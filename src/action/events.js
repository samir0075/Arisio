import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";
import { myEventsActions } from "src/store/eventsSlice";

export const myEventsFetch = url => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(myEventsActions.setMyEventsLoading(true));

      const res = await sendRequest(`${url}`, "get");
      dispatch(
        myEventsActions.fetchMyEvents({
          myEvents: res
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(myEventsActions.setMyEventsLoading(false));
      return res;
    } catch (err) {
      dispatch(myEventsActions.setMyEventsLoading(false));
      return err?.response?.data?.message;
    }
  };
};

export const addMyEvents = (role, addEventData, message) => {
  return async dispatch => {
    try {
      const res = await sendRequest(`${role}/add_event`, "post", addEventData);
      // dispatch(myEventsFetch());
      toast.success(<div>{message}</div>, {
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
      console.log(err);
      // const error = err?.response?.data?.message?.toString() || "Something went Wrong";
      // toast.error(error, {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined
      // });
      if (err.response.status === 403) {
        toast.warning(err?.response?.data?.message || "Something went wrong", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
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
            progress: undefined
          }
        );
      }
    }
  };
};

export const updateMyEvents = (role, eventId, updateEventData, message) => {
  return async dispatch => {
    try {
      const res = await sendRequest(`${role}/event/${eventId}`, "put", updateEventData);
      toast.success(<div>{message}</div>, {
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
      console.log(err);
      // const error = err?.response?.data?.message?.toString() || "Something went Wrong";
      // toast.error(error, {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined
      // });
      if (err.response.status === 403) {
        toast.warning(err?.response?.data?.message || "Something went wrong", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
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
            progress: undefined
          }
        );
      }
      return err?.response?.data?.message;
    }
  };
};

export const myEventDetail = url => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      dispatch(myEventsActions.setLoading(true));
      const res = await sendRequest(`${url}`, "get");

      dispatch(
        myEventsActions.fetchSelectedEvent({
          selectedEvent: res
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(myEventsActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(myEventsActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};

export const approveOrRejectTheEvent = (selectedEventId, eventStatus, remark) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      const res = await sendRequest(
        `admin/change_event/${selectedEventId}/${eventStatus}`,
        "patch",
        {
          reason: remark
        }
      );
      toast.success(<div>{res?.message}</div>, {
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
      dispatch(myEventsActions.setLoading(true));
      toast.error(<div>{err?.response?.data?.message}</div>, {
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

export const deleteMyEvent = (role, eventId, url) => {
  return async dispatch => {
    try {
      const res = await sendRequest(`${role}/delete_event/${eventId}`, "delete");
      // dispatch(myEventsFetch(url));
      toast.success(<div>{res?.message}</div>, {
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

export const uploadEventsImage = (role, formData) => {
  return async dispatch => {
    try {
      // Set loading to true before making the request
      // dispatch(myEventsActions.setLoading(true));
      const res = await sendRequest(`${role}/uploadEventImage`, "post", formData, "pdf");
      // Set loading to false after successfully fetching the data
      // dispatch(myEventsActions.setLoading(false));
      toast.success("Events picture is uploaded successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      dispatch(
        myEventsActions.fetchImageEvents({
          eventsImage: res
        })
      );
      return res;
    } catch (err) {
      // Set loading to false after successfully fetching the data
      return err?.response?.data?.message;
    }
  };
};
