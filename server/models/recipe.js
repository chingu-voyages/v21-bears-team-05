const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipeSchema = new Schema(
  {
    uuid: {type: String, required: true, index: true},
    title: { type: String, required: true },
    description: { type: String },
    ingredients: [
      {
        uuid: { type: String, required: true },
        amount: {
          quantity: Number,
          value: { type: String },
        },
      },
    ],
    description: { type: String },
    tags: [{ type: String }],
    createdBy: { type: String },
    uploadedBy: { type: String, required: true },
    instructions: [{ type: String }],
    gallery: [
      {
        uploadedBy: { type: String, required: true },
        url: { type: String },
      },
    ],
    comments: [
      {
        uuid: {type: String, required: true},
        commentBy: {type: String, required: true},
      },
    ],
    rating: {
      votes: { type: Number, default: 0 },
      stars: { type: Number, default: 0, max: 10 },
    },
  },
  {
    timestamps: { createdAt: "dateCreated", updatedAt: "dateUpdated" },
  }
);

recipeSchema.index({ "rating.votes": -1, "rating.stars": -1 });

// Duplicate the ID field.
recipeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
recipeSchema.set("toJSON", {
  virtuals: true,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
