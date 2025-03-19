/* eslint-disable react-hooks/rules-of-hooks */
import React, { use, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { Button, Grid, Modal, Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { searchStartUpsActions } from "src/store/searchStartupsSlice";
import { sendMailToStartUpWithMandates } from "src/action/searchStartups";

const confirmInvitePitchModal = ({
  openModal,
  setMandatesList,
  setSelectedStartUpId,
  setOpenModal,
  selectedStartUpId,
  mandatesList,
  setCheckedMandates,
}) => {
  const dispatch = useDispatch();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;
  const adminId = userDetails?.id;

  console.log(userDetails);
  const confirmMandates = () => {
    if (userDetails?.role === "ADMINISTRATOR") {
      dispatch(sendMailToStartUpWithMandates("admin", selectedStartUpId, mandatesList, adminId));
    } else if (userDetails?.role === "INVESTOR")
      dispatch(
        sendMailToStartUpWithMandates("investor", selectedStartUpId, mandatesList, investorId)
      );
  };

  const response = useSelector((state) => state?.searchStartUps?.emailData);

  const handle_Close = () => {
    setOpenModal(false);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedStartUpId(0);
    setCheckedMandates([]);
    setMandatesList([]);
    dispatch(
      searchStartUpsActions.fetchResponseOfSendingMandates({
        emailData: {},
      })
    );
  };
  return (
    <>
      <Modal open={openModal} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "35px",
            paddingRight: "25px",
            paddingLeft: "25px",
            borderRadius: "10px",
            bgcolor: "#ffffff",
            boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.56)",
            p: 4,
          }}
        >
          {mandatesList?.length === 0 && response?.status === undefined ? (
            <Grid item md={8} direction="row">
              <Typography
                style={{
                  opacity: 1,
                  fontFamily: "Calibri",
                  fontWeight: 600,
                  fontSize: "17px",
                  color: "#595959",
                  letterSpacing: "0px",
                }}
                variant="body1"
                gutterBottom
              >
                <FormattedMessage
                  id="confirmInvitePitchModal.card.text1"
                  defaultMessage="Please select at least one mandate"
                />
              </Typography>
            </Grid>
          ) : response?.status === true ? (
            <Typography
              style={{
                opacity: 1,
                fontFamily: "Calibri",
                fontWeight: 600,
                fontSize: "17px",
                color: "#595959",
                letterSpacing: "0px",
              }}
              variant="body1"
              gutterBottom
            >
              {response?.message}
            </Typography>
          ) : (
            <Typography
              style={{
                opacity: 1,
                fontFamily: "Calibri",
                fontWeight: 600,
                fontSize: "17px",
                color: "#595959",
                letterSpacing: "0px",
              }}
              variant="body1"
              gutterBottom
            >
              <FormattedMessage
                id="confirmInvitePitchModal.card.text2"
                defaultMessage="Do you want this startup to pitch for your mandate?"
              />
            </Typography>
          )}
          <Grid item md={8} direction="row"></Grid>
          <Grid
            item
            md={8}
            direction="row"
            style={{ display: "flex", justifyContent: "space-evenly", marginTop: "25px" }}
          >
            {response?.status === true && mandatesList?.length > 0 ? (
              <Button
                onClick={() => handleClose()}
                variant="contained"
                size="small"
                style={{
                  fontSize: "15px",
                  fontFamily: "Calibri",
                  fontWeight: "bold",
                  width: "50px",
                  verticalAlign: "middle",
                  borderRadius: "25px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  backgroundColor: "#8a1538",
                  color: "#fff",
                }}
              >
                <FormattedMessage id="confirmInvitePitchModal.card.ok.button" defaultMessage="Ok" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    if (mandatesList?.length === 0) {
                      handle_Close();
                    } else {
                      confirmMandates();
                    }
                  }}
                  variant="contained"
                  size="small"
                  style={{
                    fontSize: "15px",
                    fontFamily: "Calibri",
                    fontWeight: "bold",
                    width: "50px",
                    verticalAlign: "middle",
                    borderRadius: "25px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    backgroundColor: "#8a1538",
                    color: "#fff",
                  }}
                >
                  <FormattedMessage
                    id="confirmInvitePitchModal.card.yes.button"
                    defaultMessage="Yes"
                  />
                </Button>
                <Button
                  onClick={() => handleClose()}
                  variant="contained"
                  size="small"
                  style={{
                    fontSize: "15px",
                    fontFamily: "Calibri",
                    fontWeight: "bold",
                    width: "50px",
                    verticalAlign: "middle",
                    borderRadius: "25px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    backgroundColor: "#8a1538",
                    color: "#fff",
                  }}
                >
                  <FormattedMessage
                    id="confirmInvitePitchModal.card.no.button"
                    defaultMessage="No"
                  />
                </Button>
              </>
            )}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

confirmInvitePitchModal.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default confirmInvitePitchModal;
