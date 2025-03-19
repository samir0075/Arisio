import { createSlice } from "@reduxjs/toolkit";

const seeMyIdeaSlice = createSlice({
  name: "myIdea",
  initialState: {
    myIdea: [],
    loading: false,
  },
  reducers: {
    fetchNewMyIdea(state, action) {
      state.myIdea = action.payload.myIdea;
      state.loading = false;
    },

    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    },
    // addMyUpdates(state, action) {
    //   state.selectedMyUpdates = action.payload.selectedMyUpdates;
    // },
  },
});
export const myIdeaActions = seeMyIdeaSlice?.actions;

export default seeMyIdeaSlice;
