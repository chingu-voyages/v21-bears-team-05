import localDB from "./localDB";
import serverAPI from "./serverAPI";
import generateTempId from "../utils/generateTempId";
import testData from "./testData";

const devOptions = {
  useServer: true,
  useAppState: true,
  useLocalDB: true,
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
    let data = null;
    if (ref?.hasOwnProperty("id")) {
      // simple lookup
      if (devOptions.useAppState && appState[destination][ref.id]) {
        data = appState[destination][ref.id];
      } else if (devOptions.useLocalDB) {
        // if not in appState check if in localDB
        data = await localDB.read({ destination, ref });
      }
    }
    let lastest =
      data?.lastModified &&
      data.lastModified >=
        appState.index?.[destination]?.[ref?.id]?.lastModified;
    if (
      devOptions.useServer &&
      ((!data && (await serverAPI.isOnline())) || !lastest)
    ) {
      data = await serverAPI.getData({ destination, ref });
      data &&
        devOptions.useLocalDB &&
        (await localDB.write({ destination, data }));
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
  const useTestData = false;
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
