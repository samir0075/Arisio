import { Box, Button, Dialog, FormLabel, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import styles from "./Footer.module.css";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import { addContactUsForm } from "src/action/contactUs";
import { FormattedMessage, useIntl } from "react-intl";
// import style from "./NavBar.module.css";
import style from "../NavBar/NavBar.module.css";
const ContactUsModal = ({ dialogOpen, setDialogOpen }) => {
  const handleClose = () => {
    setDialogOpen(false);
  };

  /*
   ** Pattern Validator
   */
  const intl = useIntl();
  const dispatch = useDispatch();
  const schema = yup.object({
    name: yup.string().required("Please Enter Full Name "),
    email_id: yup
      .string()
      .required("Please Enter  Email")
      .matches(/^(?:\d{10}|\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+)$/, "Invalid email address"),
    phone: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.contactNo.errorMessage"
          defaultMessage="Enter the contact no."
        />
      )
      .matches(/^[0-9]+$/, () => (
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.contactNo.invalidErrorMessage"
          defaultMessage="Contact number should only contain numbers"
        />
      ))
      .min(
        8,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.contactNo.minLength.errorMessage"
          defaultMessage="Number should be at least 8 digits"
        />
      )
      .max(
        15,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.contactNo.maxLength.errorMessage"
          defaultMessage="Number should not exceed 15 digits"
        />
      ),
    message: yup.string().required("Please Enter  Message "),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const onSubmit = (data) => {
  //   console.log(data);
  //   /*
  //    **For Login
  //    */
  //   // dispatch(userSignIn({ emailId: data.emailId, password: data.password }));
  // };
  const onSubmit = (data) => {
    const message = intl.formatMessage({
      id: "myUpdateModal.addUpdat.successMessage",
      defaultMessage: "Submitted Successfully",
    });
    dispatch(addContactUsForm(data, message));
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid
          container
          direction="column"
          sx={{
            width: {
              xs: "265px", // width for mobile (extra-small and small screens)
              sm: "400px", // width for tablets (small and medium screens)
              md: "500px", // width for medium and larger screens (tablet and desktop)
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 40px",
            }}
          >
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: "600px",
                fontFamily: "Inter, sans-serif",
                color: "#0d4261",
              }}
            >
              Contact Us
            </Typography>
            <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="column" className={styles.formExternal}>
              <FormLabel className={styles.inputField}>
                Name <span className={styles.error}>*</span>
              </FormLabel>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Enter Name"
                {...register("name", { required: true })}
              />
              {errors.name && <span className={styles.error}>{errors.name?.message}</span>}
            </Grid>
            <Grid container direction="column" className={styles.formExternal}>
              <FormLabel className={styles.inputField}>
                Email <span className={styles.error}>*</span>
              </FormLabel>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Enter Email"
                {...register("email_id", { required: true })}
              />
              {errors.email_id && <span className={styles.error}>{errors.email_id?.message}</span>}
            </Grid>
            <Grid container direction="column" className={styles.formExternal}>
              <FormLabel className={styles.inputField}>
                Mobile No. <span className={styles.error}>*</span>
              </FormLabel>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Enter Mobile"
                {...register("phone", { required: true })}
              />
              {errors.phone && <span className={styles.error}>{errors.phone?.message}</span>}
            </Grid>
            <Grid container direction="column" className={styles.formExternal}>
              <FormLabel className={styles.inputField}>
                Message <span className={styles.error}>*</span>
              </FormLabel>
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="Enter your Message"
                multiline
                rows={4}
                {...register("message", { required: true })}
              />
              {errors.message && <span className={styles.error}>{errors.message?.message}</span>}
            </Grid>
            <Grid container justifyContent="flex-end" style={{ padding: "10px 30px" }}>
              <Button
                size="small"
                type="submit"
                className={style.Button}
                // sx={{
                //   background: "#FF6002",
                //   color: "#fff",
                // }}
              >
                Submit
              </Button>
            </Grid>
          </form>
        </Grid>
      </Dialog>
    </>
  );
};

export default ContactUsModal;
