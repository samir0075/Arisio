import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid, TextField, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { FormattedMessage } from "react-intl";
import { emailRegex } from "src/components/validators";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Image from "next/image";
import styles from "../components/HomePageContent/Subscribe/subscribe.module.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function SubscribeModal({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
          sx={{ maxWidth: "350px" }}
        >
          <Grid container justifyContent="flex-end">
            <Box
              sx={{
                background: "#fff !important",
                borderRadius: "100%",
                position: "absolute",
                top: "25px",
                right: "30px",
                cursor: "pointer",
              }}
            >
              <CloseIcon
                onClick={handleClose}
                sx={{ position: "relative", top: "3px", padding: "3px" }}
              />
            </Box>
          </Grid>
          <Image
            loading="lazy"
            src="/Images/HomePage/newsletter.jpg"
            height="200"
            width="300"
            className={styles.image}
            style={{
              borderRadius: "10px",
              marginTop: "20px",
              objectFit: "cover",
            }}
            alt="News Image"
          />
          <DialogTitle>Join 500+ readers today</DialogTitle>

          <DialogContent sx={{ maxWidth: "350px" }}>
            <DialogContentText
              className={styles.heroText}
              id="alert-dialog-slide-description"
              sx={{ fontSize: "0.9rem", fontWeight: "500 !important" }}
            >
              Add Arisio to your inbox & get the latest financial insights for free.
            </DialogContentText>
            <Box>
              <Typography
                className={styles.points}
                sx={{ marginTop: "10px", fontSize: "0.9rem", fontWeight: "400 " }}
              >
                <CheckCircleOutlineRoundedIcon
                  sx={{
                    position: "relative",
                    top: "7px",
                    marginRight: "6px",
                    color: "rgba(108, 25, 62, 1)",
                  }}
                />{" "}
                Just 1 email every morning.
              </Typography>
              <Typography
                className={styles.points}
                sx={{ marginTop: "5px", fontSize: "0.9rem", fontWeight: "400" }}
              >
                <CheckCircleOutlineRoundedIcon
                  sx={{
                    position: "relative",
                    top: "7px",
                    marginRight: "10px",
                    color: "rgba(108, 25, 62, 1)",
                  }}
                />
                3-min easy reads.
              </Typography>
              <Typography
                className={styles.points}
                sx={{ marginTop: "5px", fontSize: "0.9rem", fontWeight: "400 " }}
              >
                {" "}
                <CheckCircleOutlineRoundedIcon
                  sx={{
                    position: "relative",
                    top: "7px",
                    marginRight: "10px",
                    color: "rgba(108, 25, 62, 1)",
                  }}
                />
                Plain simple english, no jargon.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container direction="column">
                <TextField
                  className={styles.textField}
                  id="outlined-basic"
                  variant="outlined"
                  placeholder="Enter your email address"
                  sx={{ width: "250px", marginTop: "20px" }}
                  {...register("email", { required: true })}
                />
                {errors.email && <span style={{ color: "red" }}>{errors.email?.message}</span>}
              </Grid>
              <Button
                type="submit"
                className={styles.button}
                sx={{
                  background: (theme) => `${theme.palette.neutral.buttonBackground} `,
                  "&:hover": {
                    background: (theme) => `${theme.palette.neutral.buttonBackground}`,
                  },
                  color: "#fff !important",
                  // marginLeft: "20px",
                  padding: "12px 30px",
                  marginTop: "10px",
                }}
              >
                SUBSCRIBE FOR FREE
              </Button>
            </form>
          </DialogContent>
        </Grid>
      </Dialog>
    </>
  );
}
