const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    id: {type: String, required: true, index: true},
    createdBy: { type: String, required: true },
    comment: String,
  },
  {
    timestamps: { createdAt: "created", updatedAt: "modified" },
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
