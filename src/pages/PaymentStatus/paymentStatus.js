import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "src/action/globalApi";
import { checkPaymentStatus } from "src/action/payment";

const PaymentStatus = () => {
  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");

  const router = useRouter();

  const { id, statusId, status, transId, custom1 } = router.query;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLocation());
  }, [dispatch]);

  const UserCountry = useSelector((state) => state.globalApi.location);

  useEffect(() => {
    if (Object.keys(UserCountry).length > 0) {
      const body = {
        transactionId: transId,
        statusId: statusId,
        timezone: UserCountry?.timezone,
      };
      dispatch(checkPaymentStatus(custom1, body));
    }
  }, [UserCountry, UserCountry?.timezone, custom1, dispatch, statusId, transId]);
  useEffect(() => {
    if (transId && status && statusId && custom1) {
      const timer = setTimeout(() => {
        setMessage(transId);
      }, 2000);

      const timer1 = setTimeout(() => {
        if (status === "Paid") setMessage1("Payment successful !");
        else setMessage1("Payment is failed!");
      }, 2000);
      const timer2 = setTimeout(() => {
        if (status === "Paid") setMessage2("Your payment request is completed");
        else setMessage2("Sorry! Your payment request is failed!");
      }, 2500);
      const timer3 = setTimeout(() => {
        setMessage3("Please wait while we redirect you. Do not refresh the page or go back.");
      }, 3000);

      const timer4 = setTimeout(() => {
        router.push("/PricingSubscription");
      }, 9000);

      return () => {
        clearTimeout(timer);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else {
      return;
    }
  }, [transId, status, router, statusId, dispatch, custom1]);

  return (
    <Box
      sx={{
        // backgroundColor: status === "Paid" ? "#62b4c6" : "#ff4957",
        // backgroundColor: "#62b4c6",
        backgroundColor: "rgba(65, 148, 179, 0.1)",
        height: "100vh",
        textAlign: "center",
        paddingTop: "3%",
      }}
    >
      <img
        src={status === "Paid" ? "/Images/Sucessfull.gif" : "/Images/cancel.gif"}
        alt=""
        style={{
          padding: "0",
          margin: "auto",
          width: status === "Paid" ? "14%" : "15%",
          objectFit: "cover",
        }}
      />
      <Box>
        <Typography>{message}</Typography>{" "}
      </Box>
      <hr style={{ width: "30%" }} />
      <Box>
        <Typography style={{ fontSize: "43px", marginTop: "-10px" }}>{message1}</Typography>
        <Typography style={{ fontSize: "20px", marginTop: "5px" }}>{message2}</Typography>
      </Box>
      <Typography sx={{ fontSize: "13px", marginTop: "2%", color: "red" }}>{message3}</Typography>
      {/* <Button
        onClick={() => {}}
        sx={{
          display: "flex",
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          border: "1px solid",
          padding: "10px 3rem",
          borderRadius: "7px",
        }}
      >
        Back to Profile
      </Button> */}
    </Box>
  );
};

export default PaymentStatus;
