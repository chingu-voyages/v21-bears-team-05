import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Recipe from '../components/Recipe';
import HomeFilter from '../components/HomeFilter';
import './Main.css';
import { STATES } from 'mongoose';
import AuthContext from '../hooks/AuthContext';
import { getRecipes } from '../services/recipes';
import {
  getUserData,
  getCupboard,
  putName,
  putBio,
  putAvatar,
  updateCupboard,
} from '../services/users';

const Main = () => {
  //  Give access to auth context
  const { state: authState } = React.useContext(AuthContext);
  const fetchedRecipes = useRef([]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);
  const [recipeData, setRecipeData] = useState({});
  const [filter, setFilter] = useState('show-all');
  const fetchRecipes = async () => {
    const ingredients = await getCupboard();
    const userData = await getUserData();
    const recipes = await getRecipes({ ingredients });
    const data = Array.isArray(fetchedRecipes.current.data)
      ? [...fetchedRecipes.current?.data, ...recipes.data]
      : recipes.data;
    fetchedRecipes.current = { data, next: recipes.next };
    setRecipeData(fetchedRecipes.current.data[activeRecipeIndex]);
  };
  const handlePrev = async () => {
    if (activeRecipeIndex > 0) {
      setActiveRecipeIndex(activeRecipeIndex - 1);
      setRecipeData(fetchedRecipes.current.data[activeRecipeIndex - 1]);
    }
    return;
  };
  const handleNext = async () => {
    if (
      fetchedRecipes.current.length - 1 <= activeRecipeIndex &&
      fetchedRecipes.current.next !== 'end'
    ) {
      fetchRecipes();
    }
    setActiveRecipeIndex(activeRecipeIndex + 1);
    setRecipeData(fetchedRecipes.current.data[activeRecipeIndex + 1]);
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
      <section>
        {authState.isAuthenticated ? (
          <span>{`Hello ${authState.user.email}`}</span>
        ) : (
          ''
        )}
      </section>
      <section>
        <Recipe {...{ recipeData, handlePrev, handleNext }} />
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
