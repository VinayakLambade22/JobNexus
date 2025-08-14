import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import cloudinary from "../config/cloudinary.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNNING" });
};

export const createPost = async (req, res) => {
  const { token, body } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    let mediaUrl = "";
    let fileType = "";

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "linkedin_clone",
      });

      mediaUrl = uploadResult.secure_url;
      fileType = req.file.mimetype.split("/")[1];
    }

    const post = new Post({
      userId: user._id,
      body,
      media: mediaUrl,
      fileTypes: fileType,
    });

    await post.save();
    return res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_Id } = req.query;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const post = await Post.findOne({ _id: post_Id });
    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await Post.deleteOne({ _id: post_Id });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    await comment.save();
    return res.status(200).json({ message: "Comment added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;
  try {
    const post = await Post.find({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }
    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "username name profilePicture"
    );
    return res.status(200).json(comments.reverse());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.deleteComment({ _id: comment_id });
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increment_likes = async (req, res) => {
  const { post_id, token } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = user._id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    return res.status(200).json({
      message: "Like updated successfully",
      updatedPost: {
        _id: post._id,
        likes: post.likes,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
