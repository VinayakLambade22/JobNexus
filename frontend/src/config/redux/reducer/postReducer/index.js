import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPosts,
  getAllComments,
  incrementPostLike,
  createPost,
  deletePost,
  postComment,
} from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Loading posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.postId = action.payload.post_id;
        state.comments = action.payload.comments;
      })
      .addCase(getAllComments.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(incrementPostLike.fulfilled, (state, action) => {
        const { updatedPost } = action.payload;
        state.posts = state.posts.map((post) =>
          post._id === updatedPost._id
            ? { ...post, likes: updatedPost.likes }
            : post
        );
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createPost.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deletePost.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(postComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postComment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(postComment.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;
