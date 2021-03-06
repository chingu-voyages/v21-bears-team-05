const util = require("util");

const Recipe = require("../models/recipe");
const User = require("../models/users");
const Index = require("../models/index");
const queryHelper = require("../../lib/query");
const ErrorHandler = require("../../lib/error");

User.update = util.promisify(User.update);
Recipe.update = util.promisify(Recipe.update);
Index.update = util.promisify(Index.update);
Recipe.aggregate = util.promisify(Recipe.aggregate);

/**
 * adds a new recipe to the database
 * @async
 * @param {userId} title - uuid of recipe creator.
 */
const createRecipe = async (req, res, next) => {
  const recipe = req.body;
  try {
    const newRecipe = await Recipe.create({
      ...recipe,
    });
    await newRecipe.save();
    //update user recipe list
    const user = await User.findByIdAndUpdate(
      recipe.uploadedBy,
      {
        $push: {
          recipeList: newRecipe.uuid,
        },
      },
      { new: true }
    );
    //update index
    await Index.updateOne({}, { $push: { recipes: newRecipe.uuid } });
    res
      .status(200)
      .json({ recipe: newRecipe, userRecipeList: user.recipeList });
  } catch (error) {
    next(error);
  }
};

/**
 * updates a recipe
 * @async
 * @param {uuid} uuid - recipe uuid
 */
const updateRecipe = async (uuid, req, res, next) => {
  const update = req.body;
  try {
    //update target recipe
    const updatedRecipe = await Recipe.findOneAndUpdate({ uuid }, update, {
      new: true,
    });

    if (!updatedRecipe)
      throw new ErrorHandler(404, "Recipe Not Found", error.stack);

    //update in userRecipeList
    const uploadedBy = updatedRecipe.uploadedBy;
    await queryHelper.updateUserRecipeList(res, updatedRecipe);

    //send the response
    const user = await User.findById(uploadedBy);
    res.status(200).json({ updatedRecipe });
  } catch (error) {
    next(error);
  }
};

/**
 * deletes a recipe
 * @async
 * @param {uuid} uuid - recipe uuid
 */
const deleteRecipe = async (uuid, req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ uuid });

    if (!recipe) throw new ErrorHandler(404, "Recipe Not Found", error.stack);

    if (!recipe.uploadedBy.equals(req.body.userId))
      throw new ErrorHandler(401, "Unauthorized", error.stack);

    // delete from recipe
    // update user recipe list
    await Promise.all([
      await Recipe.findByIdAndDelete(uuid),
      await User.updateOne(
        { id: recipe.uploadedBy },
        {
          $pull: { recipeList: { title: recipe.title } },
        },
        { multi: true }
      ),
    ]);

    //delete from index
    await Index.updateOne({}, { $pull: { recipes: uuid } });
    const user = await User.findById(req.body.userId);
    res
      .status(200)
      .json({ deletedRecipe: recipe, recipeList: user.recipeList });
  } catch (error) {
    next(error);
  }
};
/**
 * Get all recipe from the database
 * @async
 * @param {userId} title - uuid of recipe creator.
 */
const getRecipes = async (req, res, next) => {
  try {
    let recipes = await Recipe.find();

    if (recipes.length === 0) {
      return res.status(404).json({ error: "No recipes in database" });
    }
    res.status(200).json(recipes);
  } catch (error) {
    console.log(error);
  }
};
/**
 * gets a recipe by user
 * @async
 * @param {uuid} uuid - user uuid
 */
const getRecipesByUser = async (uuid, res, next) => {
  try {
    const userecipes = await Recipe.find({ uploadedBy: uuid }).exec();

    if (!userecipes)
      throw new ErrorHandler(
        404,
        "user has not created any recipe",
        error.stack
      );
    res.status(200).json({ userRecipes: userecipes });
  } catch (error) {
    next(error);
  }
};

/**
 * gets a recipe by user
 * @async
 * @param {uuid} uuid - user uuid
 */
const rateRecipe = async (userId, req, res, next) => {
  const recipeId = req.body.recipeId;
  const stars = req.body.stars;
  try {
    await queryHelper.updateUserRatingsList(userId, recipeId, stars, res);
    // check recipe rating to update it
    // recipe vote increase at every rating
    // but stars is compared for present star

    await Recipe.updateOne(
      { uuid: recipeId, "rating.stars": { $lt: stars } },
      { "rating.stars": stars },
      { runValidators: true, context: "query" }
    );

    const user = await User.findById(userId);
    const recipe = await Recipe.findById(recipeId);
    res.status(200).json({ upvotedRecipe: recipe, userRatings: user.ratings });
  } catch (error) {
    next(error);
  }
};

const getRecipeById = async (uuid, res, next) => {
  try {
    const recipe = await Recipe.findOne({ uuid });
    if (!recipe) throw new ErrorHandler(404, "Recipe not found", error.stack);
    res.status(200).json(recipe);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipes,
  getRecipesByUser,
  rateRecipe,
  getRecipeById,
};
