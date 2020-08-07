import search from "../utils/search.mjs";
import { addData, getData } from "./dataController.mjs";
import { getUserData } from "./users.mjs";
import { status } from "./subscribers";

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
          const ingredientsArr = query.map((ingredient) => ingredient.uuid);
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

const getRecipe = async (uuid) => {
  let data = await getData({ destination: "recipes", ref: { uuid } });
  return data;
};

const getNOfRecipes = async ({ ingredients } = { ingredients: null }) => {
  const recipes = await getRecipes({ ingredients });
  return recipes.length || 0;
};

const addRecipe = async (recipe) => {
  const uuid = await addData({ destination: "recipes", data: recipe });
  return uuid;
};

const addToGallery = async (url, recipeId) => {
  const userData = await getUserData();
  if (userData.uuid === "guest") {
    return false;
  }
  const newUpload = {
    url,
    uploadedBy: userData.uuid,
  };
  const recipeData = await getRecipe(recipeId);
  if (!recipeData) {
    throw Error(
      `Trying to add to recipe gallery but recipeId: ${recipeId} does not exist!`
    );
  } else if (recipeData.gallery?.find((item) => item.url === url)) {
    throw Error(
      `Trying to add to recipe gallery but url has already exists in gallery, this shouldn't be able to happen!`
    );
  }
  recipeData.gallery = [...recipeData.gallery, newUpload];
  const uuid = await addRecipe(recipeData);
  if (uuid === recipeData.uuid) {
    return recipeData.gallery;
  }
  return false;
};

const removeFromGallery = async (urlToRemove, recipeId) => {
  const userData = await getUserData();
  const recipeData = await getRecipe(recipeId);
  const newGalleryData = recipeData?.gallery?.filter(
    ({ url, uploadedBy }) => !(url === urlToRemove && uploadedBy === userData.uuid)
  );
  const uuid =
    recipeData?.gallery &&
    newGalleryData?.length === recipeData.gallery?.length - 1 &&
    (await addRecipe({ ...recipeData, gallery: newGalleryData || [] }));
  if (uuid && uuid === recipeData.uuid) {
    status.done("Photo deleted");
  } else {
    status.error("Unable to delete photo");
    throw Error(
      `Unable to delete photo ${
        newGalleryData?.length !== recipeData.gallery?.length - 1
          ? "because newGalleryData.length is not equal to orginal gallery length - 1"
          : userData.uuid
          ? "because current user uuid does not match uploadedBy"
          : "for some reason"
      }`
    );
  }
  return newGalleryData;
};

export {
  searchRecipes,
  getRecipes,
  getRecipe,
  getNOfRecipes,
  addRecipe,
  addToGallery,
  removeFromGallery,
};
