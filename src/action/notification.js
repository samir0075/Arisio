import { notificationActions } from "src/store/notificationSlice";
import { sendRequest } from "src/utils/request";

export const notification = () => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`admin/organizations_count`, "post");

      console.log("res", res);
      dispatch(
        notificationActions.fetchNewNotifications({
          notification: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
