import { createSlice } from "@reduxjs/toolkit";

const shortListStartUpsSlice = createSlice({
  name: "shortListStartups",
  initialState: {
    loading: false,
    shortListStartUpsData: [],
    scheduleMeetingResponse: {},
    filtersData: {},
  },
  reducers: {
    fetchShortListedStartups(state, action) {
      state.shortListStartUpsData = action.payload.shortListStartUpsData;
      state.loading = false;
    },
    scheduleMeeting(state, action) {
      state.scheduleMeetingResponse = action.payload.scheduleMeetingResponse;
      state.loading = false;
    },
    setFilters(state, action) {
      state.filtersData = action.payload.filtersData;
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    },
  },
});
export const shortListStartUpsActions = shortListStartUpsSlice.actions;

export default shortListStartUpsSlice;
