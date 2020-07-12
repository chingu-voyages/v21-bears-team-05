require('dotenv').config();

let devKeys = {
    //mongoURI: "mongodb://localhost:27017/feedme",
    mongoURI: process.env.MONGO_URI_DEV,
  },
  prodKeys = {
    mongoURI: process.env.MONGO_URI,
  };

if (process.env.NODE_ENV === 'production') {
  module.exports = prodKeys;
} else {
  module.exports = devKeys;
}
