const Recipe = require("../server/models/recipe");
const User = require("../server/models/users");

/**
 * updates user recipe list
 * @async
 *
 */
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

/**
 * updates user recipe list
 * @async
 * @param {id} id - recipe id
 */
async function updateUserRecipeList(newRecipe) {
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
        throw new Error(error.stack);
      }
    })
  );
}

/**
 * updates user recipe list
 * @async
 * @param {id} id - recipe id
 */
async function updateUserRatingsList(userId, recipeId, sta) {
  try {
    const user = await User.findById(userId);
    for (const iterator of user.ratings) {
      if (recipeId.toString() === iterator._id.toString()) {
        await User.updateOne(
          { _id: userId, "ratings._id": iterator._id },
          { "ratings.$.stars": stars },
          { runValidators: true, context: "query" }
        );
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

module.exports = {
  listTopTenRecipes,
  updateUserRatingsList,
  updateUserRecipeList,
};
