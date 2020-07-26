import React, { useState } from "react";
import Layout from "../components/Layout";
import "./PublishRecipe.css";
import IngredientSearch from "../components/IngredientSearch";
import ItemsList from "../components/ItemsList";
import { addRecipe } from "../services/recipes";

const PublishRecipe = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    description: "",
  });
  const [error, setError] = useState("");

  const handleRemoveIngredient = (obj) => {
    const updatedList = recipe.ingredients.filter(
      (ingredient) => JSON.stringify(ingredient) !== JSON.stringify(obj)
    );
    setRecipe((prevState) => ({
      ...prevState,
      ingredients: updatedList,
    }));
  };

  const addToIngredientsList = (item) => {
    if (
      !recipe.ingredients.find(
        (ingredient) => JSON.stringify(ingredient) === JSON.stringify(item)
      )
    ) {
      const updatedList = [...recipe.ingredients, item];
      setRecipe((prevState) => ({
        ...prevState,
        ingredients: updatedList,
      }));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setError("");
    if (
      recipe.ingredients.length === 0 ||
      !recipe.name ||
      !recipe.description
    ) {
      setError("You have forgotten to fill out a required field.");
      return;
    }
    addRecipe(recipe);
    console.log("submit clicked", recipe);
  };

  return (
    <Layout>
      <h1>Publish Recipe</h1>
      <div>
        <label>
          name:
          <input
            type="text"
            name="name"
            value={recipe.name}
            onChange={handleChange}
          ></input>
        </label>
        <label>
          image:
          <input
            onChange={handleChange}
            id="inputFile"
            type="file"
            name="file"
            accept="image/*"
          />
        </label>

        <p>ingredients:</p>
        <ItemsList
          list={recipe.ingredients.map((item) => ({
            ...item,
            removeSelf: () => handleRemoveIngredient(item),
          }))}
          type="cupboard-item"
        />
        <IngredientSearch {...{ addToIngredientsList }} acceptNewIngredient />
        <label>
          instructions:
          <textarea
            type="text"
            name="description"
            value={recipe.description}
            onChange={handleChange}
          ></textarea>
        </label>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {error && <div>{error}</div>}
    </Layout>
  );
};

export default PublishRecipe;
