import { myUpdateActions } from "src/store/myUpdatesSlice";
import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";

export const myUpdate = (startupId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`startup/${startupId}/updates`, "get");
      console.log("res", res);
      dispatch(
        myUpdateActions.fetchNewMyUpdates({
          myUpdates: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const addMyUpdate = (startupId, addUpdateData, message) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/startup/save_update/${startupId}`, "post", addUpdateData);
      dispatch(myUpdate(startupId));
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
export const deleteMyUpdates = (selectedUpdate, startupId, message) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/startup/${selectedUpdate}/disable_update`, "get");

      dispatch(myUpdate(startupId));
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

// export const deleteMyUpdates = (selectedUpdate) => {
//   console.log("selectedUpdateAction", selectedUpdate);
//   return (dispatch) => {
//     sendRequest(`/startup/${selectedUpdate}/disable_update`, "get")
//       .then((res) => {
//         toast.success("Update Deleted Successfully", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//         dispatch(myUpdate());
//       })
//       .catch((err) => {
//         toast.error("Update Deletion Failed", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//       });
//   };
// };
