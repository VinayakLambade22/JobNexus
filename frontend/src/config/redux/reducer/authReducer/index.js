import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getAboutUser,
  getAllUsers,
  sendConnectionRequest,
  getConnectionsRequest,
  getMyConnectionRequests,
  acceptConnectionRequest,
  getMyNetwork,
  rejectConnectionRequest,
} from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetched: false,
  network: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginuser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Logging you in...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.user = action.payload;
        state.message = "Login successful!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
        state.message = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.user = action.payload;
        state.message = {
          message: "Registration successfull ! Please Sign In.",
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
        state.message = action.payload || "Registration failed";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.userProfile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequest = action.payload;
      })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyNetwork.fulfilled, (state, action) => {
        state.network = action.payload;
      })
      .addCase(getMyNetwork.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(rejectConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  handleLoginuser,
  emptyMessage,
  setTokenIsThere,
  setTokenIsNotThere,
} = authSlice.actions;
export default authSlice.reducer;
