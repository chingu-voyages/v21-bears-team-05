let devKeys = {
  mongoURI: "mongodb://127.0.0.1:27017/feedme",
},prodKeys = {
  mongoURI: process.env.MONGO_URI,
}

if (process.env.NODE_ENV === "production") {
  module.exports = prodKeys
} else {
	module.exports = devKeys
}
