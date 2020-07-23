import search from "../utils/search.mjs";
import traversePath from "../utils/traversePath.mjs";

const data = (function dummyData() {
  /* TODO replace with call to backend */
  return {
    catagories: [
      {
        id: "catagory1",
        name: "vegetables",
      },
      {
        id: "catagory2",
        name: "meat",
      },
      {
        id: "catagory3",
        name: "fish",
      },
      {
        id: "catagory4",
        name: "fruit",
      },
      {
        id: "catagory5",
        name: "spices",
      },
      {
        id: "catagory6",
        name: "chilies",
        parent: "catagory5",
      },
    ],
    ingredients: [
      {
        id: "ingredient1",
        name: "tomatos",
        catagories: ["catagory1", "catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient2",
        name: "cucumber",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient3",
        name: "spinach",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient4",
        name: "lettuce",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient5",
        name: "bell pepper",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient6",
        name: "radish",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient7",
        name: "sprouts",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient8",
        name: "cabbage",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient9",
        name: "fennel",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient10",
        name: "onion",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient11",
        name: "garlic",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient12",
        name: "olive",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient13",
        name: "carrot",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient14",
        name: "potato",
        catagories: ["catagory1"],
        relativeValues: [],
      },
      {
        id: "ingredient15",
        name: "beef",
        catagories: ["catagory2"],
        relativeValues: [],
      },
      {
        id: "ingredient16",
        name: "chicken",
        catagories: ["catagory2"],
        relativeValues: [],
      },
      {
        id: "ingredient17",
        name: "ham",
        catagories: ["catagory2"],
        relativeValues: [],
      },
      {
        id: "ingredient18",
        name: "pork",
        catagories: ["catagory2"],
        relativeValues: [],
      },
      {
        id: "ingredient19",
        name: "ground beef",
        catagories: ["catagory2"],
        relativeValues: [],
      },
      {
        id: "ingredient20",
        name: "sausages",
        catagories: ["catagory2"],
        relativeValues: [],
      },
      {
        id: "ingredient21",
        name: "tuna",
        catagories: ["catagory3"],
        relativeValues: [],
      },
      {
        id: "ingredient22",
        name: "salmon",
        catagories: ["catagory3"],
        relativeValues: [],
      },
      {
        id: "ingredient23",
        name: "talapia",
        catagories: ["catagory3"],
        relativeValues: [],
      },
      {
        id: "ingredient24",
        name: "perch",
        catagories: ["catagory3"],
        relativeValues: [],
      },
      {
        id: "ingredient25",
        name: "swordfish",
        catagories: ["catagory3"],
        relativeValues: [],
      },
      {
        id: "ingredient26",
        name: "cod",
        catagories: ["catagory3"],
        relativeValues: [],
      },
      {
        id: "ingredient27",
        name: "banana",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient28",
        name: "cherry",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient29",
        name: "raspberry",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient30",
        name: "apple",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient31",
        name: "apricot",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient32",
        name: "kiwi",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient33",
        name: "orange",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient34",
        name: "blueberry",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient35",
        name: "blackberry",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient36",
        name: "grapefruit",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient37",
        name: "honeydew melon",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient38",
        name: "cantoulope",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient39",
        name: "grapes",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient40",
        name: "plum",
        catagories: ["catagory4"],
        relativeValues: [],
      },
      {
        id: "ingredient42",
        name: "pepper",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient43",
        name: "salt",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient44",
        name: "oregano",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient45",
        name: "thyme",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient46",
        name: "basil",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient47",
        name: "nutmeg",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient48",
        name: "allspice",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient49",
        name: "cinnamon",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient50",
        name: "ginger",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient51",
        name: "bay leaf",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient52",
        name: "marjoram",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient53",
        name: "tumeric",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient54",
        name: "sage",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient55",
        name: "curry",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient56",
        name: "vanilla",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient57",
        name: "cumin",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient58",
        name: "carraway",
        catagories: ["catagory5"],
        relativeValues: [],
      },
      {
        id: "ingredient59",
        name: "chili flakes",
        catagories: ["catagory5", "catagory6"],
        relativeValues: [],
      },
      {
        id: "ingredient60",
        name: "red chili",
        catagories: ["catagory4", "catagory5", "catagory6"],
        relativeValues: [],
      },
    ],
  };
})();

const searchIngredients = (query, breadcrumbs = []) => {
  const lastestBreadCrumb =
    breadcrumbs && breadcrumbs[breadcrumbs.length - 1]?.id;
  const dataSet = lastestBreadCrumb
    ? data.ingredients.filter(({ catagories }) =>
        catagories.includes(lastestBreadCrumb)
      )
    : data.ingredients;
  const searchOptions = {
    output: {
      ingredientsThatStartWithQuery: {
        type: "string",
        flags: "iy",
        within: "name",
      },
      ingredientsThatContainQuery: {
        type: "string",
        flags: "i",
        within: "name",
      },
    },
    recursive: true,
  };
  const matches = search(query, dataSet, searchOptions);
  const matchSet = new Set(
    Object.keys(matches)
      .map((container) => {
        return [
          ...matches[container].map(({ value, path }) =>
            JSON.stringify({
              title: value,
              path,
            })
          ),
        ];
      })
      .flat()
  );
  return [...matchSet].map((json) => JSON.parse(json));
};

const getCatagories = (breadcrumbs) => {
  const lastestBreadCrumb = breadcrumbs && breadcrumbs[breadcrumbs.length - 1];
  const dataSet = lastestBreadCrumb
    ? data.catagories.filter(({ parent }) => parent === lastestBreadCrumb.id)
    : data.catagories.filter(({ parent }) => !parent);
  return Object.values(dataSet).map(({ name, id }) => ({ title: name, id }));
};

export { searchIngredients, getCatagories };
