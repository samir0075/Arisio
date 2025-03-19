import { createSlice } from "@reduxjs/toolkit";

const pendingApprovalsSlice = createSlice({
  name: "mandates",
  initialState: {
    mandates: [],
    selectedMandate: {},
    selectedQuestion: [],
    startups: {},
    investors: {},
    userDetails: {},
    dashboardCounts: [],
    auditLogs: {},
    subscriptionData: {},
    loading: false,
    dashboardCountsLoading: false,
    searchLoading: false,
    subscriptionPlanCount: {},
    subscriptionPlanCountLoading: false
  },
  reducers: {
    fetchNewMandates(state, action) {
      state.mandates = action.payload.mandates;
    },
    fetchSelectedMandates(state, action) {
      state.selectedMandate = action.payload.selectedMandate;
    },
    fetchQuestion(state, action) {
      state.selectedQuestion = action.payload.selectedQuestion;
    },
    fetchPendingStartups(state, action) {
      state.startups = action.payload.startups;
    },
    fetchPendingInvestors(state, action) {
      state.investors = action.payload.investors;
    },
    fetchPendingUserDetails(state, action) {
      state.userDetails = action.payload.userDetails;
    },
    fetchDashboardCounts(state, action) {
      state.dashboardCounts = action.payload.dashboardCounts;
    },
    fetchAuditLogs(state, action) {
      state.auditLogs = action.payload.auditLogs;
    },
    fetchSubscriptionData(state, action) {
      state.subscriptionData = action.payload.data;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSearchLoading(state, action) {
      state.searchLoading = action.payload;
    },
    setDashboardaCountsLoading(state, action) {
      state.dashboardCountsLoading = action.payload;
    },
    setAdminSubscriptionPlanCounts(state, action) {
      state.subscriptionPlanCount = action.payload.subscriptionPlanCount;
    },
    setAdminSubscriptionPlancountLoading(state, action) {
      state.subscriptionPlanCountLoading = action.payload;
    }
  }
});
export const pendingApprovalsActions = pendingApprovalsSlice.actions;

export default pendingApprovalsSlice;
