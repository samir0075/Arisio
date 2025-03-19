import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    skipCashTransaction: [],
    pricingLoading: false,
    activePlan: {},
  },
  reducers: {
    fetchPricingStatus(state, action) {
      state.pricingLoading = action.payload;
    },
    fetchSkipCashTransaction(state, action) {
      state.skipCashTransaction = action.payload.skipCashTransaction;
    },
    emptySkipCashTransaction(state, action) {
      state.skipCashTransaction = [];
    },
    fetchUserActivePlan(state, action) {
      state.activePlan = action.payload.activePlan;
    },
  },
});
export const paymentActions = paymentSlice.actions;

export default paymentSlice;
