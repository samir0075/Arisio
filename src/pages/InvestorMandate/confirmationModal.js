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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationModal = ({ message, dialogOpen, setDialogOpen }) => {
  const dispatch = useDispatch();

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;

  const mandateId = localStorage.getItem("selectedMandateId");

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    const startupId = message?.data?.id;
    const messageData = message?.msg?.props?.defaultMessage;
    messageData === "Are you sure you want to watch this startup?"
      ? dispatch(saveForWatchList(investorId, mandateId, startupId)).then((res) => {
          if (res.message === "success") dispatch(getSelectedMandateStatus(investorId, mandateId));
        })
      : messageData === "Are you sure you want to shortlist this startup?"
      ? dispatch(saveForShortlist(investorId, mandateId, startupId)).then((res) => {
          if (res.message === "success") dispatch(getSelectedMandateStatus(investorId, mandateId));
        })
      : dispatch(saveForRejection(investorId, mandateId, startupId)).then((res) => {
          console.log("res", res);

          if (res.message === "success") {
            dispatch(getSelectedMandateStatus(investorId, mandateId));
          } else {
            toast.error(res.message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
    setDialogOpen(false);
  };
  return (
    <>
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{message?.msg}</DialogContentText>
        </DialogContent>
        <DialogActions>
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

export default ConfirmationModal;
