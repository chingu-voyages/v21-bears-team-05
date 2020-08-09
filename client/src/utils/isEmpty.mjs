const isEmpty = (data) =>
  !data ||
  (Array.isArray(data)
    ? data.length <= 0
    : typeof data === "object" && Object.keys(data).length <= 0);

export default isEmpty;
