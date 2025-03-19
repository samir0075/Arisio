import { Box, Button, CardMedia, Dialog, Divider, Grid, Slide, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./mandates.module.css";
import ConfirmationModal from "./confirmationModal";
import CancelIcon from "@mui/icons-material/Cancel";
import { FormattedMessage, useIntl } from "react-intl";
import { fontSize } from "@mui/system";
import { formattedDate } from "src/utils/util";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const MandatesApprovalModal = ({ page, dialogOpen, setDialogOpen, adminId, selectedMandateId }) => {
  const handleClose = () => {
    setDialogOpen(false);
  };

  const [confirmDialogOpen, setConfirmDialogModal] = useState(false);
  const [action, setAction] = useState("");

  const selectedMandateData = useSelector(state => state?.pendingApprovals?.selectedMandate);

  const selectedMandateQuestion = useSelector(state => state?.pendingApprovals?.selectedQuestion);

  const question = selectedMandateQuestion.map((question, index) => (
    <Grid key={index} item xs={8}>
      <Typography
        sx={{
          fontSize: "12px",
          overflowWrap: "break-word",
          width: "100%",
          color: "rgba(108, 25, 62, 1)"
        }}
      >
        {`${index + 1}. ${question.question}`}
      </Typography>
    </Grid>
  ));

  const intl = useIntl();

  const handleApproval = () => {
    setConfirmDialogModal(true);
    setAction(
      intl.formatMessage({
        id: "pending.approvals.approveMandateMessage",
        defaultMessage: "Do you want to approve this mandate ?"
      })
    );
  };
  const handleRejection = () => {
    setConfirmDialogModal(true);
    // setAction("Do you want to reject this mandate ?");
    setAction(
      intl.formatMessage({
        id: "pending.approvals.rejectMandateMessage",
        defaultMessage: "Do you want to reject this mandate ?"
      })
    );
  };

  const language = localStorage.getItem("lang");

  return (
    <>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "730px !important",
            width: "730px !important"
          }
        }}
        TransitionComponent={Transition}
        keepMounted
        open={dialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid sx={{ p: 2, overflowX: "auto" }}>
          <Grid justifyContent="right" container onClick={handleClose}>
            <CancelIcon style={{ fontSize: "1.2rem", cursor: "pointer" }} color="disabled" />
          </Grid>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sm={12} md={3.5} xl={3.5}>
              <CardMedia
                style={{ borderRadius: "4px", objectFit: "contain" }}
                component="img"
                height="150"
                src={
                  selectedMandateData?.images?.imageName === "Image-1.png" ||
                  selectedMandateData?.images?.imageName === "Image-2.png" ||
                  selectedMandateData?.images?.imageName === "Image-3.png" ||
                  selectedMandateData?.images?.imageName === "Image-4.png"
                    ? `/Images/${selectedMandateData?.images?.imageName}`
                    : `data:image/PNG;base64,${selectedMandateData?.images?.imageContent}`
                }
                alt="Mandate Image"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={8} xl={8}>
              <Typography
                // className={styles.mandateTitle}
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  overflow: "hidden"
                }}
                component="div"
              >
                {selectedMandateData?.title}
              </Typography>

              <Typography
                style={{
                  fontSize: "14px",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  overflow: "hidden"
                }}
                className={styles.colorOfDate}
              >
                {" "}
                {selectedMandateData?.description}
              </Typography>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                <FormattedMessage
                  id="pending.approvals.investorName"
                  defaultMessage="Investor Name :"
                />

                <span style={{ marginLeft: "3px" }} className={styles.colorOfDate}>
                  {selectedMandateData?.investor?.name}
                </span>
              </Typography>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                {" "}
                <FormattedMessage
                  id="pending.approvals.investorOrganization"
                  defaultMessage="Investor Organization :"
                />
                <span style={{ marginLeft: "3px" }} className={styles.colorOfDate}>
                  {selectedMandateData?.investor?.organization}
                </span>
              </Typography>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                {" "}
                <FormattedMessage id="pending.approvals.Email" defaultMessage="Email :" />
                <span style={{ marginLeft: "3px" }} className={styles.colorOfDate}>
                  {selectedMandateData?.investor?.username}
                </span>
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ border: "1px solid #F5F5F5" }} />

          <Typography sx={{ py: 1 }} className={styles.mandateTitle}>
            <FormattedMessage
              id="pending.approvals.mandatePreferences"
              defaultMessage="Mandate Preferences :"
            />
          </Typography>

          <Grid container>
            <Grid items xs={12} sm={12} md={12} xl={12}>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                <FormattedMessage
                  id="pending.approvals.revenueStatus"
                  defaultMessage="Revenue Status :"
                />
                <span className={styles.colorOfDate}> {selectedMandateData?.revenue_status}</span>{" "}
              </Typography>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                <FormattedMessage
                  id="pending.approvals.startupStage"
                  defaultMessage="Startup Stage :"
                />{" "}
                <span className={styles.colorOfDate}> {selectedMandateData?.stage}</span>
              </Typography>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                <FormattedMessage
                  id="pending.approvals.mandateType"
                  defaultMessage="Mandate Type :"
                />{" "}
                <span className={styles.colorOfDate}> {selectedMandateData?.mandateType}</span>
              </Typography>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                <FormattedMessage
                  id="pending.approvals.investmentOffering"
                  defaultMessage="Investment Offering :"
                />{" "}
                <span className={styles.colorOfDate}>
                  {" "}
                  {selectedMandateData?.investmentOffering}
                </span>
              </Typography>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                <FormattedMessage id="pending.approvals.teamSize" defaultMessage="Team size :" />{" "}
                <span className={styles.colorOfDate}> {selectedMandateData?.teamSize}</span>
              </Typography>

              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                <FormattedMessage
                  id="pending.approvals.preferredLocation"
                  defaultMessage="Preferred Location :"
                />{" "}
                {selectedMandateData?.location?.map((data, index) => (
                  <span className={styles.colorOfDate} key={index}>
                    {data}
                    {index < selectedMandateData?.location?.length - 1 ? ", " : ""}
                  </span>
                ))}
              </Typography>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                <FormattedMessage
                  id="pending.approvals.startupCountry"
                  defaultMessage="Startup Country :"
                />{" "}
                <span className={styles.colorOfDate}>
                  {" "}
                  {selectedMandateData?.country?.map((data, index) =>
                    data.length > 1
                      ? `${data}${index !== selectedMandateData?.country?.length - 1 ? ", " : ""}`
                      : data
                  )}
                </span>
              </Typography>
              <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
                <FormattedMessage
                  id="pending.approvals.investmentAmount"
                  defaultMessage="Investment Amount :"
                />{" "}
                <span className={styles.colorOfDate}> {selectedMandateData?.amount}</span>
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ border: "1px solid #F5F5F5", marginTop: "10px" }} />

          <Typography sx={{ py: 1 }} className={styles.mandateTitle}>
            <FormattedMessage
              id="pending.approvals.MandateTimeline"
              defaultMessage=" Mandate Timeline"
            />{" "}
          </Typography>

          <Box style={{ display: "flex", justifyContent: "flex-start" }}>
            <Typography style={{ fontSize: "0.8rem" }} className={styles.dateColor}>
              <FormattedMessage
                id="pending.approvals.mandateStartingDate"
                defaultMessage="Mandate Starting Date :"
              />

              <span style={{ marginLeft: "3px" }} className={styles.colorOfDate}>
                {formattedDate(selectedMandateData?.startDate)}
              </span>
            </Typography>

            <Typography
              style={{ fontSize: "0.8rem", marginLeft: "10px" }}
              className={styles.dateColor}
            >
              {" "}
              <FormattedMessage
                id="pending.approvals.mandateClosingDate:"
                defaultMessage="Mandate Closing Date:"
              />
              <span style={{ marginLeft: "3px" }} className={styles.colorOfDate}>
                {formattedDate(selectedMandateData?.endDate)}
              </span>
            </Typography>
          </Box>

          <Divider sx={{ border: "1px solid #F5F5F5", marginTop: "10px" }} />

          <Typography sx={{ py: 1 }} className={styles.mandateTitle}>
            <FormattedMessage id="pending.approvals.Question" defaultMessage="Questions" />{" "}
          </Typography>

          {question.length > 0 ? question : "-"}

          <Divider sx={{ border: "1px solid #F5F5F5", marginTop: "10px" }} />

          <Typography sx={{ py: 1 }} className={styles.mandateTitle}>
            <FormattedMessage
              id="pending.approvals.mandateInTheSpaces"
              defaultMessage="Mandate in the Spaces"
            />{" "}
          </Typography>

          <Grid container sx={{ paddingTop: "0px" }}>
            {selectedMandateData?.othersTech !== null ? (
              <>
                <Grid item xs={12} sm={6} md={4} lg={4} className={styles.techOuter}>
                  <Typography style={{ fontSize: "0.8rem" }} className={styles.technologies}>
                    {selectedMandateData?.othersTech}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={8}
                  lg={8}
                  sx={{ marginRight: language === "ar" ? "10px" : "" }}
                >
                  <Typography
                    style={{ fontSize: "0.8rem" }}
                    // className={`${styles.mandatePoints} ${styles.detailsDateColor}`}
                  >
                    {/* {value} */}
                    {selectedMandateData?.othersDomain}
                  </Typography>
                </Grid>
              </>
            ) : (
              selectedMandateData?.spacesAndTech &&
              Object.entries(selectedMandateData?.spacesAndTech).map(
                ([key, value], index, array) => (
                  <React.Fragment key={key}>
                    <Grid item xs={12} sm={6} md={4} lg={4} className={styles.techOuter}>
                      <Typography style={{ fontSize: "0.8rem" }} className={styles.technologies}>
                        {key}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={8}
                      lg={8}
                      sx={{ marginRight: language === "ar" ? "10px" : "" }}
                    >
                      <Typography
                        style={{ fontSize: "0.8rem" }}
                        // className={`${styles.mandatePoints} ${styles.detailsDateColor}`}
                      >
                        {value}
                      </Typography>
                    </Grid>
                    {index !== array.length - 1 && (
                      <Grid item xs={12} sx={{ paddingBottom: "10px" }}>
                        <Divider
                          sx={{
                            position: "relative",
                            top: "10px",
                            border: "1px solid #F5F5F5"
                          }}
                        />
                      </Grid>
                    )}
                  </React.Fragment>
                )
              )
            )}
          </Grid>

          <Grid container justifyContent="flex-end" sx={{ margin: "15px 0 0 0" }}>
            <Button
              size="small"
              style={{ padding: "3px 4px" }}
              type="submit"
              onClick={handleRejection}
              className={styles.rejectButton}
              sx={{ marginLeft: language === "ar" ? "10px" : "" }}
            >
              <FormattedMessage id="pending.approvals.Reject" defaultMessage="Reject" />{" "}
            </Button>
            <Button
              size="small"
              style={{ padding: "3px 4px" }}
              type="submit"
              onClick={handleApproval}
              className={styles.approveButton}
            >
              <FormattedMessage id="pending.approvals.Approve" defaultMessage="Approve" />
            </Button>
          </Grid>
        </Grid>
      </Dialog>

      {confirmDialogOpen && (
        <ConfirmationModal
          page={page}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          adminId={adminId}
          selectedMandateId={selectedMandateId}
          confirmDialogOpen={confirmDialogOpen}
          setConfirmDialogModal={setConfirmDialogModal}
          action={action}
        />
      )}
    </>
  );
};

export default MandatesApprovalModal;
