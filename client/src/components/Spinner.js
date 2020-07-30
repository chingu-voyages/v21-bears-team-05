import React from "react";
import "./Spinner.css";

export default function Spinner(props) {
  return (
    <svg
      {...props}
      className={`${props.className ? props.className : ""} spinner`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="42"></circle>
    </svg>
  );
}
