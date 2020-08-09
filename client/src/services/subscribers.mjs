const setters = {};

const subscribe = ({ name, setter }) => {
  if (name && setter) {
    setters[name] = setter;
  }
};
const unsubscribe = ({ name }) => {
  delete setters[name];
};
const update = ({ name, update }) => {
  setters[name] && setters[name](update);
};

let statusQueue;
let statusTimeout;
const queueStatusUpdate = (statusData) => {
  if (!statusTimeout) {
    statusQueue = [];
  }
  statusQueue.push(statusData);
  statusTimeout = setTimeout(() => {
    statusTimeout = null;
    update({ name: "status", update: statusQueue });
  }, 100);
};
const status = {
  subscribe: (setter) => subscribe({ name: "status", setter }),
  unsubscribe: () => unsubscribe({ name: "status" }),
  error: (msg, uid) => queueStatusUpdate({ remove: uid, error: msg }),
  message: (msg) => queueStatusUpdate({ message: msg }),
  inProgress: (msg) => queueStatusUpdate({ inProgress: msg }),
  done: (msg, uid) => queueStatusUpdate({ remove: uid, done: msg }),
  remove: (uid) => queueStatusUpdate({ remove: uid }),
  clear: () => queueStatusUpdate({ clear: true }),
};

const authModalToggle = {
  subscribe: (setter) => subscribe({ name: "authModalToggle", setter }),
  unsubscribe: () => unsubscribe({ name: "authModalToggle" }),
  open: () => update({ name: "authModalToggle", update: true }),
  close: () => update({ name: "authModalToggle", update: false }),
};

export { status, authModalToggle };
