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

// Duplicate the ID field.
indexSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
indexSchema.set("toJSON", {
  virtuals: true,
});
const Index = mongoose.model("Index", indexSchema);

module.exports = Index;
