const Recipe = require("../server/models/recipe");
const User = require("../server/models/users");

/**
 * updates user recipe list
 * @async
 *
 */
const sortRecipesByRating = async () => {
  console.log("getting all recipes");
  try {
    const recipes = await Recipe.find({})
      .sort({ "ratings.votes": -1, "rating.stars": -1 })
      .select("uuid, ingredients, dateUpdated")
    return recipes;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * updates user recipe list
 * @async
 * @param {uuid} uuid - recipe uuid
 */
async function updateUserRecipeList(newRecipe) {
  const newRecipeId = newRecipe.uuid;
  const user = await User.findById(newRecipe.createdBy);
  await Promise.all(
    user.recipeList.map(async (entry) => {
      try {
        const user = await User.findById(newRecipe.createdBy);
        if (newRecipeId.equals(entry.uuid)) {
          await User.updateOne(
            { id: user.id, "recipeList.title": entry.title },
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
 * @param {uuid} uuid - recipe uuid
 */
async function updateUserRatingsList(userId, recipeId, sta) {
  try {
    const user = await User.findById(userId);
    for (const iterator of user.ratings) {
      if (recipeId.toString() === iterator.uuid.toString()) {
        await User.updateOne(
          { id: userId, "ratings.uuid": iterator.uuid },
          { "ratings.$.stars": stars },
          { runValidators: true, context: "query" }
        );
        return;
      }
    }
    await User.updateOne(
      { id: userId },
      { $push: { ratings: { uuid: recipeId, stars: stars } } },
      { runValidators: true, context: "query" }
    );
    await user.save();
    return;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  sortRecipesByRating,
  updateUserRatingsList,
  updateUserRecipeList,
};
