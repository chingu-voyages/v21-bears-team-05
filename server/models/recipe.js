const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlPath = process.env.IMAGE_BASE_URL_PATH;

const recipeSchema = new Schema(
  {
    title: { type: String, required: true, lowercase: true, unique: true },
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
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    uploadedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    instructions: [{ type: String, lowercase: true }],
    gallery: [
      {
        uploadedBy: { type: mongoose.Schema.ObjectId, ref: "Comments" },
        url: {
          type: String,
          get: (val) => `${urlPath}${val}`,
        },
      },
    ],
    comments: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: "Comments",
        },
        commentBy: String,
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

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
