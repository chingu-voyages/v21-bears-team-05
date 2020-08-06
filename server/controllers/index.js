const Index = require("../models/index");
const queryHelper = require("../../lib/query");

const getIndex = async (res, next) => {
  console.log("getting db index==");
  try {
    const index = await Index.find({});
    const recipesSortedByRating = await queryHelper.sortRecipesByRating();
    res.status(200).send({ data: {
        ...index,
        recipes: [
          ...recipesSortedByRating.map((recipe) => {
            return {
              recipeRef: recipe.id,
              ingredients: recipe.ingredients,
              tags: recipe.tags,
            };
          }),
        ]
    }});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIndex
};
