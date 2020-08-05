import Dexie from "dexie";

const db = new Dexie("db_v3");
db.version(1).stores({
  index: "id",
  recipes: "id",
  ingredients: "id",
  ingredientCategories: "id",
  users: "id",
  queue: "++id",
});

const write = async ({ destination, data }) => {
  console.log("localDB.write()", destination, data);
  const isEmpty = Object.keys(data).length === 0;
  if (!isEmpty) {
    /*
    if (destination === "users") {
      await db[destination].put(data);
    }
*/
    if (data.id) {
      console.log("localDB.write().put() |ingredients", data);
      await db[destination].put(data);
    } else {
      console.log("localDB.write().put()", data, Object.keys(data));
      const keys = Object.keys(data);
      keys.forEach(async (key) => {
        console.log("localDB.write().put() | details", data[key]);
        await db[destination].put(data[key]);
      });
    }
  }
};

const read = async ({ destination, ref }) => {
  console.log("localDB.read()", destination, ref);

  try {
    let data = ref
      ? await db[destination].get(ref)
      : await db[destination].toArray();
    return ref
      ? data
      : data.reduce((obj, item) => ({ ...obj, [item.id]: item }), {});
  } catch (e) {
    console.error(e);
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
