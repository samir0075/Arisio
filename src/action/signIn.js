import { toast } from "react-toastify";
import { signInActions } from "../store/signInSlice";
import { sendRequest } from "src/utils/request";

export const captchVerification = (captcha) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest("/assessment", "post", captcha);
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
      return err?.response?.data?.message;
    }
  };
};

export const userSignIn = (userData) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest("/login", "post", userData);

      if (res?.token) {
        localStorage.setItem("userDetails", JSON.stringify(res));
        localStorage.setItem("token", res?.token);
        localStorage.setItem("permissions", res?.permissions);
        dispatch(
          signInActions.fetchUserDetails({
            signInData: res,
          })
        );
      } else {
        toast.error(res?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

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

      return err?.response?.data?.message;
    }
  };
};

export const userEmailVerification = (verificationToken) => {
  return async () => {
    try {
      const res = await sendRequest(`/emailVerification/${verificationToken}`, "get");
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
      return err?.response?.data?.message;
    }
  };
};
export const userSignUp = (userData, user) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest("/signup", "post", userData);
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
      return err?.response?.data?.message;
    }
  };
};

export const LinkedInSignIn = (code) => {
  console.log("inaction code", code);
  return async (dispatch) => {
    try {
      const res = await sendRequest(`startup/linkedin/callback?code=${code}`, "get");
      console.log("resp in actionfile", res);
      if (res?.role === "ENTREPRENEUR") {
        localStorage.setItem("userDetails", JSON.stringify(res));
        localStorage.setItem("token", res?.token);
        localStorage.setItem("permissions", res?.permissions);
        dispatch(
          signInActions.fetchUserDetails({
            signInData: res,
          })
        );
      } else {
        toast.error(res?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      return res;
    } catch (err) {
      // const errorMessage = err?.response?.data || "Something went Wrong";
      // toast.error(errorMessage, {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      console.log(err);
      return err?.response?.data?.message;
    }
  };
};

export const getUserProfile = (startupId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/startup/${startupId}/check_profile_update`, "get");

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const getInvestorProfileCheck = (investorId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/investor/${investorId}/check_investor_profile_update`, "get");

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const forgetPassword = (emailId) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/forgot_password`, "post", { emailId });
      // dispatch(fetchUserProfileDetails());
      return res;
    } catch (err) {
      return err?.response?.data;
    }
  };
};

export const validateToken = (verificationToken) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/validate_forgot_password_token/${verificationToken}`, "get");
      // dispatch(fetchUserProfileDetails());
      return res;
    } catch (err) {
      return err?.response?.data;
    }
  };
};

export const createForgetPassword = (token, password) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/generate_password/${token}`, "post", {
        password,
      });

      toast.success("Password Successfully Changed", {
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
      return err?.response?.data;
    }
  };
};
