import React, { useState } from "react";
import Layout from "../components/Layout";
import "./PublishRecipe.css";
import IngredientSearch from "../components/IngredientSearch";
import ItemsList from "../components/ItemsList";
import { addRecipe } from "../services/recipesDB";

const PublishRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    description: "",
    instructions: "",
    image: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit clicked", recipe);
    setError("");
    console.log("should call addRecipe now");
    addRecipe(recipe);
  };

  return (
    <Layout>
      <h1>Publish Recipe</h1>
      <label>
        title:
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
        ></input>
      </label>
      <label>
        description:
        <input
          type="text"
          name="description"
          value={recipe.description}
          onChange={handleChange}
        ></input>
      </label>
      <label>
        image:
        <input
          onChange={handleChange}
          id="inputFile"
          type="file"
          name="image"
          value={recipe.image}
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
      <IngredientSearch {...{ addToIngredientsList }} />
      <label>
        instructions:
        <textarea
          type="text"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
        ></textarea>
      </label>
      <button onClick={handleSubmit}>publish recipe</button>

      {error && <div>{error}</div>}
    </Layout>
  );
};

export default PublishRecipe;
