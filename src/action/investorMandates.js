import { toast } from "react-toastify";
import { investorMandatesActions } from "src/store/investorMandatesSlice";
import { sendRequest } from "src/utils/request";

export const getInvestorMandates = (
  investorId,
  page,
  country,
  eventStatus,
  technology,
  debouncedQuery
) => {
  return async (dispatch) => {
    try {
      dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/events_per_page/${page}?query=${country},${eventStatus},${technology},${debouncedQuery}`,
        "get"
      );

      dispatch(
        investorMandatesActions.fetchInvestorMandates({
          allMandates: res,
        })
      );
      dispatch(investorMandatesActions.setLoading(false));

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));

      return err?.response?.data?.message;
    }
  };
};

export const allMandatesCount = (investorId, country, eventStatus, technology, debouncedQuery) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `investor/${investorId}/events_count?query=${country},${eventStatus},${technology},${debouncedQuery}`,
        "get"
      );
      // dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchInvestorMandatesCount({
          mandateCounts: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getMandateShortDetails = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/applications_event/${mandateId}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchInvestorMandatesInShort({
          shortDetails: res,
        })
      );
      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getSelectedMandateStatus = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/event_notification/${mandateId}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchSelectedMandatesActions({
          mandateAction: res,
        })
      );
      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getMandateMeetingDetails = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(`investor/${investorId}/meet/${mandateId}`, "get");
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchSelectedMandateMeetDetails({
          meetStatus: res,
        })
      );
      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getNewPitches = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(`investor/${investorId}/applications/${mandateId}/0`, "get");
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchNewPitches({
          newPitches: res,
        })
      );
      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const saveForShortlist = (investorId, mandateId, startupId) => {
  return async (dispatch) => {
    try {
      dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/${mandateId}/accept/${startupId}/%20/0`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(getNewPitches(investorId, mandateId));

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const saveForWatchList = (investorId, mandateId, startupId) => {
  return async (dispatch) => {
    try {
      dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/${mandateId}/watchlist/${startupId}/0`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(getNewPitches(investorId, mandateId));

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const saveForRejection = (investorId, mandateId, startupId) => {
  return async (dispatch) => {
    try {
      dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/${mandateId}/reject/${startupId}/not%20up%20to%20expected%20level`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(getNewPitches(investorId, mandateId));

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const shortlistedCount = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `investor/${investorId}/shortlisted_applications_count/${mandateId}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchShortlistedCount({
          shortlistedStartupsCount: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const shortlistedStartupList = (investorId, mandateId, pagesCount) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/accepted_applications/${mandateId}/${pagesCount}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchShortlistedStartupList({
          shortlistedStartups: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const startupTabOverallView = (investorId, startupId) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(`investor/${investorId}/startupDeatils/${startupId}`, "get");

      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchStartupOverallViewTab({
          startupTabOverView: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const startupTabTeam = (investorId, startupId, eventId) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/startupTeam/${startupId}/${eventId}`,
        "get"
      );

      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchStartupTeamTab({
          startupTabTeam: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const startupTabDocument = (investorId, startupId) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(`investor/${investorId}/startupDocument/${startupId}`, "get");

      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchStartupDocumentTab({
          startupTabDocument: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const startupTabQuestion = (investorId, startupId, eventID) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/startupQA/${startupId}/${eventID}`,
        "get"
      );

      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchStartupQuickQuestionTab({
          startupTabQuickQuestion: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const startupTabUpdates = (investorId, startupId) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(`investor/${investorId}/startupUpdates/${startupId}`, "get");

      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchStartupUpdatesTab({
          startupTabUpdates: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const scheduleMeeting = (investorId, mandateId, startupId, meetingDetails) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/schedule_meeting/${startupId}/${mandateId}`,
        "post",
        meetingDetails
      );
      dispatch(investorMandatesActions.setLoading(false));
      toast.success("Meeting Scheduled  Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return res;
    } catch (err) {
      // dispatch(investorMandatesActions.setLoading(true));
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

export const sendMessage = (investorId, startupId, selectedMandateId, applicationId, data) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/save_chat/${startupId}?query=${selectedMandateId},${applicationId}`,
        "post",
        data.message,
        "plain"
      );
      dispatch(investorMandatesActions.setLoading(false));
      // toast.success("Message Sent Successfully", {
      toast.success(
        intl.formatMessage({
          id: "investorMandate.shortlistStartup.sendMessage.successMessage",
          defaultMessage: "Message Sent Successfully",
        }),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return res;
    } catch (err) {
      // dispatch(investorMandatesActions.setLoading(true));
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
export const sendMessageShortlistedStartup = (investorId, startupId, data, intl) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/save_chat/${startupId}`,
        "post",
        data.message,
        "plain"
      );
      dispatch(investorMandatesActions.setLoading(false));
      // toast.success("Message Sent Successfully", {
      toast.success(
        intl.formatMessage({
          id: "investorMandate.shortlistStartup.sendMessage.successMessage",
          defaultMessage: "Message Sent Successfully",
        }),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return res;
    } catch (err) {
      // dispatch(investorMandatesActions.setLoading(true));
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

export const applicationsCount = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `investor/${investorId}/applications_count/${mandateId}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const watchlistedCount = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `investor/${investorId}/watchlisted_applications_count/${mandateId}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchWatchlistedCount({
          watchlistedStartupsCount: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const watchlistedStartupList = (investorId, mandateId, pagesCount) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/watchlisted_startups/${mandateId}/${pagesCount}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchWatchlistedStartupList({
          watchlistedStartups: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const meetingScheduledCount = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `investor/${investorId}/invited_applications_count/${mandateId}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchMeetingScheduledStartupCount({
          meetingScheduledStartupsCount: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const meetingScheduledStartupList = (investorId, mandateId, pagesCount) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/invited_applications/${mandateId}/${pagesCount}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchMeetingScheduledStartupList({
          meetingScheduledStartups: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const contactedCount = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `investor/${investorId}/contacted_applications_count/${mandateId}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchContactedStartupCount({
          contactedStartupsCount: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const contactedStartupList = (investorId, mandateId, pagesCount) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `investor/${investorId}/contacted_applications/${mandateId}/${pagesCount}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchContactedStartupList({
          contactedStartups: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const promoteMandate = (event_details, id) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(`event/${event_details}/${id}`, "get");
      console.log(res);
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchEventDetails({
          eventDetails: res,
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const manageMandatesStatus = (investorId, mandateId, activeId) => {
  return async (dispatch) => {
    try {
      // dispatch(investorMandatesActions.setLoading(true));
      const res = await sendRequest(
        `/investor/${investorId}/open_or_close_event/${mandateId}/${activeId}`,
        "get"
      );
      dispatch(investorMandatesActions.setLoading(false));
      dispatch(
        investorMandatesActions.fetchInvestorMandatesInShort({
          shortDetails: res?.status === true ? res?.eventDetails : [],
        })
      );

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const manageExtendedDate = (investorId, mandateId, date) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/investor/${investorId}/extend_event/${mandateId}/${date}`,
        "get"
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const deleteIncompleteMandate = (investorId, eventId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/${investorId}/delete_event/${eventId}`, "get");
      console.log("resAdd", res);
      dispatch(allMandates(investorId));
      toast.success("Update Deleted Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const allMandatesDashboardCount = () => {
  return async (dispatch) => {
    try {
      dispatch(investorMandatesActions.setAllMandatesDashboardLoading(true));

      const res = await sendRequest(`investor/counts_investor_dashboard`, "get");
      dispatch(
        investorMandatesActions.fetchAllMandatesDashboardCount({
          allMandatesDashboard: res,
        })
      );
      dispatch(investorMandatesActions.setAllMandatesDashboardLoading(false));

      return res;
    } catch (err) {
      dispatch(investorMandatesActions.setAllMandatesDashboardLoading(true));
      return err?.response?.data?.message;
    }
  };
};
