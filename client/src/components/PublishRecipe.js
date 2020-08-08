import React, { useState } from "react";
import IngredientSearch from "../components/IngredientSearch";
import ListItem from "../components/ListItem";
import { addRecipe } from "../services/recipes";
import Button from "../components/Button";
import generateId from "../utils/generateId.mjs";
import { getUserData } from "../services/users.mjs";
import IngredientValueTool from "../components/IngredientValueTool";
import PhotoUpload from "../components/PhotoUpload";
import { status } from "../services/subscribers";
import "./PublishRecipe.css";

const PublishRecipe = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState();
  const [ingredients, setIngredients] = useState({});
  const [steps, setSteps] = useState({ 1: "" });
  const [error, setError] = useState("");

  const handleRemoveIngredient = (obj) => {
    const updatedList = { ...ingredients };
    delete updatedList[obj.uuid];
    setIngredients(updatedList);
  };

  const addToIngredientsList = (item) => {
    if (!ingredients.hasOwnProperty(item.uuid)) {
      const updatedList = {
        ...ingredients,
        [item.uuid]: { ...item, amount: { quantity: 1, value: "-" } },
      };
      setIngredients(updatedList);
    }
  };

  const addStep = (e) => {
    e.preventDefault();
    const newId = generateId();
    const updatedSteps = {
      ...steps,
      [newId]: "",
    };
    setSteps(updatedSteps);
  };

  const handleStepInput = (uuid, value) => {
    let updatedSteps = { ...steps, [uuid]: value };
    setSteps(updatedSteps);
  };

  const reset = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setPhotoUrl("");
    setIngredients({});
    setSteps({});
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    if (ingredients.length === 0 || !title || !description) {
      setError("You have forgotten to fill out a required field.");
      return;
    }
    const UserData = await getUserData();
    const gallery = photoUrl
      ? [
          {
            url: photoUrl,
            uploadedBy: UserData?.uuid,
          },
        ]
      : [];
    const recipe = {
      title,
      description,
      gallery,
      ingredients: Object.values(ingredients).map((item) => ({
        ingredientRef: item.uuid,
        amount: item.amount,
      })),
      instructions: Object.values(steps),
      uploadedBy: UserData?.uuid,
      createdBy: null,
      rating: { votes: 0, stars: 0 },
      tags: [],
    };
    status.inProgress("Adding new recipe...");
    try {
      await addRecipe(recipe);
      status.done(`New recipe ${title} added!`, "Adding new recipe...");
      reset();
    } catch (e) {
      status.error(
        `Unable to add recipe ${title}, sorry!`,
        "Adding new recipe..."
      );
      console.error(e);
    }
  };

  const handleRemoveStep = (uuid) => {
    const updatedSteps = () => {
      let newSteps = { ...steps };
      delete newSteps[uuid];
      return newSteps;
    };

    setSteps(updatedSteps);
  };

  const updateIngredientAmountData = (uuid, value, property) => {
    const updatedIngredients = { ...ingredients };
    updatedIngredients[uuid].amount[property] = value;
    setIngredients(updatedIngredients);
  };

  return (
    <div>
      <Button className="publish-recipe__button" onClick={() => setOpen(!open)}>
        Add new recipe
      </Button>
      {open && (
        <>
          <div className="publish-recipe">
            <h1 className="publish-recipe__title">Add Recipe</h1>
            <button
              className="publish-recipe__back-button"
              onClick={() => setOpen(!open)}
            >
              ←
            </button>

            <div className="publish-recipe__form">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
              ></input>

              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="description"
              ></textarea>

              <label>
                image:
                <PhotoUpload
                  key={photoUrl}
                  className="publish-recipe__photo"
                  src={photoUrl}
                  alt="Recipe photo"
                  setUploadUrl={setPhotoUrl}
                />
              </label>

              <p>ingredients:</p>
              {Object.values(ingredients).map((item) => (
                <ListItem
                  key={"publish-recipe__ingredient--" + item.uuid}
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
                        updateIngredientAmountData(item.uuid, n, "quantity"),
                      updateValue: (str) =>
                        updateIngredientAmountData(item.uuid, str, "value"),
                    }}
                  />
                </ListItem>
              ))}
              <IngredientSearch
                {...{ addToIngredientsList }}
                acceptNewIngredient
              />

              <div>instructions:</div>
              <ol className="publish-recipe__instructions">
                {steps &&
                  Object.keys(steps).map((stepID, i) => (
                    <li className="publish-recipe__step" key={stepID}>
                      <textarea
                        type="text"
                        uuid={stepID}
                        value={steps.stepID}
                        placeholder="step"
                        onChange={(e) =>
                          handleStepInput(stepID, e.target.value)
                        }
                      ></textarea>
                      <Button
                        className="publish-recipe__remove-step"
                        onClick={() => handleRemoveStep(stepID)}
                      >
                        X
                      </Button>
                    </li>
                  ))}
              </ol>
              <Button
                className="publish-recipe__addStep-button"
                onClick={addStep}
              >
                add step
              </Button>
              {error && <div className="publish-recipe__error">{error}</div>}
              <Button
                className="publish-recipe__save-recipe"
                onClick={handleSubmit}
              >
                add recipe
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PublishRecipe;
