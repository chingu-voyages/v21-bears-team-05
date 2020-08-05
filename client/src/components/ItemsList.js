import React from "react";
import ListItem from "./ListItem";
import "./ItemsList.css";

const ItemsList = ({ list, type }) => {
  return (
    <>
      {list.map((item) => (
        <ListItem
          key={`${type}__item--${JSON.stringify(item)}`}
          {...{ ...item, type }}
        >
          <p>{item.name}</p>
        </ListItem>
      ))}
    </>
  );
};

export default ItemsList;
