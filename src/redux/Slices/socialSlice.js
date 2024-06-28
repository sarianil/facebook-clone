import { createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "../thunk";

const initialState = {
  currentUser: null,
  userStatus: "idle",
  error: null,
};

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      state.userStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.userStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout } = socialSlice.actions;
export const socialReducer = socialSlice.reducer;
