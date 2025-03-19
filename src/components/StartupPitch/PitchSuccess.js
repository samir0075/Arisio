import React, { useEffect } from "react";
import ExternalContainer from "../ExternalContainer";
import {
  Box,
  Button,
  Divider,
  Grid,
  Step,
  StepIcon,
  StepLabel,
  Stepper,
  Typography,
  StepConnector,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { submissionDetails } from "src/action/seeNewMandate";
import styles from "./StartupPitch.module.css";
import { makeStyles } from "@mui/styles";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";

const PitchSuccess = ({ pitchIdFromPitches }) => {
  const dispatch = useDispatch();

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const startupId = userDetails?.startupId;

  const appId = localStorage.getItem("applicationStatus");
  const pitchStatus = appId ? JSON.parse(appId) : null;
  const pitchId = pitchStatus?.applicationId;

  useEffect(() => {
    pitchIdFromPitches
      ? dispatch(submissionDetails(startupId, pitchIdFromPitches))
      : dispatch(submissionDetails(startupId, pitchId));
  }, [dispatch, startupId, pitchIdFromPitches, pitchId]);
  const mandateDetails = useSelector((state) => state?.seeNewMandate?.submissionDetails);
  const loading =useSelector((state) => state?.seeNewMandate?.loading) 
  
  

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

  const useStyles = makeStyles({
    circle: {
      fill: "rgba(138, 21, 56, 1)", // Change circle color to green
    },
  });

  const CustomStepIcon = (props) => {
    const classes = useStyles();
    const { active, completed } = props;

    return (
      <StepIcon
        {...props}
        classes={{
          active: classes.circle,
          completed: classes.circle,
        }}
        active={active}
        completed={completed}
      />
    );
  };

  const steps = [
    <FormattedMessage
      key={1}
      id="seeMandates.pitchSuccess.stepper.applicationSubmitted.title"
      defaultMessage="Application Submitted."
    />,
    <FormattedMessage
      key={1}
      id="seeMandates.pitchSuccess.stepper.underInvestorsReview.title"
      defaultMessage="Under Investors Review."
    />,
    <FormattedMessage
      key={1}
      id="seeMandates.pitchSuccess.stepper.investorsAction.title"
      defaultMessage="Investor's Action."
    />,
  ];

  const lang = localStorage.getItem("lang");

  const router = useRouter();

  // In the component
  useEffect(() => {
    const handlePopState = () => {
      router.replace("/SeeMandates");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <>
      <ExternalContainer> 
      {loading  ? (
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
              <Grid sx={{ backgroundColor: "#FFFFFF", p: 2 }}>
              <Typography className={styles.mandateHeading}>
                {mandateDetails?.investorEvent?.title}
              </Typography>
              <Typography
                className={styles.inputField}
                sx={{ marginTop: "10px", wordWrap: "break-word", wordBreak: "break-word" }}
              >
                {mandateDetails?.investorEvent?.investor?.organization}
              </Typography>
    
              <Grid container sx={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Typography className={styles.backButtonColor}>
                    <FormattedMessage
                      id="seeMandates.pitchSuccess.pitchStartDate.title"
                      defaultMessage="Pitch Start Date :"
                    />{" "}
                    <span className={styles.colorOfDate}>
                      {formatDate(mandateDetails?.investorEvent?.startDate)}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Typography className={styles.backButtonColor}>
                    <FormattedMessage
                      id="seeMandates.pitchSuccess.pitchEndDate.title"
                      defaultMessage="Pitch End Date :"
                    />{" "}
                    <span className={styles.colorOfDate}>
                      {" "}
                      {formatDate(mandateDetails?.investorEvent?.endDate)}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            )}
       

        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
          sx={{ backgroundColor: "#FFFFFF", p: 2, my: 2 }}
        >
          {mandateDetails?.currentStatus === "rejected" ? (
            <img src="/Images/thumbs-down.png" alt="Thumbs-up" width={80} height={80} />
          ) : (
            <img src="/Images/thumbs-up.png" alt="Thumbs-down" width={80} height={80} />
          )}
          <Typography className={styles.mandateTitle} sx={{ my: 1 }}>
            {mandateDetails?.currentStatus === "applied" ? (
              <FormattedMessage
                id="seeMandates.pitchSuccess.thankYou.heading"
                defaultMessage="Thank you !"
              />
            ) : mandateDetails?.currentStatus === "rejected" ? (
              <FormattedMessage
                id="seeMandates.pitchSuccess.sorry.heading"
                defaultMessage="Sorry !"
              />
            ) : (
              <FormattedMessage
                id="seeMandates.pitchSuccess.congratulation.heading"
                defaultMessage="Congratulations."
              />
            )}
          </Typography>
          <Typography className={styles.backButtonColor} sx={{ my: 1 }}>
            {mandateDetails?.currentStatus === "applied" ? (
              <FormattedMessage
                id="seeMandates.pitchSuccess.pitchSent.heading"
                defaultMessage="Your pitch has been sent to the investor successfully."
              />
            ) : mandateDetails?.currentStatus === "watch" ? (
              <FormattedMessage
                id="seeMandates.pitchSuccess.closelyWatchedMandate.heading"
                defaultMessage="Your startup is being closely watched for this mandate."
              />
            ) : mandateDetails?.currentStatus === "rejected" ? (
              <FormattedMessage
                id="seeMandates.pitchSuccess.closelyRejectedMandate.heading"
                defaultMessage="Your startup is being rejected."
              />
            ) : (
              <FormattedMessage
                id="seeMandates.pitchSuccess.shortListedMandate.heading"
                defaultMessage="Your startup is being shortlisted for this mandate."
              />
            )}
          </Typography>
          <Typography className={styles.backButtonColor} sx={{ my: 1 }}>
            {mandateDetails?.currentStatus === "applied" ? (
              <FormattedMessage
                id="seeMandates.pitchSuccess.stayTunedInvestorFeedback.heading"
                defaultMessage="Stay tuned with Arisio to know the investors feedback."
              />
            ) : mandateDetails?.currentStatus === "watch" ? (
              <FormattedMessage
                id="seeMandates.pitchSuccess.informationUpdateInvestor.heading"
                defaultMessage="We will keep you informed as your pitch status is updated by the investor."
              />
            ) : (
              ""
            )}
          </Typography>

          <Box sx={{ width: "100%", my: 2 }}>
            <Stepper
              activeStep={
                mandateDetails?.currentStatus === "accepted"
                  ? 3
                  : mandateDetails?.currentStatus === "applied"
                  ? 1
                  : mandateDetails?.currentStatus === "incomplete"
                  ? 0
                  : 3
              }
              alternativeLabel
              connector={
                <StepConnector
                  sx={{
                    position: "absolute",
                    top: "12px",

                    ...(lang === "en"
                      ? { left: `calc(-50% + 20px)`, right: `calc(50% + 20px)` }
                      : { left: `calc(50% + 20px)`, right: `calc(-50% + 20px)` }),
                  }}
                />
              }
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel className={styles.backButtonColor} StepIconComponent={CustomStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          sx={{ my: 2, opacity: 0.5, pointerEvents: "none" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={5.5}
            xl={5.5}
            sx={{
              backgroundColor: "#FFFFFF",
              p: 2,
              borderRadius: "10px",
            }}
          >
            <Typography className={styles.mandateHeading}>
              <FormattedMessage
                id="seeMandates.scheduleMeeting.heading"
                defaultMessage="Schedule Meeting Details"
              />
            </Typography>
            <Divider sx={{ borderColor: "#F5F5F5", borderWidth: "2px" }} />
            <Grid container direction="column" justifyContent="center" alignItems="center">
              <Button className={styles.nextButton}>
                {" "}
                <FormattedMessage
                  id="seeMandates.viewMeetingDetails.heading"
                  defaultMessage="View Meeting Details"
                />
              </Button>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5.5}
            xl={5.5}
            sx={{ backgroundColor: "#FFFFFF", p: 2, borderRadius: "10px" }}
          >
            <Typography className={styles.mandateHeading}>
              <FormattedMessage id="seeMandates.message.heading" defaultMessage="Messages" />
            </Typography>
            <Divider sx={{ borderColor: "#F5F5F5", borderWidth: "2px" }} />
            <Grid container direction="column" justifyContent="center" alignItems="center">
              <Button className={styles.nextButton}>
                <FormattedMessage
                  id="seeMandates.viewMessage.heading"
                  defaultMessage="View Messages"
                />{" "}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ExternalContainer>
    </>
  );
};

export default PitchSuccess;
