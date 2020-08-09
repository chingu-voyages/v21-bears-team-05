import React from "react";
import "./ListItem.css";

const ListItem = ({ children, removeSelf, onClick, type = "" }) => (
  <>
    {onClick ? (
      <button className={`item item--${type}`} onClick={onClick}>
        {children}
      </button>
    ) : (
      <div className={`item item--${type}`}>
        {children}
        {removeSelf && (
          <button className="item__remove" onClick={removeSelf}>
            X
          </button>
        )}
      </div>
    )}
  </>
);

export default ListItem;
