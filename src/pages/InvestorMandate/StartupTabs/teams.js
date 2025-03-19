import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";

import { startupTabTeam } from "src/action/investorMandates";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

const Teams = () => {
  const dispatch = useDispatch();
  // const shortlistedStartupLists = useSelector(
  //   (state) => state.investorMandates.shortlistedStartups
  // );
  // const startupId = shortlistedStartupLists[0]?.startup.id;
  const startupId = localStorage.getItem("selectedStartupId");
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const getMandateId = localStorage.getItem("selectedMandateId");

  const startUpTeamTabData = useSelector((state) => state?.investorMandates?.startupTabTeam.team);

  useEffect(() => {
    dispatch(startupTabTeam(investorId, startupId, getMandateId));
  }, [investorId, startupId, getMandateId, dispatch]);

  return (
    <>
      <Typography style={{ fontSize: "16px", fontWeight: "bold", color: "#8a1538" }}>
        <FormattedMessage id="startUpTabs.landingPage.tab2.label" defaultMessage="TEAM" />
      </Typography>
      <Grid
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
        <Typography style={{ fontSize: "16px", fontWeight: "bold" }}>
          <FormattedMessage
            id="startUpTabs.landingPage.teams.heading1"
            defaultMessage="Founders & Co-Founders"
          />
        </Typography>
        <Box style={{ marginLeft: "20px" }}>
          {startUpTeamTabData
            ?.filter((data) =>
              ["Founder", "Co-Founder", "C-Suite (CTO , CEO or etc)"].includes(data.designation)
            )
            ?.map((data) => (
              <Grid
                direction={"column"}
                key={data.id}
                item
                container
                justifyContent="space-between"
              >
                <img
                  style={{ width: "80px" }}
                  src="/Images/default_member_icon.png"
                  alt="Founder Image"
                />
                <Grid key={data?.id} sx={{ margin: "10px" }}>
                  <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {data.memberName}
                  </Typography>
                  <Typography style={{ fontSize: "12px" }}>{data.designation}</Typography>
                  <Typography style={{ fontSize: "12px" }}>{data.memberEmail}</Typography>
                  <Typography style={{ fontSize: "12px" }}>{data.linkedin_profile_url}</Typography>
                </Grid>
              </Grid>
            ))}
        </Box>
      </Grid>
      <Grid
        style={{
          backgroundColor: " #ffffff",
          borderRadius: "8px",
          padding: "10px",
          marginTop: "20px",
        }}
        sx={{
          boxShadow: "0 0 6px rgba(23,29,48,.4)",
        }}
      >
        <Typography style={{ fontSize: "16px", fontWeight: "bold" }}>
          {" "}
          <FormattedMessage
            id="startUpTabs.landingPage.teams.heading2"
            defaultMessage="Key Team Members"
          />
        </Typography>
        <Box style={{ marginLeft: "20px" }}>
          {startUpTeamTabData
            ?.filter((data) =>
              [
                "Software Team Member",
                "Sales Team Member",
                "Marketing Team Members",
                "Operations Team Members",
                "Advisor",
                "Other",
              ].includes(data.designation)
            )
            ?.map((data) => (
              <Grid
                direction={"column"}
                key={data.id}
                item
                container
                justifyContent="space-between"
              >
                <img
                  style={{ width: "80px" }}
                  src="/Images/default_member_icon.png"
                  alt="Founder Image"
                />
                <Grid key={data?.id} sx={{ margin: "10px" }}>
                  <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {data.memberName}
                  </Typography>
                  <Typography style={{ fontSize: "12px" }}>{data.designation}</Typography>
                  <Typography style={{ fontSize: "12px" }}>{data.memberEmail}</Typography>
                  <Typography style={{ fontSize: "12px" }}>{data.linkedin_profile_url}</Typography>
                </Grid>
              </Grid>
            ))}
        </Box>
      </Grid>
    </>
  );
};
export default Teams;
