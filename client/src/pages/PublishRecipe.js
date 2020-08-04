import React, { useState } from "react";
import Layout from "../components/Layout";
import "./PublishRecipe.css";
import IngredientSearch from "../components/IngredientSearch";
import ListItem from "../components/ListItem";
import { addRecipe } from "../services/recipes";
import Button from "../components/Button";
import generateTempId from "../utils/generateTempId.mjs";
import { getUserData } from "../services/users.mjs";
import IngredientValueTool from "../components/IngredientValueTool";

const PublishRecipe = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [ingredients, setIngredients] = useState({});
  const [steps, setSteps] = useState({ 1: "" });
  const [error, setError] = useState("");

  const handleRemoveIngredient = (obj) => {
    const updatedList = { ...ingredients };
    delete updatedList[obj.id];
    setIngredients(updatedList);
  };

  const addToIngredientsList = (item) => {
    if (!ingredients.hasOwnProperty(item.id)) {
      const updatedList = {
        ...ingredients,
        [item.id]: { ...item, amount: { quantity: 1, value: "-" } },
      };
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

  const updateIngredientAmountData = (id, value, property) => {
    const updatedIngredients = { ...ingredients };
    updatedIngredients[id].amount[property] = value;
    setIngredients(updatedIngredients);
  };

  return (
    <Layout>
      <div className="publish-recipe">
        <h1>Publish Recipe</h1>
        <div className="publish-recipe__form">
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
          {Object.values(ingredients).map((item) => (
            <ListItem
              key={"publish-recipe__ingredient--" + item.id}
              {...{
                ...item,
                removeSelf: () => handleRemoveIngredient(item),
              }}
              type="publish-recipe__ingredient"
            >
              <p>{item.name}</p>
              <IngredientValueTool
                {...{
                  values: item.amount,
                  updateQuantity: (n) =>
                    updateIngredientAmountData(item.id, n, "quantity"),
                  updateValue: (str) =>
                    updateIngredientAmountData(item.id, str, "value"),
                }}
              />
            </ListItem>
          ))}
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
      </div>
    </Layout>
  );
};

export default PublishRecipe;
