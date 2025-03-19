import { createSlice } from "@reduxjs/toolkit";

const signInSlice = createSlice({
  name: "user",
  initialState: {
    signInData: [],
    profileData: [],
    permission: [100],
  },
  reducers: {
    fetchUserDetails(state, action) {
      state.signInData = action.payload.signInData;
    },
    fetchUserProfileDetails(state, action) {
      state.profileData = action.payload.profileData;
    },
    handleSignOut(state, action) {
      const lang = localStorage.getItem("lang");

      localStorage.clear();
      if (lang) {
        localStorage.setItem("lang", lang);
      }
      state.signInData = "";
      state.profileData = "";
    },
  },
});
export const signInActions = signInSlice.actions;

export default signInSlice;
