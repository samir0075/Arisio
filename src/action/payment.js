import { toast } from "react-toastify";
import { paymentActions } from "src/store/paymentSlice";
import { sendRequest } from "src/utils/request";

export const PaymentTransactionDetails = (role) => {
  return async (dispatch) => {
    try {
      dispatch(paymentActions.fetchPricingStatus(true));
      const res = await sendRequest(`${role}/Skipcashtransactions`, "get");
      if (res?.status === false) {
        dispatch(
          paymentActions.fetchSkipCashTransaction({
            skipCashTransaction: res,
          })
        );
      } else {
        dispatch(
          paymentActions.fetchSkipCashTransaction({
            skipCashTransaction: res.data,
          })
        );
      }

      dispatch(paymentActions.fetchPricingStatus(false));
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
export const checkPaymentStatus = (custom1, body) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`${custom1}/paymentStatus`, "post", body);

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const applyCouponCode = (role, discountCode, id) => {
  console.log(role);
  return async (dispatch) => {
    try {
      if (role === "INVESTOR") {
        const res = await sendRequest(`investor/validate_checkout_coupon`, "post", {
          couponCode: discountCode,
          planId: id,
        });
        if (res?.success === false) {
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
      } else if (role === "ENTREPRENEUR") {
        const res = await sendRequest(`startup/validate_checkout_coupon`, "post", {
          couponCode: discountCode,
          planId: id,
        });
        if (res?.success === false) {
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
      }
    } catch (err) {
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

// export const cancelSubscription = (role, id) => {
//   console.log(id);
//   return async () => {
//     try {
//       const res = await sendRequest(`${role}/cancelSubscription`, "post", {
//         id,
//       });

//       console.log(res);
//       return res;
//     } catch (err) {
//       return err?.response?.data?.message;
//     }
//   };
// };

export const getActivePlan = (role) => {
  return async (dispatch) => {
    try {
      if (role === "ENTREPRENEUR") {
        const res = await sendRequest(`startup/checkUserPlan`, "get");
        dispatch(paymentActions.fetchUserActivePlan({ activePlan: res }));
        //  return res;
      } else if (role === "INVESTOR") {
        const res = await sendRequest(`investor/checkUserPlan`, "get");
        dispatch(paymentActions.fetchUserActivePlan({ activePlan: res }));

        // return res;
      }
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
