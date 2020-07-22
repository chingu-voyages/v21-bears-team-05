import axios from "axios";

//  Check if Backend is online
const isOnline = async () => {
  const res = await axios.get("http://localhost:5000/isOnline");
  return res.status === 200 ? true : null;
};

const getData = async ({ destination, ref }) => {
  // TODO
  console.log(`TODO: getData method; destination: ${destination}, ref: ${ref}`);
  console.log("ref", ref);
  const res = await axios.get(`http://localhost:5000/${destination}/${ref.id}`);
  console.log("serverAPI.getData() res: ", res);
  return res.data;
};
const postData = async ({ destination, data }) => {
  // TODO
  console.log(
    `TODO: postData method; destination: ${destination}, data: ${data}`
  );
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
