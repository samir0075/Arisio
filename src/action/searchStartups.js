import { searchStartUpsActions } from "src/store/searchStartupsSlice";
import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";

export const getStartUpsData = (keywords, countryName, investorId) => {
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  const id = userDetails?.id;
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(searchStartUpsActions.setLoading(true));
      const res = await sendRequest(
        `/${role === "ADMINISTRATOR" ? "admin" : "investor"}/${
          role === "ADMINISTRATOR" ? id : investorId
        }/competition_by_idea/${keywords}/${countryName}`,
        "get"
      );
      dispatch(
        searchStartUpsActions.fetchSearchStartups({
          startUpsData: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(false));
      return res;
    } catch (err) {
      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(false));
      toast.warning(err?.response?.data?.message, {
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

export const getStartUpsCount = (investorId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/${investorId}/cruchbase/startups/count`, "get");
      dispatch(
        searchStartUpsActions.fetchStartupsCount({
          startUpsCount: res,
        })
      );
      return res;
    } catch (err) {
      toast.warning(err?.response?.data?.message, {
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

export const getStartUpsDataByName = (inputData, investorId) => {
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  const id = userDetails?.id;
  return async (dispatch) => {
    try {
      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(true));
      const res = await sendRequest(
        `/${role === "ADMINISTRATOR" ? "admin" : "investor"}/${
          role === "ADMINISTRATOR" ? id : investorId
        }/companyLike/${inputData}`,
        "get"
      );
      dispatch(
        searchStartUpsActions.fetchSearchByNameStartups({
          startUpsByNameData: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(false));
      return res;
    } catch (err) {
      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(false));
      toast.warning(err?.response?.data?.message, {
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

export const sendMailToStartUpWithMandates = (role, startUpId, mandatesIds, id) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/${role}/${id}/recomended/mandates/${startUpId}`,
        "post",
        mandatesIds
      );
      dispatch(
        searchStartUpsActions.fetchResponseOfSendingMandates({
          emailData: res,
        })
      );

      return res;
    } catch (err) {
      toast.warning(err?.response?.data?.message, {
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

export const getSelectedStartUpsData = (inputDataId, investorId) => {
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  const id = userDetails?.id;
  return async (dispatch) => {
    try {
      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(true));
      const res = await sendRequest(
        `/${role === "ADMINISTRATOR" ? "admin" : "investor"}/${
          role === "ADMINISTRATOR" ? id : investorId
        }/competition_by_ids/${inputDataId}`,
        "get"
      );

      dispatch(
        searchStartUpsActions.fetchSelectedStartUpsData({
          selectedStartUpsByName: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(false));
      return res;
    } catch (err) {
      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(false));
      toast.warning(err?.response?.data?.message, {
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

export const getSelectedStartUpsMandatesData = (startUpId, userId) => {
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/${
          role === "ADMINISTRATOR" ? "admin" : "investor"
        }/${userId}/dropdown/mandates/${startUpId}`,
        "get"
      );
      dispatch(
        searchStartUpsActions.fetchSelectedStartUpMandates({
          listOfSelectedStartUpMandates: res,
        })
      );
      return res;
    } catch (err) {
      toast.warning(err?.response?.data?.message, {
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
let errorShown = false; // Persistent flag
export const getDataByCompaniesFilter = (inputData, pageNo, investorId) => {
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  const id = userDetails?.id;
  return async (dispatch) => {
    try {
      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(true));

      const count = await sendRequest(
        `/${role === "ADMINISTRATOR" ? "admin" : "investor"}/${
          role === "ADMINISTRATOR" ? id : investorId
        }/company_count_filter`,
        "post",
        inputData
      );

      const res = await sendRequest(
        `/${role === "ADMINISTRATOR" ? "admin" : "investor"}/${
          role === "ADMINISTRATOR" ? id : investorId
        }/company_filter/${pageNo}`,
        "post",
        inputData
      );

      dispatch(
        searchStartUpsActions.fetchDataByCompaniesFilter({
          companiesByFilter: { count: count, data: res },
        })
      );

      // Set loading to false after successfully fetching the data
      dispatch(searchStartUpsActions.setLoading(false));
      return res;
    } catch (err) {
      console.log(err);
      if (!errorShown) {
        errorShown = true;
        // Set loading to false after successfully fetching the data

        toast.warning(err?.response?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          errorShown = false; // Reset after a certain time
        }, 1000); // 1 seconds in this case
      }
      dispatch(searchStartUpsActions.setLoading(false));
      return err?.response?.data?.message;
    }
  };
};

export const getFullDescriptionOfStartUp = (startUpsId, investorId) => {
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;

  const id = userDetails?.id;
  return async (dispatch) => {
    try {
      // Set loading to false after successfully fetching the data
      // dispatch(searchStartUpsActions.setLoading(true));
      const res = await sendRequest(
        `/${role === "ADMINISTRATOR" ? "admin" : "investor"}/${
          role === "ADMINISTRATOR" ? id : investorId
        }/fundedCompany/${startUpsId}`,
        "get"
      );
      dispatch(
        searchStartUpsActions.fetchFullDescriptionOfStartUp({
          singleStartUpData: res,
        })
      );
      // Set loading to false after successfully fetching the data
      // dispatch(searchStartUpsActions.setLoading(false));
      return res;
    } catch (err) {
      // Set loading to false after successfully fetching the data
      // dispatch(searchStartUpsActions.setLoading(false));
      if (err?.response?.status === 403) {
        toast.warning(err?.response?.data?.message || "Something went wrong", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(
          err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            "Something went wrong",
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
      }
      return;
    }
  };
};

export const getUserCsvDownloadReport = (data, type) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request

      const res = await sendRequest(`${type}/export_company_data`, "post", data);
      return res;
    } catch (err) {
      return err;
    }
  };
};

export const getUserCsvDownloadReportwithKeywords = (filters, type) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request

      const res = await sendRequest(
        `${type}/csv_by_idea/${filters?.keywords}/${filters?.countryName}`,
        "get"
      );
      return res;
    } catch (err) {
      return err;
    }
  };
};

export const getEmployeeHistoryGraph = (companyId, userRole) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/${userRole}/${companyId}/get_emp_history`, "get");
      //   console.log("res", res);
      dispatch(
        searchStartUpsActions.fetchEmployeeCountHistoryGraph({
          employeeCountHistory: res,
        })
      );
      return res;
    } catch (err) {
      toast.error(err?.response?.data?.message?.toString(), {
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
export const getPieChartGraph = (companyId, userRole) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/${userRole}/${companyId}/get_funding_piechart`, "get");
      //   console.log("res", res);
      dispatch(
        searchStartUpsActions.fetchPieChartGraph({
          pieChartGraph: res,
        })
      );
      return res;
    } catch (err) {
      toast.error(err?.response?.data?.message?.toString(), {
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
export const getCompanyFundedHistoryGraph = (companyId, userRole) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/${userRole}/${companyId}/get_funded_history`, "get");
      //   console.log("res", res);
      dispatch(
        searchStartUpsActions.fetchCompanyFundHistoryGraph({
          employeeCompanyFundHistory: res,
        })
      );
      return res;
    } catch (err) {
      toast.error(err?.response?.data?.message?.toString(), {
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

export const searchStartupFilterDataClean = (data) => {
  return async (dispatch) => {
    try {
      // Set loading to false after successfully fetching the data
      dispatch(
        searchStartUpsActions.fetchDataByCompaniesFilter({
          companiesByFilter: data,
        })
      );
      dispatch(
        searchStartUpsActions.fetchSearchStartups({
          startUpsData: [],
        })
      );
      dispatch(
        searchStartUpsActions.fetchSelectedStartUpsData({
          selectedStartUpsByName: [],
        })
      );

      dispatch(
        searchStartUpsActions.setFiltersData({
          filtersData: {},
        })
      );
      // Set loading to false after successfully fetching the data
      return;
    } catch (err) {
      console.log(err);
    }
  };
};
