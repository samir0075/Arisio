import { investorProfileStepperAction } from "src/store/investorProfileStepperSlice";
import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";

export const getInvestorProfileStepperData = (userId, data) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(investorProfileStepperAction.setLoading(true));
      const res = await sendRequest(`/investor/${userId}/inverstor_profile_creation`, "post", data);
      //   const count = await sendRequest(`/investor/new_startups_count`, "get");
      dispatch(
        investorProfileStepperAction.fetchInvestorProfileStepper({
          investorProfileStepperData: { data: res }
        })
      );
      dispatch(investorProfileStepperAction.setInvestorId({ investorId: res.investorId }));
      // Set loading to false after successfully fetching the data
      dispatch(investorProfileStepperAction.setLoading(false));
      toast.success("Profile Created Successfully", {
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
      // Set loading to false after successfully fetching the data
      dispatch(investorProfileStepperAction.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getInvestorProfileData = investorId => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(investorProfileStepperAction.setLoading(true));
      const res = await sendRequest(`/investor/${investorId}/investor_profile`, "get");
      //   const count = await sendRequest(`/investor/new_startups_count`, "get");
      dispatch(
        investorProfileStepperAction.fetchInvestorProfileData({
          investorProfileData: res
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(investorProfileStepperAction.setLoading(false));
      return res;
    } catch (err) {
      // Set loading to false after successfully fetching the data
      dispatch(investorProfileStepperAction.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const updateInvestorProfile = (investorId, updateData) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(investorProfileStepperAction.setLoading(true));
      const res = await sendRequest(
        `/investor/${investorId}/investor_profile_update`,
        "post",
        updateData
      );
      // Set loading to false after successfully fetching the data
      dispatch(investorProfileStepperAction.setLoading(false));
      toast.success(`${res?.message}`, {
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
      // Set loading to false after successfully fetching the data
      dispatch(investorProfileStepperAction.setLoading(true));
      const error =
        err?.response?.data?.message || err?.response?.data?.msg || "Something went wrong";
      toast.error(error, {
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

export const uploadInvestorProfileImage = (profileId, formData) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(investorProfileStepperAction.setLoading(true));
      const res = await sendRequest(
        `/investor/${profileId}/upload_profile_image`,
        "post",
        formData,
        "pdf"
      );
      // Set loading to false after successfully fetching the data
      dispatch(investorProfileStepperAction.setLoading(false));
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
      // Set loading to false after successfully fetching the data
      dispatch(investorProfileStepperAction.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const uploadDocumentForInvestor = (formData, investorId, intl) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      // dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(
        `investor/${investorId}/investor_documents`,
        "post",
        formData,
        "pdf"
      );
      dispatch(getInvestorDocument(investorId));
      // toast.success("Document Uploaded Successfully", {
      toast.success(
        intl.formatMessage({
          id: "seeNewMandate.uploadDocument.successMessage",
          defaultMessage: "Document uploaded successfully "
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

export const urlForDownloadForInvestor = (investorId, pdf) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      // dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(
        `/investor/${investorId}/investor_document_download/?fileName=${pdf}`,
        "get"
      );

      // Set loading to false after successfully fetching the data
      // dispatch(seeNewMandateActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getInvestorDocument = investorId => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      // dispatch(investorProfileStepperAction.setLoading(true));
      const res = await sendRequest(`/investor/${investorId}/investor_all_documents`, "get");
      //   const count = await sendRequest(`/investor/new_startups_count`, "get");
      dispatch(
        investorProfileStepperAction.fetchDocuments({
          documents: res
        })
      );
      // Set loading to false after successfully fetching the data
      // dispatch(investorProfileStepperAction.setLoading(false));
      return res;
    } catch (err) {
      // Set loading to false after successfully fetching the data
      // dispatch(investorProfileStepperAction.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const getFundType = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/investor/fund_type_check`, "get");
      dispatch(
        investorProfileStepperAction.fetchFundType({
          fundType: res.data
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getFundTicket = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/investor/fund_ticket_check`, "get");
      dispatch(
        investorProfileStepperAction.fetchFundTicket({
          fundTicket: res.data
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getInvestorSector = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/investor/investment_sector_all`, "get");
      dispatch(
        investorProfileStepperAction.fetchInvestorSector({
          investorSector: res.data
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getStartupStageType = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/investor/startup_stage_all`, "get");
      dispatch(
        investorProfileStepperAction.fetchStageType({
          stageType: res.data
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const getRevenueStageType = () => {
  return async dispatch => {
    try {
      const res = await sendRequest(`/revenue_status_all`, "get");
      dispatch(
        investorProfileStepperAction.fetchPreRevenueType({
          preRevenueStageType: res.data
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
