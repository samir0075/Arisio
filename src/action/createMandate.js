import { toast } from "react-toastify";
import { mandateActions } from "src/store/createMandateSlice";
import { sendRequest } from "src/utils/request";

export const fetchDomains = () => {
  return async (dispatch) => {
    try {
      dispatch(mandateActions.setLoading(true));
      const res = await sendRequest(`/investor/technologies_detail`, "get");
      dispatch(
        mandateActions.fetchMandateDetails({
          domain: res,
        })
      );
      dispatch(mandateActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(mandateActions.setLoading(false));
      return err?.response?.data?.message;
    }
  };
};

export const getTechnology = () => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/admin/technologies_detail`, "get");
      dispatch(
        mandateActions.fetchMandateDetails({
          domain: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const postMandateImage = (investorId, file) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`investor/${investorId}/upload_image`, "post", file, "pdf");

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const applicationsDetails = (techId, investorId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/${investorId}/domain/${techId}`, "get");
      dispatch(
        mandateActions.fetchMandateDetailsById({
          applications: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const saveUserSelection = (selectedTechIds, userId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/investor/${userId}/save_user_selection`,
        "post",
        selectedTechIds
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const selectedMandateDetails = (investorId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `investor/${investorId}/fetch_published_selected_mapping`,
        "get"
      );
      dispatch(
        mandateActions.fetchSelectedMandate({
          selectedMandate: res,
        })
      );

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const getMandateType = () => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/mandate_type_all`, "get");
      dispatch(
        mandateActions.fetchMandateType({
          mandateType: res,
        })
      );

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const displayMandateDetails = (investorId, sendFormData) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/${investorId}/event_creation`, "post", sendFormData);
      dispatch(
        mandateActions.displayMandate({
          displayMandate: res,
        })
      );
      return res;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage, {
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

export const saveEventsQuestion = (investorId, storeQuestion, mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/investor/${investorId}/save_event_questions/${mandateId}`,
        "post",
        storeQuestion
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const showMandateDetails = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/${investorId}/events/${mandateId}`, "get");
      dispatch(
        mandateActions.showMandateDetails({
          showMandate: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const launchMandate = (investorId, mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/${investorId}/enable_event/${mandateId}`, "get");
      dispatch(
        mandateActions.fetchLaunchMandateStatus({
          statusOfLaunchMandate: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const getEventsQuestions = (mandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/event_questions/${mandateId}`, "get");
      dispatch(
        mandateActions.saveEventQuestions({
          eventQuestions: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const navigateIncompleteMandate = (investorId, eventId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/${investorId}/events/${eventId}`, "get");
      dispatch(
        mandateActions.fetchIncompleteMandate({
          incompleteMandateData: res,
        })
      );
      return res;
    } catch (err) {
      return;
    }
  };
};

export const eventsQuestionDelete = (questionId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/delete_event_question/${questionId}`, "delete");
      return res;
    } catch (err) {
      console.log(err);
      return err?.response?.data?.message;
    }
  };
};

export const getMandateNameDuplication = (mandateName) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/check_title?title=${mandateName}`, "get");
      return res;
    } catch (err) {
      const error = err?.response?.data?.message;
      return err?.response?.data;
    }
  };
};
