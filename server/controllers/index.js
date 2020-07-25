const User = require("../models/index");
const util = require("util");

const Index = require("../models/index");
const recipeController = require("../controllers/recipe");


const createIndex = async (res) => {
  console.log("creating db index==")
  const allTopRecipes = await recipeController.listTopRecipes();
  const getAllIngredients = [];
  const getAllRecipesRefs = [];
  try {
    const index = await Index.create({
      topRecipes: [
        ...allTopRecipes.map(recipe => {
           return {
						recipeRef: recipe._id, 
						ingredients: recipe.ingredients, 
						tags: recipe.tags
					 }
        }),
      ],
      ingredients: [...getAllIngredients],
      recipes: [...getAllRecipesRefs],
    });

    res.status(200).send({ appDbIndex: index });
  } catch (error) {
    res.status(500).send(error.stack);
  }
};

module.exports = {
  createIndex,
};
