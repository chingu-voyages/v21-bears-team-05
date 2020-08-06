const express = require("express");
const router = express.Router();

const IngredientCategory = require("../controllers/ingredientCategory");

//  Route for listing All ingredientCategorys
//  @route  GET /ingredientCategorys/
//  @desc   get all ingredientCategorys
//  @access Public
router.get("/", (req, res, next) => {
  IngredientCategory.getIngredientCategorys(req, res, next);
});

//  Route for creating ingredientCategorys
//  @route POST /:id
//  @desc  creates a new ingredientCategory
//  @access Public
router.post("/:id", (req, res, next) => {
  const { id } = req.params;
  IngredientCategory.createIngredientCategory(id, req, res, next);
});

//  Route for updating ingredientCategorys
//  @route PUT /:id
//  @desc  updates an ingredientCategory
//  @access Public
router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  IngredientCategory.updateIngredientCategory(id, req, res, next);
});

//  Route for getting an ingredientCategory
//  @route GET /:id
//  @desc  gets an ingredientCategory
//  @access Public
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  IngredientCategory.getIngredientCategory(id, req, res, next);
});

module.exports = router;