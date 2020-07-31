import axios from "axios";
import { status } from "../services/subscribers";

//  return status.error accordingly to http error code
const handleError = (type, destination, error) => {
  const errorCode = error.response.status;

  //  We switch over the error code to send personalised message
  switch (errorCode) {
    case "401":
      status.error(`Unauthorized, please login`);
      break;
    case "404":
      status.error(`Error ${type} ${destination}: Not Found`);
      break;
    default:
      status.error(`Error ${type} ${destination}: ${errorCode}`);
  }
};

//  Check if Backend is online
const isOnline = async () => {
  const res = await axios.get("http://localhost:5000/isOnline");
  return res.status === 200 ? true : null;
};

const getData = async ({ destination, ref }) => {
  console.log("API CALL", destination, ref);
  /*
    If we send a request with guest as id
    this means the user isn't registered
    return
  */
  if (ref?.id && ref.id === "guest") {
    status.error(`Unauthorized, please login`);
    return;
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

  /*
    If ref as an ID prop
    Call /route/:id
    else
    Call /route/
  */
  if (ref?.id) {
    try {
      res = await axios.get(
        `http://localhost:5000/${destination}/${ref.id}`,
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
    status.done(`Loading ${destination}`, `${destination} loaded`);
    return res.data;
  }
};

const postData = async ({ destination, data }) => {
  console.log(
    `postData method; destination: ${destination}, data: ${JSON.stringify(
      data
    )}`
  );
  /*
    If we post a request with guest as data.id
    this means the user isn't registered
    return
  */
  if (data?.id && data.id === "guest") {
    status.error(`Unauthorized, please login`);
    return;
  }

  //  Send a loading message
  status.inProgress(`Pushing ${destination}`);

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
    status.done(`Pushing ${destination}`, `Pushed ${destination}`);
    return res;
  } catch (error) {
    handleError("POST", destination, error);
  }
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
