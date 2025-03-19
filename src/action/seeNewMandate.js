/* eslint-disable react-hooks/rules-of-hooks */
import { seeNewMandateActions } from "src/store/seeNewMandateSlice";
import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";
import { getInvestorDocument } from "./investorProfileStepper";

export const seeNewMandate = (startupId, page, technology, startupStage, mandateType, location) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(seeNewMandateActions.setNewMandateloading(true));

      const res = await sendRequest(
        `startup/${startupId}/show_events_per_page/${page}?technologies=${technology}&stage=${startupStage}&mandateType=${mandateType}&country=${location}`,
        "get"
      );
      // technologies=1&stage=Pre Revenue&mandateType=2&country=India
      dispatch(
        seeNewMandateActions.fetchNewMandates({
          newMandate: res
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(seeNewMandateActions.setNewMandateloading(false));
      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setNewMandateloading(true));
      return err?.response?.data?.message;
    }
  };
};

export const mandateTypeDetails = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/startup/mandate_type_all`, "get");

      dispatch(
        seeNewMandateActions.fetchMandateType({
          mandateType: res
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const technologyDetails = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/technologies`, "get");

      dispatch(
        seeNewMandateActions.fetchTechnologyType({
          technologyType: res
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const startupStageTypeDetails = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/startup_stage_all`, "get");
      dispatch(
        seeNewMandateActions.fetchStartupStageType({
          startupStageType: res
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const startupTeamBackground = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/all_team_background`, "get");

      dispatch(seeNewMandateActions.fetchstartupTeamBackground(res));
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const startupcurrentTraction = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/all_current_tranction`, "get");

      dispatch(seeNewMandateActions.fetchstartupCurrentTraction(res));
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const newMandatesCount = startupId => {
  return async dispatch => {
    try {
      const res = await sendRequest(`startup/${startupId}/all_my_events_pages_count`, "get");
      // dispatch(investorMandatesActions.setLoading(false));

      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const mandateDetails = startupId => {
  return async dispatch => {
    try {
      dispatch(seeNewMandateActions.setLoading(true));
      const selectedMandateId = localStorage.getItem("selectedMandateId");
      const mandateId = selectedMandateId ? JSON.parse(selectedMandateId) : null;

      const res = await sendRequest(`startup/${startupId}/show_event/${mandateId}`, "get");
      dispatch(
        seeNewMandateActions.fetchMandateDetails({
          selectedMandate: res
        })
      );
      dispatch(seeNewMandateActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(seeNewMandateActions.setLoading(true));
      dispatch(seeNewMandateActions.setLoading(false));
      return err?.response?.data?.message;
    }
  };
};

export const proceedToPitch = startupId => {
  return async dispatch => {
    try {
      dispatch(seeNewMandateActions.setPitchLoading(true));
      const selectedMandateId = localStorage.getItem("selectedMandateId");
      const mandateId = selectedMandateId ? JSON.parse(selectedMandateId) : null;

      const res = await sendRequest(`startup/${startupId}/proceedToPitch/${mandateId}`, "get");
      localStorage.setItem("applicationStatus", JSON.stringify(res));
      dispatch(
        seeNewMandateActions.fetchApplicationStatus({
          applicationDetails: res
        })
      );
      dispatch(seeNewMandateActions.setPitchLoading(false));
      return res;
    } catch (err) {
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      dispatch(seeNewMandateActions.setPitchLoading(false));
      return err?.response?.data?.success;
    }
  };
};

export const mandateDetailsInShort = startupId => {
  return async dispatch => {
    try {
      dispatch(seeNewMandateActions.setNewMandateloading(true));
      const selectedMandateId = localStorage.getItem("selectedMandateId");
      const mandateId = selectedMandateId ? JSON.parse(selectedMandateId) : null;

      const res = await sendRequest(`startup/${startupId}/eventDetailsShort/${mandateId}`, "get");
      dispatch(
        seeNewMandateActions.fetchMandateDetailsInShort({
          selectedMandateDetailsInShort: res
        })
      );
      dispatch(seeNewMandateActions.setNewMandateloading(false));
      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setNewMandateloading(false));
      return err?.response?.data?.message;
    }
  };
};

export const uploadStartupProfile = (startupId, formData) => {
  return async dispatch => {
    try {
      const res = await sendRequest(`startup/${startupId}/startupLogo`, "post", formData, "pdf");
      toast.success("Profile picture updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const profileOverviewForMandate = profileId => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(seeNewMandateActions.setProfileOverviewLoading(true));

      const res = await sendRequest(`startup/startupDetails/${profileId}`, "get");
      dispatch(
        seeNewMandateActions.fetchProfileOverview({
          profileOverview: res
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(seeNewMandateActions.setProfileOverviewLoading(false));
      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setProfileOverviewLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const updateStartupInfundedCompany = startupId => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      // dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(`startup/updateStartupInfundedCompany/${startupId}/0`, "get");

      return res;
    } catch (err) {
      console.log("err", err);

      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      // dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const updateProfile = (profileId, profileData, intl) => {
  return async dispatch => {
    try {
      const res = await sendRequest(`startup/startup_profile/${profileId}`, "post", profileData);
      if (res) {
        dispatch(profileOverviewForMandate(profileId));
        // Set loading to false after successfully fetching the data
        // dispatch(seeNewMandateActions.setLoading(false));
        // toast.success("Profile updated Successfully", {

        if (res?.message) {
          toast.success(res?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
        }

        return res;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      // dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getTeamMember = startupId => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(`startup/${startupId}/team_members_detail`, "get");
      dispatch(
        seeNewMandateActions.fetchTeamMember({
          teamMember: res
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(seeNewMandateActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const addTeamMember = (startupId, data, intl) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      // dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(`startup/${startupId}/add_team_member`, "post", data);
      dispatch(getTeamMember(startupId));
      // Set loading to false after successfully fetching the data
      // dispatch(seeNewMandateActions.setLoading(false));
      // toast.success("Team Member Added Successfully", {
      toast.success(
        intl.formatMessage({
          id: "seeNewMandate.teamMemberAdded.successMessage",
          defaultMessage: "Team Member Added Successfully"
        }),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      );
      return res;
    } catch (err) {
      // dispatch(seeNewMandateActions.setLoading(true));

      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return err;
    }
  };
};

export const deleteMember = (deleteId, startupId, intl) => {
  return async dispatch => {
    try {
      const res = await sendRequest(`startup/${startupId}/delete_member/${deleteId}`, "get");
      dispatch(getTeamMember(startupId));
      // Set loading to false after successfully fetching the data
      dispatch(seeNewMandateActions.setLoading(false));
      toast.success(
        intl.formatMessage({
          id: "seeNewMandate.deleteMember.successMessage",
          defaultMessage: "Team Member Deleted Successfully"
        }),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      );
      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setLoading(true));
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return err?.response?.data?.message;
    }
  };
};

export const getDocuments = startupId => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(`startup/${startupId}/pitch_deck`, "get");
      dispatch(
        seeNewMandateActions.fetchDocuments({
          documents: res
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(seeNewMandateActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const urlForDownload = (startupId, pdf) => {
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  const investorId = userDetails?.investorId;

  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(
        role === "INVESTOR"
          ? `/investor/${investorId}/startupDocumentDownload/${startupId}?fileName=${pdf}`
          : `/startup/${startupId}/pitch_deck_download?fileName=${pdf}`,
        "get"
      );

      // Set loading to false after successfully fetching the data
      dispatch(seeNewMandateActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const uploadDocument = (formData, documentType, startupId, intl) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      // dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(
        `startup/${startupId}/pitch_deck/${documentType}`,
        "post",
        formData,
        "pdf"
      );
      dispatch(getDocuments(startupId));
      // toast.success("Document Uploaded Successfully", {
      toast.success(
        intl.formatMessage({
          id: "seeNewMandate.uploadDocument.successMessage",
          defaultMessage: "Documented successfully added"
        }),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      );
      // Set loading to false after successfully fetching the data
      // dispatch(seeNewMandateActions.setLoading(false));
      return res;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      // dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const deleteDocument = (deleteId, id, intl, flow) => {
  return async dispatch => {
    try {
      const res = !flow
        ? await sendRequest(`startup/${id}/pitch_deck_delete/${deleteId}`, "delete")
        : await sendRequest(`investor/${id}/${deleteId}/deleteInvestorDocument`, "delete");
      !flow ? dispatch(getDocuments(id)) : dispatch(getInvestorDocument(id));

      // Set loading to false after successfully fetching the data
      dispatch(seeNewMandateActions.setLoading(false));
      toast.success(
        intl.formatMessage({
          id: "seeNewMandate.deleteDocument.successMessage",
          defaultMessage: "Document Deleted Successfully"
        }),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      );

      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setLoading(true));
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return err?.response?.data?.message;
    }
  };
};

export const getQuestions = (startupId, mandateId) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      // dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(`startup/${startupId}/QuestionsWithAnswer/${mandateId}`, "get");
      dispatch(
        seeNewMandateActions.fetchQuestions({
          questions: res
        })
      );
      // Set loading to false after successfully fetching the data
      // dispatch(seeNewMandateActions.setLoading(false));
      console.log("response in disatch action", res);
      return res;
    } catch (err) {
      // dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const postAnswer = (startupId, data, questionId, intl) => {
  return async dispatch => {
    try {
      const res = await sendRequest(
        `startup/${startupId}/saveStartupAnswer/${questionId}`,
        "post",
        data
      );
      // toast.success("Answer Submitted Successfully", {
      toast.success(
        intl.formatMessage({
          id: "seeNewMandate.postAnswer.successMessage",
          defaultMessage: "Answer Submitted Successfully"
        }),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      );
      return res;
    } catch (err) {
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return err?.response?.data?.message;
    }
  };
};

export const updateAnswer = (startupId, data, answerId, intl) => {
  return async dispatch => {
    try {
      const res = await sendRequest(
        `startup/${startupId}/updateStartupAnswer/${answerId}`,
        "post",
        data.answer,
        "plain"
      );
      // toast.success("Answer Updated Successfully", {
      toast.success(
        intl.formatMessage({
          id: "seeNewMandate.updateAnswer.successMessage",
          defaultMessage: "Answer Updated Successfully"
        }),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      );
      return res;
    } catch (err) {
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return err?.response?.data?.message;
    }
  };
};

export const submitPitch = (startupId, mandateId, pitchId) => {
  return async dispatch => {
    try {
      const res = await sendRequest(
        `startup/${startupId}/submitApplication/${pitchId}/${mandateId}`,
        "get"
      );

      // Set loading to false after successfully fetching the data
      dispatch(seeNewMandateActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const submissionDetails = (startupId, pitchId) => {
  return async dispatch => {
    try {
      dispatch(seeNewMandateActions.setLoading(true));
      const res = await sendRequest(
        `startup/${startupId}/application_notification/${pitchId}`,
        "get"
      );
      dispatch(seeNewMandateActions.fetchSubmissionDetails({ submissionDetails: res }));
      // Set loading to false after successfully fetching the data
      dispatch(seeNewMandateActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
