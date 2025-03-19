import { Button, Dialog, Grid, Typography } from "@mui/material";
import React from "react";
import styles from "./StartupPitch/StartupPitch.module.css";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

const ConfirmationMsg = ({ dialogOpen, setDialogOpen }) => {
  const router = useRouter();
  const handleClose = () => {
    setDialogOpen(false);
  };
  const handleDelete = () => {
    router.push("/MyPitches");
  };
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid sx={{ p: 4 }}>
          <Typography className={styles.inputField}>
            <FormattedMessage
              id="confirmationMsg.title"
              defaultMessage="Are you sure you want to cancel the pitch ?"
            />{" "}
          </Typography>
          <Grid container justifyContent="center">
            <Button
              onClick={handleDelete}
              type="submit"
              style={{ marginLeft: "15px" }}
              className={styles.nextButton}
            >
              <FormattedMessage id="confirmationMsg.yesButton.title" defaultMessage="Yes" />
            </Button>
            <Button
              className={styles.nextButton}
              sx={{ backgroundColor: "#F5F5F5 !important", marginLeft: "5px" }}
              onClick={handleClose}
            >
              <FormattedMessage id="confirmationMsg.noButton.title" defaultMessage="No" />
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default ConfirmationMsg;
