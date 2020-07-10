import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import Recipe from "../components/Recipe";
import HomeFilter from "../components/HomeFilter";
import "./Main.css";

const Main = () => {
  const fetchedRecipes = useRef([]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);
  const [pretendRecipeData, setPretendRecipeData] = useState({});
  const [filter, setFilter] = useState("show-all");
  const getRecipe = async () => {
    const recipe = await axios.get("/api/pretendRecipe");
    return recipe.data;
  };
  const handlePrev = async () => {
    if (activeRecipeIndex > 0) {
      setActiveRecipeIndex(activeRecipeIndex - 1);
      setPretendRecipeData(fetchedRecipes.current[activeRecipeIndex - 1]);
    }
    return;
  };
  const handleNext = async () => {
    if (fetchedRecipes.current.length - 1 <= activeRecipeIndex) {
      const recipe = await getRecipe();
      fetchedRecipes.current.push(recipe);
    }
    setActiveRecipeIndex(activeRecipeIndex + 1);
    setPretendRecipeData(fetchedRecipes.current[activeRecipeIndex + 1]);
    return;
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  useEffect(() => {
    getRecipe().then((recipe) => {
      fetchedRecipes.current.push(recipe);
      setPretendRecipeData(fetchedRecipes.current[activeRecipeIndex]);
    });
  }, []);
  return (
    <Layout>
      <section>
        <Recipe {...{ pretendRecipeData, handlePrev, handleNext }} />
      </section>
      <section>
        <button onClick={handlePrev}>Prev</button>
        <button onClick={handleNext}>Next</button>
        <HomeFilter onChange={handleFilterChange} filter={filter} />
      </section>
    </Layout>
  );
};

export default Main;
