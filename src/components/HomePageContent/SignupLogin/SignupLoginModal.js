import { Dialog, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";

import React, { useEffect, useState } from "react";
import styles from "./SignupLoginModal.module.css";
import CustomTabPanel from "./CustomTabPanel";
import { useRouter } from "next/router";

const SignupLoginModal = ({ dialogOpen, setDialogOpen, selectedCardTitle, tabValue }) => {
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
        sx={{
          "& .MuiDialog-paper": {
            width: "350px",
          },
        }}
      >
        {/* <Typography sx={{ fontSize: "1.2rem", fontWeight: "600", px: 2, pt: 2, color: "#8A1538" }}>
          Welcome!
        </Typography> */}
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            xl={12}
            sx={{ maxHeight: "520px !important", overflow: "auto" }}
          >
            <CustomTabPanel onClose={handleClose} setDialogOpen={setDialogOpen} />
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default SignupLoginModal;
