const mongoose = require("mongoose");
const util = require("util");

const Recipe = require("../models/recipe");
const User = require("../models/users");
User.update = util.promisify(User.update)


const createRecipe = async (userId, req, res) => {
  const recipe = req.body;
  console.log("recipe =", recipe);
  try {
    const newRecipe = await Recipe.create({
      created_by: userId,
      ...recipe,
    });
    await newRecipe.save();
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          recipeList: {
            _id: newRecipe._id,
            name: newRecipe.name,
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
}


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
    res
      .status(200)
      .json({ updatedRecipe, updatedUserRecipeList: user.recipeList });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
}


async function updateUserRecipeList(res, newRecipe) {
  const newRecipeId = newRecipe._id;
  const user = await User.findById(newRecipe.created_by);
  await Promise.all(
    user.recipeList.map(async (entry) => {
      try {
        const user = await User.findById(newRecipe.created_by);
        if (newRecipeId.equals(entry._id)) {
          await User.update(
            { _id: user._id, "recipeList.name": entry.name },
            { $set: { "recipeList.$.name": newRecipe.name } }
          );
          await user.save();
          return;
        }
      } catch (error) {
        res.status(500).json({ error: error.stack });
      }
    })
  )
}


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
          $pull: { recipeList: { name: recipe.name } },
        },
        { multi: true }
      ),
    ]);

    const user = await User.findById(req.body.user_id);
    console.log("all users", user);
    res
      .status(200)
      .json({ deletedRecipe: recipe, recipeList: user.recipeList });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
}

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

module.exports = {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesByUser,
}
