import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  searchIngredients,
  getIngredientCategories,
} from "../services/ingredients.mjs";
import ItemsList from "./ItemsList";
import ListItem from "./ListItem";
import AddIngredientCategoryTool from "./AddIngredientCategoryTool";
import AddIngredientTool from "./AddIngredientTool";
import "./IngredientSearch.css";

const IngredientSearch = ({
  addToIngredientsList,
  acceptNewIngredient,
  onEmptyShowAll,
}) => {
  const [query, setQuery] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [ingredientCategories, setIngredientCategories] = useState([]);
  const [results, setResults] = useState([]);
  const inputRef = useRef();
  const handleQuery = useCallback(async () => {
    const value = inputRef.current.value;
    setQuery(value);
    const lastBreadcrumbIsNew = breadcrumbs[breadcrumbs.length - 1]?.new;
    const matches =
      (value === "" && breadcrumbs.length === 0 && !onEmptyShowAll) ||
      lastBreadcrumbIsNew
        ? []
        : await searchIngredients(value, breadcrumbs);
    setResults(matches);
  }, [breadcrumbs]);
  const handleKeyPress = (e) => {
    if (e.key === "Backspace" && query === "" && breadcrumbs.length > 0) {
      handleRemoveBreadcrumb();
    }
    if (e.key === "Enter") {
      inputRef.current.blur();
    }
  };
  const handleAddBreadcrumb = async (item) => {
    const newBreadCrumbs = [...breadcrumbs, item];
    setBreadcrumbs(newBreadCrumbs);
    const newIngredientCategories = await getIngredientCategories(
      newBreadCrumbs
    );
    setIngredientCategories(newIngredientCategories);
    !acceptNewIngredient && setQuery("");
    inputRef.current.focus();
  };
  const handleRemoveBreadcrumb = async () => {
    const newBreadCrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);
    setBreadcrumbs(newBreadCrumbs);
    const newIngredientCategories = await getIngredientCategories(
      newBreadCrumbs
    );
    setIngredientCategories(newIngredientCategories);
    if (breadcrumbs.length === 0 && query === "" && !onEmptyShowAll) {
      setResults([]);
    }
  };
  const clearSearch = async () => {
    setBreadcrumbs([]);
    const ingredientCategories = await getIngredientCategories();
    setIngredientCategories(ingredientCategories);
    setQuery("");
  };
  useEffect(() => {
    handleQuery();
  }, [handleQuery]);
  useEffect(() => {
    getIngredientCategories().then((ingredientCategories) =>
      setIngredientCategories(ingredientCategories)
    );
  }, []);
  return (
    <div className="ingredient-search">
      <div className="ingredient-search__query">
        <ItemsList
          list={breadcrumbs.map((item) => ({ ...item }))}
          type="breadcrumb"
        />
        <input
          className="ingredient-search__input"
          onChange={handleQuery}
          value={query}
          ref={inputRef}
          onKeyDown={handleKeyPress}
          placeholder={`Search ${
            acceptNewIngredient ? "or add" : ""
          } ingredients`}
        />
        {(query || breadcrumbs.length > 0) && (
          <button onClick={clearSearch} className="ingredient-search__clear">
            X
          </button>
        )}
      </div>
      <div className="ingredient-search__ingredient-categories">
        {ingredientCategories.map((result) => (
          <ListItem
            key={"results__ingredient-category--" + JSON.stringify(result)}
            {...{
              ...result,
              onClick: () => handleAddBreadcrumb(result),
            }}
            type="ingredient-category"
          >
            <p>{result.name}</p>
          </ListItem>
        ))}
        {acceptNewIngredient && (
          <AddIngredientCategoryTool {...{ handleAddBreadcrumb }} />
        )}
      </div>
      <div className="ingredient-search__results">
        {results.map((result) => (
          <ListItem
            key={"results__ingredient--" + JSON.stringify(result)}
            {...{
              ...result,
              onClick: () => addToIngredientsList(result),
            }}
            type="results__ingredient"
          >
            <p>{result.name}</p>
          </ListItem>
        ))}
        {acceptNewIngredient && (
          <AddIngredientTool
            {...{ name: query, breadcrumbs, addToIngredientsList }}
          />
        )}
      </div>
    </div>
  );
};

export default IngredientSearch;
