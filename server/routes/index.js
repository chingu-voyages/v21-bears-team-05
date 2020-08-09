const express = require("express");
const router = express.Router();

const Index = require("../controllers/index");

//  @route  GET /index
//  @desc   get index of top recipes and ingredients
//  @access Public
router.get("/", (req, res, next) => {
  Index.getIndex(res, next);
});

//  @route  GET /index
//  @desc   get index of top recipes and ingredients
//  @access Public
router.get("/modified", (req, res, next) => {
  Index.getIndexModifiedDate(res, next);
});

module.exports = router;
