import { createSlice } from "@reduxjs/toolkit";
import { initialData } from "../utils/initialState-for-searchStartup";
const searchStartupsSlice = createSlice({
  name: "searchStartups",
  initialState: {
    loading: false,
    error: false,
    startUpsData: [],
    startUpsByNameData: [],
    selectedStartUpsByName: [],
    employeeCountHistory: [],
    employeeCompanyFundHistory: [],
    pieChartGraph: [],
    companiesByFilter: initialData,
    listOfSelectedStartUpMandates: [],
    emailData: {},
    startUpsCount: {},
    /** for managing the side menu collapse value */
    collapseValue: false,
    filtersData: {},
    singleStartUpData: {},
    companyNameFilterName: {},
    keywordFilterKeys: {},
    companyFilterfeild: {}
  },
  reducers: {
    fetchSearchStartups(state, action) {
      state.startUpsData = action.payload.startUpsData;
    },
    fetchFullDescriptionOfStartUp(state, action) {
      state.singleStartUpData = action.payload.singleStartUpData;
    },
    fetchSearchByNameStartups(state, action) {
      state.startUpsByNameData = action.payload.startUpsByNameData;
    },
    fetchStartupsCount(state, action) {
      state.startUpsCount = action.payload.startUpsCount;
    },
    fetchDataByCompaniesFilter(state, action) {
      state.companiesByFilter = action.payload.companiesByFilter;
    },
    fetchSideCollapseValue(state, action) {
      state.collapseValue = action.payload.collapseValue;
    },
    fetchSelectedStartUpsData(state, action) {
      state.selectedStartUpsByName = action.payload.selectedStartUpsByName;
    },
    fetchResponseOfSendingMandates(state, action) {
      state.emailData = action.payload.emailData;
    },
    fetchSelectedStartUpMandates(state, action) {
      state.listOfSelectedStartUpMandates = action.payload.listOfSelectedStartUpMandates;
    },
    fetchEmployeeCountHistoryGraph(state, action) {
      state.employeeCountHistory = action.payload.employeeCountHistory;
    },
    fetchCompanyFundHistoryGraph(state, action) {
      state.employeeCompanyFundHistory = action.payload.employeeCompanyFundHistory;
    },
    fetchPieChartGraph(state, action) {
      state.pieChartGraph = action.payload.pieChartGraph;
    },
    setFiltersData(state, action) {
      state.filtersData = action.payload.filtersData;
    },
    setKeyowordFilterKeys(state, action) {
      state.keywordFilterKeys = action.payload.keywordFilterKeys;
    },
    setCompanyNameFilterName(state, action) {
      state.companyNameFilterName = action.payload.filterName;
    },
    setfilterDatabyCompanyFilterFeild(state, action) {
      state.companyFilterfeild = action.payload.filterFeilds;
    },

    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    },
    setError(state, action) {
      state.error = action.payload; // Set loading state based on the payload
    }
  }
});
export const searchStartUpsActions = searchStartupsSlice.actions;

export default searchStartupsSlice;
