const express = require("express");
const router = express.Router();

const Index = require("../controllers/index");

//  @route  GET /index
//  @desc   get index of top recipes and ingredients
//  @access Public
router.get("/", (req, res, next) => {
  Index.getIndex(res);
});

//  @route  GET /index
//  @desc   get index of top recipes and ingredients
//  @access Public
router.post("/", (req, res, next) => {
  Index.createIndex(res);
});

module.exports = router;
