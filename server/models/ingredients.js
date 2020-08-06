const mongoose = require("mongoose");
const { Schema } = mongoose;

const ingredientSchema = new Schema({
  id: {type: String, required: true, index: true},
  name: { type: String, required: true, lowercase: true },
  categories: [],
  relevantValues: [],
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
