import { createSlice } from "@reduxjs/toolkit";

const createNewMandate = createSlice({
  name: "newMandate",
  initialState: {
    domain: [],
    applications: [],
    selectedMandate: [],
    displayMandate: [],
    showMandate: [],
    eventQuestions: [],
    statusOfLaunchMandate: {},
    incompleteMandateData: {},
    mandateType: [],
    saveMandateId: "",
    loading: false,
  },
  reducers: {
    fetchMandateDetails(state, action) {
      state.domain = action.payload.domain;
    },
    fetchMandateDetailsById(state, action) {
      state.applications = action.payload.applications;
    },
    fetchSelectedMandate(state, action) {
      state.selectedMandate = action.payload.selectedMandate;
    },
    displayMandate(state, action) {
      state.displayMandate = action.payload.displayMandate;
    },
    showMandateDetails(state, action) {
      state.showMandate = action.payload.showMandate;
    },
    saveEventQuestions(state, action) {
      state.eventQuestions = action.payload.eventQuestions;
    },
    saveMandateId(state, action) {
      console.log(action.payload);
      state.saveMandateId = action.payload;
    },
    fetchLaunchMandateStatus(state, action) {
      state.statusOfLaunchMandate = action.payload.statusOfLaunchMandate;
    },
    fetchIncompleteMandate(state, action) {
      state.incompleteMandateData = action.payload.incompleteMandateData;
    },
    fetchMandateType(state, action) {
      state.mandateType = action.payload.mandateType;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});
export const mandateActions = createNewMandate?.actions;

export default createNewMandate;
