import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { individualAction } from "src/store/individualSlice";
import { sendRequest } from "src/utils/request";

export const getIndividualProfileDetails = individualId => {
  return async dispatch => {
    try {
      const res = await sendRequest(`individual/${individualId}/individual_profile`, "get");
      dispatch(
        individualAction.fetchIndividualProfileDetails({
          profileDetails: res
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const updateIndividualProfileDetails = (individualId, updateData) => {
  return async dispatch => {
    try {
      const res = await sendRequest(
        `individual/${individualId}/individual_profile_update`,
        "post",
        updateData
      );

      if (res?.success) {
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
    } catch (err) {
      console.log(err);
      dispatch(getIndividualProfileDetails(individualId));
      const error = err?.response?.data?.error?.msg || "Something went wrong";
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

export const updateIndividualProfileImage = (individualId, formData) => {
  return async dispatch => {
    try {
      const res = await sendRequest(
        `individual/${individualId}/upload_profile_image`,
        "post",
        formData,
        "pdf"
      );
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
      toast.error("Something went wrong Please try Again", {
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
