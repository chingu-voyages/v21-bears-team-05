const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    created_by: { type: String, required: true, lowercase: true },
    comment: String,
  },
  {
    timestamps: { createdAt: "created", updatedAt: "modified" },
  }
);

// Duplicate the ID field.
commentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
commentSchema.set("toJSON", {
  virtuals: true,
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
