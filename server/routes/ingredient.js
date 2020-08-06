const express = require("express");
const router = express.Router();

const Ingredient = require("../controllers/ingredient");

//  Route for listing All ingredients
//  @route  GET /ingredients/
//  @desc   get all ingredients
//  @access Public
router.get("/", (req, res, next) => {
  Ingredient.getIngredients(req, res, next);
});

//  Route for creating ingredients
//  @route POST /:id
//  @desc  creates a new ingredient
//  @access Public
router.post("/:id", (req, res, next) => {
  const { id } = req.params;
  Ingredient.createIngredient(id, req, res, next);
});

//  Route for updating ingredients
//  @route PUT /:id
//  @desc  updates an ingredient
//  @access Public
router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  Ingredient.updateIngredient(id, req, res, next);
});

//  Route for getting an ingredient
//  @route GET /:id
//  @desc  gets an ingredient
//  @access Public
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Ingredient.getIngredient(id, req, res, next);
});

module.exports = router;