const express = require("express");
const router = express.Router();

const Recipe = require("../controllers/recipe");

//  Route for listing All recipes
//  @route  GET /recipe/
//  @desc   get all recipes
//  @access Public
router.get("/", (req, res, next) => {
  Recipe.getRecipes(req, res, next);
});

//  Route for listing recipes
//  @route  GET /recipe/list/:id
//  @desc   get all user recipes created by a user
//  @access Public
router.get("/list/:id", (req, res, next) => {
  const { id } = req.params;
  Recipe.getRecipesByUser(id, res, next);
});

//  Route for creating recipes
//  @route POST /:id
//  @desc  creates a new recipe
//  @access Public
router.post("/:userId", (req, res, next) => {
  Recipe.createRecipe(req, res, next);
});

//  Route for creating recipes
//  @route PUT /:id
//  @desc  updates a recipe
//  @access Public
router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  Recipe.updateRecipe(id, req, res, next);
});

//  Route for creating recipes
//  @route PUT /:id
//  @desc  updates a recipe
//  @access Public
router.put("/rate/:id", (req, res, next) => {
  const { id } = req.params;
  Recipe.rateRecipe(id, req, res, next);
});

//  Route for creating recipes
//  @route DELETE /:id
//  @desc  deletes a recipe
//  @access Public
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  Recipe.deleteRecipe(id, req, res, next);
});

module.exports = router;