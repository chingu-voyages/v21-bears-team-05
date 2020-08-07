import localDB from "./localDB";
import serverAPI from "./serverAPI";
import generateId from "../utils/generateId";
import isEmpty from "../utils/isEmpty";

const devOptions = {
  useServer: true,
  useAppState: true,
  useLocalDB: false,
};

const appState = {
  recipes: {},
  ingredients: {},
  ingredientCategories: {},
  users: {},
  index: null,
  uploadQueue: [],
};

const addData = async ({ destination, data, oldData, ref }) => {
  const destinationIsValid = checkDestinationIsValid({ destination });
  if (!destinationIsValid) {
    return destinationIsValid;
  }
  let editing = true;
  data = { ...oldData, ...data };
  const guestData = data?.uuid === "guest";
  if (!data.uuid) {
    data = { ...data, uuid: generateId() };
    editing = false; // use POST route
  }
  if (devOptions.useAppState) {
    appState[destination] = {
      ...appState[destination],
      [data.uuid]: data,
    };
  }
  if (devOptions.useLocalDB) {
    await addToUploadQueue({ destination, data, editing });
    await localDB.write({ destination, data });
    !guestData && devOptions.useServer && runUploadQueue();
  }
  if (!guestData && !devOptions.useLocalDB && devOptions.useServer) {
    editing
      ? serverAPI.putData({ destination, data, ref })
      : serverAPI.postData({ destination, data });
  }
  return data.uuid;
};

const getData = async ({ destination, ref }) => {
  const guestData = ref?.uuid === "guest";
  const validDestination = checkDestinationIsValid({ destination });
  let data = null;
  if (validDestination) {
    await appStateInitialised;
    const getDataFrom = async (location) => {
      switch (location) {
        case "server":
          return !ref
            ? await serverAPI.getData({ destination })
            : guestData
            ? null
            : await serverAPI.getData({ destination, ref });
        case "localDB":
          return !ref
            ? await localDB.read({ destination })
            : await localDB.read({ destination, ref });
        case "appState":
          return !ref
            ? appState[destination]
            : ref?.hasOwnProperty("uuid")
            ? appState[destination][ref.uuid]
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
        dataIsFromServer = true;
      }
      return data;
    };
    let dataIsFromServer = false;
    let nearestData = await getNearestData();
    if (!dataIsFromServer && nearestData && devOptions.useServer) {
      let dataIsStale = false;
      const index = await getIndex();
      if (ref?.hasOwnProperty("uuid")) {
        dataIsStale = index[destination]?.find(
          ({ uuid, dateUpdated }) =>
            uuid === nearestData.uuid && dateUpdated > nearestData.dateUpdated
        );
      } else {
        dataIsStale = true; // TODO!! change this to check each property or item in nearestData again index
      }
      if (dataIsStale) {
        const serverData = await getDataFrom("server");
        if (serverData) {
          data = serverData;
          dataIsFromServer = true;
        }
      }
    }
    if (dataIsFromServer) {
      // store serverData locally
      if (devOptions.useAppState) {
        if (ref?.hasOwnProperty("uuid")) {
          appState[destination][ref.uuid] = data;
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

const addToUploadQueue = async ({ destination, data }) => {
  await localDB.write({
    destination: "uploadQueue",
    data: { destination, data },
  });
};

const runUploadQueue = async () => {
  if (await serverAPI.isOnline()) {
    try {
      const uploadQueue = await localDB.read({ destination: "uploadQueue" });
      while (uploadQueue.length > 0) {
        const { destination, data, editing, uuid } = uploadQueue.shift();
        const uploaded = editing
          ? serverAPI.putData({ destination, data })
          : serverAPI.postData({ destination, data });
        if (uploaded) {
          await localDB.remove({ destination: "uploadQueue", ref: uuid });
        }
      }
    } catch (error) {
      console.error("error", error);
    }
  }
};

const getIndex = async () => {
  let index;
  const oldIndex =
    (devOptions.useAppState && appState.index) ||
    (devOptions.useLocalDB && (await localDB.read({ destination: "index" })));
  if (devOptions.useServer) {
    let newIndex;
    const indexLastUpdated = await serverAPI.getData({
      destination: "index",
      ref: { route: "modified" },
    });
    if (
      !indexLastUpdated ||
      !oldIndex ||
      oldIndex.dateUpdated < indexLastUpdated
    ) {
      newIndex = await serverAPI.getData({ destination: "index" });
    }
    if (devOptions.useAppState) {
      appState.index = newIndex;
    }
    devOptions.useLocalDB &&
      (await localDB.write({ destination: "index", data: newIndex }));
    index = newIndex;
  }
  if (!index) {
    index = oldIndex;
  }
  return index;
};


const postInit = async () => {
  await appStateInitialised
  runUploadQueue();
}
const preInit = async () => {
  // anything that needs to be done pre app load
  return true;
};
const appStateInitialised = preInit();
postInit();
