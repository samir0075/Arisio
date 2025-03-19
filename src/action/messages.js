import { messagesActions } from "src/store/messagesSlice";
import { sendRequest } from "src/utils/request";

export const getNewMessagesCount = (userId, role, chatOpened) => {
  return async dispatch => {
    try {
      // dispatch(messagesActions.setLoading(true));
      const res =
        role !== "ENTREPRENEUR"
          ? await sendRequest(
              `investor/${userId}/update_unread_count?chatOpened=${chatOpened}`,
              "get"
            )
          : await sendRequest(
              `startup/${userId}/update_unread_count?chatOpened=${chatOpened}`,
              "get"
            );
      dispatch(
        messagesActions.fetchMessagesCount({
          count: res
        })
      );
      // dispatch(messagesActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(messagesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getMessages = (id, role, searchItem) => {
  return async dispatch => {
    dispatch(messagesActions.setLoading(true));
    try {
      const res =
        role === "ENTREPRENEUR"
          ? await sendRequest(`startup/${id}/message_list?search=${searchItem}`, "get")
          : await sendRequest(`investor/${id}/message_list?search=${searchItem}`, "get");
      dispatch(
        messagesActions.fetchMessages({
          messagesList: res
        })
      );
      dispatch(messagesActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(messagesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getStartupChat = (investorId, startupId, role) => {
  return async dispatch => {
    try {
      // dispatch(messagesActions.setLoading(true));
      const res =
        role === "ENTREPRENEUR"
          ? await sendRequest(`startup/${startupId}/message_by_investor/${investorId}`)
          : await sendRequest(`investor/${investorId}/message_list_startup/${startupId}`, "get");
      dispatch(
        messagesActions.fetchStartupChat({
          fullChat: res
        })
      );
      // dispatch(messagesActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(messagesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const postChat = (investorId, startupId, chat, role) => {
  return async dispatch => {
    try {
      dispatch(messagesActions.setStatus(true));

      const res =
        role === "ENTREPRENEUR"
          ? await sendRequest(`startup/${investorId}/save_chat/${startupId}`, "post", chat, "plain")
          : await sendRequest(
              `investor/${investorId}/save_chat/${startupId}`,
              "post",
              chat,
              "plain"
            );

      dispatch(messagesActions.setStatus(false));
      dispatch(getStartupChat(investorId, startupId));

      return res;
    } catch (err) {
      // dispatch(messagesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
