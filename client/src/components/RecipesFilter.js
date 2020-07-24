import React from "react";
import Button from "./Button";
import "./RecipesFilter.css";

const RecipesFilter = ({ onChange, filter }) => {
  return (
    <div className="recipes-filter">
      <div className="recipes-filter__ingredients">
        <h2>ingredients filter</h2>
        <div>
          <input
            type="radio"
            name="filter"
            id="show-some"
            value="show-some"
            onChange={onChange}
            checked={filter === "show-some" ? true : false}
          ></input>
          <label htmlFor="show-some">Show only for matching ingredients</label>
        </div>
        <div>
          <input
            type="radio"
            name="filter"
            id="show-all"
            value="show-all"
            onChange={onChange}
            checked={filter === "show-all" ? true : false}
          ></input>
          <label htmlFor="show-all">Show all</label>
        </div>
      </div>
      <div className="recipes-filter__meal-type">
        <h2>filter by meal type</h2>
        <select>
          <option>Any</option>
        </select>
      </div>
      <div className="recipes-filter__submit">
        <Button>Filter Recipes</Button>
      </div>
    </div>
  );
};

export default RecipesFilter;
