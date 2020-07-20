const mongoose = require("mongoose");
const { Schema } = mongoose;

const ingredientSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  categories: [],
  relevantValues: [],
});

const Ingredient = mongoose.model("Ingredient", recipeSchema);

module.exports = Ingredient;
