import React, { useState } from "react";
import Layout from "../components/Layout";
import "./PublishRecipe.css";
import IngredientSearch from "../components/IngredientSearch";
import ItemsList from "../components/ItemsList";
import { addRecipe } from "../services/recipes";
import Button from "../components/Button";

const PublishRecipe = () => {
  const [steps, setSteps] = useState([{ id: 1, value: "" }]);
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    description: "",
    steps: steps,
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
  };

  const addStep = (e) => {
    e.preventDefault();
    setSteps([...steps, { id: steps.length + 1, value: "" }]);
  };

  const handleStepInput = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    let index = id - 1;
    let updatedStep = { id: id, value: value };
    let newSteps = Object.assign([...steps], { [index]: updatedStep });
    setSteps(newSteps);
    setRecipe((prevState) => ({
      ...prevState,
      steps: newSteps,
    }));
  };

  return (
    <Layout>
      <h1>Publish Recipe</h1>
      <div className="recipeForm">
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
          description:
          <textarea
            type="text"
            name="description"
            value={recipe.description}
            onChange={handleChange}
          ></textarea>
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

        <div>instructions:</div>
        {steps &&
          steps.map((step) => (
            <label>
              step {step.id}:
              <textarea
                key={step.id}
                type="text"
                id={step.id}
                value={step.value}
                placeholder={`step ${step.id}`}
                onChange={handleStepInput}
              ></textarea>
            </label>
          ))}
        <Button onClick={addStep}>add step</Button>
        <Button onClick={handleSubmit}>submit</Button>
      </div>
      {error && <div>{error}</div>}
    </Layout>
  );
};

export default PublishRecipe;
