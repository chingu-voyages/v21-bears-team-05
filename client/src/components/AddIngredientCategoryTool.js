import React, { useState } from "react";
import generateTempId from "../utils/generateTempId";
import "./AddIngredientCategoryTool.css";

const AddIngredientCategoryTool = ({ handleAddBreadcrumb }) => {
  const [newIngredientCategory, setNewIngredientCategory] = useState("");
  const handleAddNewCatagory = () => {
    handleAddBreadcrumb({
      name: newIngredientCategory,
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
        className="addCategoryInput"
        placeholder="add category"
        type="text"
        value={newIngredientCategory}
        onChange={(e) => setNewIngredientCategory(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {newIngredientCategory.length > 1 && (
        <button className="addCategoryButton" onClick={handleAddNewCatagory}>
          Add Category
        </button>
      )}
    </div>
  );
};

export default AddIngredientCategoryTool;
