import search from "../utils/search.mjs";
import { addData, getData } from "./dataController.mjs";

const searchRecipes = async ({ query, ingredients }) => {
  let dataSet = await getRecipes();
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
  const matches = search(query, dataSet.data, searchOptions);
  const matchSet = new Set(
    Object.keys(matches)
      .map((container) => {
        return [...matches[container].map((result) => result.path[0])];
      })
      .flat()
  );
  const data = {};
  [...matchSet].forEach(
    (recipeKey) => (data[recipeKey] = dataSet.data[recipeKey])
  );
  return {
    data,
  };
};

const filterRecipesByIngredients = async ({ ingredients, dataSet }) => {
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
  const refs = matches?.recipesWithLessOrEqualIngredients?.map(
    (match) => match.path[0]
  );
  const filteredData = {};
  if (refs) {
    refs.forEach((ref) => {
      filteredData[ref] = dataSet[ref];
    });
  }
  return filteredData;
};

const getRecipes = async (props) => {
  let dataSet = await getData({ destination: "recipes" });
  let data;
  if (props?.ingredients) {
    data = await filterRecipesByIngredients({
      ingredients: props.ingredients,
      dataSet,
    });
  } else {
    data = dataSet;
  }
  return { data };
};

const getNOfRecipes = async ({ ingredients } = { ingredients: null }) => {
  const recipes = await getRecipes({ ingredients });
  return recipes.length || 0;
};

const addRecipe = async (recipe) => {
  const id = await addData({ destination: "recipes", data: recipe });
  return id;
};

export { searchRecipes, getRecipes, getNOfRecipes, addRecipe };
