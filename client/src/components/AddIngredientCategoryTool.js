import React, { useState } from "react";
import generateTempId from "../utils/generateTempId";

const AddIngredientCategoryTool = ({ handleAddBreadcrumb }) => {
  const [newIngredientCategory, setNewIngredientCategory] = useState("");
  const handleAddNewCatagory = () => {
    handleAddBreadcrumb({
      name: newIngredientCategory,
      id: generateTempId(),
      isNew: true,
    });
    setNewIngredientCategory("");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddNewCatagory();
    }
  };
  return (
    <div>
      <input
        placeholder="Make new IngredientCategory"
        type="text"
        value={newIngredientCategory}
        onChange={(e) => setNewIngredientCategory(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {newIngredientCategory.length > 1 && (
        <button onClick={handleAddNewCatagory}>Add IngredientCategory</button>
      )}
    </div>
  );
};

export default AddIngredientCategoryTool;
