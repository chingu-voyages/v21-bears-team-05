import React from "react";
import ListItem from "./ListItem";
import generateTempId from "../utils/generateTempId";
import {
  addIngredient,
  addIngredientCategory,
} from "../services/ingredients.mjs";

const AddIngredientTool = ({ name, breadcrumbs, addToIngredientsList }) => {
  const processNewIngredientCategories = () =>
    breadcrumbs.map(({ id, name, parent, isNew }, i, arr) => {
      if (!parent && arr[i - 1]) {
        parent = arr[i - 1].id;
      }
      const ingredientCategory = { id, name, parent };
      if (isNew) {
        addIngredientCategory(ingredientCategory);
      }
      return ingredientCategory;
    });
  const getIngredientCategoriesHead = () => {
    const ingredientCategories = processNewIngredientCategories();
    return ingredientCategories[ingredientCategories.length - 1];
  };
  const handleAddNewIngredient = () => {
    const newIngredient = {
      id: generateTempId(),
      name,
      ingredientCategories: [getIngredientCategoriesHead()],
      relativeValues: [],
    };
    addIngredient(newIngredient);
    addToIngredientsList(newIngredient);
  };
  return (
    <>
      {name.length > 1 && (
        <ListItem
          {...{
            name: `Add ${breadcrumbs
              .map(({ name }) => name)
              .join(" --> ")} --> ${name} as a new ingredient`,
            type: "new-ingredient",
            onClick: handleAddNewIngredient,
          }}
        />
      )}
    </>
  );
};

export default AddIngredientTool;
