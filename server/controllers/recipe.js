const mongoose = require("mongoose");
const util = require("util");

const Recipe = require("../models/recipe");
const User = require("../models/users");
const Rating = require("../models/ratings");
User.update = util.promisify(User.update);

/**
 * adds a new recipe to the database
 * @async
 * @param {userId} title - id of recipe creator.
 */
const createRecipe = async (userId, req, res) => {
  const recipe = req.body;
  console.log("recipe =", recipe);
  try {
    const newRecipe = await Recipe.create({
      created_by: userId,
      uploaded_by: userId,
      ...recipe,
    });
    await newRecipe.save();
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
    res.status(200).json({ updatedRecipe, UserRecipeList: user.recipeList });
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
          await User.update(
            { _id: user._id, "recipeList.title": entry.title },
            { $set: { "recipeList.$.title": newRecipe.title } }
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
    //get the recipe
    const user = await User.findById(userId);
    await updateUserRatingsList(user, recipeId, stars, res);
    console.log("then update recipe ratings");
    // check rating to update it
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

/**
 * updates user recipe list
 * @async
 * @param {id} id - recipe id
 */
async function updateUserRatingsList(user, recipeId, stars, res) {
  console.log("rating....", recipeId, stars, user.ratings);
  try {
    for (const iterator of user.ratings) {
      if (recipeId.equals(iterator._id) ) {
        await User.update(
          { _id: user._id, "recipeList.title": entry.title },
          { $set: { "recipeList.$.title": newRecipe.title } }
        );
        await user.save()
        return
      }
    }
    await User.update(
      { _id: user._id },
      { $push: { ratings: { _id: recipeId, stars: stars } } }
    );
    await user.save()
    return
  } catch (error) { res.status(500).json({ error: error.stack }) }
}

module.exports = {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesByUser,
  rateRecipe,
};
