const data = (function dummyData() {
  /* TODO replace with call to backend */
  return {
    users: {
      currentUserId: {
        id: "currentUserId",
        username: "Susan",
        avatar:
          "https://d33wubrfki0l68.cloudfront.net/ec99b69e4512106ddf49a54a31a92853b19b2c6a/28b45/en/blog/uploads/web-developer-coding-backend.jpg",
        bio:
          "I love my job as a coder but I forget to plan my meals and only have 2 eggs, 1 potato and some old mustard.  I hope this app will help me figure out what to have for dinner.",
      },
    },
    recipes: {
      recipe1: {
        id: "recipe1",
        title: "Fried eggs",
        description: "Yummy fried egg",
        ingredients: [
          {
            ingredientRef: "ingredient61",
            amount: {
              quantity: 1,
              value: "medium",
            },
          },
          {
            ingredientRef: "ingredient62",
            amount: {
              quantity: 15,
              value: "ml",
            },
          },
        ],
        instructions: [
          "Heat oil pan",
          "Crack in egg",
          "Cook until all the whites are opaque",
        ],
        gallery: [
          {
            url:
              "data:image/jpeg;base64,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",
            uploadedBy: "currentUserId",
          },
        ],
        tags: ["breakfast"],
        createdBy: null,
        uploadedBy: "currentUserId",
        commentsRef: "",
        Rating: {
          votes: 0,
          stars: 0,
        },
      },
      recipe2: {
        id: "recipe2",
        title: "English Breakfast",
        description: "Traditional recipe for English Breakfast. English breakfast is a dish that consists of a number of components such as back bacon, eggs, British sausage, baked ...",
        ingredients: [
          {
            ingredientRef: "ingredient20",
            amount: {
              quantity: 2,
              value: null,
            },
          },
          {
            ingredientRef: "ingredient61",
            amount: {
              quantity: 1,
              value: "medium",
            },
          },
          {
            ingredientRef: "ingredient62",
            amount: {
              quantity: 45,
              value: "ml",
            },
          },
          {
            ingredientRef: "ingredient63",
            amount: {
              quantity: 2,
              value: null,
            },
          },
        ],
        instructions: ["Fry the eggs, lorem ipsum..."],
        gallery: [
          {
            url:
              "data:image/jpeg;base64,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",
            uploadedBy: "currentUserId",
          },
        ],
        tags: ["breakfast"],
        createdBy: "Susan's Mum",
        uploadedBy: "currentUserId",
        commentsRef: "",
        Rating: {
          votes: 0,
          stars: 0,
        },
      },
    },
    ingredientCategories: {
      ingredientCategory1: {
        id: "ingredientCategory1",
        name: "vegetables",
      },
      ingredientCategory2: {
        id: "ingredientCategory2",
        name: "meat",
      },
      ingredientCategory3: {
        id: "ingredientCategory3",
        name: "fish",
      },
      ingredientCategory4: {
        id: "ingredientCategory4",
        name: "fruit",
      },
      ingredientCategory5: {
        id: "ingredientCategory5",
        name: "spices",
      },
      ingredientCategory6: {
        id: "ingredientCategory6",
        name: "chilies",
        parent: "ingredientCategory5",
      },
    },
    ingredients: {
      ingredient1: {
        id: "ingredient1",
        name: "tomatos",
        ingredientCategories: ["ingredientCategory1", "ingredientCategory4"],
        relativeValues: [],
      },
      ingredient2: {
        id: "ingredient2",
        name: "cucumber",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient3: {
        id: "ingredient3",
        name: "spinach",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient4: {
        id: "ingredient4",
        name: "lettuce",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient5: {
        id: "ingredient5",
        name: "bell pepper",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient6: {
        id: "ingredient6",
        name: "radish",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient7: {
        id: "ingredient7",
        name: "sprouts",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient8: {
        id: "ingredient8",
        name: "cabbage",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient9: {
        id: "ingredient9",
        name: "fennel",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient10: {
        id: "ingredient10",
        name: "onion",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient11: {
        id: "ingredient11",
        name: "garlic",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient12: {
        id: "ingredient12",
        name: "olive",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient13: {
        id: "ingredient13",
        name: "carrot",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient14: {
        id: "ingredient14",
        name: "potato",
        ingredientCategories: ["ingredientCategory1"],
        relativeValues: [],
      },
      ingredient15: {
        id: "ingredient15",
        name: "beef",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      ingredient16: {
        id: "ingredient16",
        name: "chicken",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      ingredient17: {
        id: "ingredient17",
        name: "ham",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      ingredient18: {
        id: "ingredient18",
        name: "pork",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      ingredient19: {
        id: "ingredient19",
        name: "ground beef",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      ingredient20: {
        id: "ingredient20",
        name: "sausages",
        ingredientCategories: ["ingredientCategory2"],
        relativeValues: [],
      },
      ingredient21: {
        id: "ingredient21",
        name: "tuna",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      ingredient22: {
        id: "ingredient22",
        name: "salmon",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      ingredient23: {
        id: "ingredient23",
        name: "talapia",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      ingredient24: {
        id: "ingredient24",
        name: "perch",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      ingredient25: {
        id: "ingredient25",
        name: "swordfish",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      ingredient26: {
        id: "ingredient26",
        name: "cod",
        ingredientCategories: ["ingredientCategory3"],
        relativeValues: [],
      },
      ingredient27: {
        id: "ingredient27",
        name: "banana",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient28: {
        id: "ingredient28",
        name: "cherry",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient29: {
        id: "ingredient29",
        name: "raspberry",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient30: {
        id: "ingredient30",
        name: "apple",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient31: {
        id: "ingredient31",
        name: "apricot",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient32: {
        id: "ingredient32",
        name: "kiwi",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient33: {
        id: "ingredient33",
        name: "orange",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient34: {
        id: "ingredient34",
        name: "blueberry",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient35: {
        id: "ingredient35",
        name: "blackberry",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient36: {
        id: "ingredient36",
        name: "grapefruit",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient37: {
        id: "ingredient37",
        name: "honeydew melon",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient38: {
        id: "ingredient38",
        name: "cantoulope",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient39: {
        id: "ingredient39",
        name: "grapes",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient40: {
        id: "ingredient40",
        name: "plum",
        ingredientCategories: ["ingredientCategory4"],
        relativeValues: [],
      },
      ingredient42: {
        id: "ingredient42",
        name: "pepper",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient43: {
        id: "ingredient43",
        name: "salt",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient44: {
        id: "ingredient44",
        name: "oregano",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient45: {
        id: "ingredient45",
        name: "thyme",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient46: {
        id: "ingredient46",
        name: "basil",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient47: {
        id: "ingredient47",
        name: "nutmeg",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient48: {
        id: "ingredient48",
        name: "allspice",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient49: {
        id: "ingredient49",
        name: "cinnamon",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient50: {
        id: "ingredient50",
        name: "ginger",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient51: {
        id: "ingredient51",
        name: "bay leaf",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient52: {
        id: "ingredient52",
        name: "marjoram",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient53: {
        id: "ingredient53",
        name: "tumeric",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient54: {
        id: "ingredient54",
        name: "sage",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient55: {
        id: "ingredient55",
        name: "curry",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient56: {
        id: "ingredient56",
        name: "vanilla",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient57: {
        id: "ingredient57",
        name: "cumin",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient58: {
        id: "ingredient58",
        name: "carraway",
        ingredientCategories: ["ingredientCategory5"],
        relativeValues: [],
      },
      ingredient59: {
        id: "ingredient59",
        name: "chili flakes",
        ingredientCategories: ["ingredientCategory5", "ingredientCategory6"],
        relativeValues: [],
      },
      ingredient60: {
        id: "ingredient60",
        name: "red chili",
        ingredientCategories: [
          "ingredientCategory4",
          "ingredientCategory5",
          "ingredientCategory6",
        ],
        relativeValues: [],
      },
      ingredient61: {
        id: "ingredient61",
        name: "eggs",
        ingredientCategories: [],
        relativeValues: [],
      },
      ingredient62: {
        id: "ingredient62",
        name: "oil",
        ingredientCategories: [],
        relativeValues: [],
      },
      ingredient63: {
        id: "ingredient63",
        name: "bacon",
        ingredientCategories: [],
        relativeValues: [],
      },
    },
  };
})();

export default data;
