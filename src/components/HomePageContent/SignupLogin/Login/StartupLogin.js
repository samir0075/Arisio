import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState } from "react";
import styles from "../SignupLoginModal.module.css";
import { Button } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  captchVerification,
  forgetPassword,
  getInvestorProfileCheck,
  getUserProfile,
  userSignIn,
} from "../../../../action/signIn";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/use-auth";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { getInputStyles } from "../inputTextcss";
import { signInEmailRegex } from "../../../validators";
import Captcha from "src/components/Captcha";

const StartupLogin = ({ handleAction }) => {
  const inputStyles = getInputStyles();
  const dispatch = useDispatch();
  const intl = useIntl();
  const router = useRouter();
  const auth = useAuth();
  const [emailId, setEmailId] = useState("");

  const recaptchaRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [captchaValue, setCaptchaValue] = useState(null);

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [confirmationOpen, setConfirmationOpen] = useState(false);

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

  const userTypes = [
    {
      id: 4,
      name: "Startup",
    },
    {
      id: 3,
      name: "Investor",
    },
    {
      id: 13,
      name: "Individual",
    },
    {
      id: 2,
      name: "Mentor",
    },
  ];
  const schema = yup.object({
    emailId: yup
      .string()
      .required(
        <FormattedMessage id="startUp.login.email.required" defaultMessage="Please Enter Email" />
      )
      .matches(signInEmailRegex, () => (
        <FormattedMessage id="startUp.login.email.regex" defaultMessage="Invalid email address" />
      )),
    password: yup
      .string()
      .required(
        <FormattedMessage
          id="startUp.login.password.required"
          defaultMessage="Please Enter Password "
        />
      ),
    role: yup
      .string()
      .required(
        <FormattedMessage id="startUp.login.role.required" defaultMessage="Please select Role" />
      ),
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const userType = "startup";

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // CAPTCHA Verification
      const captcha = { captchaValue };
      const captchaResponse = await dispatch(captchVerification(captcha));

      if (!captchaResponse?.success) {
        setError("Failed to validate reCAPTCHA");
        return;
      }

      // if (data.role === "14") {
      //   router.push("/Profile");
      // } else {
      /*
       **For Login
       */
      dispatch(
        userSignIn({
          emailId: data.emailId.trim(),
          password: data.password,
          usertype_id: data.role,
        })
      )
        .then((res) => {
          console.log(res);

          if (res?.startupId) {
            auth?.signIn();
            const startupId = res?.startupId;

            if (res?.status === 1) {
              router.replace("/SeeMandates");
              dispatch(getUserProfile(startupId)).then((response) => {
                localStorage.setItem("isProfileUpdated", JSON.stringify(response));
                if (response?.isProfileUpdated === 0) {
                  toast.warn("Please Update the profile to pitch on any Mandate", {
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
            } else {
              toast.warn(
                "Please verify your account by clicking on the link which is send to your registered email address",
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
            }

            // dispatch(getUserProfile(startupId)).then((response) => {
            // localStorage.setItem("isProfileUpdated", JSON.stringify(response));
            // if (response?.isProfileUpdated === 0) {
            //   router.replace("/Profile");
            //   setTimeout(() => {
            //     toast.warn("Please Update the profile to access the platform!", {
            //       position: "top-right",
            //       autoClose: 10000,
            //       hideProgressBar: false,
            //       closeOnClick: true,
            //       pauseOnHover: true,
            //       draggable: true,
            //       progress: undefined,
            //     });
            //   }, 5000);
            // } else
            // if (response?.isProfileUpdated === 1 && res?.status !== 1) {
            //     router.replace("/Profile");
            //     setTimeout(() => {
            //       toast.warn("Please wait for admin to approve it  !", {
            //         position: "top-right",
            //         autoClose: 10000,
            //         hideProgressBar: false,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //       });
            //     }, 5000);
            //   } else if (response?.isProfileUpdated === 1 && res?.status == 2) {
            //     router.replace("/Profile");
            //     setTimeout(() => {
            //       toast.warn(
            //         "Your profile is rejected, Please update the profile based on rejection reason  !",
            //         {
            //           position: "top-right",
            //           autoClose: 10000,
            //           hideProgressBar: false,
            //           closeOnClick: true,
            //           pauseOnHover: true,
            //           draggable: true,
            //           progress: undefined,
            //         }
            //       );
            //     }, 5000);
            //   } else {
            //     router.replace("/SeeMandates");
            //   }
            // });
          } else if (res?.role === "INVESTOR" && res?.role_id) {
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
          } else if (res?.individualId) {
            auth?.signIn();
            const individualId = res?.individualId;

            router.push("/News");
          } else if (res?.mentorId) {
            auth?.signIn();
            router.push("/Profile");
          } else if (res !== true) {
            recaptchaRef.current.reset();
          }
          //   else {
          //     if (typeof res !== "string") {
          //       toast.error("Please check your credentials !", {
          //         position: "top-right",
          //         autoClose: 3000,
          //         hideProgressBar: false,
          //         closeOnClick: true,
          //         pauseOnHover: true,
          //         draggable: true,
          //         progress: undefined,
          //       });
          //     }
          //   }
        })

        .catch((err) => {});
    } catch (error) {
      console.error(error);
      setError("An error occurred during the login process.");
    } finally {
      setLoading(false);
    }
  };

  // const yourDomain = "https://dic.hyperthink.io/LinkedIn";
  // const yourDomain = "http://localhost:3000/LinkedIn";
  const yourDomain = "https://lnkbydic.hyperthings.in/LinkedIn";

  const handleLinkedInLogin = () => {
    //  router.push("/linkedin");
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86fumvbjhltjdq&redirect_uri=${yourDomain}&state=startup&scope=openid,email,profile`;
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

  const currentUrl = window.location.href;

  const togglePassVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const userRoleId = watch("role");

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={styles.inputExternal}>
          <FormLabel style={{ display: "flex", fontWeight: "400" }}>
            <FormattedMessage id="startUp.login.email.textfield" defaultMessage="Email" />{" "}
            <span className={styles.error}>*</span>
          </FormLabel>
          <TextField
            // style={{ borderRadius: "0px" }}
            fullWidth
            size="small"
            id="outlined-basic"
            variant="outlined"
            placeholder={intl.formatMessage({
              id: "startUp.login.email.placeholder",
              defaultMessage: "Enter Email ",
            })}
            {...register("emailId", { required: true })}
            InputProps={{
              sx: inputStyles, // Apply the styles generated by the function
            }}
          />
          {errors.emailId && <span className={styles.error}>{errors.emailId?.message}</span>}
        </Box>

        <Box className={styles.inputExternal}>
          <FormLabel style={{ display: "flex", marginTop: "10px", fontWeight: "400" }}>
            <FormattedMessage id="startUp.login.Password.textfield" defaultMessage=" Password" />{" "}
            <span className={styles.error}>*</span>
          </FormLabel>
          <TextField
            size="small"
            fullWidth
            id="outlined-basic"
            variant="outlined"
            placeholder={intl.formatMessage({
              id: "startUp.login.password.placeholder",
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

        <Box sx={{ mb: 2 }}>
          <FormLabel sx={{ fontWeight: "400" }}>
            {intl.formatMessage({
              id: "startUp.login.role",
              defaultMessage: "Role",
            })}
            <span style={{ color: "red" }}>*</span>
          </FormLabel>
          <Controller
            name="role"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                fullWidth
                labelId="single-select-label"
                id="single-select"
                {...field}
                displayEmpty
                sx={inputStyles}
              >
                <MenuItem value="" disabled sx={{ display: "none" }}>
                  Select Role
                </MenuItem>
                {userTypes?.map((option) => (
                  <MenuItem
                    key={option?.id}
                    value={option?.id}
                    sx={{ fontWeight: "300", fontSize: "0.8rem" }}
                  >
                    {option?.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.role && <span style={{ color: "red" }}>{errors.role?.message}</span>}
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
              <FormattedMessage
                id="startUp.login.forgotPassword.title"
                defaultMessage="Forgot Password"
              />
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <FormattedMessage
                  id="startUp.login.forgotPassword.textfield"
                  defaultMessage="Please enter your email address here. We will send link to generate password."
                />
              </DialogContentText>
              <TextField
                fullWidth
                size="small"
                value={emailId}
                id="outlined-basic"
                variant="outlined"
                placeholder={intl.formatMessage({
                  id: "startUp.login.email.placeholder",
                  defaultMessage: "Enter Email ",
                })}
                InputProps={{
                  sx: inputStyles, // Apply the styles generated by the function
                }}
                onChange={handleEmail}
                required
                error={emailId.trim() === ""}
                helperText={
                  emailId.trim() === "" ? (
                    <FormattedMessage
                      id="startUp.login.forgotPassword.email.required"
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
                  id="startUp.login.forgotPassword.Cancel.button"
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
                  id="startUp.login.forgotPassword.Submit.button"
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
                      id="startUp.login.forgotPassword.Ok.button"
                      defaultMessage="  Ok"
                    />
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          ) : (
            ""
          )}
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
              <FormattedMessage id="investor.login.button" defaultMessage="LOGIN" />
            </Typography>
          </Button>
        </Box>
      </form>
      {userRoleId === 4 && (
        <>
          <Divider
            variant="middle"
            sx={{
              margin: "5px 0px",
              width: "100%",
              flexGrow: 1,
              borderColor: "#000000",
              borderWidth: "2px",
              "&::before, &::after": {
                borderColor: "#000000",
                borderWidth: "1px",
              },
            }}
          >
            <Typography style={{ fontSize: "0.7rem" }}>Or Login With</Typography>
          </Divider>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "3px",
            }}
          >
            <Button
              onClick={handleLinkedInLogin}
              size="small"
              style={{
                display: "flex",
                alignItems: "center",
                background: "#007EBB",
                color: "#ffff",
                fontSize: "0.7rem",
                borderRadius: "3px",
                width: "100%",
                padding: "6px 20px",
              }}
            >
              <Stack>
                <LinkedInIcon style={{ fontSize: "15px", marginRight: "3px" }} />
              </Stack>
              <Typography style={{ fontSize: "0.7rem" }}>
                <FormattedMessage
                  id="startUp.login.singInWithLinkedIn"
                  defaultMessage="Sign in with LinkedIn"
                />
              </Typography>
            </Button>
          </Box>
        </>
      )}

      {/* <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px 0px",
        }}
      >
        <Typography style={{ fontSize: "0.6rem", marginRight: "5px" }}>
         
          <FormattedMessage
            id="startUp.login.notHavingAccount"
            defaultMessage="Don't have an account ?"
          />{" "}
        </Typography>
        <Typography
          style={{ fontSize: "0.6rem", fontWeight: "600", color: "#8A1538", cursor: "pointer" }}
          onClick={handleAction}
        >
          <FormattedMessage id="startUp.login.SignUp.button" defaultMessage="Sign Up" />
        </Typography>
      </Box> */}
    </>
  );
};

export default StartupLogin;
