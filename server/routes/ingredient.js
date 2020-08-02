const express = require("express");
const router = express.Router();

const IngredientController = require("../controllers/ingredient");

//  @route  POST /ingredient
//  @desc   Create a new ingredient
//  @access Public
router.route("/").post(IngredientController.createIngredient);

//  @route  GET /ingredient
//  @desc   GET ingredients
//  @access Public
router.route("/").get(IngredientController.getIngredients);

module.exports = router;
