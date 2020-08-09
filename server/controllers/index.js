const queryHelper = require("../../lib/query");
const Ingredient = require("../models/ingredient");
const IngredientCategory = require("../models/ingredientCategory");
const User = require("../models/users");
const Index = require("../models/index");

const getIndex = async (res, next) => {
  try {
    const ingredients = await Ingredient.find().select("uuid dateUpdated");
    const ingredientCategories = await IngredientCategory.find().select(
      "uuid dateUpdated"
    );
    const recipesSortedByRating = await queryHelper.sortRecipesByRating();
    const users = await User.find().select("uuid dateUpdated");
    res.status(200).json({
      ingredients,
      ingredientCategories,
      recipes: recipesSortedByRating,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const getIndexModifiedDate = async (res, next) => {
  try {
    const index = await Index.findOne({ ref: "1" });
    res.status(200).json({
      modified: index.modified,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIndex,
  getIndexModifiedDate,
};
