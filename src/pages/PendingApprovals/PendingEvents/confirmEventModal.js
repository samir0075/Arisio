/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";
import { approveOrRejectTheEvent } from "src/action/events";
import { getButtonCss } from "src/utils/util";
import { toast } from "react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";

const confirmEventModal = ({ openModal, setOpenModal, selectedEventId, eventStatus }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const ButtonCss = getButtonCss();
  const handleClose = () => {
    setOpenModal(false);
  };
  const [remark, setRemark] = useState("");

  const handleRejection = () => {
    if (eventStatus !== 1 && remark.trim() === "") {
      toast.error("Please mention the remarks !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      dispatch(approveOrRejectTheEvent(selectedEventId, eventStatus, remark));
      router.push("/PendingApprovals/PendingEvents");
      setOpenModal(false);
    }
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
            p: 4,
          }}
        >
          <CancelIcon
            color="disabled"
            style={{
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              position: "absolute",
              right: "10px",
              top: "10px",
            }}
            onClick={handleClose}
          />
          <Typography
            style={{
              opacity: 1,
              fontFamily: "Calibri",
              fontWeight: 600,
              fontSize: "17px",
              color: "#595959",
              letterSpacing: "0px",
              padding: "8px",
            }}
            variant="body1"
            gutterBottom
          >
            {eventStatus === 1 ? (
              <FormattedMessage
                id="confirmEventModal.card.text.approve"
                defaultMessage="Do you want to Approve this Event ?"
              />
            ) : (
              <FormattedMessage
                id="confirmEventModal.card.text.reject"
                defaultMessage="Do you want to Reject this Event ?"
              />
            )}
          </Typography>
          {eventStatus !== 1 ? (
            <TextField
              required
              id="outlined-textarea"
              placeholder="Enter Reason for Rejection"
              multiline
              value={remark}
              size="small"
              fullWidth
              // style={{ padding: "0px 20px" }}
              onChange={(e) => setRemark(e.target.value)}

              //   {...register("name")}
            />
          ) : (
            " "
          )}
          <Grid item md={8} direction="row"></Grid>
          <Grid
            item
            md={8}
            direction="row"
            style={{ display: "flex", justifyContent: "space-evenly", marginTop: "25px" }}
          >
            <Button
              onClick={handleRejection}
              size="small"
              sx={{
                ...ButtonCss,
                marginRight: "10px",
                height: "37px",
                background: "green",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "green", // Keep the same background on hover
                },
              }}
            >
              <FormattedMessage id="confirmEventModal.card.ok.button" defaultMessage="Yes" />
            </Button>
            <Button
              onClick={() => handleClose()}
              size="small"
              sx={{
                ...ButtonCss,
                marginRight: "10px",
                height: "37px",
                background: "#d32f2f",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#d32f2f", // Keep the same background on hover
                },
              }}
            >
              <FormattedMessage id="confirmEventModal.card.no.button" defaultMessage="Cancel" />
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
export default confirmEventModal;
