import localDB from "./localDB";
import serverAPI from "./serverAPI";
import generateId from "../utils/generateId";
import testData from "./testData";
import isEmpty from "../utils/isEmpty";

const devOptions = {
  useServer: true,
  useAppState: false,
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
  data = { ...oldData, ...data };
  const guestData = data?.id === "guest";
  if (!data.id) {
    data = { ...data, id: generateId() };
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
    !guestData && devOptions.useServer && runQueue();
  }
  if (!guestData && !devOptions.useLocalDB && devOptions.useServer) {
    editing
      ? serverAPI.putData({ destination, data })
      : serverAPI.postData({ destination, data });
  }
  return data.id;
};

const getData = async ({ destination, ref }) => {
  const guestData = ref?.id === "guest";
  const validDestination = checkDestinationIsValid({ destination });
  let data = null;
  if (validDestination) {
    await appStateInitialised;
    const getDataFrom = async (location) => {
      switch (location) {
        case "server":
          return !ref
            ? await serverAPI.getData({ destination })
            : guestData ? null : await serverAPI.getData({ destination, ref });
        case "localDB":
          return !ref
            ? await localDB.read({ destination })
            : await localDB.read({ destination, ref });
        case "appState":
          return !ref
            ? appState[destination]
            : ref?.hasOwnProperty("id")
            ? appState[destination][ref.id]
            : appState[destination] /* search app state */;
        default:
          return null;
      }
    };
    const getNearestData = async () => {
      if (devOptions.useAppState) {
        data = await getDataFrom("appState");
      }
      if (isEmpty(data) && devOptions.useLocalDB) {
        // if not in appState check if in localDB
        data = await getDataFrom("localDB");
      }
      if (isEmpty(data) && devOptions.useServer) {
        data = await getDataFrom("server");
        nearestDataFromSever = true;
      }
      return data;
    };
    let nearestDataFromSever = false;
    let nearestData = await getNearestData();
    if (!nearestDataFromSever && nearestData && devOptions.useServer) {
      const nearestDataHasNeverBeenToServer = !nearestData.timestamps;
      const nearestDataGoneStale =
        nearestDataHasNeverBeenToServer ||
        nearestData.timestamps.updatedAt <=
          appState.index?.[destination]?.[ref?.id]?.timestamps.updatedAt;
      if (nearestDataGoneStale) {
        const serverData = await getDataFrom("server");
        if (serverData) {
          data = serverData;
          // store serverData locally
          if (devOptions.useAppState) {
            if (ref?.hasOwnProperty("id")) {
              appState[destination][ref.id] = data;
            } else {
              appState[destination] = {
                ...appState[destination],
                ...data,
              };
            }
          }
          if (devOptions.useLocalDB) {
            await localDB.write({ destination, data });
          }
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
  const useTestData = false;
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
