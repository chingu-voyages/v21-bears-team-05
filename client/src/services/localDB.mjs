import Dexie from "dexie";

const db = new Dexie("db_v2");
db.version(1).stores({
  index: "id",
  recipes: "id",
  ingredients: "id",
  ingredientCategories: "id",
  users: "id",
  queue: "++id",
});

const write = async ({ destination, data }) => {
  try {
    await db[destination].put(data);
    return true;
  } catch (e) {
    console.error(e);
  }
};

const read = async ({ destination, ref }) => {
  try {
    let data = ref ? await db[destination].get(ref) : await db[destination].toArray();
    return ref ? data : data.reduce((obj, item) => ({ ...obj, [item.id]: item}), {})
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
