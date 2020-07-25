const User = require("../models/index");
const util = require("util");

const Index = require("../models/index");
const recipeController = require("../controllers/recipe");

const createIndex = async (res) => {
  console.log("creating db index==");
  const allTopRecipes = await recipeController.listTopTenRecipes();

  try {
    const index = await Index.create({
      topRecipes: [
        ...allTopRecipes.map((recipe) => {
          return {
            recipeRef: recipe._id,
            ingredients: recipe.ingredients,
            tags: recipe.tags,
          };
        }),
      ],
    });

    res.status(200).send({ appDbIndex: index });
  } catch (error) {
    res.status(500).send(error.stack);
  }
};

const getIndex = async (res) => {
  console.log("getting db index==");
  try {
    const index = await Index.find({})

    res.status(200).send({ appDbIndex: index });
  } catch (error) {
    res.status(500).send(error.stack);
  }
};

module.exports = {
	createIndex,
	getIndex
};
