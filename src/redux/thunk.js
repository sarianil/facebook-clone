import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    const response = await axios.get("http://localhost:5000/currentUser");
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Kullanıcı verisi alınamadı:", error);
    throw error;
  }
});

export const fetchFlowData = createAsyncThunk(
  "flowdata/fetchFlowData",
  async () => {
    try {
      const response = await axios.get("http://localhost:5000/flowdata");
      console.log("Flow data API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Flow data alınamadı:", error);
      throw error;
    }
  }
);
