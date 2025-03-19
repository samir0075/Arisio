import { createSlice } from "@reduxjs/toolkit";

const contactUsSlice = createSlice({
  name: "contactUs",
  initialState: {
    contactUs: [],
  },
  reducers: {
    addContactUs(state, action) {
      state.contactUs = action.payload.contactUs;
    },
  },
});
export const contactUsActions = contactUsSlice.actions;

export default contactUsSlice;
