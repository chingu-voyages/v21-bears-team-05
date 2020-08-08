import search from "../utils/search.mjs";
import { addData, getData } from "./dataController.mjs";

const searchIngredients = async (query, breadcrumbs = []) => {
  let data = await getData({ destination: "ingredients" });
  if (data) {
    data = Object.values(data);
    const lastestBreadCrumb =
      breadcrumbs && breadcrumbs[breadcrumbs.length - 1]?.id;
    const dataSet = lastestBreadCrumb
      ? data.filter(({ ingredientCategories }) =>
          ingredientCategories.includes(lastestBreadCrumb)
        )
      : data;
    const searchOptions = {
      output: {
        ingredientsThatStartWithQuery: {
          type: "string",
          flags: "iy",
          within: "name",
        },
        ingredientsThatContainQuery: {
          type: "string",
          flags: "i",
          within: "name",
        },
      },
      recursive: true,
    };
    const matches = search(query, dataSet, searchOptions);
    const matchSet = new Set(
      Object.keys(matches)
        .map((container) => {
          return [
            ...matches[container].map(({ value, path }) =>
              JSON.stringify({
                name: value,
                path,
              })
            ),
          ];
        })
        .flat()
    );
    return [...matchSet]
      .map((json) => JSON.parse(json))
      .map((item) => item.path[0]);
  }
  return [];
};

const getIngredientCategories = async (breadcrumbs) => {
  let data = await getData({ destination: "ingredientCategories" });
  if (data) {
    data = Object.values(data);
    if (data.length > 0) {
      const lastestBreadCrumb =
        breadcrumbs && breadcrumbs[breadcrumbs.length - 1];
      const dataSet = lastestBreadCrumb
        ? data.filter(({ parent }) => parent === lastestBreadCrumb.id)
        : data.filter(({ parent }) => !parent);
      return Object.values(dataSet).map(({ name, id }) => ({ name, id }));
    }
  }
  return [];
};

const lookupIngredient = async (id) => {
  let data = await getData({ destination: "ingredients", ref: { id } });
  return data;
};

const addIngredient = async (ingredient) => {
  const data = ingredient;
  const id = await addData({ destination: "ingredients", data });
  return id;
};

const addIngredientCategory = async (ingredientCategory) => {
  const data = ingredientCategory;
  const id = await addData({ destination: "ingredientCategories", data });
  return id;
};

export {
  searchIngredients,
  getIngredientCategories,
  addIngredient,
  addIngredientCategory,
  lookupIngredient,
};
