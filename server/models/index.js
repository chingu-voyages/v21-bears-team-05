const mongoose = require("mongoose");
const { Schema } = mongoose;

const indexSchema = new Schema({
  ingredientCategories: [{ type: String }],
  ingredients: [{ type: String }],
  recipes: [{ type: String }],
});

const Index = mongoose.model("Index", indexSchema);

module.exports = Index;