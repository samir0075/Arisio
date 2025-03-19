/* eslint-disable react/jsx-key */
import React from "react";
import { useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { Box, Typography } from "@mui/material";

const InvestorLandingPageModal = ({ columns, data, open, setOpen, handelSubmit }) => {
  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // height: "20vh",
          backgroundColor: "#eaf0f1",
          paddingBottom: "30px",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img style={{ margin: "20px 0px" }} src="/Images/no-application-recieved.png" />
          <Typography style={{ fontWeight: "bold", color: "rgba(108, 25, 62, 1)" }}>
            You have not launched any mandate yet.
          </Typography>

          <Typography style={{ fontWeight: "bold", margin: "20px 0px", color: "grey" }}>
            Create New Mandate to invite pitches from startups.{" "}
            <a
              style={{
                color: "rgba(108, 25, 62, 1)",
                textDecoration: "none",
              }}
              href="./../CreateMandates"
            >
              Click here
            </a>
          </Typography>
          <Typography
            style={{ fontWeight: "bold", margin: "20px 0px", textAlign: "center", color: "grey" }}
          >
            *** Mandate is a selection of your preferred technologies and domains in which you would
            like to fine good startups. You can also define your own startup preferences like
            startup stage, team strength, etc so that you get startup pitches customized to your
            needs.
          </Typography>
        </Box>
      </Box>
    </>
  );
};
InvestorLandingPageModal.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default InvestorLandingPageModal;
