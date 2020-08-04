import localDB from "./localDB";
import serverAPI from "./serverAPI";
import generateTempId from "../utils/generateTempId";
import testData from "./testData";

const devOptions = {
  useServer: false,
  useAppState: false,
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

  data = { ...oldData, ...data };
  if (!data.id) {
    data = { ...data, id: generateTempId() };
    editing = false; // use POST route
  }
  if (devOptions.useAppState) {
    appState[destination] = {
      ...appState[destination],
      [data.id]: data,
    };
  }
  if (devOptions.useLocalDB) {
    await addToQueue({ destination, data, editing });
    await localDB.write({ destination, data });
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
    const getNearestData = async () => {
      let data = null;
      if (!ref || !ref?.hasOwnProperty("id")) {
        // gets all data
        if (devOptions.useAppState) {
          data = appState[destination];
        }
        if (!data && devOptions.useLocalDB) {
          data = await localDB.read({ destination });
        }
        if (!data && devOptions.useServer) {
          if (!ref) {
            data = await serverAPI.getData({ destination });
          } else {
            data = await serverAPI.getData({ destination, ref });
          }
        }
      } else {
        if (devOptions.useAppState) {
          // simple lookup
          data = appState[destination][ref.id];
        }
        if (!data && devOptions.useLocalDB) {
          // if not in appState check if in localDB
          data = await localDB.read({ destination, ref });
        }
      }
      return data;
    };
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
              appState[destination][ref.id] = serverData;
            } else {
              appState[destination] = {
                ...appState[destination],
                ...serverData,
              };
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
    testData.recipes &&
      Object.values(testData.recipes).forEach((recipe) =>
        addData({ destination: "recipes", data: recipe })
      );
    testData.ingredients &&
      Object.values(testData.ingredients).forEach((ingredient) =>
        addData({ destination: "ingredients", data: ingredient })
      );
    testData.ingredientCategories &&
      Object.values(testData.ingredientCategories).forEach((category) =>
        addData({ destination: "ingredientCategories", data: category })
      );
    testData.users &&
      Object.values(testData.users).forEach((user) =>
        addData({ destination: "users", data: user })
      );
    if (devOptions.useAppState) {
      appState.index = testData.index;
      appState.queue = testData.queue;
    }
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
