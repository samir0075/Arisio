import { toast } from "react-toastify";
import { startupActions } from "src/store/startupSlice";
import { sendRequest } from "src/utils/request";

export const startup = (adminUserId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/admin/${adminUserId}/companyLike/com`, "get");
      dispatch(
        startupActions.fetchNewStartups({
          startups: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const addStartup = (adminUserId, startupData) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `admin/save_company/${adminUserId}`,
        "post",
        startupData,
        "pdf"
      );
      dispatch(startup(adminUserId));
      toast.success("Startup Created Successfully", {
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
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return err;
    }
  };
};

export const uploadDocument = (formData, adminUserId) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(startupActions.setLoading(true));

      const res = await sendRequest(
        `admin/${adminUserId}/upload_startup_csv`,
        "post",
        formData,
        "pdf"
      );

      dispatch(startup(adminUserId));
      toast.success("Bulk Data Upload Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Set loading to false after successfully fetching the data
      dispatch(startupActions.setLoading(false));
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
        progress: undefined,
      });
      dispatch(startupActions.setLoading(false));
      return err?.response?.data?.message;
    }
  };
};
