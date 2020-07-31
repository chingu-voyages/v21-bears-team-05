import React, { useState } from "react";
import Layout from "../components/Layout";
import "./PublishRecipe.css";
import IngredientSearch from "../components/IngredientSearch";
import ItemsList from "../components/ItemsList";
import { addRecipe } from "../services/recipes";
import Button from "../components/Button";

const PublishRecipe = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([{ id: 1, value: "" }]);
  const [error, setError] = useState("");

  const handleRemoveIngredient = (obj) => {
    const updatedList = ingredients.filter(
      (ingredient) => JSON.stringify(ingredient) !== JSON.stringify(obj)
    );
    setIngredients(updatedList);
  };

  const addToIngredientsList = (item) => {
    if (
      !ingredients.find(
        (ingredient) => JSON.stringify(ingredient) === JSON.stringify(item)
      )
    ) {
      const updatedList = [...ingredients, item];
      setIngredients(updatedList);
    }
  };

  const handleName = (e) => {
    e.preventDefault();
    setName(e.target.value);
    console.log("name at change", name);
  };

  const handleDescription = (e) => {
    e.preventDefault();
    setDescription(e.target.value);
    console.log("description at change", description);
  };

  const handleImage = (e) => {
    e.preventDefault();
    setFile(e.target.value);
    console.log("file", file);
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
  };

  const handleSubmit = () => {
    setError("");
    if (ingredients.length === 0 || !name || !description) {
      setError("You have forgotten to fill out a required field.");
      return;
    }

    let recipe = {
      name,
      description,
      file,
      ingredients,
      instructions: steps.map((step) => step.value),
    };

    console.log(recipe);
    // addRecipe(recipe);
  };

  const deleteStep = (e) => {
    e.preventDefault();
    let { key, id, value } = e.target;
    let stepIndex = id - 1;
    steps.splice(stepIndex, 1);
    console.log("x clicked", key);
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
            value={name}
            onChange={handleName}
          ></input>
        </label>
        <label>
          description:
          <textarea
            type="text"
            name="description"
            value={description}
            onChange={handleDescription}
          ></textarea>
        </label>
        <label>
          image:
          <input
            onChange={handleImage}
            id="inputFile"
            type="file"
            name="file"
            accept="image/*"
          />
        </label>

        <p>ingredients:</p>
        <ItemsList
          list={ingredients.map((item) => ({
            ...item,
            removeSelf: () => handleRemoveIngredient(item),
          }))}
          type="cupboard-item"
        />
        <IngredientSearch {...{ addToIngredientsList }} acceptNewIngredient />

        <div>steps:</div>
        <ol>
          {steps &&
            steps.map((step) => (
              <li key={step.id}>
                <textarea
                  type="text"
                  id={step.id}
                  value={step.value}
                  placeholder={`step ${step.id}`}
                  onChange={handleStepInput}
                ></textarea>
                <Button onClick={deleteStep}>X</Button>
              </li>
            ))}
        </ol>
        <Button onClick={addStep}>add step</Button>
        <Button onClick={handleSubmit}>submit</Button>
      </div>
      {error && <div>{error}</div>}
    </Layout>
  );
};

export default PublishRecipe;
