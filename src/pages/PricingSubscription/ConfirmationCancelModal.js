import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import {
  getSelectedMandateStatus,
  saveForRejection,
  saveForShortlist,
  saveForWatchList,
} from "src/action/investorMandates";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import { sendRequest } from "src/utils/request";
import { getActivePlan } from "src/action/payment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationCancelModal = ({ confirmationDialogOpen, setConfirmationDialogOpen, recsid }) => {
  const dispatch = useDispatch();

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const role = userDetails?.role;

  const handleClose = () => {
    setConfirmationDialogOpen(false);
  };

  const handleSubmit = () => {
    if (userDetails?.role === "INVESTOR") {
      sendRequest(`investor/cancelSubscription`, "post", {
        Id: recsid,
      })
        .then((resp) => {
          setConfirmationDialogOpen(false);
          toast.success(resp?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          dispatch(getActivePlan(role));
        })
        .catch((err) => {
          setConfirmationDialogOpen(false);
          toast.error(err?.response?.data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      sendRequest(`startup/cancelSubscription`, "post", {
        Id: recsid,
      })
        .then((resp) => {
          setConfirmationDialogOpen(false);
          toast.success(resp?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          dispatch(getActivePlan(role));
        })
        .catch((err) => {
          setConfirmationDialogOpen(false);
          toast.error(err?.response?.data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };
  return (
    <>
      <Dialog
        open={confirmationDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" sx={{ padding: "10px 0" }}>
            Are you sure you want to cancel your subscription?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ gap: "8px" }}>
          <Button sx={{ bgcolor: "#F5F5F5" }} onClick={handleClose}>
            <FormattedMessage id="confirmation.modal.button.no" defaultMessage="No" />
          </Button>
          <Button sx={{ bgcolor: "rgba(138, 21, 56, 0.15)" }} onClick={handleSubmit}>
            <FormattedMessage id="confirmation.modal.button.yes" defaultMessage="Yes" />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationCancelModal;
