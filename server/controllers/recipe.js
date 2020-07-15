const mongoose = require("mongoose");
const util = require("util");
const Recipe = require("../models/recipe");
const User = require("../models/users");

User.update = util.promisify(User.update);

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

const updateRecipe = async (id, req, res) => {
  const update = req.body;
  try {
    //update target recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, update, {
      new: true,
		});
		
    if (!updatedRecipe) return res.status(404).json({ error: "Not Found" });
		
		//update in userRecipeList
    const createdBy = updatedRecipe.created_by
    await updateUserRecipeList(res, updatedRecipe)
		
		//send the response
    const user = await User.findById(createdBy);
    res
      .status(200)
      .json({ updatedRecipe, updatedUserRecipeList: user.recipeList });
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

async function updateUserRecipeList(res, newRecipe) {
  const newRecipeId = mongoose.Types.ObjectId(newRecipe._id);
  const user = await User.findById(newRecipe.created_by);
  await Promise.all(
    user.recipeList.map(async (entry, i) => {
      try {
        const user = await User.findById(newRecipe.created_by);
        if (newRecipeId.equals(mongoose.Types.ObjectId(entry._id))) {
          await User.update(
            { _id: user._id, "recipeList.name" : entry.name },
            { $set: { "recipeList.$.name": newRecipe.name } }
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

module.exports = {
  createRecipe,
  updateRecipe,
};
