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
  error: (msg, uid) => queueStatusUpdate({ removeSpinner: uid, error: msg }),
  message: (msg) => queueStatusUpdate({ message: msg }),
  inProgress: (msg) => queueStatusUpdate({ inProgress: msg }),
  done: (msg, uid) => queueStatusUpdate({ removeSpinner: uid, done: msg }),
  clear: () => queueStatusUpdate({ clear: true }),
};

export { status };
