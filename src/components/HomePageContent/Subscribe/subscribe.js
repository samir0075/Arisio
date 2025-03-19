import { Button, Grid, TextField, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { emailRegex } from "src/components/validators";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup
  .object({
    email: yup
      .string()
      .trim()
      .required(
        <FormattedMessage id="homepage.email.required.errorMessage" defaultMessage="Enter Email" />
      )
      .matches(emailRegex, () => (
        <FormattedMessage
          id="scheduleMeeting.email.error.message"
          defaultMessage="Invalid email address "
        />
      ))
      .trim(),
  })
  .required();

const Subscribe = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const intl = useIntl();

  const onSubmit = (data) => {
    if (data) {
      toast.success("Successfully Subscribed !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      reset();
    }
  };

  const isMobileScreen = useMediaQuery("(max-width:1440px)");

  return (
    <>
      <Grid
        sx={{
          background: (theme) =>
            `linear-gradient(to right, ${theme.palette.neutral.primary} 0%,      
               
            ${theme.palette.neutral.tertiary} 150% )`,
        }}
        container
        justifyContent="center"
      >
        <Grid
          sx={{
            background: "#FFFFFF",
            padding: "20px",
            margin: "20px",
            maxWidth: isMobileScreen ? "1010px" : "1350px",
            borderRadius: "10px",
          }}
          container
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Grid item sx={{ marginTop: "10px" }}>
            <Typography sx={{ fontWeight: "700", fontSize: "1.25rem" }}>
              <FormattedMessage
                id="homepage.section.subscribers.tagline"
                defaultMessage="Join 500+ Subscribers"
              />
            </Typography>
          </Grid>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              sx={{
                marginTop: "20px",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <Grid container direction="column">
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  placeholder={intl.formatMessage({
                    id: "homepage.section.subscribers.email",
                    defaultMessage: "Enter your email address",
                  })}
                  // sx={{ width: "400px" }}
                  {...register("email", { required: true })}
                />
                {errors.email && <span style={{ color: "red" }}>{errors.email?.message}</span>}
              </Grid>

              <Button
                type="submit"
                sx={{
                  background: (theme) => `${theme.palette.neutral.buttonBackground}`,
                  color: "#fff !important",
                  padding: "12px 30px",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    background: (theme) => `${theme.palette.neutral.buttonBackground}`,
                  },
                }}
              >
                <FormattedMessage
                  id="homepage.section.subscribers.button"
                  defaultMessage="Subscribe"
                />
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default Subscribe;
