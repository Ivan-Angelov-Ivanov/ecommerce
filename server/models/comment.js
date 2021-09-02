const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    content: String,
    user: {
      type: ObjectId,
      ref: "User",
    },
    product: {
      type: ObjectId,
      ref: "Product",
    },
    likes: {
      type: Number,
      default: 0,
    },
    usersWhoLike: {
      type: Array,
      ref: "User",
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    usersWhoDislike: {
      type: Array,
      ref: "User",
    },
    comments: {
      type: Array,
      ref: "Comment",
    },
    isSubComment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
