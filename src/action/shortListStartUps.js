import { shortListStartUpsActions } from "src/store/shortListStartUpsSlice";
import { sendRequest } from "src/utils/request";

export const getShortListedStartUpsData = (data, pageNo, investorId) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(shortListStartUpsActions.setLoading(true));
      const res = await sendRequest(
        `/investor/${investorId}/exseed_recommended/${pageNo}`,
        "post",
        data
      );
      const count = await sendRequest(`/investor/${investorId}/exseed_recommended_count`, "get");
      dispatch(
        shortListStartUpsActions.fetchShortListedStartups({
          shortListStartUpsData: { data: res, count: count?.count, pageCount: count?.pagesCount },
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(shortListStartUpsActions.setLoading(false));
      return res;
    } catch (err) {
      // Set loading to false after successfully fetching the data
      dispatch(shortListStartUpsActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const createScheduleMeeting = (investorId, userId, eventId, data) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/investor/${investorId}/schedule_meeting/${eventId}/${userId}`,
        "post",
        data
      );
      dispatch(
        shortListStartUpsActions.scheduleMeeting({
          scheduleMeetingResponse: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
