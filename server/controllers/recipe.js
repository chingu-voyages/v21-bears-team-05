const mongoose = require("mongoose");
const util = require("util");

const Recipe = require("../models/recipe");
const User = require("../models/users");
const Index = require("../models/index");
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
    await Index.update({}, { $push: { recipes: newRecipe._id } });
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
    await updateUserRecipeList(res, updatedRecipe);

    //send the response
    const user = await User.findById(createdBy);
    res.status(200).json({ updatedRecipe });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

/**
 * updates user recipe list
 * @async
 * @param {id} id - recipe id
 */
async function updateUserRecipeList(res, newRecipe) {
  const newRecipeId = newRecipe._id;
  const user = await User.findById(newRecipe.created_by);
  await Promise.all(
    user.recipeList.map(async (entry) => {
      try {
        const user = await User.findById(newRecipe.created_by);
        if (newRecipeId.equals(entry._id)) {
          await User.updateOne(
            { _id: user._id, "recipeList.title": entry.title },
            { "recipeList.$.title": newRecipe.title }
          );
          await user.save();
          return;
        }
      } catch (error) {
        res.status(500).json({ error: error.stack });
      }
    })
  );
}

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
      await User.update(
        { _id: recipe.created_by },
        {
          $pull: { recipeList: { title: recipe.title } },
        },
        { multi: true }
      ),
    ]);

    //delete from index
    await Index.update({}, { $pull: { recipes: id } });
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
    await updateUserRatingsList(userId, recipeId, stars, res);
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

/**
 * updates user recipe list
 * @async
 * @param {id} id - recipe id
 */
async function updateUserRatingsList(userId, recipeId, stars, res) {
  try {
    const user = await User.findById(userId);
    for (const iterator of user.ratings) {
      // retain previous rating
      if (recipeId.toString() === iterator._id.toString()) {
<<<<<<< HEAD
        // await User.updateOne(
        //   { _id: userId, "ratings._id": iterator._id },
        //   { "ratings.$.stars": stars },
        //   { runValidators: true, context: "query" }
        // );
=======
        await User.updateOne(
          { _id: userId, "ratings._id": iterator._id },
          { "ratings.$.stars": stars },
          { runValidators: true, context: "query" }
        );
>>>>>>> 1b1c610d0d3fe924f1c140617c03974c8d2f0a6b
        return;
      }
    }
    await User.updateOne(
      { _id: userId },
      { $push: { ratings: { _id: recipeId, stars: stars } } },
      { runValidators: true, context: "query" }
    );
    await user.save();
    return;
  } catch (error) {
    throw new Error(error);
  }
}

const listTopTenRecipes = async () => {
  console.log("getting all recipes");
  try {
    const recipes = await Recipe.find({})
      .sort({ "ratings.votes": -1, "rating.stars": -1 })
      .select("_id, ingredients , tags")
      .limit(10);
    return recipes;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesByUser,
  rateRecipe,
  listTopTenRecipes,
};
