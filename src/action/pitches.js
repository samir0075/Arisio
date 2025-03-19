import { pitchesActions } from "src/store/pitchesSlice";
import { sendRequest } from "src/utils/request";

export const pitches = (startupId, page, eventStatus) => {
  return async (dispatch) => {
    try {
      dispatch(pitchesActions.setLoading(true));
      const res = await sendRequest(
        `startup/${startupId}/show_my-events_per_page/${page}?eventStatus=${eventStatus}`,
        "get"
      );

      dispatch(
        pitchesActions.fetchNewPitches({
          pitches: res,
        })
      );
      dispatch(pitchesActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(pitchesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const pitchMandateCount = (startupId, pageNo, eventStatus) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `startup/${startupId}/show_my-events_per_page_count/${pageNo}?eventStatus=${eventStatus}`,
        "get"
      );

      dispatch(
        pitchesActions.fetchPitchesCount({
          pitchesCount: res,
        })
      );
      // dispatch(investorMandatesActions.setLoading(false));

      return res;
    } catch (err) {
      dispatch(pitchesActions.Loading(true));
      return err?.response?.data?.message;
    }
  };
};
export const allMandatesDashboardCountStartup = () => {
  return async (dispatch) => {
   
    try {
      dispatch(pitchesActions.setpitchCountLoading(true));
      
      const res = await sendRequest(`startup/startupdashboardCount`, "get");
      

      dispatch(
        pitchesActions.fetchAllMandatesDashboardCountStartup({
          allMandatesDashboardStartup: res,
        })
      );
      dispatch(pitchesActions.setpitchCountLoading(false));

      return res;
    } catch (err) {
      dispatch(pitchesActions.setpitchCountLoading(true));
      return err?.response?.data?.message;
    }
  };
};
