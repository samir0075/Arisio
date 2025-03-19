import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState } from "react";
import styles from "../SignupLoginModal.module.css";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  forgetPassword,
  getInvestorProfileCheck,
  userSignIn,
  captchVerification,
} from "../../../../action/signIn";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/use-auth";
import { FormattedMessage, useIntl } from "react-intl";
import { getInputStyles } from "../inputTextcss";
import { toast } from "react-toastify";
import { signInEmailRegex } from "../../../validators";
import Captcha from "src/components/Captcha";

const InvestorLogin = ({ handleAction }) => {
  const inputStyles = getInputStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useAuth();

  const recaptchaRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [emailId, setEmailId] = useState("");

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setMsg("");
    // setPasswordBoxOpen(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /*
   ** Pattern Validator
   */

  const schema = yup.object({
    emailId: yup
      .string()
      .required(
        <FormattedMessage id="investor.login.email.required" defaultMessage="Please Enter Email" />
      )
      .matches(signInEmailRegex, () => (
        <FormattedMessage id="investor.login.email.regex" defaultMessage="Invalid email address" />
      )),
    password: yup
      .string()
      .required(
        <FormattedMessage
          id="investor.login.password.required"
          defaultMessage="Please Enter Password "
        />
      ),
  });

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const userType = "investor";

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // CAPTCHA Verification
      const captcha = { captchaValue };
      const captchaResponse = await dispatch(captchVerification(captcha));

      if (captchaResponse?.success !== true) {
        setLoading(false);
        setError("Failed to validate reCAPTCHA");
        return;
      }
      /*
       **For Login
       */
      dispatch(
        userSignIn(
          { emailId: data.emailId.trim(), password: data.password, usertype_id: 3 },
          userType
        )
      )
        .then((res) => {
          console.log(res);

          if (res?.role === "INVESTOR" && res?.role_id) {
            auth?.signIn();
            const investorId = res?.investorId;
            console.log(res?.investorId);
            console.log(res?.status);
            console.log(res?.investorId !== null && res?.status === 4);

            if (res?.investorId !== null) {
              dispatch(getInvestorProfileCheck(investorId)).then((response) => {
                localStorage.setItem("isProfileUpdated", JSON.stringify(response));
                if (response?.isProfileUpdated === 0) {
                  toast.warn("Please update your profile to perform any actions.", {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }
              });
              if (res?.investorId !== null && res?.status === 1) {
                router.replace("/SearchStartups");
              } else if (res?.investorId !== null && res?.status === 3) {
                router.push("./Profile");
                toast.warn("Please wait for admin to approve it  !", {
                  position: "top-right",
                  autoClose: 10000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              } else if (res?.investorId !== null && res?.status === 2) {
                router.push("./Profile");
                toast.warn(
                  "Your profile is rejected, Please update the profile based on rejection reason!",
                  {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }
                );
              } else if (res?.investorId !== null && res?.status === 4) {
                toast.warn("Please Update the profile to access the platform!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                router.push("./SignUpProfileStepper/ProfileStepperModal");
              }
            } else if (res?.investorId === null) {
              router.push("./SignUpProfileStepper/ProfileStepperModal");
              toast.warn("Please Update the profile to perform any sort of action.", {
                position: "top-right",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          } else if (res !== true) {
            recaptchaRef.current.reset();
          }
          // else {
          //   if (typeof res !== "string") {
          //     toast.error("Please check your credentials !", {
          //       position: "top-right",
          //       autoClose: 3000,
          //       hideProgressBar: false,
          //       closeOnClick: true,
          //       pauseOnHover: true,
          //       draggable: true,
          //       progress: undefined,
          //     });
          //   }
          // }
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
      setError("An error occurred during the login process.");
    } finally {
      setLoading(false);
    }
  };
  const togglePassVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleEmail = (e) => {
    setEmailId(e.target.value);
  };
  const onEmailSubmit = () => {
    dispatch(forgetPassword(emailId)).then((res) => {
      if (res?.message) {
        setMsg(res?.message);
        setOpen(false);
        setEmailId("");
      }
    });

    setConfirmationOpen(true);
  };

  const intl = useIntl();
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Box className={styles.inputExternal}>
            <FormLabel style={{ display: "flex", margin: "10px 0px" }}>
              <FormattedMessage id="investor.login.email.textfield" defaultMessage="Email" />
              <span className={styles.error}>*</span>
            </FormLabel>
            <TextField
              fullWidth
              size="small"
              id="outlined-basic"
              variant="outlined"
              InputProps={{
                sx: inputStyles, // Apply the styles generated by the function
              }}
              placeholder={intl.formatMessage({
                id: "investor.login.email.placeholder",
                defaultMessage: "Enter Email ",
              })}
              {...register("emailId", { required: true })}
            />
            {errors.emailId && <span className={styles.error}>{errors.emailId?.message}</span>}
          </Box>

          <Box className={styles.inputExternal}>
            <FormLabel style={{ display: "flex", margin: "10px 0px" }}>
              <FormattedMessage id="investor.login.Password.textfield" defaultMessage=" Password" />{" "}
              <span className={styles.error}>*</span>
            </FormLabel>
            <TextField
              fullWidth
              size="small"
              id="outlined-basic"
              variant="outlined"
              placeholder={intl.formatMessage({
                id: "investor.login.password.placeholder",
                defaultMessage: "Enter Password",
              })}
              {...register("password", { required: true })}
              type={isPasswordVisible ? "text" : "password"}
              InputProps={{
                sx: inputStyles,
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={togglePassVisibility}
                    sx={{ cursor: "pointer" }}
                  >
                    {isPasswordVisible ? (
                      <img src="/Images/Eye.png" />
                    ) : (
                      <img src="/Images/Eye1.png" />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            {errors.password && <span className={styles.error}>{errors.password?.message}</span>}
          </Box>

          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              onClick={handleClickOpen}
              style={{ fontSize: "0.7rem", color: "#8A1538", cursor: "pointer" }}
            >
              <FormattedMessage
                id="investor.login.ForgotPassword.button"
                defaultMessage="Forgot Password"
              />
            </Typography>
          </Box>

          <Captcha
            setLoading={setLoading}
            setError={setError}
            error={error}
            setCaptchaValue={setCaptchaValue}
            recaptchaRef={recaptchaRef}
          />

          <Box>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                {" "}
                <FormattedMessage
                  id="investor.login.forgotPassword.title"
                  defaultMessage="Forgot Password"
                />
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <FormattedMessage
                    id="investor.login.forgotPassword.textfield"
                    defaultMessage="Please enter your email address here. We will send link to generate password."
                  />{" "}
                </DialogContentText>
                <TextField
                  fullWidth
                  size="small"
                  value={emailId}
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    sx: inputStyles,
                  }}
                  placeholder={intl.formatMessage({
                    id: "investor.login.email.placeholder",
                    defaultMessage: "Enter Email ",
                  })}
                  onChange={handleEmail}
                  required
                  error={emailId.trim() === ""}
                  helperText={
                    emailId.trim() === "" ? (
                      <FormattedMessage
                        id="investor.login.forgotPassword.email.required"
                        defaultMessage="Email id is required"
                      />
                    ) : (
                      ""
                    )
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button size="small" onClick={handleClose}>
                  {" "}
                  <FormattedMessage
                    id="investor.login.forgotPassword.Cancel.button"
                    defaultMessage="Cancel"
                  />
                </Button>
                <Button
                  size="small"
                  onClick={onEmailSubmit}
                  disabled={emailId.trim() === ""}
                  type="submit"
                >
                  <FormattedMessage
                    id="investor.login.forgotPassword.Submit.button"
                    defaultMessage="Submit"
                  />
                </Button>
              </DialogActions>
            </Dialog>
            {msg ? (
              <Box>
                <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
                  <DialogContentText style={{ padding: "20px" }}>{msg}</DialogContentText>
                  <DialogActions>
                    <Button
                      size="small"
                      style={{ backgroundColor: "rgba(108, 25, 62, 1)", color: "#ffff" }}
                      onClick={handleConfirmationClose}
                    >
                      <FormattedMessage
                        id="investor.login.forgotPassword.Ok.button"
                        defaultMessage="  Ok"
                      />{" "}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            ) : (
              ""
            )}
          </Box>
        </Box>

        <Box>
          <Button
            size="small"
            style={{
              background: loading ? "grey" : "#8A1538",
              color: "#ffff",
              padding: "6px 20px",
              fontSize: "0.7rem",
              borderRadius: "3px",
              width: "100%",
              marginTop: "10px",
            }}
            type="submit"
            disabled={loading}
          >
            <Typography style={{ fontSize: "0.7rem", fontWeight: "600" }}>
              <FormattedMessage id="investor.login.SignIn.button" defaultMessage="Sign In" />
            </Typography>
          </Button>
        </Box>
      </form>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px 0px",
        }}
      >
        <Typography style={{ fontSize: "0.6rem", marginRight: "5px" }}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <FormattedMessage
            id="investor.login.notHavingAccount"
            defaultMessage="Don't have an account ?"
          />{" "}
        </Typography>
        <Typography
          style={{ fontSize: "0.6rem", fontWeight: "600", color: "#8A1538", cursor: "pointer" }}
          onClick={handleAction}
        >
          <FormattedMessage id="investor.login.SignUp.button" defaultMessage="Sign Up" />
        </Typography>
      </Box>
    </>
  );
};

export default InvestorLogin;
