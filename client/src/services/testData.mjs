const data = (function dummyData() {
  /* TODO replace with call to backend */
  return {
    users: {
      "currentUserId": {
        "id":"currentUserId"
      }
    },
    ingredientCategories: {
      "ingredientCategory1": {
        id: ("ingredientCategory1"),
        name: "vegetables",
      },
      "ingredientCategory2": {
        id: ("ingredientCategory2"),
        name: "meat",
      },
      "ingredientCategory3": {
        id: ("ingredientCategory3"),
        name: "fish",
      },
      "ingredientCategory4": {
        id: ("ingredientCategory4"),
        name: "fruit",
      },
      "ingredientCategory5": {
        id: ("ingredientCategory5"),
        name: "spices",
      },
      "ingredientCategory6": {
        id: ("ingredientCategory6"),
        name: "chilies",
        parent: "ingredientCategory5",
      },
  },
    ingredients: {
      "ingredient1": {
        id: ("ingredient1"),
        name: "tomatos",
        ingredientCategories: ["ingredientCategory1", "ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient2": {
        id: ("ingredient2"),
        name: "cucumber",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient3": {
        id: ("ingredient3"),
        name: "spinach",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient4": {
        id: ("ingredient4"),
        name: "lettuce",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient5": {
        id: ("ingredient5"),
        name: "bell pepper",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient6": {
        id: ("ingredient6"),
        name: "radish",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient7": {
        id: ("ingredient7"),
        name: "sprouts",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient8": {
        id: ("ingredient8"),
        name: "cabbage",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient9": {
        id: ("ingredient9"),
        name: "fennel",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient10": {
        id: ("ingredient10"),
        name: "onion",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient11": {
        id: ("ingredient11"),
        name: "garlic",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient12": {
        id: ("ingredient12"),
        name: "olive",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient13": {
        id: ("ingredient13"),
        name: "carrot",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient14": {
        id: ("ingredient14"),
        name: "potato",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      "ingredient15": {
        id: ("ingredient15"),
        name: "beef",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      "ingredient16": {
        id: ("ingredient16"),
        name: "chicken",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      "ingredient17": {
        id: ("ingredient17"),
        name: "ham",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      "ingredient18": {
        id: ("ingredient18"),
        name: "pork",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      "ingredient19": {
        id: ("ingredient19"),
        name: "ground beef",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      "ingredient20": {
        id: ("ingredient20"),
        name: "sausages",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      "ingredient21": {
        id: ("ingredient21"),
        name: "tuna",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      "ingredient22": {
        id: ("ingredient22"),
        name: "salmon",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      "ingredient23": {
        id: ("ingredient23"),
        name: "talapia",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      "ingredient24": {
        id: ("ingredient24"),
        name: "perch",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      "ingredient25": {
        id: ("ingredient25"),
        name: "swordfish",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      "ingredient26": {
        id: ("ingredient26"),
        name: "cod",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      "ingredient27": {
        id: ("ingredient27"),
        name: "banana",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient28": {
        id: ("ingredient28"),
        name: "cherry",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient29": {
        id: ("ingredient29"),
        name: "raspberry",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient30": {
        id: ("ingredient30"),
        name: "apple",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient31": {
        id: ("ingredient31"),
        name: "apricot",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient32": {
        id: ("ingredient32"),
        name: "kiwi",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient33": {
        id: ("ingredient33"),
        name: "orange",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient34": {
        id: ("ingredient34"),
        name: "blueberry",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient35": {
        id: ("ingredient35"),
        name: "blackberry",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient36": {
        id: ("ingredient36"),
        name: "grapefruit",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient37": {
        id: ("ingredient37"),
        name: "honeydew melon",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient38": {
        id: ("ingredient38"),
        name: "cantoulope",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient39": {
        id: ("ingredient39"),
        name: "grapes",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient40": {
        id: ("ingredient40"),
        name: "plum",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      "ingredient42": {
        id: ("ingredient42"),
        name: "pepper",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient43": {
        id: ("ingredient43"),
        name: "salt",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient44": {
        id: ("ingredient44"),
        name: "oregano",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient45": {
        id: ("ingredient45"),
        name: "thyme",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient46": {
        id: ("ingredient46"),
        name: "basil",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient47": {
        id: ("ingredient47"),
        name: "nutmeg",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient48": {
        id: ("ingredient48"),
        name: "allspice",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient49": {
        id: ("ingredient49"),
        name: "cinnamon",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient50": {
        id: ("ingredient50"),
        name: "ginger",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient51": {
        id: ("ingredient51"),
        name: "bay leaf",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient52": {
        id: ("ingredient52"),
        name: "marjoram",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient53": {
        id: ("ingredient53"),
        name: "tumeric",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient54": {
        id: ("ingredient54"),
        name: "sage",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient55": {
        id: ("ingredient55"),
        name: "curry",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient56": {
        id: ("ingredient56"),
        name: "vanilla",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient57": {
        id: ("ingredient57"),
        name: "cumin",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient58": {
        id: ("ingredient58"),
        name: "carraway",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      "ingredient59": {
        id: ("ingredient59"),
        name: "chili flakes",
        ingredientCategories: ["ingredientCategory5", "ingredientCategory6"],
        relativeValues: [],
      },
      "ingredient60": {
        id: ("ingredient60"),
        name: "red chili",
        ingredientCategories: [
          "ingredientCategory4",
          "ingredientCategory5",
          "ingredientCategory6",
        ],
        relativeValues: [],
      },
    },
  };
})();

export default data;
