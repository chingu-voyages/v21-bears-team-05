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
 * @param {userId} title - id of recipe creator.
 */
const createRecipe = async (userId, req, res, next) => {
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
    next(error);
  }
};

/**
 * updates a recipe
 * @async
 * @param {id} id - recipe id
 */
const updateRecipe = async (id, req, res, next) => {
  const update = req.body;
  try {
    //update target recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedRecipe)
      throw new ErrorHandler(404, "Recipe Not Found", error.stack);

    //update in userRecipeList
    const createdBy = updatedRecipe.created_by;
    await queryHelper.updateUserRecipeList(res, updatedRecipe);

    //send the response
    const user = await User.findById(createdBy);
    res.status(200).json({ updatedRecipe });
  } catch (error) {
    next(error);
  }
};

/**
 * deletes a recipe
 * @async
 * @param {id} id - recipe id
 */
const deleteRecipe = async (id, req, res, next) => {
  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) throw new ErrorHandler(404, "Recipe Not Found", error.stack);

    if (!recipe.created_by.equals(req.body.user_id))
      throw new ErrorHandler(401, "Unauthorized", error.stack);

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
    next(error);
  }
};

/**
 * gets a recipe by user
 * @async
 * @param {id} id - user id
 */
const getRecipesByUser = async (id, res, next) => {
  try {
    const userecipes = await Recipe.find({ created_by: id }).exec();

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
 * @param {id} id - user id
 */
const rateRecipe = async (userId, req, res, next) => {
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
    next(error);
  }
};

module.exports = {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesByUser,
  rateRecipe,
};
