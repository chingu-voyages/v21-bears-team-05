import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import IngredientsSearch from "../components/IngredientSearch";
import ItemsList from "../components/ItemsList";
import Button from "../components/Button";
import { useHistory } from "react-router-dom";
import "./Cupboard.css";
import { getCupboard, updateCupboard } from "../services/users";
import { getNOfRecipes } from "../services/recipes";

const Cupboard = () => {
  let history = useHistory();
  const [ingredientsList, setIngredientsList] = useState([]);
  const [nPossibleRecipes, setNPossibleRecipes] = useState(0);
  const handleRemoveIngredient = (obj) => {
    const updatedList = ingredientsList.filter(
      (ingredient) => JSON.stringify(ingredient) !== JSON.stringify(obj)
    );
    setIngredientsList(updatedList);
    getNOfRecipes({ ingredients: updatedList }).then((n) =>
      setNPossibleRecipes(n)
    );
    updateCupboard({ ingredients: updatedList });
  };
  const addToIngredientsList = (item) => {
    if (
      !ingredientsList.find(
        (ingredient) => JSON.stringify(ingredient) === JSON.stringify(item)
      )
    ) {
      const updatedList = [...ingredientsList, item];
      setIngredientsList(updatedList);
      getNOfRecipes({ ingredients: updatedList }).then((n) =>
        setNPossibleRecipes(n)
      );
      updateCupboard({ ingredients: updatedList });
    }
  };
  const handleSubmit = async () => {
    history.push("/main");
  };
  useEffect(() => {
    getCupboard().then((data) => {
      const updatedList = data;
      setIngredientsList(updatedList);
      getNOfRecipes({ ingredients: updatedList }).then((n) =>
        setNPossibleRecipes(n)
      );
    });
  }, []);
  return (
    <Layout>
      <div className="cupboard">
        <div className="cupboard__list">
          <ItemsList
            list={ingredientsList.map((item) => ({
              ...item,
              removeSelf: () => handleRemoveIngredient(item),
            }))}
            type="cupboard-item"
          />
        </div>
        <IngredientsSearch {...{ addToIngredientsList }} />
      </div>
      {nPossibleRecipes > 0 && (
        <Button onClick={handleSubmit} className="cupboard__feedme-button">
          <h3>
            {nPossibleRecipes} recipe{nPossibleRecipes > 1 && "s"} available
          </h3>
          <h2>Feed Me!</h2>
        </Button>
      )}
    </Layout>
  );
};

export default Cupboard;
