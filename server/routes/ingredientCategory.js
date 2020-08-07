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
//  @route POST /:uuid
//  @desc  creates a new ingredientCategory
//  @access Public
router.post("/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  IngredientCategory.createIngredientCategory(uuid, req, res, next);
});

//  Route for updating ingredientCategorys
//  @route PUT /:uuid
//  @desc  updates an ingredientCategory
//  @access Public
router.put("/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  IngredientCategory.updateIngredientCategory(uuid, req, res, next);
});

//  Route for getting an ingredientCategory
//  @route GET /:uuid
//  @desc  gets an ingredientCategory
//  @access Public
router.get("/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  IngredientCategory.getIngredientCategory(uuid, req, res, next);
});

module.exports = router;