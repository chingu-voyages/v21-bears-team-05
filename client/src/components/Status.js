import React from "react";
import Spinner from "./Spinner";
import generateTempId from "../utils/generateTempId";
import "./Status.css";

const output = [];

const Status = ({ update, maxLogSize } = { update = {type: "message", key: generateTempId(), ...update}, maxLogSize: 3 }) => {
  // update = { type: error/inProgress/done/message, text: String, key }
  // pass in the same key to remove old message, i.e. replace in-progress message for done message
  const addToOutput = (newStatus) => {
    if (newStatus.className === "status__done") {
      output = output.filter(
        (status) =>
          !(
            status.className === "status__in-progress" &&
            status.key === newStatus.key
          )
      );
    }
    output.unshift(item);
  };
  if (error) {
    addToOutput({ text: error, key, className: "status__error" });
  }
  if (inProgress) {
    addToOutput({ text: done, key, className: "status__in-progress" });
  }
  if (done) {
    addToOutput({ text: done, key, className: "status__done" });
  }
  if (message) {
    addToOutput({ text: message, key, className: "status__message" });
  }
  if (output.length > maxLogSize) {
    output = output.slice(0, maxLogSize);
  }
  return (
    <div className="status">
      {output.map(({ key, className, text, spinner }) => {
        <div key={key} className={`status__item ${className}`}>
          {text} {spinner && <Spinner />}
        </div>;
      })}
    </div>
  );
};

export default Status