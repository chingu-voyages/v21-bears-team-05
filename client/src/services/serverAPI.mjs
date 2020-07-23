import axios from "axios";

//  Check if Backend is online
const isOnline = async () => {
  const res = await axios.get("http://localhost:5000/isOnline");
  return res.status === 200 ? true : null;
};

const getData = async ({ destination, ref }) => {
  console.log("API CALL", destination);
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
    //TODO
    res = axios.get(`http://localhost:5000/${destination}/`, config);
  }
  if (res) {
    return res.data;
  }
};
const postData = async ({ destination, data }) => {
  // TODO
  console.log(
    `postData method; destination: ${destination}, data: ${JSON.stringify(
      data
    )}`
  );
  const token = JSON.parse(localStorage.getItem("token"));
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(data);

  const res = await axios.post(
    `http://127.0.0.1:5000/${destination}/${data.id}`,
    body,
    config
  );
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
