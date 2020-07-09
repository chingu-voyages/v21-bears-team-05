import React from "react";

const HomeFilter = ({ onChange, filter }) => {
  return (
    <div>
      <h4>Filter</h4>
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
    </div>
  );
};

export default HomeFilter;
