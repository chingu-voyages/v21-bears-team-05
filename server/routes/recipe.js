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
//  @route  GET /recipe/list/:uuid
//  @desc   get all user recipes created by a user
//  @access Public
router.get("/list/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  Recipe.getRecipesByUser(uuid, res, next);
});

//  Route for creating recipes
//  @route POST /:uuid
//  @desc  creates a new recipe
//  @access Public
router.post("/:userId", (req, res, next) => {
  Recipe.createRecipe(req, res, next);
});

//  Route for creating recipes
//  @route PUT /:uuid
//  @desc  updates a recipe
//  @access Public
router.put("/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  Recipe.updateRecipe(uuid, req, res, next);
});

//  Route for creating recipes
//  @route PUT /:uuid
//  @desc  updates a recipe
//  @access Public
router.put("/rate/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  Recipe.rateRecipe(uuid, req, res, next);
});

//  Route for creating recipes
//  @route DELETE /:uuid
//  @desc  deletes a recipe
//  @access Public
router.delete("/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  Recipe.deleteRecipe(uuid, req, res, next);
});

//  Route getting a recipe
//  @route  GET /recipe/:uuid
//  @desc   get recipe by uuid
//  @access Public
router.get("/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  Recipe.getRecipeById(uuid, res, next);
});

module.exports = router;