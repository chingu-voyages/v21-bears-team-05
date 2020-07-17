const mongoose = require("mongoose");
const { Schema } = mongoose;


const recipeSchema = new Schema(
  {
    title: { type: String, required: true, lowercase: true },
    description: { type: String, lowercase: true },
    ingredients: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: "Ingredients",
        },
        name: String,
        quantity: Number,
        value: String,
      },
    ],
    description: String,
    tags: [String],
    region: String,
    created_by: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    uploaded_by: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    instructions: { type: String, lowercase: true },
    comments: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: "Comments",
        },
        comment_by: String,
      },
    ],
    rating: {
      votes: Number,
      favs: Number,
    },
  },
  {
    timestamps: { createdAt: "date_created", updatedAt: "date_updated" },
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
