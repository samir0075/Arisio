import { createSlice } from "@reduxjs/toolkit";

const myNewsSlice = createSlice({
  name: "myNews",
  initialState: {
    myNews: [],
    myNewsType: [],
    myAllNews: [],
    selectedMyNews: {},
    newsImage: {},
    loading: false,
    searchLoading: false,
    myAllNewsLoading: false,
  },
  reducers: {
    fetchMyNews(state, action) {
      state.myNews = action.payload.myNews;
    },
    fetchMyAllNews(state, action) {
      state.myAllNews = action.payload.myAllNews;
    },

    fetchMyNewsType(state, action) {
      state.myNewsType = action.payload.myNewsType;
    },
    fetchSelectedNews(state, action) {
      state.selectedMyNews = action.payload.selectedMyNews;
    },
    fetchImageNews(state, action) {
      state.newsImage = action.payload.newsImage;
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    },
    setSearchLoading(state, action) {
      state.searchLoading = action.payload; // Set loading state based on the payload
    },
    setMyAllNewsLoading(state, action) {
      state.myAllNewsLoading = action.payload;
    },
  },
});
export const myNewsActions = myNewsSlice.actions;

export default myNewsSlice;
