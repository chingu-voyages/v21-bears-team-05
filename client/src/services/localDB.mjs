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

  //  Writting {} data may happen, prevent this behaviour
  const isEmpty = Object.keys(data).length === 0;
  if (isEmpty) return;

  /*  We may receive different kind of objects to write */

  //  Object field {id,name}
  if (data.id) {
    console.log("localDB.write().data.id");
    try {
      await db[destination].put(data);
    } catch (error) {
      console.log("ERROR localDB.write().data.id", destination, data);
    }
    return;
  }
  //  Array with Object [{id,name}, {id}, name]
  if (Array.isArray(data)) {
    data.forEach(async (entry) => {
      console.log("localDB.write().Array", destination, entry);
      try {
        await db[destination].put(entry);
      } catch (error) {
        console.log("ERROR localDB.write().Array", destination, data);
      }
    });
    return;
  }
  //  Nested Object {0:{id, name}, 1:{id, name}} || Unseen for the moment
};

const read = async ({ destination, ref }) => {
  try {
    let data = ref
      ? await db[destination].get(ref)
      : await db[destination].toArray();
    return ref
      ? data
      : data.reduce((obj, item) => ({ ...obj, [item.id]: item }), {});
  } catch (e) {
    console.log("localDB.read()", destination, ref);
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
