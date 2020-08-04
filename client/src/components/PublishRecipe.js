import React, { useState } from "react";
import IngredientSearch from "../components/IngredientSearch";
import ListItem from "../components/ListItem";
import { addRecipe } from "../services/recipes";
import Button from "../components/Button";
import generateTempId from "../utils/generateTempId.mjs";
import { getUserData } from "../services/users.mjs";
import IngredientValueTool from "../components/IngredientValueTool";
import PhotoUpload from "../components/PhotoUpload";
import { status } from "../services/subscribers";
import defaultAvatar from "../images/defaultAvatar.svg";
import "./PublishRecipe.css";

const PublishRecipe = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState(defaultAvatar);
  const [ingredients, setIngredients] = useState({});
  const [steps, setSteps] = useState({});
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
    const recipe = {
      title,
      description,
      gallery: [
        {
          url: photoUrl,
          uploadedBy: UserData?.id,
        },
      ],
      ingredients: Object.values(ingredients),
      instructions: Object.values(steps),
      uploadedBy: UserData?.id,
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
    <div className="publish-recipe">
      <Button onClick={() => setOpen(!open)}>Add new recipe</Button>
      {open && (
        <>
          <div className="publish-recipe__form">
            <label>
              title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
            </label>
            <label>
              description:
              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </label>
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
            <IngredientSearch
              {...{ addToIngredientsList }}
              acceptNewIngredient
            />

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
        </>
      )}
    </div>
  );
};

export default PublishRecipe;