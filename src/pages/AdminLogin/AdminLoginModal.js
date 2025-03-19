import { Button, FormLabel, InputAdornment, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState } from "react";
import styles from "./AdminLogin.module.css";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks/use-auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userSignIn, captchVerification } from "src/action/signIn";
import { toast } from "react-toastify";
import Captcha from "src/components/Captcha";

const AdminLoginModal = ({}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useAuth();

  const recaptchaRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  /*
   ** Pattern Validator
   */

  const schema = yup.object({
    emailId: yup
      .string()
      .required("Please Enter Email id.")
      .matches(
        /^\s*(?:\d{10}|\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+)\s*$/,
        "Invalid email address or mobile number"
      ),
    password: yup.string().required("Please Enter Password "),
    // .matches(
    //   /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    //   "Password must contain at least 8 characters, including one uppercase letter and one special character"
    // ),
  });

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const userType = "admin";

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

      console.log(data);

      if (data?.emailId?.trim() === "contentwriter@arisio.io") {
        dispatch(
          userSignIn({ emailId: data.emailId.trim(), password: data.password, usertype_id: 12 })
        ).then((res) => {
          if (res?.role_id === 12) {
            auth?.signIn();
            router.replace("/News");
          } else if (res !== true) {
            recaptchaRef.current.reset();
          } else {
            return;
          }
        });
      } else {
        dispatch(
          userSignIn(
            { emailId: data.emailId.trim(), password: data.password, usertype_id: 11 }
            // userType
          )
        ).then((res) => {
          if (res?.role === "ADMINISTRATOR") {
            auth?.signIn();
            router.replace("/PendingApprovals/Mandates");
          } else if (res !== true) {
            recaptchaRef.current.reset();
          } else {
            return;
          }
        });
      }
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "rgba(65, 148, 179,0.1) !important",
        }}
      >
        <Box
          sx={{ boxShadow: " 0 4px 8px 0 #d0d0d0", bgcolor: "#fff", borderRadius: "8px" }}
          className={styles.dialogExternal}
        >
          <Box className={styles.loginImageSection} sx={{ width: "450px", height: "500px" }}>
            <img
              src="/Images/HomePage/InvestorLogin.png"
              alt="InvestorLogin"
              width="100%"
              height="100%"
              style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}
            />
          </Box>

          <Box sx={{ width: { xs: "300px", sm: "450px" }, px: 2, py: 1 }}>
            <Typography className={styles.subHeading}>Admin Login </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box>
                <Box className={styles.inputExternal}>
                  <FormLabel className={styles.inputField}>
                    Email <span className={styles.error}>*</span>
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter Email "
                    {...register("emailId", { required: true })}
                  />
                  {errors.emailId && (
                    <span className={styles.error}>{errors.emailId?.message}</span>
                  )}
                </Box>

                <Box className={styles.inputExternal}>
                  <FormLabel className={styles.inputField}>
                    Password <span className={styles.error}>*</span>
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter Password"
                    {...register("password", { required: true })}
                    type={isPasswordVisible ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" onClick={togglePassVisibility}>
                          {isPasswordVisible ? (
                            <img src="/Images/Eye.png" />
                          ) : (
                            <img src="/Images/Eye1.png" />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.password && (
                    <span className={styles.error}>{errors.password?.message}</span>
                  )}
                </Box>
              </Box>
              <Captcha
                setLoading={setLoading}
                setError={setError}
                error={error}
                setCaptchaValue={setCaptchaValue}
                recaptchaRef={recaptchaRef}
              />
              <Box
                sx={{
                  py: 1,
                }}
                className={styles.inputExternal}
              >
                <Button
                  className={styles.loginButton}
                  sx={{ background: loading ? "grey" : "#8A1538" }}
                  type="submit"
                  disabled={loading}
                >
                  Login
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AdminLoginModal;
