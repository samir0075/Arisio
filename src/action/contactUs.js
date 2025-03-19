import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";

export const addContactUsForm = (addContactUsData, message) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/website/saveContacts`, "post", addContactUsData);
      //   dispatch(contactUs());
      toast.success(<div>{message}</div>, {
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
