import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import Recipe from "../components/Recipe";
import HomeToolbar from "../components/HomeToolbar";
import AuthContext from "../hooks/AuthContext";
import { getRecipes } from "../services/recipes";
import { getCupboard } from "../services/users";
import RecipeList from "../components/RecipeList";
import "./Main.css";

const Main = () => {
  const fetchedRecipes = useRef([]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);
  const [recipeData, setRecipeData] = useState({});
  const [filter, setFilter] = useState("show-all");
  const [listView, setListView] = useState(false);
  const fetchRecipes = async () => {
    let recipes;
    if (filter === "show-all") {
      recipes = await getRecipes();
    } else {
      const ingredients = await getCupboard();
      recipes = await getRecipes({ ingredients });
    }
    fetchedRecipes.current = Object.values(recipes.data);
    setRecipeData(fetchedRecipes.current[activeRecipeIndex]);
  };
  const handleSettingRecipe = (index) => {
    if (index >= 0 && fetchedRecipes.current.length - 1 > index) {
      setActiveRecipeIndex(index);
      setRecipeData(fetchedRecipes.current[index]);
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
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  useEffect(() => {
    fetchRecipes();
  }, []);
  return (
    <Layout>
      <main className="home">
        <section>
          {listView ? (
            <RecipeList
              {...{ list: fetchedRecipes.current, handleSettingRecipe }}
            />
          ) : (
            <Recipe {...{ recipeData, handlePrev, handleNext }} />
          )}
        </section>
        <section>
          <HomeToolbar
            {...{ onChange: handleFilterChange, filter, listView, setListView }}
          />
        </section>
      </main>
    </Layout>
  );
};

export default Main;
