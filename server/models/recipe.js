const mongoose = require("mongoose")
const { Schema } = mongoose

const urlPath = process.env.IMAGE_BASE_URL_PATH

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
    created_by: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    uploaded_by: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		instructions: { type: String, lowercase: true },
		gallery: [
			{
        uploaded_by: { type: mongoose.Schema.ObjectId, ref: "Comments" },
				url: {
					type: String,
					get: val => `${urlPath}${val}`
				}
			}
		],
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
      stars: Number,
    },
  },
  {
    timestamps: { createdAt: "date_created", updatedAt: "date_updated" },
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
