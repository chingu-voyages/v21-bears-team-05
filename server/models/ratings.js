const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema(
  {
    rated_by: {
      _id: { type: mongoose.Schema.ObjectId, ref: "User", unique: true },
    },
    recipe_id: {
      _id: {
        type: mongoose.Schema.ObjectId,
				ref: "Recipe",
				unique: true
      }
    },
    stars: String,
  },
  {
    timestamps: { createdAt: "date_rated" },
  }
);

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating
