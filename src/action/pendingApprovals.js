import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";
import { pendingApprovalsActions } from "src/store/pendingApprovalsSlice";

export const pendingApprovalCount = (adminId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`admin/${adminId}/pending_approval_events_count`, "get");

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const seeMandates = (adminId, page, technology, country, date) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(pendingApprovalsActions.setLoading(true));

      const res = await sendRequest(
        `admin/${adminId}/events_per_page/${page}?technology=${
          technology ? technology : ""
        }&country=${country ? country : ""}&startDate=${date ? date : ""}`,
        "get"
      );
      dispatch(
        pendingApprovalsActions.fetchNewMandates({
          mandates: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(pendingApprovalsActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(pendingApprovalsActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const previewMandate = (adminId, selectedMandateId) => {
  return async (dispatch) => {
    try {
      // dispatch(pendingApprovalsActions.setLoading(true));
      const res = await sendRequest(`admin/${adminId}/events/${selectedMandateId}`, "get");
      dispatch(
        pendingApprovalsActions.fetchSelectedMandates({
          selectedMandate: res,
        })
      );
      // dispatch(pendingApprovalsActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(pendingApprovalsActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const previewMandateQuestion = (selectedMandateId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`admin/event_questions/${selectedMandateId}`, "get");
      dispatch(
        pendingApprovalsActions.fetchQuestion({
          selectedQuestion: res,
        })
      );

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const approveMandate = (adminId, selectedMandateId, page) => {
  return async (dispatch) => {
    try {
      // dispatch(pendingApprovalsActions.setLoading(true));
      const res = await sendRequest(`admin/${adminId}/approve_event/${selectedMandateId}`, "get");

      if (res?.status === true) {
        toast.success(res?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      dispatch(seeMandates(adminId, page));
      // dispatch(pendingApprovalsActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(pendingApprovalsActions.setLoading(true));

      toast.error(err?.message, {
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

export const rejectMandate = (adminId, selectedMandateId, page, reason) => {
  return async (dispatch) => {
    try {
      // dispatch(pendingApprovalsActions.setLoading(true));
      const res = await sendRequest(
        `admin/${adminId}/reject_event/${selectedMandateId}`,
        "post",
        reason
      );
      if (res?.status === true) {
        toast.success(res?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      console.log(adminId, page);
      dispatch(seeMandates(adminId, page));
      // dispatch(pendingApprovalsActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(pendingApprovalsActions.setLoading(true));
      toast.error(err?.message, {
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

export const getPendingStartups = (page, country, date, debouncedQuery) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(pendingApprovalsActions.setLoading(true));

      const res = await sendRequest(
        `admin/users_list/${page}?user=startup&country=${country}&RegisterTime=${date}&name=${debouncedQuery}`,
        "get"
      );
      dispatch(
        pendingApprovalsActions.fetchPendingStartups({
          startups: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(pendingApprovalsActions.setLoading(false));
      dispatch(pendingApprovalsActions.setSearchLoading(false));

      return res;
    } catch (err) {
      dispatch(pendingApprovalsActions.setLoading(false));
      dispatch(pendingApprovalsActions.setSearchLoading(false));

      return err?.response?.data?.message;
    }
  };
};

export const getPendingInvestors = (page, country, date, debouncedQuery) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(pendingApprovalsActions.setLoading(true));

      const res = await sendRequest(
        `admin/users_list/${page}?user=investor&country=${country}&RegisterTime=${date}&name=${debouncedQuery}`,
        "get"
      );
      dispatch(
        pendingApprovalsActions.fetchPendingInvestors({
          investors: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(pendingApprovalsActions.setLoading(false));
      dispatch(pendingApprovalsActions.setSearchLoading(false));

      return res;
    } catch (err) {
      dispatch(pendingApprovalsActions.setLoading(true));
      dispatch(pendingApprovalsActions.setSearchLoading(false));

      return err?.response?.data?.message;
    }
  };
};

export const getPendingUserDetails = (userId) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      // dispatch(pendingApprovalsActions.setLoading(true));

      const res = await sendRequest(`admin/user_overview/${userId}`, "get");
      dispatch(
        pendingApprovalsActions.fetchPendingUserDetails({
          userDetails: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(pendingApprovalsActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(pendingApprovalsActions.setLoading(false));
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  };
};
export const getApprovalOrRejection = (adminId, userId, status, body) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      // dispatch(pendingApprovalsActions.setLoading(true));

      const res = await sendRequest(
        `admin/${adminId}/change_user_status/${userId}/${status}`,
        "post",
        body
      );

      toast.success(res?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Set loading to false after successfully fetching the data
      // dispatch(pendingApprovalsActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(pendingApprovalsActions.setLoading(true));
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

export const getDashboardCounts = (page) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(pendingApprovalsActions.setDashboardaCountsLoading(true));

      const res = await sendRequest(`admin/dashboard_counts`, "get");
      dispatch(
        pendingApprovalsActions.fetchDashboardCounts({
          dashboardCounts: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(pendingApprovalsActions.setDashboardaCountsLoading(false));
      return res;
    } catch (err) {
      dispatch(pendingApprovalsActions.setDashboardaCountsLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const documentsDownloadForStartup = (userId, pdf) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      // dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(`/admin/${userId}/startup_doc_download?fileName=${pdf}`, "get");

      // Set loading to false after successfully fetching the data
      // dispatch(seeNewMandateActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(seeNewMandateActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const documentsDownloadForInvestor = (userId, pdf) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      // dispatch(seeNewMandateActions.setLoading(true));

      const res = await sendRequest(
        `/admin/${userId}/investor_doc_download?fileName=${pdf}`,
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

export const getApprovalOrRejectionNews = (newsId, status, body) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      // dispatch(pendingApprovalsActions.setLoading(true));

      const res = await sendRequest(`admin/change_news_status/${newsId}/${status}`, "patch", body);

      toast.success(res?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Set loading to false after successfully fetching the data
      // dispatch(pendingApprovalsActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(pendingApprovalsActions.setLoading(true));
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

export const getUserCsvDownload = (userType, country, selectedDate) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(pendingApprovalsActions.setLoading(true));

      const res = await sendRequest(
        `admin/export_users?RegisterTime=${selectedDate}&usertype=${userType}&country=${country}`,
        "get"
      );
      // dispatch(
      //   pendingApprovalsActions.fetchPendingStartups({
      //     startups: res,
      //   })
      // );
      // Set loading to false after successfully fetching the data
      // dispatch(pendingApprovalsActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(pendingApprovalsActions.setLoading(true));
      return;
    }
  };
};
export const getUserCsvDownloadMandate = (country, technology, date) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(pendingApprovalsActions.setLoading(true));

      const res = await sendRequest(
        `admin/export_csv_mandate?country=${country}&technology=${technology}&startDate=${date}`,
        "get"
      );
      // dispatch(
      //   pendingApprovalsActions.fetchPendingStartups({
      //     startups: res,
      //   })
      // );
      // Set loading to false after successfully fetching the data
      // dispatch(pendingApprovalsActions.setLoading(false));
      return res;
    } catch (err) {
      // dispatch(pendingApprovalsActions.setLoading(true));
      return;
    }
  };
};

export const getAuditLogs = (page, userName) => {
  return async (dispatch) => {
    try {
      dispatch(pendingApprovalsActions.setLoading(true));

      const res = await sendRequest(`/admin/get_audit_log/${page}?userName=${userName}`, "get");
      dispatch(
        pendingApprovalsActions.fetchAuditLogs({
          auditLogs: res,
        })
      );
      dispatch(pendingApprovalsActions.setSearchLoading(false));
      dispatch(pendingApprovalsActions.setLoading(false));

      return res;
    } catch (err) {
      dispatch(pendingApprovalsActions.setSearchLoading(false));
      dispatch(pendingApprovalsActions.setLoading(false));

      console.log(err);

      toast.error(err?.response?.data?.msg, {
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

export const getSubscriptionData = (page, searchName, planType, userType) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(pendingApprovalsActions.setLoading(true));
      const res = await sendRequest(
        `/admin/subscription_list/${page}?name=${searchName}&plan=${planType}&usertype=${userType}`,
        "get"
      );
      // console.log(res);
      dispatch(
        pendingApprovalsActions.fetchSubscriptionData({
          data: res,
        })
      );
      dispatch(pendingApprovalsActions.setSearchLoading(false));
      dispatch(pendingApprovalsActions.setLoading(false));

      return res;
    } catch (err) {
      dispatch(pendingApprovalsActions.setSearchLoading(false));
      dispatch(pendingApprovalsActions.setLoading(false));

      const error = err?.response?.data?.msg || err?.response?.data?.message;

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

export const getSubscriptionCounts = () => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(pendingApprovalsActions.setAdminSubscriptionPlancountLoading(true));

      const res = await sendRequest(`/admin/plan_counts`, "get");
      dispatch(
        pendingApprovalsActions.setAdminSubscriptionPlanCounts({
          subscriptionPlanCount: res,
        })
      );
      dispatch(pendingApprovalsActions.setAdminSubscriptionPlancountLoading(false));
      return res;
    } catch (err) {
      console.log(err);
      dispatch(pendingApprovalsActions.setAdminSubscriptionPlancountLoading(false));

      toast.error(err?.response?.data?.msg, {
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
