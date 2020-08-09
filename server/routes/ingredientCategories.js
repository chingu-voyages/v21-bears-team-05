const express = require("express");
const router = express.Router();

const IngredientCategoriesController = require("../controllers/ingredientCategories");

//  @route  GET /ingredientCategories
//  @desc   GET ingredient Categories
//  @access Public
router.route("/").get(IngredientCategoriesController.getIngredientCategories);

//  @route  POST /ingredientCategories
//  @desc   Add a new ingredient categorie
//  @access Public
//TODO: make private
router
  .route("/")
  .post(IngredientCategoriesController.createIngredientCategorie);
module.exports = router;
