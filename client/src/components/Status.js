import React, { useRef } from "react";
import Spinner from "./Spinner";
import "./Status.css";

const Status = ({statusData}) => {
  const output = useRef([]);
  const processStatusData = ({
    error,
    inProgress,
    done,
    message,
    maxLogSize,
    clear,
    text,
    removeSpinner
  }) => {
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
      if (done) {
        addToOutput({ text: done, className: "status__done" });
      }
      if (message) {
        addToOutput({ text: message, className: "status__message" });
      }
      if (inProgress) {
        addToOutput({
          text: inProgress,
          className: "status__in-progress",
          spinner: true,
        });
      }
      if (removeSpinner) {
        // check to remove spinner from any older inProgress status items
        output.current = output.current.map((status) =>
          status.className === "status__in-progress" && status.text === removeSpinner
            ? { ...status, spinner: false }
            : status
        );
      }
    }
    if (output.current.length > maxLogSize) {
      output.current = output.current.slice(0, maxLogSize);
    }
    return output
  };
  statusData && statusData.map(data => processStatusData(data));
  return (
    <div className="status">
      {output.current.map(({ key, className, text, spinner, count }) => (
        <div key={key} className={`status__item ${className}`}>
          {text} {count && `(${count})`}
          {spinner && <Spinner className="status__spinner" />}
        </div>
      ))}
    </div>
  )
}

export default Status;
