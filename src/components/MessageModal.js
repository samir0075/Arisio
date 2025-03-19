import { Box, Button, Dialog, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import EmailIcon from "@mui/icons-material/Email";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  getSelectedMandateStatus,
  sendMessage,
  sendMessageShortlistedStartup,
} from "src/action/investorMandates";
import { FormattedMessage, useIntl } from "react-intl";
import CancelIcon from "@mui/icons-material/Cancel";

const schema = yup
  .object({
    message: yup
      .string()
      .required(
        <FormattedMessage
          id="messageModal.card.heading2.placeholder"
          defaultMessage="Enter Message"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="messageModal.card.heading2.placeholder.MinLength"
          defaultMessage="Minimun 2 Character required"
        />
      )
      .max(
        300,
        <FormattedMessage
          id="messageModal.card.heading2.placeholder.MaxLength"
          defaultMessage="Maximum 300 characters are allowed"
        />
      ),
  })
  .required();

const MessageModal = ({
  messageDialog,
  setMessageDialog,
  startupProfile,
  shortListStartUpMessage,
  contactedMandateId,
}) => {
  const intl = useIntl();
  const handleClose = () => {
    setMessageDialog(false);
  };

  const dispatch = useDispatch();

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const id = userDetails?.id;

  const selectedMandateId = localStorage.getItem("selectedMandateId");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("to", startupProfile?.startup?.organizationName || "");
  }, [startupProfile, setValue]);

  console.log(investorId);

  const onSubmit = (data) => {
    const startupId = startupProfile?.startup?.user?.id;
    const applicationId = startupProfile?.id;
    if (shortListStartUpMessage) {
      dispatch(sendMessageShortlistedStartup(id, startupId, data, intl)).then((res) => {
        setMessageDialog(false);
      });
    } else {
      dispatch(sendMessage(id, startupId, selectedMandateId, applicationId, data, intl)).then(
        (res) => {
          setMessageDialog();
          dispatch(getSelectedMandateStatus(investorId, selectedMandateId));
        }
      );
    }
  };

  // sendMessageShortlistedStartup
  return (
    <>
      {" "}
      <Dialog
        open={messageDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid sx={{ p: 4, width: { xs: "none", sm: "auto", md: "550px" } }}>
          <Grid container sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex" }}>
              <EmailIcon sx={{ position: "relative", right: "5px" }} />
              <Typography sx={{ fontWeight: 600 }}>
                {" "}
                <FormattedMessage id="messageModal.card.heading" defaultMessage="Send Message" />
              </Typography>
            </Box>
            <CancelIcon
              onClick={handleClose}
              sx={{ fontSize: "1.2rem" }}
              // color="disabled"
              style={{ cursor: "pointer", width: "40px", alignItems: "center" }}
            />
          </Grid>
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "10px" }}>
            <Grid sx={{ my: 2 }}>
              <Typography>
                <FormattedMessage id="messageModal.card.heading3" defaultMessage="To" />
              </Typography>
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                placeholder=""
                {...register("to")}
                disabled
              />
            </Grid>
            <Grid sx={{ my: 2 }}>
              <Typography>
                <FormattedMessage id="messageModal.card.heading2" defaultMessage="Message" />{" "}
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                multiline
                minRows={2}
                placeholder={intl.formatMessage({
                  id: "messageModal.card.heading2.placeholder",
                  defaultMessage: "Enter Message",
                })}
                {...register("message", { required: true })}
              />
              {errors.message && <span style={{ color: "red" }}>{errors.message?.message}</span>}
            </Grid>
            <Grid container justifyContent="flex-end" sx={{ marginTop: "20px" }}>
              <Button type="submit" sx={{ bgcolor: "rgba(138, 21, 56, 0.15) !important" }}>
                <FormattedMessage id="messageModal.card.button" defaultMessage="Send" />
              </Button>
            </Grid>
          </form>
        </Grid>
      </Dialog>
    </>
  );
};

export default MessageModal;
