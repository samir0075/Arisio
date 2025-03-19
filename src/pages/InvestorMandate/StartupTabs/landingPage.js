import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";

import ExternalContainer from "src/components/ExternalContainer";
import { Box, Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "../allMandate.module.css";

import Document from "../StartupTabs/document";
import OverView from "../StartupTabs/overView";
import QuickQuestions from "../StartupTabs/quickQuestions";
import Teams from "../StartupTabs/teams";
import Updates from "../StartupTabs/updates";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

const LandingPage = () => {
  const startUpOverallViewTabData = useSelector(
    (state) => state?.investorMandates?.startupTabOverView
  );

  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const [selectedCard, setSelectedCard] = useState(1);

  const handleCardClick = (cardId) => {
    // if (selectedCard === cardId) {
    //   // If the same card header is clicked again, close it
    //   setSelectedCard(null);
    // } else {
    setSelectedCard(cardId);
    // }
  };

  return (
    <>
      <ExternalContainer>
        <Grid container onClick={goBack}>
          <ArrowBackIcon className={styles.backButtonColor} />
          <Typography sx={{ px: 1 }} className={`${styles.backButtonColor} ${styles.backButton}`}>
            <FormattedMessage
              id="startUpTabs.landingPage.back.button.label"
              defaultMessage="Back to mandates status"
            />
          </Typography>
        </Grid>
        <Grid>
          <Grid
            container
            className={styles.cardOuter}
            sx={{
              boxShadow: "0 0 6px rgba(23,29,48,.4)",
            }}
          >
            <Grid container alignItems="center">
              <Grid xs={2} sm={2} md={2} xl={2}>
                <img
                  src={
                    startUpOverallViewTabData?.logoUrl
                      ? `data:image/PNG;base64,${startUpOverallViewTabData?.logoUrl}`
                      : "/Images/company_default.png"
                  }
                  height="35"
                  width="50"
                  alt="Logo"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={10} xl={10}>
                <Typography
                  component="div"
                  style={{ fontWeight: "bold", whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  {startUpOverallViewTabData?.organizationName}
                </Typography>
                <Typography
                  component="div"
                  style={{
                    fontSize: "14px",
                    color: "#808080",
                    fontWeight: "bold",
                    margin: "10px 0px",
                  }}
                >
                  {startUpOverallViewTabData?.city} {startUpOverallViewTabData?.state}{" "}
                  {startUpOverallViewTabData.country}
                </Typography>
                <Typography
                  component="div"
                  style={{
                    fontSize: "14px",
                    color: "#808080",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {startUpOverallViewTabData?.description}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <>
          <Box style={{ marginTop: "20px" }}>
            <Grid container spacing={1} style={{ marginTop: "5px" }}>
              <Grid
                textAlign="center"
                item
                xs={12}
                sm={5}
                md={2}
                xl={2}
                style={{ margin: "10px 7px" }}
                className={selectedCard === 1 ? styles.active : styles.individualTabs}
                onClick={() => handleCardClick(1)}
              >
                <FormattedMessage
                  id="startUpTabs.landingPage.tab1.label"
                  defaultMessage="OVERVIEW"
                />
              </Grid>

              <Grid
                textAlign="center"
                item
                xs={12}
                sm={5}
                md={2}
                xl={2}
                style={{ margin: "10px 7px" }}
                className={selectedCard === 2 ? styles.active : styles.individualTabs}
                onClick={() => handleCardClick(2)}
              >
                <FormattedMessage id="startUpTabs.landingPage.tab2.label" defaultMessage="TEAM" />
              </Grid>

              <Grid
                textAlign="center"
                item
                xs={12}
                sm={5}
                md={2}
                xl={2}
                style={{ margin: "10px 7px" }}
                className={selectedCard === 3 ? styles.active : styles.individualTabs}
                onClick={() => handleCardClick(3)}
              >
                <FormattedMessage
                  id="startUpTabs.landingPage.tab3.label"
                  defaultMessage="DOCUMENTS"
                />
              </Grid>

              <Grid
                textAlign="center"
                item
                xs={12}
                sm={5}
                md={3}
                xl={2}
                style={{ margin: "10px 7px" }}
                className={selectedCard === 4 ? styles.active : styles.individualTabs}
                onClick={() => handleCardClick(4)}
              >
                <FormattedMessage
                  id="startUpTabs.landingPage.tab4.label"
                  defaultMessage="QUICK QUESTIONS"
                />
              </Grid>
              <Grid
                textAlign="center"
                item
                xs={12}
                sm={5}
                md={2}
                xl={2}
                style={{ margin: "10px 7px" }}
                className={selectedCard === 5 ? styles.active : styles.individualTabs}
                onClick={() => handleCardClick(5)}
              >
                <FormattedMessage
                  id="startUpTabs.landingPage.tab5.label"
                  defaultMessage="UPDATES"
                />
              </Grid>
            </Grid>

            <Grid sx={{ p: 2, my: 4, backgroundColor: "#FFFFFF", borderRadius: "10px" }}>
              {selectedCard === 1 && <OverView />}
              {selectedCard === 2 && <Teams />}
              {selectedCard === 3 && <Document />}
              {selectedCard === 4 && <QuickQuestions />}
              {selectedCard === 5 && <Updates />}
            </Grid>
          </Box>
        </>
      </ExternalContainer>
    </>
  );
};
LandingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default LandingPage;
