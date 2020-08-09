import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import "./Recipes.css";

const recipes = {
  breakfast: [
    {
      id: 1,
      name: "English Breakfast",
      ingredients: ["bacon", "eggs", "sausage"],
      description: "Fry the eggs, lorem ipsum...",
    },
    {
      id: 2,
      name: "American Pancakes",
      ingredients: ["white flour", "milk", "eggs"],
      description: "Fry the eggs, lorem ipsum...",
    },
  ],
  asian: [
    {
      id: 3,
      name: "Tonkotsu Ramen",
      ingredients: ["noodles", "pork", "spring onion"],
      description: "Fry the eggs, lorem ipsum...",
    },
  ],
  pastas: [
    {
      id: 4,
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
      <input placeholder="Search ingredients"></input>
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
            <Link
              key={recipe.id}
              to={{
                pathname: `/recipes/${recipe.id}`,
                state: {
                  recipe,
                },
              }}
            >
              <li>{recipe.name}</li>
            </Link>
          ))
        );
      })}
    </Layout>
  );
};

export default Recipes;
