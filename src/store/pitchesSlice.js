import { createSlice } from "@reduxjs/toolkit";

const myPitchesSlice = createSlice({
  name: "pitches",
  initialState: {
    pitches: [],
    allMandatesDashboardStartup: [],
    pitchesCount: [],
    loading: false
  },
  reducers: {
    fetchNewPitches(state, action) {
      state.pitches = action.payload.pitches;
    },
    fetchPitchesCount(state, action) {
      state.pitchesCount = action.payload.pitchesCount;
    },
    fetchAllMandatesDashboardCountStartup(state, action) {
      state.allMandatesDashboardStartup = action.payload.allMandatesDashboardStartup;
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    },
    setpitchCountLoading(state, action) {
      state.pitchCountLoading = action.payload;
    }
  }
});
export const pitchesActions = myPitchesSlice.actions;

export default myPitchesSlice;
