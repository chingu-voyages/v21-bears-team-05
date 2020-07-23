import matchQuery from "../utils/matchQuery";

const defaultOptions = {
  output: {
    matches: {
      type: "any",
      flags: "iy",
    },
    objects: {
      type: "object",
      flags: "iy",
    },
    arrays: {
      type: "array",
      flags: "iy",
    },
    strings: {
      type: "string",
      flags: "i",
    },
  },
  recursive: true,
};

const search = (query, dataSet, options = defaultOptions) => {
  const output = {};
  const filterResult = (key, value, path) => {
    const valueType = Array.isArray(value) ? "array" : typeof value;
    Object.keys(options.output).forEach((container) => {
      const withinIsEqualToKey = () =>
        !options.output[container].within ||
        options.output[container].within === key ||
        (key === value &&
          path[path.length - 1] === options.output[container].within);
      const valueTypeMatchesContainerType = () =>
        options.output[container].type === "any" ||
        options.output[container].type === valueType;
      if (withinIsEqualToKey() && valueTypeMatchesContainerType()) {
        let match;
        if (options.output[container].compareFunc) {
          match = options.output[container].compareFunc(query, { key, value });
        } else if (options.output[container].flags) {
          match = matchQuery({
            query,
            value,
            flags: options.output[container].flags,
          });
        }
        if (match) {
          if (!Array.isArray(output[container])) {
            output[container] = [];
          }
          const result = { key, value, path };
          output[container].push(result);
        }
      }
    });
    if (options.recursive !== false) {
      const newPath = [...path, key];
      if (valueType === "array") {
        value.forEach((key) => filterResult(key, key, newPath));
      } else if (valueType === "object") {
        Object.keys(value).forEach((key) =>
          filterResult(key, value[key], newPath)
        );
      }
    }
  };
  const dataSetType = Array.isArray(dataSet) ? "array" : typeof dataSet;
  if (dataSetType === "array") {
    dataSet.forEach((item) => filterResult(item, item, []));
  } else if (dataSetType === "object") {
    Object.keys(dataSet).forEach((key) => filterResult(key, dataSet[key], []));
  } else {
  }
  return output;
};

export default search;
