import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  media: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
  fileTypes: {
    type: String,
    default: "",
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
