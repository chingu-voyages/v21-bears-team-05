import React, { useState, useRef, useEffect } from "react";
import './Editable.css';

/* Component that on being clicked switches from being a displayed value to an input i.e. <h1>hi</h1> --onClick--> <input type="text" /> */

const Editable = (props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(props.children);
  const ref = useRef();
  const handleSubmit = () => {
      props.handleSubmit(value);
      setEditing(false)
  };
  useEffect(() => {
    if (editing) {
      ref.current.focus();
    }
  }, [editing]);
  let attributes = {}
  const className = props.className || "";
  let main = props.children;
  if (editing) {
    const inputAttributes = {
      onChange: (e) => {
        setValue(e.target.value);
      },
      value,
      onBlur: handleSubmit,
      onKeyPress: (e) => e.key === "Enter" && ref.current.blur(),
      ref,
    };
    let inputEditor = (
      <input className="editable__input" {...{ ...attributes, ...inputAttributes, type: "text" }} />
    );
    if (props.textarea) {
      inputEditor = <textarea className="editable__textarea" {...{ ...attributes, ...inputAttributes }} />;
    }
    main = (
      <span className={className + "__main"}>
        {inputEditor}
      </span>
    );
  }
  return (
    React.createElement(props.tag, {
        ...attributes,
        className: "editable "+className,
        onClick: () => setEditing(true),
      }, main)
  );
};

export default Editable;