import React, { useState } from "react";
import Layout from "../components/Layout";
import "./PublishRecipe.css";

const PublishRecipe = () => {
  const [recipe, setRecipe] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit clicked");
  };

  return (
    <Layout>
      <h1>Publish Recipe</h1>
      <form onSubmit={handleSubmit}>
        <label>
          instructions:
          <textarea
            type="text"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
          ></textarea>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </Layout>
  );
};

export default PublishRecipe;
