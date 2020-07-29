require("./db");
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const app = require("express")();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./public/swagger/swagger.json');
const cors = require("cors");
const path = require("path");
const api = require("./server/api");
const bodyParser = require("body-parser");
const logger = require("./lib/logger");
const ErrorHandler = require("./lib/error");

//  Middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "client/build")));
app.use(morgan("combined", { stream: logger.stream }));
app.use(bodyParser.json());

//  Routes
app.use("/auth", require("./server/routes/auth"));
app.use("/recipes", require("./server/routes/recipe"));
app.use("/users", require("./server/routes/user"));
app.use("/index", require("./server/routes/index"));

//  isOnline route to check if we're up
app.get("/isOnline", (req, res) => {
  res.status(200).send();
});

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/:method", async function (req, res) {
  const apiMethod = req.params.method;
  try {
    const isValid = api.hasOwnProperty(apiMethod);
    if (!isValid) {
      res.status(404).send({ errors: [`No such method ${apiMethod}!`] });
    } else {
      const data = await api[apiMethod]();
      res.send(data);
    }
  } catch (e) {
    res
      .status(500)
      .send({ errors: ["Sorry something went wrong!", e.message] });
  }
});

app.get("/api/", function (req, res) {
  res.status(404).send({
    errors: [
      `No method given! Avalible endpoints: ${Object.keys(api).map(
        (method) => `/api/${method}, `
      )}`,
    ],
  });
});

//404 handler
app.use(function (req, res, next) {
  res.status(404).send("oop's, can't find that!");
});

// error handler middleware
app.use((error, req, res, next) => {
  ErrorHandler.handleError(error, req, res);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join((__dirname = "client/build/index.html")));
  });
} else {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/public/index.html"));
  });
}

module.exports = app;
