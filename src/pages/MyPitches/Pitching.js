import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import StartupDetailsTab from "../../components/StartupPitch/StartupDetailsTab";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuestions,
  getDocuments,
  getTeamMember,
  mandateDetailsInShort,
  profileOverviewForMandate,
} from "src/action/seeNewMandate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "../SeeMandates/seeNewMandate.module.css";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

const Pitching = () => {
  const [value, setValue] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const startupId = userDetails?.startupId;
  const profileId = userDetails?.id;

  useEffect(() => {
    dispatch(mandateDetailsInShort(startupId));
    dispatch(profileOverviewForMandate(profileId));
    dispatch(getTeamMember(startupId));
    dispatch(getDocuments(startupId));
  }, [dispatch, startupId, profileId]);

  let mandatesData = useSelector((state) => state?.seeNewMandate);
  let profileOverviewData = useSelector((state) => state?.seeNewMandate?.profileOverview);
  const selectedMandateInShort = useSelector(
    (state) => state?.seeNewMandate?.selectedMandateDetailsInShort
  );

  const mandateId = selectedMandateInShort?.id;
  const seniorTeamMember = useSelector((state) => state?.seeNewMandate?.teamMember);
  const documentList = useSelector((state) => state.seeNewMandate?.documents);

  useEffect(() => {
    dispatch(getQuestions(startupId, mandateId));
  }, [dispatch, startupId, mandateId]);

  const questionsList = useSelector((state) => state.seeNewMandate?.questions);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month?.padStart(2, "0");
    const paddedDay = day?.padStart(2, "0");

    return `${paddedDay}/${paddedMonth}/${year}`;
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          background: "rgba(65, 148, 179,0.1) !important",
        }}
      >
        <Container maxWidth="xl">
          <Grid container onClick={goBack}>
            <ArrowBackIcon className={styles.backButtonColor} />
            <Typography className={`${styles.backButtonColor} ${styles.backButton}`}>
              <FormattedMessage
                id="pitches.pitching.backToMandates.button.title"
                defaultMessage="Back to mandates"
              />
            </Typography>
          </Grid>

          <Box
            sx={{
              flexGrow: 1,

              my: 2,
            }}
          >
            {mandatesData.newMandateloading ? (
              <Box sx={{ background: "#FFFFFF", p: 1, borderRadius: "8px" }}>
                {/* Skeleton for Title */}
                <Typography>
                  <Skeleton variant="text" width="40%" height={35} />
                </Typography>

                {/* Skeleton for Grid Items */}
                <Grid container sx={{ marginTop: "5px" }} spacing={2}>
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Typography>
                      <Skeleton variant="text" width="80%" height={30} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Typography>
                      <Skeleton variant="text" width="80%" height={30} />
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ background: "#FFFFFF", p: 2, borderRadius: "8px" }}>
                <Typography className={styles.mandateHeading}>
                  {selectedMandateInShort?.title}
                </Typography>

                <Grid container sx={{ marginTop: "10px" }}>
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Typography className={styles.backButtonColor}>
                      <FormattedMessage
                        id="pitches.pitching.pitchStartDate.title"
                        defaultMessage="Pitch Start Date :"
                      />
                      <span className={styles.colorOfDate}>
                        {formatDate(selectedMandateInShort?.startDate)}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Typography className={styles.backButtonColor}>
                      <FormattedMessage
                        id="pitches.pitching.pitchEndDate.title"
                        defaultMessage="Pitch End Date :"
                      />{" "}
                      <span className={styles.colorOfDate}>
                        {" "}
                        {formatDate(selectedMandateInShort?.endDate)}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
            <Divider sx={{ border: "3px solid #F5F5F5" }} />

            {mandatesData.profileOverviewLoading ? (
              <Box sx={{ background: "#FFFFFF", p: 2, borderRadius: "8px" }}>
                <Grid container spacing={2} sx={{ marginBottom: 2, justifyContent: "flex-start" }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Grid item key={index}>
                      <Box
                        sx={{
                          width: 100,
                          height: 40,
                          borderRadius: "16px",
                          background: "#F5F5F5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Skeleton variant="text" width="60%" height={20} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Typography sx={{ fontWeight: "bold", marginBottom: 2 }}>
                  STARTUP INFORMATION
                </Typography>

                <Grid container spacing={2} >
                  {/* Left Fields */}
                  <Grid item xs={12} sm={9}  >
                    <Typography>
                      <Skeleton variant="text" height={45} width="80%" />
                    </Typography>
                    <Typography>
                      <Skeleton variant="text" width="60%" height={45} sx={{ marginTop: 1 }} />
                    </Typography>
                    <Typography>
                      <Skeleton variant="text" width="80%" height={45} sx={{ marginTop: 1 }} />
                    </Typography>
                  </Grid>

                  {/* Right Image */}
                  <Grid item xs={12} sm={3} sx={{ textAlign: "center" }}>
                  <Skeleton variant="text" width="40%" />
                    <Skeleton variant="circular" width={100} height={100} />
                    <Typography sx={{ marginTop: 2 }}>
                      <Skeleton variant="text" width="60%" />
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <StartupDetailsTab
                pitchingDisable={true}
                setValue={setValue}
                value={value}
                profileOverviewData={profileOverviewData}
                seniorTeamMember={seniorTeamMember}
                documentList={documentList}
                questionsList={questionsList}
              />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

Pitching.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Pitching;
