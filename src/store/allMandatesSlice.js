import { createSlice } from "@reduxjs/toolkit";

const allMandatesSlice = createSlice({
  name: "pitches",
  initialState: {
    allMandates: [],
    allOpenMandates: [],
    allTableMandates: [],
    selectedMandates: {},
    adminMandateDetailData: {},
    mandateQuestion: [],
    loading: false,
    mandateDetailLoading: false
  },
  reducers: {
    fetchAllMandates(state, action) {
      state.allMandates = action.payload.allMandates;
    },
    fetchAllOpenMandates(state, action) {
      state.allOpenMandates = action.payload.allOpenMandates;
    },
    fetchAllTableMandates(state, action) {
      state.allTableMandates = action.payload.allTableMandates;
    },
    fetchMandateDetail(state, action) {
      state.adminMandateDetailData = action.payload.adminMandateDetailData;
    },
    fetchMandateQuestion(state, action) {
      state.mandateQuestion = action.payload.mandateQuestion;
    },
    fetchMandateDetailLoadingState(state, action) {
      state.mandateDetailLoading = action.payload;
    },
    fetchLoadingState(state, action) {
      state.loading = action.payload;
    }
  }
});
export const allMandatesActions = allMandatesSlice.actions;

export default allMandatesSlice;
