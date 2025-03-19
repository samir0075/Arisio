import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaymentTransactionDetails } from "src/action/payment";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import ExternalContainer from "src/components/ExternalContainer";
import { getPricingDetails } from "src/action/globalApi";
import Payment from "./pricing";
import AfterPayment from "./AfterPayment";

const Page = () => {
  const dispatch = useDispatch();

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;

  useEffect(() => {
    dispatch(getPricingDetails());

    if (role === "ENTREPRENEUR") {
      dispatch(PaymentTransactionDetails("startup"));
    } else {
      dispatch(PaymentTransactionDetails("investor"));
    }
  }, [dispatch, role]);

  const pricingDetails = useSelector((state) => state.globalApi.pricingPoints);
  const userTransactionHistory = useSelector((state) => {
    return state.payment.skipCashTransaction;
  });

  return (
    <>
      {/* {userTransactionHistory?.status === false ? (
        <Payment />
      ) : ( */}
      <AfterPayment pricingDetails={pricingDetails?.data} />
      {/* )} */}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
