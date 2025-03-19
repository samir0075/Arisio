import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
// import styles from "./mandates.module.css";
import { getButtonCss } from "src/utils/util";
import { getApprovalOrRejectionNews } from "src/action/pendingApprovals";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ConfirmationModal = ({
  dialogOpen,
  setDialogOpen,
  selectedNewsId,
  action,
  inputTextShow,
}) => {
  const dispatch = useDispatch();
  const ButtonCss = getButtonCss();
  const [remark, setRemark] = useState("");
  const router = useRouter();

  //   const handleApproval = () => {
  //     action === "Do you want to approve this mandate ?"
  //       ? dispatch(approveMandate(adminId, selectedNewsId))
  //       : dispatch(rejectMandate(adminId, selectedNewsId));
  //     setConfirmDialogModal(false);
  //     // setDialogOpen(false);
  //   };
  //   const handleRejection = () => {
  //     setConfirmDialogModal(false);
  //     // setDialogOpen(false);
  //   };

  const onApproval = (e) => {
    dispatch(getApprovalOrRejectionNews(selectedNewsId, 1)).then((result) => {
      console.log(result);
      if (result?.status === true) {
        setDialogOpen(false);
        router.push("/PendingApprovals/PendingNews");
      }
    });
  };

  const onRejection = (e) => {
    e.preventDefault();
    if (inputTextShow === 1 && remark.trim() === "") {
      toast.error("Please mention the remarks !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    } else {
      const body = {
        reason: remark,
      };
      dispatch(getApprovalOrRejectionNews(selectedNewsId, 2, body)).then((result) => {
        console.log(result);
        if (result?.status === true) {
          setDialogOpen(false);
          router.push("/PendingApprovals/PendingNews");
        }
      });
    }
  };
  const handleClose = () => {
    setDialogOpen(false);
  };
  return (
    <>
      <Dialog
        // TransitionComponent={Transition}
        // keepMounted
        // open={confirmDialogOpen}
        // onClose={handleClose}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
        open={dialogOpen}
      >
        {/* <Grid container justifyContent="center" sx={{ p: 3, width: "400px !important" }}>
          <Typography>{action}</Typography>
          <Grid container justifyContent="space-around">
            <Button
              type="submit"
              style={{ ...ButtonCss, marginRight: "10px", background: "green", color: "#fff" }}
              onClick={handleRejection}
            >
              <FormattedMessage
                id="pendingApproval.confirmationModal.yesButton.title"
                defaultMessage="Yes"
              />
            </Button>
            <Button
              type="submit"
              style={{ ...ButtonCss, marginRight: "10px", background: "#d32f2f", color: "#fff" }}
              onClick={handleApproval}
            >
              <FormattedMessage
                id="pendingApproval.confirmationModal.noButton.title"
                defaultMessage="No"
              />
            </Button>
          </Grid>
        </Grid> */}
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
        <DialogTitle>
          <Typography style={{ fontSize: "0.9rem", fontWeight: "600", paddingTop: "20px" }}>
            {action}
          </Typography>
        </DialogTitle>
        {inputTextShow === 1 ? (
          <form>
            <FormControl size="small" fullWidth sx={{ width: "100%", marginTop: 0 }}>
              <FormLabel
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "0px 20px",
                  // marginLeft: "15px",
                }}
              >
                Description
                <div style={{ color: "red" }}>*</div>
              </FormLabel>
              <TextField
                required
                id="outlined-textarea"
                placeholder="Enter Reason for Rejection"
                multiline
                value={remark}
                size="small"
                fullWidth
                style={{ padding: "0px 20px" }}
                onChange={(e) => setRemark(e.target.value)}

                //   {...register("name")}
              />
            </FormControl>
            <DialogActions>
              <Button
                style={{ ...ButtonCss, margin: "10px", background: "#d32f2f", color: "white" }}
                onClick={handleClose}
              >
                No
              </Button>
              <Button
                onClick={onRejection}
                style={{ ...ButtonCss, margin: "10px", backgroundColor: "green", color: "white" }}
                type="submit"
              >
                Yes
              </Button>
            </DialogActions>
          </form>
        ) : (
          <DialogActions>
            <Button
              style={{ ...ButtonCss, margin: "10px", background: "#d32f2f", color: "white" }}
              onClick={handleClose}
            >
              No
            </Button>
            <Button
              onClick={onApproval}
              style={{ ...ButtonCss, margin: "10px", backgroundColor: "green", color: "white" }}
              type="submit"
            >
              Yes
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default ConfirmationModal;
