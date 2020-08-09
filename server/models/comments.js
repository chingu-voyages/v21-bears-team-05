const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    uuid: {type: String, required: true, index: true},
    createdBy: { type: String, required: true },
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
