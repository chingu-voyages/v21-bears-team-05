const matchQuery = ({ query, value, flags }) => {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return value.match(new RegExp(escapedQuery, flags));
};

export default matchQuery;
