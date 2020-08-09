const mongoose = require("mongoose");
const { Schema } = mongoose;

const ingredientCategorySchema = new Schema(
  {
    uuid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true },
    parent: { type: String },
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
