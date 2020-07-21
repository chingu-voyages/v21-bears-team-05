import localDB from "./localDB";
import serverAPI from "./serverAPI";
import generateTempId from "../utils/generateTempId";

const appState = {
  recipes: {},
  ingredients: {},
  users: {},
  index: {},
  queue: []
};

const addData = async ({ destination, data }) => {
  const destinationIsValid = checkDestinationIsValid({ destination });
  if (!destinationIsValid) {
    return destinationIsValid;
  }
  let editing = true;
  if (!data.id) {
    data = { ...data, id: generateTempId() };
    editing = false; // use POST route 
  }
  appState[destination] = { ...appState[destination], [data.id]: data };
  addToQueue({ destination, data, editing });
  await localDB.write({ destination, data });
  runQueue();
  return true;
};

const getData = async ({ destination, ref }) => {
  const validDestination = checkDestinationIsValid({destination});
  if (validDestination) {
    await appStateInitialised;
    let data;
    if (ref.hasOwnProperty("id")) { // simple lookup
      data = appState[destination][ref.id]
    }
    let lastest = true; // TODO compare index lastModified <= data.lastModified, have server add lastModified to data
    if (!data || (data && !lastest)) {
      data = await localDB.read({ destination });
      lastest = true; // TODO
      if ((!data && (await serverAPI.isOnline())) || !lastest) {
        data = await serverAPI.getData({ destination, ref });
        data && localDB.write({ destination, data });
      }
      if (!data) {
        console.warn(`Unable to find data in destination: ${destination} for ref: ${JSON.stringify(ref)}`);
        return false
      }
    }
    return data;
  }
};

export { addData, getData };

const checkDestinationIsValid = ({ destination }) => {
  if (!appState[destination]) {
    console.warn(`No such destination: ${destination}`);
    return false;
  }
  return true;
};

const addToQueue = ({ destination, data }) => {
  localDB.write({
    destination: "queue",
    data: { destination, data },
  });
};

const runQueue = async () => {
  if (await serverAPI.isOnline()) {
    const queue = await localDB.read("queue");
    while (queue.length > 0) {
      const { destination, data, editing, id } = queue.shift();
      const uploaded = editing ? 
      serverAPI.putData({ destination, data })
      : serverAPI.postData({ destination, data });
      if (!uploaded) {
        // try again in a few minutes
        setTimeout(runQueue, 1000 * 60 * 2);
      } else {
        localDB.remove({ destination: "queue", ref: id });
      }
    }
  }
};


const init = async () => {
  const recipes = await localDB.read({ destination: "recipes" });
  Array.isArray(recipes) && recipes.forEach(recipe => appState.recipes[recipe.id] = recipe);
  const ingredients = await localDB.read({ destination: "ingredients" });
  Array.isArray(ingredients) && ingredients.forEach(ingredient => appState.ingredients[ingredient.id] = ingredient);
  const users = await localDB.read({ destination: "users" });
  Array.isArray(users) && users.forEach(user => appState.users[user.id] = user);
  const index = await localDB.read({ destination: "index" });
  Array.isArray(index) && index.forEach(item => appState.index[item.destination] = item);
  appState.queue = (await localDB.read({ destination: "queue" })) || [];
  // sync from server
  // syncIndex
  // getUser
  // runQueue
  return true
};
const appStateInitialised = init();
