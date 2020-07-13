import React, { useState } from "react";
import Layout from "../components/Layout";
import "./PublishRecipe.css";
import IngredientSearch from "../components/IngredientSearch";
import ItemsList from "../components/ItemsList";
import { useHistory } from "react-router-dom";

const PublishRecipe = () => {
  const history = useHistory();
  const [recipe, setRecipe] = useState({
    id: "",
    name: "",
    ingredients: [],
    description: "",
  });

  const [ingredientsList, setIngredientsList] = useState([]);
  const [error, setError] = useState("");

  const handleRemoveIngredient = (obj) => {
    const updatedList = ingredientsList.filter(
      (ingredient) => JSON.stringify(ingredient) !== JSON.stringify(obj)
    );
    setIngredientsList(updatedList);
  };

  const addToIngredientsList = (item) => {
    if (
      !ingredientsList.find(
        (ingredient) => JSON.stringify(ingredient) === JSON.stringify(item)
      )
    ) {
      const updatedList = [...ingredientsList, item];
      setIngredientsList(updatedList);
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
    setError("");
    if (ingredientsList.length === 0 || !recipe.name || !recipe.description) {
      setError("You have forgotten to fill out a required field.");
      return;
    }
    recipe.id = Math.floor(Math.random() * 100);
    for (var i = 0; i < ingredientsList.length; i++) {
      var ingredients = recipe.ingredients;
      ingredients.push(ingredientsList[i].title);
    }
    console.log("submit clicked", recipe);
    //TODO send this information to the backend and store in DB
  };

  return (
    <Layout>
      <h1>Publish Recipe</h1>
      <form onSubmit={handleSubmit}>
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
          list={ingredientsList.map((item) => ({
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
            name="description"
            value={recipe.description}
            onChange={handleChange}
          ></textarea>
        </label>
        <input type="submit" value="Submit" />
      </form>
      {error && <div>{error}</div>}
    </Layout>
  );
};

export default PublishRecipe;
