const mongoose = require("mongoose");
const util = require("util");

const Recipe = require("../models/recipe");
const User = require("../models/users");
const Index = require("../models/index");
const queryHelper = require("../../lib/query");

User.update = util.promisify(User.update);
Recipe.update = util.promisify(Recipe.update);
Index.update = util.promisify(Index.update);
Recipe.aggregate = util.promisify(Recipe.aggregate);

/**
 * adds a new recipe to the database
 * @async
 * @param {userId} title - id of recipe creator.
 */
const createRecipe = async (userId, req, res) => {
  const recipe = req.body;
  try {
    const newRecipe = await Recipe.create({
      created_by: userId,
      uploaded_by: userId,
      ...recipe,
    });
    await newRecipe.save();
    //update user recipe list
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          recipeList: {
            _id: newRecipe._id,
            title: newRecipe.title,
          },
        },
      },
      { new: true }
    );
    //update index
    await Index.updateOne({}, { $push: { recipes: newRecipe._id } });
    res
      .status(200)
      .json({ recipe: newRecipe, userRecipeList: user.recipeList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * updates a recipe
 * @async
 * @param {id} id - recipe id
 */
const updateRecipe = async (id, req, res) => {
  const update = req.body;
  try {
    //update target recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedRecipe) return res.status(404).json({ error: "Not Found" });

    //update in userRecipeList
    const createdBy = updatedRecipe.created_by;
    await queryHelper.updateUserRecipeList(res, updatedRecipe);

    //send the response
    const user = await User.findById(createdBy);
    res.status(200).json({ updatedRecipe });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

/**
 * deletes a recipe
 * @async
 * @param {id} id - recipe id
 */
const deleteRecipe = async (id, req, res) => {
  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) return res.status(404).json({ error: "recipe not found" });

    if (!recipe.created_by.equals(req.body.user_id))
      return res.status(401).send("Unauthorized");

    // delete from recipe
    // update user recipe list
    await Promise.all([
      await Recipe.findByIdAndDelete(id),
      await User.updateOne(
        { _id: recipe.created_by },
        {
          $pull: { recipeList: { title: recipe.title } },
        },
        { multi: true }
      ),
    ]);

    //delete from index
    await Index.updateOne({}, { $pull: { recipes: id } });
    const user = await User.findById(req.body.user_id);
    res
      .status(200)
      .json({ deletedRecipe: recipe, recipeList: user.recipeList });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

/**
 * gets a recipe by user
 * @async
 * @param {id} id - user id
 */
const getRecipesByUser = async (id, res) => {
  try {
    const userecipes = await Recipe.find({ created_by: id }).exec();
    if (!userecipes)
      return res.status(404).json({ error: "user has not created any recipe" });
    res.status(200).json({ userRecipes: userecipes });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

/**
 * gets a recipe by user
 * @async
 * @param {id} id - user id
 */
const rateRecipe = async (userId, req, res) => {
  const recipeId = req.body.recipe_id;
  const stars = req.body.stars;
  try {
    await queryHelper.updateUserRatingsList(userId, recipeId, stars, res);
    // check recipe rating to update it
    // recipe vote increase at every rating
    // but stars is compared for present star

    await Recipe.updateOne(
      { _id: recipeId, "rating.stars": { $lt: stars } },
      { "rating.stars": stars },
      { runValidators: true, context: "query" }
    );

    const user = await User.findById(userId);
    const recipe = await Recipe.findById(recipeId);
    res.status(200).json({ upvotedRecipe: recipe, userRatings: user.ratings });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

module.exports = {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesByUser,
  rateRecipe,
};
