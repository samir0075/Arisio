import { createSlice } from "@reduxjs/toolkit";

const investorProfileStepper = createSlice({
  name: "investorProfileStepper",
  initialState: {
    loading: false,
    investorProfileStepperData: [],
    investorProfileData: [],
    investorId: null,
    documents: [],
    fundType: [],
    fundTicket: [],
    investorSector: [],
    startupStageType: [],
    preRevenueStageType: [],
  },
  reducers: {
    fetchInvestorProfileStepper(state, action) {
      state.investorProfileStepperData = action.payload.investorProfileStepperData;
      state.loading = false;
      state.investorId = null;
    },
    fetchInvestorProfileData(state, action) {
      state.investorProfileData = action.payload.investorProfileData;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    },
    setInvestorId(state, action) {
      state.investorId = action.payload; // Set loading state based on the payload
    },
    fetchDocuments(state, action) {
      state.documents = action.payload.documents;
    },
    fetchFundType(state, action) {
      state.fundType = action.payload.fundType;
    },
    fetchFundTicket(state, action) {
      state.fundTicket = action.payload.fundTicket;
    },
    fetchInvestorSector(state, action) {
      state.investorSector = action.payload.investorSector;
    },
    fetchStageType(state, action) {
      state.startupStageType = action.payload.stageType;
    },
    fetchPreRevenueType(state, action) {
      state.preRevenueStageType = action.payload.preRevenueStageType;
    },
  },
});
export const investorProfileStepperAction = investorProfileStepper.actions;
// export const { setInvestorId } = investorProfileStepper.actions;

export default investorProfileStepper;
