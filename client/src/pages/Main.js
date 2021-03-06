import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Recipe from "../components/Recipe";
import HomeToolbar from "../components/HomeToolbar";
import { getRecipes, searchRecipes } from "../services/recipes";
import { getCupboard } from "../services/users";
import RecipeList from "../components/RecipeList";
import "./Main.css";

const Main = () => {
  const [recipes, setRecipes] = useState([]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState();
  const [filter, setFilter] = useState("");
  const [listView, setListView] = useState(true);
  const [query, setQuery] = useState("");
  const fetchRecipes = async ({ filter, query } = {}) => {
    if (filter === "cupboard") {
      var ingredients = await getCupboard();
    }
    let recipes;
    if (query) {
      recipes = ingredients
        ? await searchRecipes({ query, ingredients })
        : await searchRecipes({ query });
    } else if (filter) {
      switch (filter) {
        case "cupboard":
          recipes = await getRecipes({ ingredients });
          break;
        default:
          recipes = await getRecipes();
      }
    } else {
      recipes = await getRecipes();
    }
    const recipeList = recipes.data && Object.values(recipes.data);
    recipeList && setRecipes(recipeList);
    setActiveRecipeIndex(recipeList.length > 0 ? 0 : null);
  };
  const handleSettingRecipe = (index) => {
    if (index >= 0 && recipes.length > index) {
      setActiveRecipeIndex(index);
      setListView(false);
    }
  };
  const handlePrev = () => {
    handleSettingRecipe(activeRecipeIndex - 1);
    return;
  };
  const handleNext = () => {
    handleSettingRecipe(activeRecipeIndex + 1);
    return;
  };
  const handleSetFilter = (event) => {
    setFilter(event.target.value);
    fetchRecipes({ filter: event.target.value });
  };
  const handleSetQuery = (event) => {
    setQuery(event.target.value);
    fetchRecipes({ query: event.target.value, filter });
  };
  useEffect(() => {
    fetchRecipes();
  }, []);
  return (
    <Layout>
      <HomeToolbar
        {...{
          filter,
          handleSetFilter,
          listView,
          setListView,
          query,
          handleSetQuery,
        }}
      />
      <main className="home">
        <section className="home__recipe-list__wrapper">
          {listView ? (
            <RecipeList {...{ list: recipes, handleSettingRecipe }} />
          ) : (
            <Recipe
              {...{
                recipeId: recipes[activeRecipeIndex]?.uuid,
                handlePrev,
                handleNext,
              }}
            />
          )}
        </section>
      </main>
    </Layout>
  );
};

export default Main;
