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
//  @route POST /:uuid
//  @desc  creates a new ingredient
//  @access Public
router.post("/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  Ingredient.createIngredient(uuid, req, res, next);
});

//  Route for updating ingredients
//  @route PUT /:uuid
//  @desc  updates an ingredient
//  @access Public
router.put("/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  Ingredient.updateIngredient(uuid, req, res, next);
});

//  Route for getting an ingredient
//  @route GET /:uuid
//  @desc  gets an ingredient
//  @access Public
router.get("/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  Ingredient.getIngredient(uuid, req, res, next);
});

module.exports = router;