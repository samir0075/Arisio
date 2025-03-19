import { createSlice } from "@reduxjs/toolkit";

const seeMyUpdateSlice = createSlice({
  name: "myUpdates",
  initialState: {
    myUpdates: [],
    selectedMyUpdates: {},
  },
  reducers: {
    fetchNewMyUpdates(state, action) {
      state.myUpdates = action.payload.myUpdates;
    },
    // addMyUpdates(state, action) {
    //   state.selectedMyUpdates = action.payload.selectedMyUpdates;
    // },
  },
});
export const myUpdateActions = seeMyUpdateSlice.actions;

export default seeMyUpdateSlice;
