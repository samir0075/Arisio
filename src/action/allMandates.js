import { toast } from "react-toastify";
import { allMandatesActions } from "src/store/allMandatesSlice";
import { sendRequest } from "src/utils/request";

export const allMandatesCounts = (country, eventStatus, technology) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `admin/events_count?query=${country},${eventStatus},${technology}`,
        "get"
      );

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const allMandates = (page, country, eventStatus, technology) => {
  return async (dispatch) => {
    try {
      dispatch(allMandatesActions.fetchLoadingState(true));
      const res = await sendRequest(
        `admin/events_per_page/${page}?query=${country},${eventStatus},${technology}`,
        "get"
      );

      dispatch(
        allMandatesActions.fetchAllMandates({
          allMandates: res,
        })
      );
      dispatch(allMandatesActions.fetchLoadingState(false));
      return res;
    } catch (err) {
      dispatch(allMandatesActions.fetchLoadingState(false));
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return err?.response?.data?.message;
    }
  };
};
export const allOpenMandates = (userId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`admin/${userId}/pitched_mandates`, "get");

      console.log("res", res);
      dispatch(
        allMandatesActions.fetchAllOpenMandates({
          allOpenMandates: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const allTableMandates = (userId, mandateId, startupPitchId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `admin/7300/mandate/${mandateId}/pitches/${startupPitchId}/${0}`,
        "get"
      );

      console.log("res", res);
      dispatch(
        allMandatesActions.fetchAllTableMandates({
          allTableMandates: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const adminMandateDetail = (adminUserId, mandateId) => {
  return async (dispatch) => {
    try {
      dispatch(allMandatesActions.fetchMandateDetailLoadingState(true));
      const res = await sendRequest(`admin/${adminUserId}/events/${mandateId}`, "get");
      dispatch(
        allMandatesActions.fetchMandateDetail({
          adminMandateDetailData: res,
        })
      );
      dispatch(allMandatesActions.fetchMandateDetailLoadingState(false));

      return res;
    } catch (err) {
      dispatch(allMandatesActions.fetchMandateDetailLoadingState(false));
      const error = err?.response?.data?.message || "Something went wrong";
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return err?.response?.data?.message;
    }
  };
};

export const adminMandateQuestion = (mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`admin/event_questions/${mandateId}`, "get");
      dispatch(
        allMandatesActions.fetchMandateQuestion({
          mandateQuestion: res,
        })
      );

      return res;
    } catch (err) {
      const error = err?.response?.data?.message || "Something went wrong";
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return err?.response?.data?.message;
    }
  };
};
