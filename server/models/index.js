const mongoose = require("mongoose");
const { Schema } = mongoose;

const indexSchema = new Schema(
  {
    ref: { type: String, index: true, required: true },
    ingredientCategories: [{ type: String }],
    ingredients: [{ type: String }],
    recipes: [{ type: String }],
  },
  {
    timestamps: { createdAt: "created", updatedAt: "modified" },
  }
);

const Index = mongoose.model("Index", indexSchema);

module.exports = Index;
