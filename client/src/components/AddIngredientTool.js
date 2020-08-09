import React from "react";
import ListItem from "./ListItem";
import {
  addIngredient,
  addIngredientCategory,
} from "../services/ingredients.mjs";

const AddIngredientTool = ({ name, breadcrumbs, addToIngredientsList }) => {
  const processNewIngredientCategories = async () =>
    Promise.all(breadcrumbs.map(async ({ uuid, name, parent, isNew }, i, arr) => {
      if (!parent && arr[i - 1]) {
        parent = arr[i - 1].uuid;
      }
      if (isNew) {
        uuid = await addIngredientCategory({ name, parent });
      }
      return { uuid, name, parent };
    }));
  const handleAddNewIngredient = async () => {
    const ingredientCategories = await processNewIngredientCategories();
    const newIngredient = {
      name,
      ingredientCategories: [ingredientCategories?.[ingredientCategories.length - 1]?.uuid],
      relativeValues: [],
    };
    const uuid = await addIngredient(newIngredient);
    addToIngredientsList({ ...newIngredient, uuid });
  };
  return (
    <>
      {name.length > 1 && (
        <ListItem
          {...{
            type: "new-ingredient",
            onClick: handleAddNewIngredient,
          }}
        >
          <p>{`add ${breadcrumbs
            .map(({ name }) => name)
            .join(" → ")} → ${name} as a new ingredient`}</p>
        </ListItem>
      )}
    </>
  );
};

export default AddIngredientTool;
