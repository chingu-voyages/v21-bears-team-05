const mongoose = require("mongoose");
const { Schema } = mongoose;

const indexSchema = new Schema(
  {
    ref: String,
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
