import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFlowData } from "../thunk";

const initialState = {
  flowData: [],
  flowDataStatus: "idle",
  error: null,
};

const flowdataSlice = createSlice({
  name: "flowdata",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlowData.pending, (state) => {
        state.flowDataStatus = "loading";
      })
      .addCase(fetchFlowData.fulfilled, (state, action) => {
        state.flowDataStatus = "succeeded";
        state.flowData = action.payload;
      })
      .addCase(fetchFlowData.rejected, (state, action) => {
        state.flowDataStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const flowdataReducer = flowdataSlice.reducer;
export default flowdataSlice;
