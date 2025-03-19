import { createSlice } from "@reduxjs/toolkit";

const homepageSlice = createSlice({
  name: "home",
  initialState: {
    newMandate: [],
    news: [],
    events: [],
    dataCounts: [],
    loading: false, // Single loading flag for the whole component
    loadingCounter: 0, // Tracks the number of ongoing requests
    newsLoading: true,
    eventsLoading: true,
  },
  reducers: {
    fetchNewMandate(state, action) {
      state.newMandate = action.payload.newMandate;
    },
    fetchNews(state, action) {
      state.news = action.payload.news;
    },
    fetchEvents(state, action) {
      state.events = action.payload.events;
    },
    fetchDataCounts(state, action) {
      state.dataCounts = action.payload.dataCounts;
    },
    incrementLoading(state) {
      state.loadingCounter += 1;
      state.loading = true; // Set loading to true when any request starts
    },
    decrementLoading(state) {
      state.loadingCounter -= 1;
      if (state.loadingCounter <= 0) {
        state.loading = false; // Set loading to false when all requests finish
        state.loadingCounter = 0; // Prevent negative loading counter
      }
    },
    setLoading(state, action) {
      state.loading = action.payload; // Manually set loading in case of need
    },
    setNewsLoading(state, action) {
      state.newsLoading = action.payload;
    },
    setEventsLoading(state, action) {
      state.eventsLoading = action.payload;
    },
  },
});

export const homepageActions = homepageSlice.actions;

export default homepageSlice;
