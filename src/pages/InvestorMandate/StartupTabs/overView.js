import { Box, Grid, Link, Typography } from "@mui/material";
import { display } from "@mui/system";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { startupTabOverallView } from "src/action/investorMandates";

const OverView = () => {
  const dispatch = useDispatch();
  // const shortlistedStartupLists = useSelector(
  //   (state) => state.investorMandates.shortlistedStartups
  // );
  // const startupId = shortlistedStartupLists[0]?.startup.id;
  const startupId = localStorage.getItem("selectedStartupId");
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  useEffect(() => {
    dispatch(startupTabOverallView(investorId, startupId));
  }, [dispatch, investorId, startupId]);
  const startUpOverallViewTabData = useSelector(
    state => state?.investorMandates?.startupTabOverView
  );

  const space = startUpOverallViewTabData?.space;

  console.log(startUpOverallViewTabData);

  return (
    <>
      <Typography style={{ fontSize: "16px", fontWeight: "bold", color: "#8a1538" }}>
        <FormattedMessage id="startUpTabs.landingPage.tab1.label" defaultMessage="OVERVIEW" />
      </Typography>
      <Grid
        style={{
          backgroundColor: " #ffffff",
          borderRadius: "8px",
          padding: "15px",
          marginTop: "10px"
        }}
        sx={{
          boxShadow: "0 0 6px rgba(23,29,48,.4)"
        }}
      >
        <Grid container spacing={1} style={{ marginTop: "5px" }}>
          <Grid item xs={12} sm={6} md={3} xl={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading1"
                defaultMessage="Headquater"
              />{" "}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} xl={3}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#8a1538"
              }}
            >
              {startUpOverallViewTabData?.city} {startUpOverallViewTabData?.state}{" "}
              {startUpOverallViewTabData.country}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading2"
                defaultMessage="Description"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={9} xl={9}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#8a1538",
                whiteSpace: "normal", // Allows text wrapping
                wordWrap: "break-word", // Ensures long words wrap
                width: "100%"
              }}
            >
              {startUpOverallViewTabData?.description}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading3"
                defaultMessage="Founded Year"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.foundedYear}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading4"
                defaultMessage="Categories"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {space?.map(item => item.name).join(" / ")}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage id="startUpTabs.overView.tab1.heading5" defaultMessage="Stage" />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.stageName
                ? startUpOverallViewTabData?.stageName?.map(data => data.stage_name).join(", ")
                : "-"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage id="startUpTabs.overView.tab1.heading17" defaultMessage="Sector" />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.space
                ? startUpOverallViewTabData?.space?.map(r => r?.name).join(" , ")
                : "-"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading18"
                defaultMessage="Technology"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.technology
                ? startUpOverallViewTabData?.technology?.map(r => r?.name)
                : "-"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage id="startUpTabs.overView.tab1.heading6" defaultMessage="Website" />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#8a1538",
                whiteSpace: "normal", // Allows text wrapping
                wordWrap: "break-word" // Ensures long words wrap
              }}
            >
              <Link
                style={{ cursor: "pointer", textDecoration: "none" }}
                href={`https://${startUpOverallViewTabData?.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {startUpOverallViewTabData?.website ? startUpOverallViewTabData?.website : "-"}
              </Link>
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading7"
                defaultMessage="Employees"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.employeeCount}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab1.headin"
                defaultMessage="Team Background"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.teamBackgroundName}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab.heading7"
                defaultMessage="Funding Amount Raised"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.fundingTotalUsd}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading8"
                defaultMessage="Past Funding"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.pastFunding}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab.heading"
                defaultMessage="Current Traction"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.currentTranctionName}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab.headin"
                defaultMessage="Market Opportunity"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.marketOpportunity}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading9"
                defaultMessage="Email Address"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#8a1538",
                whiteSpace: "normal", // Allows text wrapping
                wordWrap: "break-word" // Ensures long words wrap
              }}
            >
              {startUpOverallViewTabData?.communicationEmail}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              {" "}
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading10"
                defaultMessage="Contact Number"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#8a1538" }}>
              {startUpOverallViewTabData?.contactNo}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              {" "}
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading11"
                defaultMessage="Facebook"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#8a1538",
                cursor: startUpOverallViewTabData?.facebookLink ? "pointer" : "",
                whiteSpace: "normal", // Allows text wrapping
                wordWrap: "break-word" // Ensures long words wrap
              }}
              onClick={() => {
                startUpOverallViewTabData?.facebookLink
                  ? window.open(startUpOverallViewTabData?.facebookLink, "_blank", "noreferrer")
                  : "";
              }}
            >
              {startUpOverallViewTabData?.facebookLink
                ? startUpOverallViewTabData?.facebookLink
                : "-"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              {" "}
              <FormattedMessage id="startUpTabs.overView.tab1.heading17" defaultMessage="X" />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#8a1538",
                cursor: startUpOverallViewTabData?.googleLink ? "pointer" : "",
                whiteSpace: "normal", // Allows text wrapping
                wordWrap: "break-word" // Ensures long words wrap
              }}
              onClick={() => {
                startUpOverallViewTabData?.googleLink
                  ? window.open(startUpOverallViewTabData?.googleLink, "_blank", "noreferrer")
                  : "";
              }}
            >
              {startUpOverallViewTabData?.googleLink ? startUpOverallViewTabData?.googleLink : "-"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              {" "}
              <FormattedMessage id="startUpTabs.overView.tab1.heading13" defaultMessage="Youtube" />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#8a1538",
                cursor: startUpOverallViewTabData?.youtubeLink ? "pointer" : "",
                whiteSpace: "normal", // Allows text wrapping
                wordWrap: "break-word" // Ensures long words wrap
              }}
              onClick={() => {
                startUpOverallViewTabData?.youtubeLink
                  ? window.open(startUpOverallViewTabData?.youtubeLink, "_blank", "noreferrer")
                  : "";
              }}
            >
              {startUpOverallViewTabData?.youtubeLink
                ? startUpOverallViewTabData?.youtubeLink
                : "-"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "2px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography style={{ fontSize: "14px" }}>
              {" "}
              <FormattedMessage
                id="startUpTabs.overView.tab1.heading14"
                defaultMessage="Instagram"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#8a1538",

                cursor: startUpOverallViewTabData?.instragramLink ? "pointer" : "",
                whiteSpace: "normal", // Allows text wrapping
                wordWrap: "break-word" // Ensures long words wrap
              }}
              onClick={() => {
                startUpOverallViewTabData?.instragramLink
                  ? window.open(startUpOverallViewTabData?.instragramLink, "_blank", "noreferrer")
                  : "";
              }}
            >
              {startUpOverallViewTabData?.instragramLink
                ? startUpOverallViewTabData?.instragramLink
                : "-"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default OverView;
