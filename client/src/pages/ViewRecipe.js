import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const ViewRecipe = (props) => {
  const { recipe } = props.location.state;
  return (
    <Layout>
      <Link to="/recipes">Go back</Link>
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
