import React, { useRef } from "react";
import Spinner from "./Spinner";
import "./Status.css";

const Status = ({
  error,
  inProgress,
  done,
  message,
  maxLogSize,
  clear,
  text,
}) => {
  const output = useRef([]);
  maxLogSize = maxLogSize || 3;
  const addToOutput = (newStatus) => {
    newStatus.key = newStatus.text + newStatus.className;
    if (output.current[0]?.key === newStatus.key) {
      if (output.current[0].count) {
        output.current[0].count++;
      } else {
        output.current[0].count = 2;
      }
    } else {
      const repeatCount = output.current.filter((status) => status.text === newStatus.text && status.className === newStatus.className).length;
      if (repeatCount > 0) {
        newStatus.key = newStatus.key + repeatCount;
      }
      output.current.unshift(newStatus);
    }
  };
  if (clear) {
    output.current = [];
  } else {
    if (error) {
      addToOutput({ text: error, className: "status__error" });
    }
    if (inProgress) {
      addToOutput({
        text: inProgress,
        className: "status__in-progress",
        spinner: true,
      });
    }
    if (done) {
      output.current = output.current.map((status) =>
        status.className === "status__in-progress" && status.text === done
          ? { ...status, spinner: false }
          : status
      );
      addToOutput({ text, className: "status__done" });
    }
    if (message) {
      addToOutput({ text: message, className: "status__message" });
    }
  }
  if (output.current.length > maxLogSize) {
    output.current = output.current.slice(0, maxLogSize);
  }
  return (
    <div className="status">
      {output.current.map(({ key, className, text, spinner, count }) => (
        <div key={key} className={`status__item ${className}`}>
          {text} {count && `(${count})`}
          {spinner && <Spinner className="status__spinner" />}
        </div>
      ))}
    </div>
  );
};

export default Status;
