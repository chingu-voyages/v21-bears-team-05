import search from "../utils/search.mjs";
import traversePath from "../utils/traversePath.mjs";

const data = (function dummyData() {
  /* TODO replace with call to backend */
  return {
    vegetables: [
      "tomatos",
      "cucumber",
      "spinach",
      "lettuce",
      "bell pepper",
      "radish",
      "sprouts",
      "cabbage",
      "fennel",
      "onion",
      "garlic",
      "olive",
      "carrot",
      "potato",
    ],
    meat: ["beef", "chicken", "ham", "pork", "ground beef", "sausages"],
    fish: ["tuna", "salmon", "talapia", "perch", "swordfish", "cod"],
    fruit: [
      "banana",
      "cherry",
      "raspberry",
      "apple",
      "apricot",
      "kiwi",
      "orange",
      "blueberry",
      "blackberry",
      "grapefruit",
      "honeydew melon",
      "cantoulope",
      "grapes",
      "plum",
    ],
    spices: [
      "pepper",
      "salt",
      "oregano",
      "thyme",
      "basil",
      "nutmeg",
      "allspice",
      "cinnamon",
      "ginger",
      "bay leaf",
      "marjoram",
      "tumeric",
      "sage",
      "curry",
      "vanilla",
      "cumin",
      "carraway",
      "chili flakes",
    ],
  };
})();

const searchIngredients = (query, breadcrumbs = []) => {
  const dataSet = traversePath(data, breadcrumbs);
  const searchOptions = {
    output: {
      ingredientsThatStartWithQuery: {
        type: "string",
        flags: "iy",
      },
      ingredientsThatContainQuery: {
        type: "string",
        flags: "i",
      },
      catagories: {
        type: "array",
        flags: "iy",
      },
    },
    recursive: true,
  };
  const matches = search(query, dataSet, searchOptions);
  const formatResult = ({ key, value, path, type }) => ({
    title: !Number.isInteger(key) ? key : value,
    path: [...breadcrumbs, ...path],
    isCatagory: type === "catagory",
  });
  const matchSet = new Set(
    Object.keys(matches)
      .map((container) => {
        const type = container === "catagories" ? "catagory" : "ingredient";
        return [
          ...matches[container].map((result) =>
            JSON.stringify(formatResult({ ...result, type }))
          ),
        ];
      })
      .flat()
  );
  return [...matchSet].map((json) => JSON.parse(json));
};
const getCatagories = (path = []) => {
  const dataSet = traversePath(data, path);
  return Object.keys(dataSet).map((item) => ({
    title: item,
    isCatagory: true,
  }));
};

export { searchIngredients, getCatagories };
