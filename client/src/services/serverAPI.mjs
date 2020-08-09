import axios from "axios";
import { status, authModalToggle } from "../services/subscribers";

//  return status.error accordingly to http error code
const handleError = (type, destination, error) => {
  const errorCode = error?.response?.status || null;
  //  We switch over the error code to send personalised message
  switch (errorCode) {
    case 401:
      status.error("Unauthorized, please login", `Loading ${destination}`);
      authModalToggle.open();
      break;
    case 404:
      status.error(
        `Unable to find ${destination}, sorry!`,
        `Loading ${destination}`
      );
      console.error(`Error ${type} ${destination}: Not Found`);
      break;
    default:
      status.error(`Something went wrong :(`, `Loading ${destination}`);
      console.error(`Error ${type} ${destination}: ${error}`);
  }
};

//  Check if client is online then if server can be accessed
const isOnline = async () => {
  const online = navigator.onLine;
  if (online) {
    status.remove("Working offline");
    let serverOnline;
    try {
      const res = await axios.get("http://localhost:5000/isOnline");
      serverOnline = res.status === 200;
    } catch (e) {
      serverOnline = false;
    }
    if (serverOnline) {
      status.remove("Sorry our servers are currenly offline");
      return true;
    } else {
      status.error("Sorry our servers are currenly offline");
    }
  } else {
    status.message("Working offline");
  }
  return false;
};

const getData = async ({ destination, ref }) => {
  if (await !isOnline()) {
    return false;
  }
  //  Send a loading message
  status.inProgress(`Loading ${destination}`);

  const token = JSON.parse(localStorage.getItem("token"));
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  let res = null;
  const addisionalRouting = ref?.route ? ref.route : "";
  /*
    If ref as an ID prop
    Call /route/:uuid
    else
    Call /route/
  */
  if (ref?.uuid) {
    try {
      res = await axios.get(
        `http://localhost:5000/${destination}/${addisionalRouting}${ref.uuid}`,
        config
      );
    } catch (error) {
      handleError("GET", destination, error);
    }
  } else {
    try {
      res = await axios.get(
        `http://localhost:5000/${destination}/${addisionalRouting}`,
        config
      );
    } catch (error) {
      handleError("GET", destination, error);
    }
  }
  if (res?.data) {
    status.done(`${destination} loaded`, `Loading ${destination}`);
    return res.data;
  }
};

const postData = async ({ destination, data }) => {
  console.log(
    `postData method; destination: ${destination}, data: ${JSON.stringify(
      data
    )}`
  );
  if (await !isOnline()) {
    return false;
  }
  const token = JSON.parse(localStorage.getItem("token"));

  //  Send a loading message
  status.inProgress(`Pushing ${destination}`);

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
      `http://127.0.0.1:5000/${destination}/${data.uuid}`,
      body,
      config
    );
    status.done(`Pushed ${destination}`, `Pushing ${destination}`);
    return true;
  } catch (error) {
    handleError("POST", destination, error);
  }
};
const putData = async ({ destination, ref, data }) => {
  console.log("putdata", destination, data, ref);
  console.log(
    `putData method; destination: ${destination}, data: ${JSON.stringify(data)}`
  );
  if (await !isOnline()) {
    return false;
  }
  try {
    if (!ref?.uuid) {
      throw Error("Can't putData without a ref.uuid!");
    }
    const token = JSON.parse(localStorage.getItem("token"));
    //  Send a loading message
    status.inProgress(`Uploading new ${destination} data`);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(data);
    let res = null;

    res = await axios.put(
      `http://localhost:5000/${destination}/${data.uuid}`,
      body,
      config
    );
    status.done(
      `Uploaded ${destination} data`,
      `Uploading new ${destination} data`
    );
    return true;
  } catch (error) {
    handleError("POST", destination, error);
  }
};
const deleteData = async ({ destination, ref }) => {
  // TODO
  console.log(
    `TODO: deleteData method; destination: ${destination}, ref: ${ref}`
  );
  if (await !isOnline()) {
    return false;
  }
  const token = JSON.parse(localStorage.getItem("token"));

  //  Send a loading message
  status.inProgress(`Deleting ${destination}`);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  let res = null;
  try {
    res = await axios.delete(
      `http://127.0.0.1:5000/${destination}/${ref.uuid}`,
      config
    );
    status.done(`Deleted ${destination}`, `Deleting ${destination}`);
    return res;
  } catch (error) {
    handleError("DELETE", destination, error);
  }
};

export default { isOnline, getData, postData, putData, deleteData };
