const Index = require("../models/index");
const queryHelper = require("../../lib/query");

const createIndex = async (res, next) => {
  const allTopRecipes = await queryHelper.listTopTenRecipes();

  try {
    const index = await Index.create({
      topRecipes: [
        ...allTopRecipes.map((recipe) => {
          return {
            recipeRef: recipe.id,
            ingredients: recipe.ingredients,
            tags: recipe.tags,
          };
        }),
      ],
    });

    res.status(200).send({ appDbIndex: index });
  } catch (error) {
    next(error);
  }
};

const getIndex = async (res, next) => {
  console.log("getting db index==");
  try {
    const index = await Index.find({});
    res.status(200).send({ appDbIndex: index });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIndex,
  getIndex,
};
