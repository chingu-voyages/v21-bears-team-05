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

//  Check if Backend is online
const isOnline = async () => {
  const res = await axios.get("http://localhost:5000/isOnline");
  return res.status === 200 ? true : null;
};

const getData = async ({ destination, ref }) => {
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

  /*
    If ref as an ID prop
    Call /route/:uuid
    else
    Call /route/
  */
  if (ref?.uuid) {
    try {
      res = await axios.get(
        `http://localhost:5000/${destination}/${ref.uuid}`,
        config
      );
    } catch (error) {
      handleError("GET", destination, error);
    }
  } else {
    try {
      res = await axios.get(`http://localhost:5000/${destination}/`, config);
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
    return res;
  } catch (error) {
    handleError("POST", destination, error);
  }
};
const putData = async ({ destination, ref, data }) => {
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
      `http://localhost:5000/${destination}/${ref.uuid}`,
      body,
      config
    );
    status.done(
      `Uploaded ${destination} data`,
      `Uploading new ${destination} data`
    );
    return res;
  } catch (error) {
    handleError("POST", destination, error);
  }
};
const deleteData = async ({ destination, ref }) => {
  // TODO
  console.log(
    `TODO: deleteData method; destination: ${destination}, ref: ${ref}`
  );
};

export default { isOnline, getData, postData, putData, deleteData };
