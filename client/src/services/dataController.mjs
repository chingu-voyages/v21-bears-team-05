import localDB from "./localDB";
import serverAPI from "./serverAPI";
import generateId from "../utils/generateId";
import isEmpty from "../utils/isEmpty";

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
  index: null,
  uploadQueue: [],
};

const addData = async ({ destination, data, oldData, ref }) => {
  const dataWithoutUUID = { ...data };
  delete dataWithoutUUID.uuid;
  if (!isEmpty(dataWithoutUUID)) {
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
      !guestData &&
        (await addToUploadQueue({
          destination,
          data,
          editing,
          uuid: generateId(),
        }));
      await localDB.write({ destination, data });
      !guestData && devOptions.useServer && runUploadQueue();
    }
    if (!guestData && !devOptions.useLocalDB && devOptions.useServer) {
      editing
        ? serverAPI.putData({ destination, data, ref })
        : serverAPI.postData({ destination, data });
    }
    return data.uuid;
  }
  return false;
};

const getData = async ({ destination, ref }) => {
  const guestData = ref?.uuid === "guest";
  const validDestination = checkDestinationIsValid({ destination });
  let data = null;
  if (validDestination) {
    await appStateInitialised;
    let dataIsFromServer = false;
    const getDataFrom = async (location) => {
      switch (location) {
        case "server":
          const res = !ref
            ? await serverAPI.getData({ destination })
            : guestData
            ? null
            : await serverAPI.getData({ destination, ref });
          if (res) {
            data = res;
          }
          return data;
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
    let nearestData = await getNearestData();
    if (
      !dataIsFromServer &&
      nearestData &&
      devOptions.useServer &&
      (await serverAPI.isOnline())
    ) {
      let dataIsStale = false;
      const index =
        (devOptions.useAppState && appState.index) ||
        (devOptions.useLocalDB &&
          (await localDB.read({ destination: "index" })));
      if (index) {
        if (ref?.hasOwnProperty("uuid")) {
          dataIsStale = index[destination]?.find(
            ({ uuid, dateUpdated }) =>
              uuid === nearestData.uuid &&
              (!nearestData.dateUpdated ||
                dateUpdated > nearestData.dateUpdated)
          );
        } else {
          // check each property or item in nearestData against index
          if (Array.isArray(nearestData)) {
            nearestData.find((item) => {
              return index[destination]?.find(
                ({ uuid, dateUpdated }) =>
                  item.uuid &&
                  uuid === item.uuid &&
                  dateUpdated > item.dateUpdated
              );
            });
          } else if (typeof nearestData === "object") {
            Object.values(nearestData).find((item) => {
              return index[destination]?.find(
                ({ uuid, dateUpdated }) =>
                  item.uuid &&
                  uuid === item.uuid &&
                  dateUpdated > item.dateUpdated
              );
            });
          } else {
            dataIsStale = true;
          }
        }
      }
      if (dataIsStale) {
        const serverData = await getDataFrom("server");
        if (serverData) {
          data = serverData;
          dataIsFromServer = true;
        }
      }
    }
    if (dataIsFromServer && !isEmpty(data)) {
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
    if (isEmpty(data)) {
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
  if (!appState.hasOwnProperty(destination)) {
    console.warn(`No such destination: ${destination}`);
    return false;
  }
  return true;
};

const addToUploadQueue = async ({ destination, data, uuid, editing }) => {
  await localDB.write({
    destination: "uploadQueue",
    data: { destination, data, uuid, editing },
  });
};

const runUploadQueue = async () => {
  if (devOptions.useServer && (await serverAPI.isOnline())) {
    try {
      let uploadQueue = await localDB.read({ destination: "uploadQueue" });
      uploadQueue = Object.values(uploadQueue);
      while (uploadQueue.length > 0) {
        const { destination, data, editing, uuid } = uploadQueue.shift();
        const uploaded = editing
          ? await serverAPI.putData({ destination, data, ref: { uuid } })
          : await serverAPI.postData({ destination, data });
        if (uploaded === true) {
          await localDB.remove({ destination: "uploadQueue", ref: uuid });
        }
      }
    } catch (error) {
      console.error("error", error);
    }
  }
};

const postInit = async () => {
  await appStateInitialised;
  runUploadQueue();
};
const preInit = async () => {
  // anything that needs to be done pre app load
  if (devOptions.useServer && serverAPI.isOnline()) {
    const newIndex = await serverAPI.getData({ destination: "index" });
    if (devOptions.useAppState) {
      appState.index = newIndex;
    }
    if (devOptions.useLocalDB) {
      await localDB.write({ destination: "index", data: newIndex });
    }
  }
  return true;
};
const appStateInitialised = preInit();
postInit();
