import React, { useState } from "react";
import Layout from "../components/Layout";
import "./Recipes.css";

const recipes = {
  breakfast: [
    {
      name: "English Breakfast",
      ingredients: ["bacon", "eggs", "sausage"],
      description: "Fry the eggs, lorem ipsum...",
    },
    {
      name: "American Pancakes",
      ingredients: ["white flour", "milk", "eggs"],
      description: "Fry the eggs, lorem ipsum...",
    },
  ],
  asian: [
    {
      name: "Tonkotsu Ramen",
      ingredients: ["noodles", "pork", "spring onion"],
      description: "Fry the eggs, lorem ipsum...",
    },
  ],
  pastas: [
    {
      name: "Carbonara",
      ingredients: ["spaghetti", "pancetta", "eggs"],
      description: "DO NOT Fry the eggs, lorem ipsum...",
    },
  ],
};

const Recipes = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelection = (event) => {
    setSelectedCategory(event.target.innerText);
  };

  const resetCategory = () => {
    setSelectedCategory("");
  };

  return (
    <Layout>
      <p>Search component placeholder</p>
      <p>{selectedCategory}</p>
      {selectedCategory && (
        <p style={{ color: "blue" }} onClick={resetCategory}>
          Back
        </p>
      )}
      {!selectedCategory &&
        Object.keys(recipes).map((category) => (
          <li key={category} onClick={handleCategorySelection}>
            {category}
          </li>
        ))}
      {Object.keys(recipes).map((category) => {
        return (
          category === selectedCategory &&
          recipes[category].map((recipe) => (
            <li key={recipe.name}>{recipe.name}</li>
          ))
        );
      })}
    </Layout>
  );
};

export default Recipes;
