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

// Duplicate the ID field.
indexSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
indexSchema.set("toJSON", {
  virtuals: true,
});
const Index = mongoose.model("Index", indexSchema);

module.exports = Index;
