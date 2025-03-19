import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createForgetPassword, validateToken } from "src/action/signIn";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const VerificationToken = () => {
  const [passwordBoxOpen, setPasswordBoxOpen] = useState(true);
  const [tokenStatus, settokenStatus] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(show => !show);

  const { verificationToken } = router.query;

  const schema = yup.object({
    reset: yup
      .string()
      .required("Please enter password")
      .min(8, "Password must be at least 8 characters long.")
      .matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).*$/, {
        message: "Use uppercase, lowercase, special characters."
      }),
    confirmPassword: yup
      .string()
      .required("Please confirm your new password")
      .oneOf([yup.ref("reset"), null], "Password must match")
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (verificationToken !== undefined) {
      dispatch(validateToken(verificationToken)).then(resp => {
        settokenStatus(resp);
      });
    }
  }, [verificationToken, dispatch]);

  // const onPasswordhandle = (e) => {
  //   setResetPassword(e.target.value);
  // };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handlePasswordBoxClose = () => {
    setPasswordBoxOpen(false);
  };

  const onResetPassword = data => {
    dispatch(createForgetPassword(verificationToken, data.reset)).then(res => {
      setPasswordBoxOpen(false);
      router.push("/");
    });
  };

  return (
    <>
      <Box>
        <Dialog open={passwordBoxOpen} onClose={handlePasswordBoxClose}>
          <form onSubmit={handleSubmit(onResetPassword)}>
            <DialogTitle>Reset Password</DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {tokenStatus?.message === "expired" ? (
                <Box>Session Expired</Box>
              ) : (
                <>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel sx={{ paddingBottom: "8px" }}>New Password</FormLabel>{" "}
                    <OutlinedInput
                      {...register("reset")}
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      // onChange={onPasswordhandle}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      // label="Password"
                    />
                    {errors.reset && (
                      <FormHelperText
                        sx={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word"
                        }}
                        error
                      >
                        {errors.reset.message}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel sx={{ paddingBottom: "8px" }}>Confirm New Password</FormLabel>{" "}
                    <OutlinedInput
                      {...register("confirmPassword")}
                      id="outlined-adornment-password"
                      type={showConfirmPassword ? "text" : "password"}
                      // onChange={onPasswordhandle}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      // label="Password"
                    />
                    {errors.confirmPassword && (
                      <FormHelperText
                        sx={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word"
                        }}
                        error
                      >
                        {errors.confirmPassword.message}
                      </FormHelperText>
                    )}
                  </Box>
                </>
              )}
            </DialogContent>

            <DialogActions>
              {tokenStatus.message === "expired" ? (
                <Button
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  Ok
                </Button>
              ) : (
                <>
                  <Button onClick={handlePasswordBoxClose}>Cancel</Button>
                  <Button type="submit">Reset</Button>
                </>
              )}
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </>
  );
};

export default VerificationToken;
