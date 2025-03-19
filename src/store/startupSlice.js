import { createSlice } from "@reduxjs/toolkit";

const startupSlice = createSlice({
  name: "startups",
  initialState: {
    startups: [],
    loading: false,
  },
  reducers: {
    fetchNewStartups(state, action) {
      state.startups = action.payload.startups;
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    },
  },
});
export const startupActions = startupSlice.actions;

export default startupSlice;
