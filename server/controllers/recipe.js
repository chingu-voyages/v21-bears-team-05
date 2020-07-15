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
};

module.exports = {
  createRecipe,
  // updateRecipe,
};
