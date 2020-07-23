import React, { useRef, useState, useCallback, useEffect } from "react";
import { searchIngredients, getCatagories } from "../services/ingredients.mjs";
import ItemsList from "./ItemsList";
import ListItem from "./ListItem";
import "./IngredientSearch.css";

const IngredientSearch = ({ addToIngredientsList }) => {
  const [query, setQuery] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [catagories, setCatagories] = useState([]);
  const [results, setResults] = useState([]);
  const inputRef = useRef();
  const handleQuery = useCallback(() => {
    const value = inputRef.current.value;
    setQuery(value);
    const matches =
      value === "" && breadcrumbs.length === 0
        ? []
        : searchIngredients(value, breadcrumbs);
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
  const handleAddBreadcrumb = (item) => {
    const newBreadCrumbs = [...breadcrumbs, item];
    setBreadcrumbs(newBreadCrumbs);
    const newCatagories = getCatagories(newBreadCrumbs);
    setCatagories(newCatagories);
    setQuery("");
    inputRef.current.focus();
  };
  const handleRemoveBreadcrumb = () => {
    const newBreadCrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);
    setBreadcrumbs(newBreadCrumbs);
    const newCatagories = getCatagories(newBreadCrumbs);
    setCatagories(newCatagories);
    if (breadcrumbs.length === 0 && query === "") {
      setResults([]);
    }
  };
  const clearSearch = () => {
    setBreadcrumbs([]);
    setCatagories(getCatagories());
    setResults([]);
    setQuery("");
  };
  useEffect(() => {
    handleQuery();
  }, [handleQuery]);
  useEffect(() => {
    setCatagories(getCatagories());
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
        />
        {(query || breadcrumbs.length > 0) && (
          <button onClick={clearSearch}>X</button>
        )}
      </div>
      <div className="ingredient-search__catagories">
        {catagories.map((result) => (
          <ListItem
            key={"results__catagory--" + result.title}
            {...{
              ...result,
              onClick: () => handleAddBreadcrumb(result),
            }}
            type="catagory"
          />
        ))}
      </div>
      <div className="ingredient-search__results">
        {results.map((result) => (
          <ListItem
            key={"results__ingredient--" + result.title}
            {...{
              ...result,
              onClick: () => addToIngredientsList(result),
            }}
            type="results__ingredient"
          />
        ))}
      </div>
    </div>
  );
};

export default IngredientSearch;
