import axios from "axios";
import { status } from "../services/subscribers";

//  Check if Backend is online
const isOnline = async () => {
  const res = await axios.get("http://localhost:5000/isOnline");
  return res.status === 200 ? true : null;
};

const getData = async ({ destination, ref }) => {
  console.log("API CALL", destination, ref);

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
      status.error(`Error Loading ${destination}`);
    }
  } else {
    try {
      res = await axios.get(`http://localhost:5000/${destination}/`, config);
    } catch (error) {
      status.error(`Error Loading ${destination}`);
    }
  }
  if (res?.data) {
    status.done(`Loading ${destination}`, `${destination} loaded`);
    return res.data;
  }
  status.error(`Error Loading ${destination}`);
};

const postData = async ({ destination, data }) => {
  console.log(
    `postData method; destination: ${destination}, data: ${JSON.stringify(
      data
    )}`
  );
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
    const errorCode = error.response.status;

    //  We switch over the error code to send personalised message
    switch (errorCode) {
      case "401":
        status.error(`Unauthorized, please login`);
        break;
      case "404":
        status.error(`Error pushing ${destination}: Not Found`);
        break;
      default:
        status.error(`Error pushing ${destination}: ${errorCode}`);
    }
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
