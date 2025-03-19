import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "home",
  initialState: {
    count: [],
    messagesList: [],
    fullChat: [],
    loading: false,
    status: false,
  },
  reducers: {
    fetchMessagesCount(state, action) {
      state.count = action.payload.count;
    },
    fetchMessages(state, action) {
      state.messagesList = action.payload.messagesList;
    },
    fetchStartupChat(state, action) {
      state.fullChat = action.payload.fullChat;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});
export const messagesActions = messagesSlice.actions;

export default messagesSlice;
