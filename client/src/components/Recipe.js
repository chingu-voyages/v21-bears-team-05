import React from "react";
import { useSwipeable } from "react-swipeable";
import "./Recipe.css";

const Recipe = ({
  pretendRecipeData = { colour: "black", title: "", ingredients: "" },
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
  return (
    <div style={{ background: pretendRecipeData.colour }} {...handlers}>
      <h1>{pretendRecipeData.title}</h1>
      <p>With {pretendRecipeData.ingredients}</p>
    </div>
  );
};

export default Recipe;
