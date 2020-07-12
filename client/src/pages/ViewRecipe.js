import React from "react";
import Layout from "../components/Layout";

const ViewRecipe = (props) => {
  const { recipe } = props.location.state;
  console.log(recipe);
  return (
    <Layout>
      <h1>{recipe.name}</h1>
      <p>Ingredients:</p>
      {recipe.ingredients.map((ingredient) => (
        <li key={ingredient}>{ingredient}</li>
      ))}
      <p>Process:</p>
      <p>{recipe.description}</p>
    </Layout>
  );
};

export default ViewRecipe;
