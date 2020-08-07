const Index = require("../models/index");
const queryHelper = require("../../lib/query");
const Ingredient = require("../models/ingredient");
const IngredientCategory = require("../models/ingredientCategory");

const getIndex = async (res, next) => {
  try {
    let index = await Index.findOne({ ref: "1" });
    if (!index) {
      // create it
      const ingredients = await Ingredient.find().select("uuid dateUpdated");
      const ingredientCategories = await IngredientCategory.find().select(
        "uuid dateUpdated"
      );
      index = await Index.create({
        ref: "1",
        ingredients,
        ingredientCategories,
      });
    }
    const recipesSortedByRating = await queryHelper.sortRecipesByRating();
    res.status(200).json({
      ...index._doc,
      recipes: recipesSortedByRating,
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
