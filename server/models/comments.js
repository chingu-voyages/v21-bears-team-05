const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    createdBy: { type: String, required: true, lowercase: true },
    comment: String,
  },
  {
    timestamps: { createdAt: "created", updatedAt: "modified" },
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
