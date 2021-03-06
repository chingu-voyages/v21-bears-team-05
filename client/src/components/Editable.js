import React, { useState, useRef, useEffect } from "react";
import "./Editable.css";

/* Component that on being clicked switches from being a displayed value to an input i.e. <h1>hi</h1> --onClick--> <input type="text" /> */

const Editable = (props) => {
  const [editing, setEditing] = useState(!props.children || props.editMode || false);
  const [value, setValue] = useState(props.children);
  const [error, setError] = useState(false);
  const ref = useRef();
  const handleInvalid = (msg) => {
    setError(msg);
  };
  const handleSubmit = () => {
    const invalid = !props.validateFunc || props.validateFunc(value);
    if (!props.validateFunc || !invalid) {
      props.handleSubmit(value);
      value && setEditing(false);
    } else {
      handleInvalid(invalid);
    }
  };
  useEffect(() => {
    if (editing) {
      ref.current.select();
    }
  }, [editing]);
  let attributes = { ...props };
  delete attributes.tag;
  delete attributes.validateFunc;
  delete attributes.children;
  delete attributes.handleSubmit;
  delete attributes.textarea;
  delete attributes.handleClick;
  delete attributes.editMode;
  const className = props.className || "";
  let main = props.children || "...";
  if (editing) {
    const inputAttributes = {
      onChange: (e) => {
        setError(false);
        setValue(e.target.value);
      },
      value,
      onBlur: handleSubmit,
      onKeyPress: (e) => e.key === "Enter" && ref.current.blur(),
      ref,
    };
    let inputEditor = (
      <input
        className="editable__input"
        {...{ ...attributes, ...inputAttributes, type: "text" }}
      />
    );
    if (props.textarea) {
      inputEditor = (
        <textarea
          className="editable__textarea"
          {...{ ...attributes, ...inputAttributes }}
        />
      );
    }
    main = (
      <span
        className={`editable__main ${editing ? "editable__main--editing" : ""}`}
      >
        {inputEditor}
        <span className="editable__error">{error}</span>
      </span>
    );
  }
  return React.createElement(
    props.tag,
    {
      ...attributes,
      className: "editable " + className,
      onClick: props.handleClick || (() => setEditing(true)),
    },
    main
  );
};

export default Editable;
