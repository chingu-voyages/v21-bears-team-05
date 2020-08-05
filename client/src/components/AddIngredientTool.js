import React from "react";
import ListItem from "./ListItem";
import {
  addIngredient,
  addIngredientCategory,
} from "../services/ingredients.mjs";

const AddIngredientTool = ({ name, breadcrumbs, addToIngredientsList }) => {
  const processNewIngredientCategories = async () =>
    Promise.all(breadcrumbs.map(async ({ id, name, parent, isNew }, i, arr) => {
      if (!parent && arr[i - 1]) {
        parent = arr[i - 1].id;
      }
      if (isNew) {
        id = await addIngredientCategory({ name, parent });
      }
      return { id, name, parent };
    }));
  const handleAddNewIngredient = async () => {
    const ingredientCategories = await processNewIngredientCategories();
    const newIngredient = {
      name,
      ingredientCategories: [ingredientCategories?.[ingredientCategories.length - 1]?.id],
      relativeValues: [],
    };
    const id = await addIngredient(newIngredient);
    addToIngredientsList({ ...newIngredient, id });
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
          <p>{`Add ${breadcrumbs
            .map(({ name }) => name)
            .join(" --> ")} --> ${name} as a new ingredient`}</p>
        </ListItem>
      )}
    </>
  );
};

export default AddIngredientTool;
