import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { getButtonCss } from "src/utils/util";
import { FormControl, FormLabel, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { getApprovalOrRejection } from "src/action/pendingApprovals";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";

const ConfirmationDialog = ({ dialogOpen, setDialogOpen, action, inputTextShow }) => {
  const dispatch = useDispatch();

  console.log(inputTextShow);
  const ButtonCss = getButtonCss();
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const adminId = userDetails?.id;
  const [remark, setRemark] = useState("");

  const startupDetails = JSON.parse(localStorage.getItem("userData"));
  const userId = startupDetails?.id;

  const router = useRouter();

  const onApproval = (e) => {
    dispatch(getApprovalOrRejection(adminId, userId, 1)).then((result) => {
      console.log(result);
      if (result?.status === true) {
        setDialogOpen(false);
        router.push("/PendingApprovals/Startups");
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
      dispatch(getApprovalOrRejection(adminId, userId, 2, body)).then((result) => {
        console.log(result);
        if (result?.status === true) {
          setDialogOpen(false);
          router.push("/PendingApprovals/Startups");
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
        open={dialogOpen}
        // fullWidth
        sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "60%" } }}
      >
        <CancelIcon
          sx={{ fontSize: "1.2rem" }}
          color="disabled"
          style={{
            cursor: "pointer",
            display: "flex",
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
          onClick={handleClose}
        />
        <DialogTitle>
          <Typography style={{ fontSize: "0.9rem", fontWeight: "600" }}>{action}</Typography>
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
export default ConfirmationDialog;
