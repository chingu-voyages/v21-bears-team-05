import React from "react";
import { useSwipeable } from "react-swipeable";
import "./Recipe.css";

const Recipe = ({
  recipeData,
  handlePrev,
  handleNext,
}) => {
  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    delta: 50,
  });
  return ( recipeData ?
    <div style={{ background: recipeData.colour }} {...handlers}>
      <h1>{recipeData.name}</h1>
      <p>{recipeData.description}</p>
      <ul>
        {recipeData?.ingredients?.map(ingredient => <li key={ingredient.title}>{ingredient.title}</li>)}
      </ul>
    </div> :
    <div>No more recipes to show, please try adding more ingredients to your cupboard.</div>
  );
};

export default Recipe;
