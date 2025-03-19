import { createSlice } from "@reduxjs/toolkit";

const seeNewMandateSlice = createSlice({
  name: "mandates",
  initialState: {
    newMandate: [],
    mandateType: [],
    startupStageType: [],
    technologyType: [],
    selectedMandate: {},
    startupTeamBackground: {},
    startupcurrenttTraction: {},
    selectedMandateDetailsInShort: {},
    applicationDetails: {},
    profileOverview: {},
    loading: false,
    newMandateloading: false,
    teamMember: [],
    documents: [],
    questions: [],
    submissionDetails: {},
    pitchLoading: false,
    profileOverviewLoading: false,
  },
  reducers: {
    fetchNewMandates(state, action) {
      state.newMandate = action.payload.newMandate;
      state.loading = false;
    },
    fetchMandateType(state, action) {
      state.mandateType = action.payload.mandateType;
      state.loading = false;
    },
    fetchTechnologyType(state, action) {
      state.technologyType = action.payload.technologyType;
      state.loading = false;
    },
    fetchStartupStageType(state, action) {
      state.startupStageType = action.payload.startupStageType;
      state.loading = false;
    },
    fetchstartupTeamBackground(state, action) {
      state.startupTeamBackground = action.payload;
    },
    fetchstartupCurrentTraction(state, action) {
      state.startupcurrenttTraction = action.payload;
    },
    fetchMandateDetails(state, action) {
      state.selectedMandate = action.payload.selectedMandate;
      state.loading = false;
    },
    fetchApplicationStatus(state, action) {
      state.applicationDetails = action.payload.applicationDetails;
      state.loading = false;
    },
    fetchMandateDetailsInShort(state, action) {
      state.selectedMandateDetailsInShort = action.payload.selectedMandateDetailsInShort;
      state.loading = false;
    },
    fetchProfileOverview(state, action) {
      state.profileOverview = action.payload.profileOverview;
      state.loading = false;
    },
    fetchTeamMember(state, action) {
      state.teamMember = action.payload.teamMember;
      state.loading = false;
    },
    fetchDocuments(state, action) {
      state.documents = action.payload.documents;
      state.loading = false;
    },
    fetchQuestions(state, action) {
      state.questions = action.payload.questions;
      state.loading = false;
    },
    fetchSubmissionDetails(state, action) {
      state.submissionDetails = action.payload.submissionDetails;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    },
    setPitchLoading(state, action) {
      state.pitchLoading = action.payload; // Set loading state based on the payload
    },
    setNewMandateloading(state, action) {
      state.newMandateloading = action.payload;
    },
    setProfileOverviewLoading(state, action) {
      state.profileOverviewLoading = action.payload;
    },
  },
});
export const seeNewMandateActions = seeNewMandateSlice.actions;

export default seeNewMandateSlice;
