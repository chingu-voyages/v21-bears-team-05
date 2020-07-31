import React, { useState } from "react";
import Layout from "../components/Layout";
import "./PublishRecipe.css";
import IngredientSearch from "../components/IngredientSearch";
import ItemsList from "../components/ItemsList";
import { addRecipe } from "../services/recipes";
import Button from "../components/Button";
import generateTempId from "../utils/generateTempId.mjs";
import getUserData from "../services/users.mjs";

const PublishRecipe = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState({ 1: "" });
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
  };

  const handleDescription = (e) => {
    e.preventDefault();
    setDescription(e.target.value);
  };

  const handleImage = (e) => {
    e.preventDefault();
    setFile(e.target.value);
  };

  const addStep = (e) => {
    e.preventDefault();
    const newId = generateTempId();
    const updatedSteps = {
      ...steps,
      [newId]: "",
    };
    setSteps(updatedSteps);
  };

  const handleStepInput = (id, value) => {
    let updatedSteps = { ...steps, [id]: value };
    setSteps(updatedSteps);
  };

  const handleSubmit = async () => {
    setError("");
    if (ingredients.length === 0 || !name || !description) {
      setError("You have forgotten to fill out a required field.");
      return;
    }

    let UserData = await getUserData();

    let recipe = {
      name,
      description,
      file,
      ingredients,
      instructions: Object.values(steps),
      uploaded_by: UserData?.id,
      created_by: UserData?.name,
    };

    addRecipe(recipe);
  };

  const handleRemoveStep = (id) => {
    const updatedSteps = () => {
      let newSteps = { ...steps };
      delete newSteps[id];
      return newSteps;
    };

    setSteps(updatedSteps);
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
            Object.keys(steps).map((stepID, i) => (
              <li key={stepID}>
                <textarea
                  type="text"
                  id={stepID}
                  value={steps.stepID}
                  placeholder="step"
                  onChange={(e) => handleStepInput(stepID, e.target.value)}
                ></textarea>
                <Button onClick={() => handleRemoveStep(stepID)}>X</Button>
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
