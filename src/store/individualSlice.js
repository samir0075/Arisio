import { createSlice } from "@reduxjs/toolkit";

const individualSlice = createSlice({
  name: "individual",
  initialState: {
    individualProfileDetails: {},
    loading: false
  },
  reducers: {
    fetchIndividualProfileDetails(state, action) {
      state.individualProfileDetails = action.payload.profileDetails;
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    }
  }
});
export const individualAction = individualSlice.actions;

export default individualSlice;
