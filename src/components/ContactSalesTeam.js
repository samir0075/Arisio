import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";

const ContactSalesTeam = ({ dialogOpen, setDialogOpen }) => {
  const handleClose = () => {
    setDialogOpen(false);
  };

  const dispatch = useDispatch();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth={"xs"}>
        <DialogTitle sx={{ fontSize: "18px" }}>Upgrade Subscription</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "16px" }}>Dear {userDetails.name}</Typography>
          <Typography sx={{ padding: "10px 0px" }}>
            For more features and a Better user Experience. please Contact our Sales Team.{" "}
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>Contact No : +974 – 44654622</Typography>
          <Typography sx={{ fontWeight: 600 }}>Email id : salesteam@hyperthing.in</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactSalesTeam;
