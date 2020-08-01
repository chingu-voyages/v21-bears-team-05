import search from "../utils/search.mjs";
import { addData, getData } from "./dataController.mjs";

const searchRecipes = async ({ query, ingredients }) => {
  let dataSet = getData({ destination: "recipes", query });
  if (ingredients) {
    dataSet = getRecipes({ ingredients });
  }
  const searchOptions = {
    output: {
      recipeNamesThatStartWithQuery: {
        type: "string",
        within: "name",
        flags: "iy",
      },
      recipeNamesThatContainQuery: {
        type: "string",
        within: "name",
        flags: "i",
      },
      recipeDescriptionsThatContainQuery: {
        type: "string",
        within: "description",
        flags: "i",
      },
    },
    recursive: true,
  };
  const matches = search(query, dataSet, searchOptions);
  const matchSet = new Set(
    Object.keys(matches)
      .map((container) => {
        return [...matches[container].map((result) => result.path[0])];
      })
      .flat()
  );
  return {
    data: [...matchSet].map((recipeKey) => dataSet[recipeKey]),
    next: dataSet.next,
  };
};

const getRecipes = async ({ ingredients } = {ingredients: null}) => {
  const dataSet = await getData({ destination: "recipes", ref: { ingredients } });
  if (ingredients) {
    const searchOptions = {
      output: {
        recipesWithLessOrEqualIngredients: {
          type: "array",
          within: "ingredients",
          compareFunc: (query, { value }) => {
            const ingredientsArr = query.map((ingredient) => ingredient.title);
            return value
              .map((val) => val.title)
              .every((q) => ingredientsArr.includes(q));
          },
        },
      },
      recursive: true,
    };
    const matches = search(ingredients, dataSet, searchOptions);
    return {
      data:
        matches?.recipesWithLessOrEqualIngredients?.map(
          (result) => result.path[1]
        ) || [],
    };
  }
  return { data: dataSet };
};

const getNOfRecipes = async ({ ingredients } = {ingredients: null}) => {
  const recipes = await getRecipes({ ingredients });
  return recipes.length || 0;
};

const addRecipe = async (recipe) => {
  console.log("Add recipes");
  return addData({ destination: "recipes", data: recipe });
};

export { searchRecipes, getRecipes, getNOfRecipes, addRecipe };
