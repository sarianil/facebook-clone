import { configureStore } from "@reduxjs/toolkit";
import { flowdataReducer } from "./Slices/flowdataSlice";
import { socialReducer } from "./Slices/socialSlice";

const store = configureStore({
  reducer: {
    social: socialReducer,
    flowdata: flowdataReducer,
  },
});

export default store;
