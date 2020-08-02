import search from "../utils/search.mjs";
import { addData, getData } from "./dataController.mjs";

const searchRecipes = async ({ query, ingredients }) => {
  let dataSet = await getData({ destination: "recipes", query });
  if (ingredients) {
    dataSet = await getRecipes({ ingredients });
  }
  const searchOptions = {
    output: {
      recipeNamesThatStartWithQuery: {
        type: "string",
        within: "title",
        flags: "iy",
      },
      recipeNamesThatContainQuery: {
        type: "string",
        within: "title",
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

const getRecpiesRefsByIngredients = async ({ ingredients }) => {
  const dataSet = await getData({
    destination: "recipes",
    ref: { ingredients },
  });
  const searchOptions = {
    output: {
      recipesWithLessOrEqualIngredients: {
        type: "array",
        within: "ingredients",
        compareFunc: (query, { value }) => {
          const ingredientsArr = query.map((ingredient) => ingredient.id);
          return value
            .map((val) => val.ingredientRef)
            .every((q) => ingredientsArr.includes(q));
        },
      },
    },
    recursive: true,
  };
  const matches = search(ingredients, dataSet, searchOptions);
  return matches?.recipesWithLessOrEqualIngredients?.map(
    (match) => match.path[0]
  );
};

const getRecipes = async (props) => {
  let data = await getData({ destination: "recipes" });
  if (props?.ingredients) {
    const refs = await getRecpiesRefsByIngredients({
      ingredients: props.ingredients,
    });
    const filteredData = {};
    if (refs) {
      refs.forEach((ref) => {
        filteredData[ref] = data[ref];
      });
    }
    data = filteredData;
  }
  return { data };
};

const getNOfRecipes = async ({ ingredients } = { ingredients: null }) => {
  const recipes = await getRecipes({ ingredients });
  return recipes.length || 0;
};

const addRecipe = async (recipe) => {
  return addData({ destination: "recipes", data: recipe });
};

export { searchRecipes, getRecipes, getNOfRecipes, addRecipe };
