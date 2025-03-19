/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { Button, Grid, Modal, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { manageMandatesStatus } from "src/action/investorMandates";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";

const mandateStatusModal = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;
  const mandateShortDetails = useSelector((state) => state.investorMandates.shortDetails);

  const mandateId = mandateShortDetails?.id ? mandateShortDetails?.id : null;

  const handleYesButton = () => {
    setOpenModal(false);
    const activeId = mandateShortDetails?.is_active === 1 ? 0 : 1;
    dispatch(manageMandatesStatus(investorId, mandateId, activeId));
    // router.back();
  };

  const handleClose = () => {
    setOpenModal(false);
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
          <CancelIcon
            sx={{
              position: "absolute",
              top: "10px", // Adjust to your liking
              right: "10px", // Adjust to your liking
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
            color="disabled"
            onClick={handleClose}
          />
          <Grid container direction="row">
            <Grid item>
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
                  id="mandateStatusModal.card.heading.text1"
                  defaultMessage="Are you sure you want to"
                />{" "}
                {mandateShortDetails?.is_active === 1 ? (
                  <FormattedMessage
                    id="mandateStatusModal.card.heading.text3"
                    defaultMessage="close"
                  />
                ) : (
                  <FormattedMessage
                    id="mandateStatusModal.card.heading.text4"
                    defaultMessage="open"
                  />
                )}{" "}
                <FormattedMessage
                  id="mandateStatusModal.card.heading.text2"
                  defaultMessage="this mandate?"
                />
              </Typography>
            </Grid>
          </Grid>
          <Grid item md={8} direction="row"></Grid>
          <Grid
            item
            md={8}
            direction="row"
            style={{ display: "flex", justifyContent: "space-evenly", marginTop: "25px" }}
          >
            <>
              <Button
                onClick={() => {
                  handleYesButton();
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
                <FormattedMessage id="mandateStatusModal.button.text1" defaultMessage="Yes" />
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
                <FormattedMessage id="mandateStatusModal.button.text2" defaultMessage="No" />
              </Button>
            </>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

mandateStatusModal.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default mandateStatusModal;
