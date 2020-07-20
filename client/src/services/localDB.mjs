import Dexie from "dexie";

const db = new Dexie("db_v2");
db.version(1).stores({
  index: "id",
  recipes: "id",
  ingredients: "id",
  users: "id",
  queue: "++id",
});

const write = async ({ into, data }) => {
  try {
    await db[into].put(data);
    return true;
  } catch (e) {
    console.error(e);
  }
};

const read = async ({ from, page, pageLength }) => {
  try {
    let data;
    data = await db[from];
    if (page) {
      data = data.offset(page * pageLength).limit(pageLength);
    }
    return data.toArray();
  } catch (e) {
    console.error(e);
  }
};

const remove = async ({ from, ref }) => {
  try {
    let data;
    if (!ref) {
      await db[from].clear();
    } else {
      await db[from].delete(ref);
    }
    return data;
  } catch (e) {
    console.error(e);
  }
};

export default { write, read, remove };
