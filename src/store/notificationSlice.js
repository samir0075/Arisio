import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notification: [],
    selectedNotification: {},
  },
  reducers: {
    fetchNewNotifications(state, action) {
      state.notification = action.payload.notification;
    },
  },
});
export const notificationActions = notificationSlice.actions;

export default notificationSlice;
