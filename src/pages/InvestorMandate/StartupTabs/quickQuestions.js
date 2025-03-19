import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { startupTabQuestion } from "src/action/investorMandates";

const QuickQuestion = () => {
  const dispatch = useDispatch();
  const startupId = localStorage.getItem("selectedStartupId");
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const getMandateId = localStorage.getItem("selectedMandateId");

  const startUpQuickQuestionTabData = useSelector(
    (state) => state?.investorMandates?.startupTabQuickQuestion
  );

  useEffect(() => {
    dispatch(startupTabQuestion(investorId, startupId, getMandateId));
  }, [investorId, startupId, getMandateId, dispatch]);
  return (
    <>
      <Typography style={{ fontSize: "16px", fontWeight: "bold", color: "#8a1538" }}>
        <FormattedMessage
          id="startUpTabs.landingPage.tab4.label"
          defaultMessage="QUICK QUESTIONS"
        />
      </Typography>
      {startUpQuickQuestionTabData.map((data) => (
        <Grid
          key={data.id}
          style={{
            backgroundColor: " #ffffff",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "10px",
          }}
          sx={{
            boxShadow: "0 0 6px rgba(23,29,48,.4)",
          }}
        >
          <Typography style={{ fontSize: "16px", fontWeight: "bold", color: "#39c6f3" }}>
            {data?.question}
          </Typography>
          <Typography style={{ fontSize: "16px", marginTop: "20px" }}>
            {data?.eventAnswer?.answer}
          </Typography>
        </Grid>
      ))}
    </>
  );
};
export default QuickQuestion;
