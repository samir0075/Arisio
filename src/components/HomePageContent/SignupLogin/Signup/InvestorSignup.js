import {
  Dialog,
  DialogActions,
  DialogContentText,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import styles from "../SignupLoginModal.module.css";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userSignUp } from "../../../../action/signIn";
import { FormattedMessage, useIntl } from "react-intl";
import { getInputStyles } from "../inputTextcss";
import { restrictingGmailandYahooRegex } from "../../../validators";
import TermsModal from "src/components/Footer/TermsModal";
import { useSelector } from "react-redux";
const InvestorSignup = ({ handleAction, setDialogOpen }) => {
  /*
   ** Pattern Validator
   */
  const schema = yup.object({
    emailId: yup
      .string()
      .required(
        <FormattedMessage id="startUpSingUp.email.required" defaultMessage="Please Enter Email" />
      )
      .matches(restrictingGmailandYahooRegex, {
        message: "Please use your official email address.",
      }),
    name: yup
      .string()
      .required(
        <FormattedMessage
          id="startUpSingUp.fullName.required"
          defaultMessage="Please Enter Full Name"
        />
      )
      .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
        message: "Name must be alphabetic with no spaces.",
      }),
    contactNo: yup
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
    contactCode: yup.string().required("Select Country Code"),
    // investorType: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="startUpSingUp.investorType.required"
    //       defaultMessage="Please select your investor type"
    //     />
    //   ),
    password: yup
      .string()
      .required(
        <FormattedMessage
          id="startUpSingUp.password.required"
          defaultMessage="Please Enter Password "
        />
      )
      .min(8, "Password must be at least 8 characters long.")
      .matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).*$/, {
        message: "Use uppercase, lowercase, special characters & No space.",
      }),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        <FormattedMessage id="startUpSingUp.password.match" defaultMessage="Passwords must match" />
      )
      .required(
        <FormattedMessage
          id="startUpSingUp.password.confirm"
          defaultMessage="Please confirm your password"
        />
      ),
  });
  const inputStyles = getInputStyles();
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const intl = useIntl();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const countryNumberCode = useSelector((state) => state?.globalApi?.countryNumberCode);
  const UserCountry = useSelector((state) => state.globalApi.location);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setDialogOpen(false);
  };

  const handleTerms = () => {
    setTermsDialogOpen(true);
  };

  const onSubmit = (data) => {
    const userData = {
      emailId: data.emailId.trim(),
      name: data.name,
      password: data.password,
      contact_number: `${data.contactCode}-${data.contactNo}`,
      role_id: "3",
      ...(data.coupon && { coupon: data.coupon }),
    };

    const user = "Investor";

    dispatch(userSignUp(userData, user))
      .then((res) => {
        setMsg(res?.message);
        setConfirmationOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const togglePassVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  const toggleConfirmPassVisibility = () => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const code = countryNumberCode?.filter(
      (data) => data.country_code_3 === UserCountry?.country_code3
    );
    setValue("contactCode", code[0]?.dialing_code || "");
  }, [UserCountry?.country_code3, countryNumberCode, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Box className={styles.inputExternal}>
            <FormLabel style={{ display: "flex", margin: "10px 0px" }}>
              <FormattedMessage id="investorSignUp.fullName.textfield" defaultMessage="Full Name" />{" "}
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
                id: "investorSignUp.fullName.placeholder",
                defaultMessage: "Enter Full Name",
              })}
              {...register("name", { required: true })}
            />
            {errors.name && <span className={styles.error}>{errors.name?.message}</span>}
          </Box>
          <Box className={styles.inputExternal}>
            <FormLabel style={{ display: "flex", margin: "10px 0px" }}>
              <FormattedMessage id="investorSignUp.email.textfield" defaultMessage="Email" />{" "}
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
                id: "investorSignUp.email.placeholder",
                defaultMessage: "Enter Email ",
              })}
              {...register("emailId", { required: true })}
            />
            {errors.emailId && <span className={styles.error}>{errors.emailId?.message}</span>}
          </Box>

          <Box className={styles.inputExternal}>
            <FormLabel style={{ display: "flex", margin: "10px 0px" }}>
              <FormattedMessage id="startUpSignUp.contactNo" defaultMessage="Contact No" />{" "}
              <span className={styles.error}>*</span>
            </FormLabel>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Box width={"30%"}>
                <Controller
                  name="contactCode"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      fullWidth
                      labelId="single-select-label"
                      id="single-select"
                      size="small"
                      {...field}
                      sx={{
                        "& .MuiSelect-select": {
                          // color: "#6d6d6d" // Apply color to the selected value text
                        },
                        height: "37px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                          borderRight: "none",
                        },
                      }}
                      displayEmpty
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: { xs: "200px", sm: "auto" },
                            width: { xs: "200px", sm: "250px", md: "400px" },
                            marginLeft: "0 !important",
                          },
                        },
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <Typography>Code</Typography>;
                        }
                        const selectedCountry = countryNumberCode.find(
                          (country) => country.dialing_code === selected
                        );
                        return (
                          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            {!isMobile && (
                              <img
                                src={selectedCountry?.flag}
                                style={{ width: "20px", height: "15px" }}
                              />
                            )}
                            <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                              {selectedCountry?.dialing_code}
                            </Typography>
                          </Box>
                        );
                      }}
                    >
                      <MenuItem value="" disabled sx={{ display: "none" }}>
                        Code
                      </MenuItem>
                      {countryNumberCode?.map((option) => (
                        <MenuItem
                          key={option.id}
                          value={option?.dialing_code}
                          sx={{
                            whiteSpace: "normal", // Allow text to wrap
                            wordBreak: "break-word",
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <img src={option?.flag} style={{ width: "20px" }} />
                          <span
                            style={{
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {option?.country_name}
                          </span>
                          <span style={{ fontSize: "12px", width: "50px" }}>
                            {option?.dialing_code}
                          </span>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Box>
              <Box width={"70%"}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  sx={{
                    // ...textFeildStyling,

                    "& .MuiOutlinedInput-notchedOutline": {
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    },
                  }}
                  inputProps={{
                    style: {
                      // ...feildInputProps
                    },
                  }}
                  placeholder={intl.formatMessage({
                    id: "startUpSignUp.contactNo.placeholder",
                    defaultMessage: "Enter contact number",
                  })}
                  className={styles.placeholder}
                  {...register("contactNo", { required: true })}
                />
              </Box>
            </Box>

            {errors.contactCode && (
              <span className={styles.error}>{errors.contactCode?.message}</span>
            )}
            {errors.contactNo && <span className={styles.error}>{errors.contactNo?.message}</span>}
          </Box>

          <Box className={styles.inputExternal}>
            <FormLabel style={{ display: "flex", margin: "10px 0px" }}>
              <FormattedMessage id="investorSignUp.password.textfield" defaultMessage="Password" />{" "}
              <span className={styles.error}>*</span>
            </FormLabel>
            <TextField
              fullWidth
              size="small"
              id="outlined-basic"
              variant="outlined"
              placeholder={intl.formatMessage({
                id: "investorSignUp.password.placeholder",
                defaultMessage: "Enter Password",
              })}
              type={isPasswordVisible ? "text" : "password"}
              {...register("password", { required: true })}
              InputProps={{
                sx: inputStyles, // Apply the styles generated by the function

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
          <Box className={styles.inputExternal}>
            <FormLabel style={{ display: "flex", margin: "10px 0px" }}>
              <FormattedMessage
                id="investorSignUp.confirmPassword.title"
                defaultMessage="Confirm Password"
              />{" "}
              <span className={styles.error}>*</span>
            </FormLabel>
            <TextField
              fullWidth
              size="small"
              id="outlined-basic"
              variant="outlined"
              placeholder={intl.formatMessage({
                id: "investorSignUp.confirmPassword.placeholder",
                defaultMessage: "Enter Confirm password",
              })}
              type={isConfirmPasswordVisible ? "text" : "password"}
              {...register("confirmPassword", { required: true })}
              InputProps={{
                sx: inputStyles,
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={toggleConfirmPassVisibility}
                    sx={{ cursor: "pointer" }}
                  >
                    {isConfirmPasswordVisible ? (
                      <img src="/Images/Eye.png" />
                    ) : (
                      <img src="/Images/Eye1.png" />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            {errors.confirmPassword && (
              <span className={styles.error}>{errors.confirmPassword?.message}</span>
            )}
          </Box>

          {/* <Box>
            <FormLabel style={{ display: "flex", margin: "10px 0px" }}>
              <FormattedMessage
                id="startUp.login.couponCode.textfield"
                defaultMessage="Invite Code"
              />{" "}
            </FormLabel>
            <TextField
              fullWidth
              size="small"
              id="outlined-basic"
              variant="outlined"
              placeholder={intl.formatMessage({
                id: "startUp.login.couponCOde.placeholder",
                defaultMessage: "Invite Code "
              })}
              {...register("coupon")}
              InputProps={{
                sx: inputStyles
              }}
            />
          </Box> */}

          <Box className={`${styles.dialogExternal} ${styles.signUpText}`}>
            <Typography
              sx={{
                fontSize: "0.7rem",
                marginTop: "8px",
                marginRight: "5px",
                cursor: "pointer",
              }}
              onClick={handleTerms}
            >
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <FormattedMessage
                id="investorSignUp.policy.title"
                defaultMessage="By signing up, I agree to Arisio's Term of services and Privacy Policy."
              />
            </Typography>
          </Box>
        </Box>

        <Box className={styles.inputExternal}>
          <Button
            size="small"
            style={{
              background: "#8A1538",
              color: "#ffff",
              padding: "6px 20px",
              fontSize: "0.7rem",
              borderRadius: "3px",
              width: "100%",
              marginTop: "10px",
            }}
            type="submit"
          >
            <FormattedMessage id="investorSignUp.button.title" defaultMessage="Sign Up" />
          </Button>
        </Box>

        {msg ? (
          <Box>
            <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
              <DialogContentText style={{ padding: "20px" }}>{msg}</DialogContentText>
              <DialogActions>
                <Button
                  style={{ backgroundColor: "rgba(108, 25, 62, 1)", color: "#ffff" }}
                  onClick={handleConfirmationClose}
                >
                  <FormattedMessage id="investorSignUp.button.title2" defaultMessage=" Ok" />
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        ) : (
          ""
        )}
      </form>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px 0px",
          marginBottom: "20px",
        }}
      >
        <Typography style={{ fontSize: "0.6rem", marginRight: "5px" }}>
          <FormattedMessage
            id="investorSignUp.alreadyAccount.title"
            defaultMessage="Already have an account ?"
          />{" "}
        </Typography>
        <Typography
          style={{ fontSize: "0.6rem", fontWeight: "600", color: "#8A1538", cursor: "pointer" }}
          onClick={handleAction}
        >
          <FormattedMessage id="investorSignUp.LogIn.button.title" defaultMessage="Log In" />
        </Typography>
      </Box>

      {termsDialogOpen && (
        <TermsModal dialogOpen={termsDialogOpen} setDialogOpen={setTermsDialogOpen} />
      )}
    </>
  );
};

export default InvestorSignup;
