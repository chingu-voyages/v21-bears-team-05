const mongoose = require("mongoose");
const { Schema } = mongoose;

const ingredientSchema = new Schema(
  {
    uuid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true },
    categories: [],
    ingredientCategories: [],
    relevantValues: [],
  },
  {
    timestamps: { createdAt: "dateCreated", updatedAt: "dateUpdated" },
  }
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
