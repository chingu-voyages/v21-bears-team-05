const Index = require("../models/index");
const queryHelper = require("../../lib/query");
const Ingredient = require("../models/ingredient");
const IngredientCategory = require("../models/ingredientCategory");

const getIndex = async (res, next) => {
  console.log("getting db index==");
  try {
    let index = await Index.find({})[0];
    if (!index) {
      // create it
      const ingredients = await Ingredient.find().select("uuid, dateUpdated");
      const ingredientCatagories = await IngredientCategory.find().select(
        "uuid, dateUpdated"
      );
      index = await Index.create({
        ingredients,
        ingredientCatagories,
      });
    }
    console.log("index: " + JSON.stringify(index));
    const recipesSortedByRating = await queryHelper.sortRecipesByRating();
    res.status(200).send({
      ...index._doc,
      recipes: recipesSortedByRating,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIndex,
};
