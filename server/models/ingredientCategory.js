const mongoose = require("mongoose");
const { Schema } = mongoose;

const ingredientCategorySchema = new Schema(
  {
    uuid: { type: String, required: true, index: true },
    name: { type: String, required: true, lowercase: true },
    parent: String,
  },
  {
    timestamps: { createdAt: "dateCreated", updatedAt: "dateUpdated" },
  }
);

const IngredientCategory = mongoose.model(
  "IngredientCategory",
  ingredientCategorySchema
);

module.exports = IngredientCategory;
