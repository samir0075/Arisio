import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import ExternalContainer from "../../components/ExternalContainer";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import styles from "./seeNewMandate.module.css";
import { useDispatch, useSelector } from "react-redux";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ConfirmationMsg from "src/components/ConfirmationMsg";
import PreviewDetailModal from "./PreviewDetailModal";
import { isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import {
  getDocuments,
  getQuestions,
  getTeamMember,
  mandateDetailsInShort,
  profileOverviewForMandate,
  submitPitch,
} from "src/action/seeNewMandate";
import { FormattedMessage } from "react-intl";

const PitchOverview = ({ pitchIdFromPitches }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const router = useRouter();

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

  const EditPitch = () => {
    router.push("./Pitching");
  };

  const handleCancelSubmission = () => {
    setDialogOpen(true);
  };

  const handleReviewPitch = () => {
    setPreviewDialogOpen(true);
  };

  const dispatch = useDispatch();
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const startupId = userDetails?.startupId;
  const profileId = userDetails?.id;

  useEffect(() => {
    dispatch(mandateDetailsInShort(startupId));
    dispatch(profileOverviewForMandate(profileId));
    dispatch(getTeamMember(startupId));
    dispatch(getDocuments(startupId));
  }, [profileId, dispatch, startupId]);

  const selectedMandateInShort = useSelector(
    (state) => state?.seeNewMandate?.selectedMandateDetailsInShort
  );

  const appId = localStorage.getItem("applicationStatus");
  const pitchStatus = appId ? JSON.parse(appId) : null;
  const pitchId = pitchStatus?.applicationId;

  const mandateId = selectedMandateInShort?.id;

  useEffect(() => {
    dispatch(getQuestions(startupId, mandateId));
  }, [dispatch, mandateId, startupId]);

  const handleSubmitPitch = () => {
    pitchIdFromPitches
      ? dispatch(submitPitch(startupId, mandateId, pitchIdFromPitches))
      : dispatch(submitPitch(startupId, mandateId, pitchId));
    router.push("./pitchSubmission");
  };

  return (
    <>
      <ExternalContainer>
        <Box sx={{ backgroundColor: "#FFFFFF", p: 2 }}>
          <Box>
            <Typography className={styles.mandateHeading}>
              {selectedMandateInShort?.title}
            </Typography>

            <Grid container sx={{ marginTop: "10px" }}>
              <Grid item xs={12} sm={12} md={6} xl={6}>
                <Typography className={styles.backButtonColor}>
                  <FormattedMessage
                    id="seeMandates.pitchOverview.pitchStartDate.title"
                    defaultMessage="Pitch Start Date :"
                  />{" "}
                  <span className={styles.colorOfDate}>
                    {formatDate(selectedMandateInShort?.startDate)}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} xl={6}>
                <Typography className={styles.backButtonColor}>
                  <FormattedMessage
                    id="seeMandates.pitchOverview.pitchEndDate.title"
                    defaultMessage="Pitch End Date :"
                  />
                  <span className={styles.colorOfDate}>
                    {" "}
                    {formatDate(selectedMandateInShort?.endDate)}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ border: "3px solid #F5F5F5", my: 2 }} />
          <Grid>
            <Typography className={styles.mandateHeading}>
              {" "}
              <FormattedMessage
                id="seeMandates.pitchOverview.pitchSummary.title"
                defaultMessage="Pitch Summary"
              />
            </Typography>
            <Grid className={styles.PitchStatusExternal}>
              <Typography className={styles.mandateTitle}>
                <FormattedMessage
                  id="seeMandates.pitchOverview.pitchStatus.title"
                  defaultMessage="Pitch Status"
                />
              </Typography>
              <Divider sx={{ border: "1px solid #F5F5F5", my: 1 }} />
              <Grid container alignItems="center">
                <img
                  src="/Images/full-circle-image.png"
                  alt="tick-mark"
                  height="70px"
                  width="70px"
                  className={styles.pitchStatusImage}
                />
                <Typography className={styles.statusMsg}>
                  <FormattedMessage
                    id="seeMandates.pitchOverview.pitchComplete.heading"
                    defaultMessage="Your pitch is now 100% complete. Please submit your pitch."
                  />
                </Typography>
              </Grid>
              <Divider sx={{ border: "1px solid #F5F5F5", my: 1 }} />
              {isPermitted(permissions.STARTUP_MANDATE_PITCH_SUMMARY_EDIT_PITCH) ? (
                <Grid container alignItems="center" justifyContent="center">
                  {" "}
                  <Button onClick={EditPitch} className={styles.colorOfDate}>
                    <FormattedMessage
                      id="seeMandates.pitchOverview.edit/UpdateButton.heading"
                      defaultMessage="Edit / Update Pitch"
                    />
                  </Button>
                </Grid>
              ) : null}
            </Grid>
            {isPermitted(permissions.STARTUP_MANDATE_PITCH_SUMMARY_VIEW_PITCH) ? (
              <Grid
                container
                sx={{
                  px: { xs: "", sm: 5 },
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  gap: "10px",
                }}
                className={styles.PitchStatusExternal}
                onClick={handleReviewPitch}
              >
                <RemoveRedEyeIcon />
                <Grid sx={{ mx: { xs: "", sm: 2 }, textAlign: { xs: "center", sm: "left" } }}>
                  {" "}
                  <Typography className={styles.backButtonColor}>
                    <FormattedMessage
                      id="seeMandates.pitchOverview.reviewButton.title"
                      defaultMessage="Review your pitch before submitting it."
                    />
                  </Typography>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
          <Grid container justifyContent="space-between" sx={{ py: 2 }}>
            {isPermitted(permissions.STARTUP_MANDATE_PITCH_SUMMARY_CANCEL_PITCH) ? (
              <Button
                onClick={handleCancelSubmission}
                className={styles.nextButton}
                sx={{
                  backgroundColor: "#FFFFFF !important",
                  border: "1px solid rgba(138, 21, 56, 1)!important",
                }}
              >
                <FormattedMessage
                  id="seeMandates.pitchOverview.cancelSubmissionButton.title"
                  defaultMessage="Cancel Submission"
                />
              </Button>
            ) : null}
            {isPermitted(permissions.STARTUP_MANDATE_PITCH_SUMMARY_SUBMIT_PITCH) ? (
              <Button type="submit" onClick={handleSubmitPitch} className={styles.nextButton}>
                <FormattedMessage
                  id="seeMandates.pitchOverview.submitSubmissionButton.title"
                  defaultMessage="Submit Pitch"
                />
              </Button>
            ) : null}
          </Grid>
        </Box>
      </ExternalContainer>
      {dialogOpen && <ConfirmationMsg dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />}
      {previewDialogOpen && (
        <PreviewDetailModal
          previewDialogOpen={previewDialogOpen}
          setPreviewDialogOpen={setPreviewDialogOpen}
        />
      )}
    </>
  );
};

PitchOverview.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default PitchOverview;
