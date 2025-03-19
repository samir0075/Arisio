import { HomeRepairService } from "@mui/icons-material";
import { homepageActions } from "../store/homepageSlice";
import { sendRequest } from "src/utils/request";

export const getNewMandate = (country) => {
  return async (dispatch) => {
    try {
      dispatch(homepageActions.incrementLoading()); // Increment the loading counter

      const res = await sendRequest(`show_events_per_page?country=${country}`, "get");

      dispatch(
        homepageActions.fetchNewMandate({
          newMandate: res?.data,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    } finally {
      dispatch(homepageActions.decrementLoading()); // Decrement the loading counter
    }
  };
};

export const getNews = (country, category, page) => {
  return async (dispatch) => {
    try {
      dispatch(homepageActions.setNewsLoading(true)); // Increment the loading counter

      const res = await sendRequest(
        `website/news/${page ? page : "1"}?country=${country ? country : ""}&category=${
          category ? category : ""
        }`,
        "get"
      );

      dispatch(
        homepageActions.fetchNews({
          news: res,
        })
      );
      dispatch(homepageActions.setNewsLoading(false));
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    } finally {
      dispatch(homepageActions.setNewsLoading(false));
    }
  };
};

export const getEvents = (country, page) => {
  return async (dispatch) => {
    try {
      // dispatch(homepageActions.incrementLoading()); // Increment the loading counter
      dispatch(homepageActions.setEventsLoading(true));

      const res = await sendRequest(
        `website/events/${page ? page : "1"}?country=${country ? country : ""}`,
        "get"
      );

      dispatch(
        homepageActions.fetchEvents({
          events: res,
        })
      );
      dispatch(homepageActions.setEventsLoading(false));
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    } finally {
      // dispatch(homepageActions.decrementLoading()); // Decrement the loading counter
      dispatch(homepageActions.setEventsLoading(false));
    }
  };
};
export const getDataCounts = (country) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`website/data_counts`, "get");
      dispatch(
        homepageActions.fetchDataCounts({
          dataCounts: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
