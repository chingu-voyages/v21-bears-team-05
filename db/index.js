require("dotenv").config();
const mongoose = require("mongoose");
const helper = require("../lib/db");

const mongoURI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27017/feedmetest"
    : process.env.MONGO_URI_DEV;

//create connection
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    bufferCommands: false,
		keepAlive: true,
		keepAliveInitialDelay: 300000
  })
  .catch((err) => helper.handleDbConnectionError(err));

if (process.env.NODE_ENV === "development") mongoose.set("debug", true);

//check for connection success or failure
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("db connected!"));
db.on("disconnected", () => console.log("db disconnected!"));

process.on("SIGINT", () => {
  console.log("Mongoose disconnected on exit process");
  process.exit(0);
});
