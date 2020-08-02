const mongoose = require("mongoose");
const { Schema } = mongoose;

const ingredientSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  categories: [],
  relevantValues: [],
});

// Duplicate the ID field.
ingredientSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ingredientSchema.set("toJSON", {
  virtuals: true,
});
const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
