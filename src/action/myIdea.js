import { myIdeaActions } from "src/store/myIdeaSlice";
import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";

let errorShown = false;
export const myIdea = (keywords, label) => {
  return async (dispatch) => {
    try {
      dispatch(myIdeaActions.setLoading(true));
      const res = await sendRequest(`startup/ideaInfo/%20${keywords.join("%20")}/${label}`, "get");
      console.log("ressss", res);
      dispatch(
        myIdeaActions.fetchNewMyIdea({
          myIdea: res,
        })
      );
      dispatch(myIdeaActions.setLoading(false));
      return res;
    } catch (err) {
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

      dispatch(myIdeaActions.setLoading(false));
      return err?.response?.data?.message;
    }
  };
};

export const limitDecreaseIdeaSearch = () => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/startup/limit_decrease/startups`, "get");
      return res;
    } catch (err) {
      return err?.response?.data;
    }
  };
};
