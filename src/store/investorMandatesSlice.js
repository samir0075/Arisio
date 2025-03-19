import { createSlice } from "@reduxjs/toolkit";

const investorMandatesSlice = createSlice({
  name: "pitches",
  initialState: {
    allMandates: [],
    mandateCounts: [],
    shortDetails: {},
    mandateAction: {},
    meetStatus: [],
    newPitches: [],
    loading: false,
    shortlistedStartups: [],
    shortlistedStartupsCount: [],
    startupTabOverView: [],
    startupTabTeam: [],
    startupTabDocument: [],
    startupTabQuickQuestion: [],
    startupTabUpdates: [],
    watchlistedStartups: [],
    watchlistedStartupsCount: [],
    meetingScheduledStartups: [],
    meetingScheduledStartupsCount: [],
    contactedStartups: [],
    contactedStartupsCount: [],
    eventDetails: [],
    allMandatesDashboard: [],
    allMandatesDashboardLoading: false,
    // allOpenMandates: [],
    // selectedMandates: {},
  },
  reducers: {
    fetchInvestorMandates(state, action) {
      state.allMandates = action.payload.allMandates;
    },
    fetchInvestorMandatesCount(state, action) {
      state.mandateCounts = action.payload.mandateCounts;
    },
    fetchInvestorMandatesInShort(state, action) {
      state.shortDetails = action.payload.shortDetails;
    },
    fetchSelectedMandatesActions(state, action) {
      state.mandateAction = action.payload.mandateAction;
    },
    fetchSelectedMandateMeetDetails(state, action) {
      state.meetStatus = action.payload.meetStatus;
    },
    fetchNewPitches(state, action) {
      state.newPitches = action.payload.newPitches;
    },
    fetchShortlistedCount(state, action) {
      state.shortlistedStartupsCount = action.payload.shortlistedStartupsCount;
    },
    fetchShortlistedStartupList(state, action) {
      state.shortlistedStartups = action.payload.shortlistedStartups;
    },
    fetchStartupOverallViewTab(state, action) {
      state.startupTabOverView = action.payload.startupTabOverView;
    },
    fetchStartupTeamTab(state, action) {
      state.startupTabTeam = action.payload.startupTabTeam;
    },
    fetchStartupDocumentTab(state, action) {
      state.startupTabDocument = action.payload.startupTabDocument;
    },
    fetchStartupQuickQuestionTab(state, action) {
      state.startupTabQuickQuestion = action.payload.startupTabQuickQuestion;
    },
    fetchStartupUpdatesTab(state, action) {
      state.startupTabUpdates = action.payload.startupTabUpdates;
    },
    fetchWatchlistedCount(state, action) {
      state.watchlistedStartupsCount = action.payload.watchlistedStartupsCount;
    },
    fetchWatchlistedStartupList(state, action) {
      state.watchlistedStartups = action.payload.watchlistedStartups;
    },
    fetchMeetingScheduledStartupCount(state, action) {
      state.meetingScheduledStartupsCount = action.payload.meetingScheduledStartupsCount;
    },
    fetchMeetingScheduledStartupList(state, action) {
      state.meetingScheduledStartups = action.payload.meetingScheduledStartups;
    },
    fetchContactedStartupCount(state, action) {
      state.contactedStartupsCount = action.payload.contactedStartupsCount;
    },
    fetchContactedStartupList(state, action) {
      state.contactedStartups = action.payload.contactedStartups;
    },
    fetchEventDetails(state, action) {
      state.eventDetails = action.payload.eventDetails;
    },
    fetchAllMandatesDashboardCount(state, action) {
      state.allMandatesDashboard = action.payload.allMandatesDashboard;
    },

    setAllMandatesDashboardLoading(state, action) {
      state.allMandatesDashboardLoading = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    // fetchAllOpenMandates(state, action) {
    //   state.allOpenMandates = action.payload.allOpenMandates;
    // },
  },
});
export const investorMandatesActions = investorMandatesSlice.actions;

export default investorMandatesSlice;
