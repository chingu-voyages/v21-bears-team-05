const setters = {};

const subscribe = ({ name, setter }) => {
  if (name && setter) {
    setters[name] = setter;
  }
  console.log(setters);
};
const unsubscribe = ({ name }) => {
  delete setters[name];
};
const update = ({ name, update }) => {
  console.log(setters);
  setters[name] && setters[name](update);
};

const status = {
  subscribe: (setter) => subscribe({ name: "status", setter }),
  unsubscribe: () => unsubscribe({ name: "status" }),
  error: (msg) => update({ name: "status", update: { error: msg } }),
  message: (msg) => update({ name: "status", update: { message: msg } }),
  inProgress: (msg, uid) =>
    update({ name: "status", update: { inProgress: msg } }),
  done: (uid, msg) =>
    update({ name: "status", update: { done: uid, text: msg } }),
  clear: () => update({ name: "status", update: { clear: true } }),
};

export { status };
