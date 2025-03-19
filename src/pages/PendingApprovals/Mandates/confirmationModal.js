import { Button, Dialog, Grid, Slide, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./mandates.module.css";
import { approveMandate, rejectMandate } from "src/action/pendingApprovals";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ConfirmationModal = ({
  confirmDialogOpen,
  page,
  setConfirmDialogModal,
  setDialogOpen,
  adminId,
  selectedMandateId,
  action
}) => {
  const handleClose = () => {
    setConfirmDialogModal(false);
  };
  const [remark, setRemark] = useState("");
  const dispatch = useDispatch();

  console.log();

  // const handleApproval = () => {
  //   action === "Do you want to approve this mandate ?"
  //     ? dispatch(approveMandate(adminId, selectedMandateId, page))
  //     : remark === ""
  //     ? toast.error("Please mention the remarks !", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       })
  //     : dispatch(
  //         rejectMandate(adminId, selectedMandateId, page, {
  //           reason: remark,
  //         })
  //       );
  //   setConfirmDialogModal(false);
  //   setDialogOpen(false);
  // };

  const handleApproval = () => {
    if (action === "Do you want to approve this mandate ?") {
      dispatch(approveMandate(adminId, selectedMandateId, page));
      setConfirmDialogModal(false);
      setDialogOpen(false);
    } else {
      if (remark === "" || remark.trim() === "") {
        toast.error("Please mention the remarks !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      } else {
        dispatch(rejectMandate(adminId, selectedMandateId, page, { reason: remark }));
        setConfirmDialogModal(false);
        setDialogOpen(false);
      }
    }
  };

  const handleRejection = () => {
    setConfirmDialogModal(false);
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={confirmDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CancelIcon
          sx={{ fontSize: "1.2rem" }}
          color="disabled"
          style={{
            cursor: "pointer",
            display: "flex",
            position: "absolute",
            right: "10px",
            top: "10px"
          }}
          onClick={handleClose}
        />
        <Grid
          container
          justifyContent="center"
          sx={{ p: 3, width: "auto !important", gap: "10px" }}
        >
          <Typography className={styles.dateColor}>{action}</Typography>
          {action !== "Do you want to approve this mandate ?" ? (
            <TextField
              required
              id="outlined-textarea"
              placeholder="Enter Reason for Rejection"
              multiline
              value={remark}
              size="small"
              fullWidth
              // style={{ padding: "0px 30px" }}
              onChange={e => setRemark(e.target.value)}

              //   {...register("name")}
            />
          ) : (
            " "
          )}
          <Grid container justifyContent="space-around">
            <Button className={styles.backButtonColor} type="submit" onClick={handleRejection}>
              <FormattedMessage
                id="pendingApproval.confirmationModal.noButton.title"
                defaultMessage="No"
              />
            </Button>
            <Button className={styles.nextButton} type="submit" onClick={handleApproval}>
              <FormattedMessage
                id="pendingApproval.confirmationModal.yesButton.title"
                defaultMessage="Yes"
              />
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default ConfirmationModal;
