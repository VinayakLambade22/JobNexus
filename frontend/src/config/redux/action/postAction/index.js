import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData, thunkAPI) => {
    try {
      const response = await clientServer.post("/post", formData);
      return thunkAPI.fulfillWithValue("Post created successfully");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const postId = post_id.post_id;

      const response = await clientServer.delete(
        `/delete_post?token=${token}&post_Id=${postId}`
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const incrementPostLike = createAsyncThunk(
  "post/incrementLike",
  async (post, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post(`/increment_post_like`, {
        post_id: post.post_id,
        token: token, 
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get(`/get_comments`, {
        params: { post_id: postData.post_id },
      });
      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id: postData.post_id,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post(`/comment`, {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
