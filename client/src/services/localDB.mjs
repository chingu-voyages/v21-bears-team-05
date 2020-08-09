import Dexie from "dexie";
import isEmpty from "../utils/isEmpty";

const db = new Dexie("db_v5");
db.version(1).stores({
  index: "uuid",
  recipes: "uuid",
  ingredients: "uuid",
  ingredientCategories: "uuid",
  users: "uuid",
  uploadQueue: "uuid",
});
const dbLocations = {
  index: "uuid",
  recipes: "uuid",
  ingredients: "uuid",
  ingredientCategories: "uuid",
  // users: "uuid", // disable using users seems to get error /* Unhandled Rejection (SchemaError): KeyPath [uuid+route] on object store users is not indexed */
  uploadQueue: "++uuid",
};
const checkDestinationIsValid = ({ destination }) => {
  if (!dbLocations[destination]) {
    console.warn(`No such destination: ${destination}`);
    return false;
  }
  return true;
};

const write = async ({ destination, data }) => {
  console.log("localDB.write()", destination, data);
  if (!checkDestinationIsValid({ destination })) {
    return false;
  }
  const addItem = async (item) => {
    try {
      await db[destination].put(item);
      return true;
    } catch (e) {
      console.error(e);
    }
  };
  if (!isEmpty(data)) {
    if (data.hasOwnProperty("uuid")) {
      addItem(data);
    } else if (Array.isArray(data)) {
      data.forEach((item) => item.hasOwnProperty("uuid") && addItem(item));
    } else if (typeof data === "object") {
      Object.values(data).forEach(
        (item) => item.hasOwnProperty("uuid") && addItem(item)
      );
    }
  }
  return false;
};

const read = async ({ destination, ref }) => {
  if (!checkDestinationIsValid({ destination })) {
    return false;
  }
  try {
    let data = ref
      ? await db[destination].get(ref)
      : await db[destination].toArray();
    return ref
      ? data
      : data.reduce((obj, item) => ({ ...obj, [item.uuid]: item }), {});
  } catch (e) {
    return false;
  }
};

const remove = async ({ destination, ref }) => {
  try {
    let data;
    if (!ref) {
      await db[destination].clear();
    } else {
      await db[destination].delete(ref);
    }
    return data;
  } catch (e) {
    console.error(e);
  }
};

export default { write, read, remove };
