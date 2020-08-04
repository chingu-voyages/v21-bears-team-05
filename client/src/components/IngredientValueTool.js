import React from "react";
import "./IngredientValueTool.css";

const IngredientValueTool = ({ values, updateQuantity, updateValue }) => {
  const valueMeasures = [
    "-",
    "gram",
    "kilogram",
    "milliliter",
    "liter",
    "cup",
    "teaspoon",
    "tablespoon",
    "pint",
    "quart",
    "gallon",
    "ounce",
    "fluid ounce",
    "pinch",
    "drop",
  ];
  return (
    <>
      <label>
        <input
          type="number"
          value={values.quantity}
          onChange={(e) => updateQuantity(e.target.value)}
        />
      </label>
      <select
        name="measurementType"
        id="measurementType"
        value={values.value}
        onChange={(e) => updateValue(e.target.value)}
      >
        {valueMeasures &&
          valueMeasures.map((measure) => (
            <option
              key={`value--measure--${JSON.stringify(measure)}`}
              value={measure}
            >
              {measure}
            </option>
          ))}
      </select>
    </>
  );
};

export default IngredientValueTool;
