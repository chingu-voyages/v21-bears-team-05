const mongoose = require("mongoose");
const { Schema } = mongoose;

const ingredientCategorySchema = new Schema({
  id: { type: String, required: true, index: true },
  name: { type: String, required: true, lowercase: true },
  parent: String,
});

const IngredientCategory = mongoose.model(
  "IngredientCategory",
  ingredientCategorySchema
);

module.exports = IngredientCategory;
