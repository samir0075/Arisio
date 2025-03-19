import { createSlice } from "@reduxjs/toolkit";

const myEventsSlice = createSlice({
  name: "myEvents",
  initialState: {
    myEvents: {},
    selectedEvent: {},
    eventsImage: {},
    loading: false,
    myEventsLoading: false,
  },
  reducers: {
    fetchMyEvents(state, action) {
      state.myEvents = action.payload.myEvents;
      state.loading = false;
    },
    fetchImageEvents(state, action) {
      state.eventsImage = action.payload.eventsImage;
    },
    fetchSelectedEvent(state, action) {
      state.selectedEvent = action.payload.selectedEvent;
    },
    setLoading(state, action) {
      state.loading = action.payload; 
    },
    setMyEventsLoading(state, action) {
      state.myEventsLoading = action.payload;
    },
  },
});
export const myEventsActions = myEventsSlice.actions;

export default myEventsSlice;
