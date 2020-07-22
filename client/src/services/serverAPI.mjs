const isOnline = async () => {
  // TODO ping server
  console.log(`TODO: isOnline method`);
  return true;
};
const getData = async ({ destination, ref }) => {
  // TODO
  console.log(`TODO: getData method; destination: ${destination}, ref: ${ref}`);
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
