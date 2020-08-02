import localDB from "./localDB";
import serverAPI from "./serverAPI";
import generateTempId from "../utils/generateTempId";
import testData from "./testData";

const devOptions = {
  useServer: false,
  useAppState: true,
  useLocalDB: false,
};

const appState = {
  recipes: {},
  ingredients: {},
  ingredientCategories: {},
  users: {},
  index: {},
  queue: [],
};

const addData = async ({ destination, data, oldData }) => {
  const destinationIsValid = checkDestinationIsValid({ destination });
  if (!destinationIsValid) {
    return destinationIsValid;
  }
  let editing = true;

  const newData = { ...oldData, ...data };
  if (!data.id) {
    data = { ...data, id: generateTempId() };
    editing = false; // use POST route
  }
  if (devOptions.useAppState) {
    appState[destination] = {
      ...appState[destination],
      [data.id]: newData,
    };
  }
  if (devOptions.useLocalDB) {
    await addToQueue({ destination, data: newData, editing });
    await localDB.write({ destination, data: newData });
    devOptions.useServer && runQueue();
  }
  if (!devOptions.useLocalDB && devOptions.useServer) {
    editing
      ? serverAPI.putData({ destination, data })
      : serverAPI.postData({ destination, data });
  }
  return true;
};

const getData = async ({ destination, ref }) => {
  const validDestination = checkDestinationIsValid({ destination });
  if (validDestination) {
    await appStateInitialised;
    let dataSource;
    const getNearestData = async () => {
      let data = null;
      if (!ref) {
        // gets all data
        if (devOptions.useAppState) {
          data = appState[destination];
          dataSource = "appState"
        }
        if (!data && devOptions.useLocalDB) {
          data = await localDB.read({ destination });
          dataSource = "localDB"
        }
        if (!data && devOptions.useServer) {
          serverAPI.getData({ destination });
          dataSource = "server"
        }
      }
      else {
        if (devOptions.useAppState) {
          if (ref?.hasOwnProperty("id")) {
            // simple lookup
            data = appState[destination][ref.id];
          } else {
            data = appState[destination] // impliment search on appState[destination] for ref
          }
          dataSource = "appState"
        }
        if (!data && devOptions.useLocalDB) {
          // if not in appState check if in localDB
          data = await localDB.read({ destination, ref });
          dataSource = "localDB"
        }
        if (!data && devOptions.useServer) {
          // if not in localDB try 
          data = await serverAPI.getData({ destination, ref });
          dataSource = "server"
        }
      }
      return data
    }
    let data = await getNearestData();
    if (data && devOptions.useServer) {
      const lastest =
        data.lastModified &&
        data.lastModified >=
        appState.index?.[destination]?.[ref?.id]?.lastModified;
      if (!lastest) {
        const serverData = await serverAPI.getData({ destination });
        if (serverData) {
          if (devOptions.useAppState) {
            if (ref?.hasOwnProperty("id")) {
              appState[destination][ref.id] = serverData
            }
            else {
              appState[destination] = {...appState[destination], ...serverData}
            }
          }
          if (devOptions.useLocalDB) {
            await localDB.write({ destination, data });
          } 
          data = serverData;
        }
      }
    }
    if (!data) {
      console.warn(
        `Unable to find data in destination: ${destination} for ref: ${JSON.stringify(
          ref
        )}`
      );
      return false;
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

const addToQueue = async ({ destination, data }) => {
  await localDB.write({
    destination: "queue",
    data: { destination, data },
  });
};

const runQueue = async () => {
  if (await serverAPI.isOnline()) {
    try {
      const queue = await localDB.read({ destination: "queue" });
      while (queue.length > 0) {
        const { destination, data, editing, id } = queue.shift();
        const uploaded = editing
          ? serverAPI.putData({ destination, data })
          : serverAPI.postData({ destination, data });
        if (!uploaded) {
          // try again in a few minutes
          setTimeout(runQueue, 1000 * 60 * 2);
        } else {
          await localDB.remove({ destination: "queue", ref: id });
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }
};

const init = async () => {
  const useTestData = true;
  if (useTestData) {
    appState.recipes = testData.recipes || {};
    appState.ingredients = testData.ingredients || {};
    appState.ingredientCategories = testData.ingredientCategories || {};
    appState.users = testData.users || {};
    appState.index = testData.index || {};
    appState.queue = testData.queue || [];
  }
  if (devOptions.useLocalDB) {
    const recipes = await localDB.read({ destination: "recipes" });
    Array.isArray(recipes) &&
      recipes.forEach((recipe) => (appState.recipes[recipe.id] = recipe));
    const ingredients = await localDB.read({ destination: "ingredients" });
    Array.isArray(ingredients) &&
      ingredients.forEach(
        (ingredient) => (appState.ingredients[ingredient.id] = ingredient)
      );
    const ingredientCategories = await localDB.read({
      destination: "ingredientCategories",
    });
    Array.isArray(ingredientCategories) &&
      ingredientCategories.forEach(
        (ingredientCategory) =>
          (appState.ingredientCategories[
            ingredientCategory.id
          ] = ingredientCategory)
      );

    const users = await localDB.read({ destination: "users" });
    Array.isArray(users) &&
      users.forEach((user) => (appState.users[user.id] = user));
    const index = await localDB.read({ destination: "index" });
    Array.isArray(index) &&
      index.forEach((item) => (appState.index[item.destination] = item));
    appState.queue = (await localDB.read({ destination: "queue" })) || [];
  }
  // sync from server
  // syncIndex
  // getUser
  // runQueue
  return true;
};
const appStateInitialised = init();
