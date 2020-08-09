const mongoose = require("mongoose");
const { Schema } = mongoose;

//TODO: Error from mongoDB, unique is not respected
const ingredientSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: true,
    lowercase: true,
  },
});

// Duplicate the ID field.
ingredientSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ingredientSchema.set("toJSON", {
  virtuals: true,
});

const ingredientCategories = mongoose.model(
  "ingredientCategories",
  ingredientSchema
);

module.exports = ingredientCategories;
