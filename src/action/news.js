import { myNewsActions } from "src/store/newsSlice";
import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";

export const myNewsFetch = (role, page, value, country, newsType, debouncedQuery) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(myNewsActions.setMyAllNewsLoading(true));
      // const res = await sendRequest(`${url}`, "get");
      const res = await sendRequest(
        `${role}/news_list/${page}?newstype=${value}&country=${country}&category=${newsType}&newsTitle=${debouncedQuery}`,
        "get"
      );

      dispatch(
        myNewsActions.fetchMyNews({
          myNews: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(myNewsActions.setMyAllNewsLoading(false));
      return res;
    } catch (err) {
      console.log(err);
      dispatch(myNewsActions.setMyAllNewsLoading(false));
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

export const adminNewsFetch = (status, page, value, country, newsType, debouncedQuery) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(myNewsActions.setMyAllNewsLoading(true));
      // const res = await sendRequest(`${url}`, "get");
      const res = await sendRequest(
        `admin/news_list/${page}?listType=${status}&newstype=${value}&country=${country}&category=${newsType}&newsTitle=${debouncedQuery}`,
        "get"
      );

      dispatch(
        myNewsActions.fetchMyNews({
          myNews: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(myNewsActions.setMyAllNewsLoading(false));
      return res;
    } catch (err) {
      console.log(err);
      dispatch(myNewsActions.setMyAllNewsLoading(false));
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
export const myAllNewsFetch = (role, page, value, country, newsType, debouncedQuery) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(myNewsActions.setMyAllNewsLoading(true));

      // async () => {
      // const res = await sendRequest(`${url}`, "get");
      const res = await sendRequest(
        `${role}/news_list/${page}?newstype=${value}&country=${country}&category=${newsType}&newsTitle=${debouncedQuery}`,
        "get"
      );

      dispatch(
        myNewsActions.fetchMyAllNews({
          myAllNews: res,
        })
      );
      dispatch(myNewsActions.setMyAllNewsLoading(false));
      // };
      // Set loading to false after successfully fetching the data

      return res;
    } catch (err) {
      dispatch(myNewsActions.setMyAllNewsLoading(false));
      console.log(err);
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

export const adminAllNewsFetch = (status, page, value, country, newsType, debouncedQuery) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(myNewsActions.setMyAllNewsLoading(true));

      // async () => {
      // const res = await sendRequest(`${url}`, "get");
      const res = await sendRequest(
        `admin/news_list/${page}?listType=${status}&newstype=${value}&country=${country}&category=${newsType}&newsTitle=${debouncedQuery}`,
        "get"
      );
      dispatch(
        myNewsActions.fetchMyAllNews({
          myAllNews: res,
        })
      );
      // };
      // Set loading to false after successfully fetching the data
      dispatch(myNewsActions.setMyAllNewsLoading(false));
      return res;
    } catch (err) {
      dispatch(myNewsActions.setMyAllNewsLoading(false));
      console.log(err);
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
export const myNewsType = (url) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/news_types`, "get");
      //   console.log("res", res);
      dispatch(
        myNewsActions.fetchMyNewsType({
          myNewsType: res,
        })
      );
      return res;
    } catch (err) {
      toast.error(err?.response?.data?.message.toString(), {
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

let errorShown = false;
export const addMyNews = (url, addNewsData, message) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`${url}`, "post", addNewsData);
      dispatch(myNewsActions.setLoading(false));
      // dispatch(myNewsFetch(userID));
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
      // if (!errorShown) {
      //   errorShown = true;
      //   // Set loading to false after successfully fetching the data

      //   toast.error(err?.response?.data?.message, {
      //     position: "top-right",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined
      //   });
      //   setTimeout(() => {
      //     errorShown = false; // Reset after a certain time
      //   }, 1000); // 1 seconds in this case
      // }
      if (err.response.status === 403) {
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
    }
  };
};

export const updateMyNews = (url, addNewsData, message) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`${url}`, "put", addNewsData);
      dispatch(myNewsActions.setLoading(false));
      toast.success(res?.message.toString(), {
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
      // if (!errorShown) {
      //   errorShown = true;
      //   // Set loading to false after successfully fetching the data

      //   toast.warning(err?.response?.data?.message, {
      //     position: "top-right",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined
      //   });
      //   setTimeout(() => {
      //     errorShown = false; // Reset after a certain time
      //   }, 1000); // 1 seconds in this case
      // }
      if (err.response.status === 403) {
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
      return err?.response?.data?.message;
    }
  };
};
export const deleteMyNews = (url, message) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`${url}`, "delete");

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
export const uploadNewsImage = (userRole, formData) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request

      dispatch(myNewsActions.setLoading(true));
      const res = await sendRequest(`${userRole}/uploadnewsImage`, "post", formData, "pdf");
      // Set loading to false after successfully fetching the data
      dispatch(myNewsActions.setLoading(false));
      toast.success("News picture is uploaded successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(
        myNewsActions.fetchImageNews({
          newsImage: res,
        })
      );

      return res;
    } catch (err) {
      // Set loading to false after successfully fetching the data
      dispatch(myNewsActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
export const myNewsDetail = (newsId) => {
  return async (dispatch) => {
    try {
      // Set loading to true before making the request
      dispatch(myNewsActions.setLoading(true));
      const res = await sendRequest(`website/newsoverview/${newsId}`, "get");

      dispatch(
        myNewsActions.fetchSelectedNews({
          selectedMyNews: res,
        })
      );
      // Set loading to false after successfully fetching the data
      dispatch(myNewsActions.setLoading(false));
      return res;
    } catch (err) {
      dispatch(myNewsActions.setLoading(true));
      return err?.response?.data?.message;
    }
  };
};
