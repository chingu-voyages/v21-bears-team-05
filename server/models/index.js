const mongoose = require("mongoose");
const { Schema } = mongoose;

const indexSchema = new Schema({
  topRecipes: [
    {
      recipeRef: {
        type: mongoose.Schema.ObjectId,
        ref: "Recipe",
      },
      ingredients: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Ingredient",
        },
      ],
      tags: [String],
    },
  ],
  ingredients: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Ingredient",
    },
  ],
  recipes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Recipe",
    },
  ],
});

const Index = mongoose.model("Index", indexSchema);

module.exports = Index;
