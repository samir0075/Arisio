import { Button, Dialog, Grid, Typography } from "@mui/material";
import React from "react";
import styles from "./StartupPitch/StartupPitch.module.css";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

const ConfirmationModal = ({ dialogOpen, setDialogOpen, title, handleSave }) => {
  const router = useRouter();
  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid sx={{ p: 4 }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: "600", textAlign: "center" }}>
            {title}
          </Typography>
          <Grid container justifyContent="center">
            <Button
              onClick={handleSave}
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

export default ConfirmationModal;
