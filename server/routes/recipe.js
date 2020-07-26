const express = require("express");
const router = express.Router();

const Recipe = require("../controllers/recipe");

//  Route for listing recipes
//  @route  GET /recipe/list/:id
//  @desc   get all user recipes created by a user
//  @access Public
router.get("/list/:id", (req, res) => {
  const { id } = req.params;
  Recipe.getRecipesByUser(id, res);
});

//  Route for creating recipes
//  @route POST /:id
//  @desc  creates a new recipe
//  @access Public
router.post("/:userId", (req, res) => {
  const { userId } = req.params;
  Recipe.createRecipe(userId, req, res);
});

//  Route for creating recipes
//  @route PUT /:id
//  @desc  updates a recipe
//  @access Public
router.put("/:id", (req, res) => {
  const { id } = req.params;
  Recipe.updateRecipe(id, req, res);
});

//  Route for creating recipes
//  @route PUT /:id
//  @desc  updates a recipe
//  @access Public
router.put("/rate/:id", (req, res) => {
  const { id } = req.params;
  Recipe.rateRecipe(id, req, res);
});

//  Route for creating recipes
//  @route DELETE /:id
//  @desc  deletes a recipe
//  @access Public
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Recipe.deleteRecipe(id, req, res);
});

module.exports = router;
