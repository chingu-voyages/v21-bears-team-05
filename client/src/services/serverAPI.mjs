import axios from "axios";

/*
  Observer pattern
  We use this function as a data tunnel between localDB and our app
  import ObserverServerAPI then subscribe your callback
  it will be called by fire()
*/
function ObserverServerAPI() {
  this.handlers = [];
}

ObserverServerAPI.prototype = {
  subscribe: function (fn) {
    this.handlers.push(fn);
  },
  fire: function (type, data, thisObj) {
    var scope = thisObj || window;
    this.handlers.forEach(function (item) {
      item.call(scope, type, data);
    });
  },
};

export const observerServerAPI = new ObserverServerAPI();

//  Check if Backend is online
const isOnline = async () => {
  const res = await axios.get("http://localhost:5000/isOnline");
  //observerServerAPI.fire("IS_ONLINE", 200 ? true : null);
  return res.status === 200 ? true : null;
};

const getData = async ({ destination, ref }) => {
  console.log("API CALL", destination);
  //  Send a loading message
  //  Will be dispatched in our serverAPI reducer
  const token = JSON.parse(localStorage.getItem("token"));
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  let res = null;
  //  If ref has an id prop
  if (ref?.id) {
    res = await axios.get(
      `http://localhost:5000/${destination}/${ref.id}`,
      config
    );
  } else {
    //  Can throw an error if we don't get data back
    //  Right now it doesn't break our logic because it return a promise
    //  TODO
    //res = axios.get(`http://localhost:5000/${destination}/`, config);
  }
  if (res) {
    observerServerAPI.fire("GET_DATA", res);
    return res.data;
  } else {
    //observerServerAPI.fire("GET_DATA", res);
  }
};
const postData = async ({ destination, data }) => {
  //  Send a loading message
  //  Will be dispatched in our serverAPI reducer
  console.log(
    `postData method; destination: ${destination}, data: ${JSON.stringify(
      data
    )}`
  );
  observerServerAPI.fire("LOADING");
  const token = JSON.parse(localStorage.getItem("token"));
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(data);
  let res = null;
  try {
    res = await axios.post(
      `http://127.0.0.1:5000/${destination}/${data.id}`,
      body,
      config
    );
  } catch (error) {
    const errorCode = error.response.status;
    observerServerAPI.fire("POST_DATA", { status: errorCode });
  }
  return res;
};
const putData = async ({ destination, ref, data }) => {
  // TODO
  console.log(
    `TODO: putData method; destination: ${destination}, ref: ${ref}, data: ${data}`
  );
};
const deleteData = async ({ destination, ref }) => {
  // TODO
  console.log(
    `TODO: deleteData method; destination: ${destination}, ref: ${ref}`
  );
};

export default { isOnline, getData, postData, putData, deleteData };
