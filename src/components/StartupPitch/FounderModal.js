import {
  Box,
  Button,
  Container,
  Dialog,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import styles from "./StartupPitch.module.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CancelIcon from "@mui/icons-material/Cancel";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addTeamMember } from "src/action/seeNewMandate";
import { emailRegex, linkedInRegex, linkUrlRegex, nameRegex } from "../validators";
import { FormattedMessage, useIntl } from "react-intl";
import { getUserProfile } from "src/action/signIn";

const FounderModal = ({ dialogOpen, setDialogOpen, memberType }) => {
  const handleClose = () => {
    setDialogOpen(false);
  };
  const schema = yup.object({
    memberName: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.teamTabInfoModal.name.required.errorMessage"
          defaultMessage="Enter  Name"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="startupPitch.teamTabInfoModal.name.minLength.errorMessage"
          defaultMessage="Name should be at least 2 characters"
        />
      )
      .max(
        150,
        <FormattedMessage
          id="startupPitch.teamTabInfoModal.name.maxLength.errorMessage"
          defaultMessage="Name should not exceed 150 characters"
        />
      )
      .matches(nameRegex, () => (
        <FormattedMessage
          id="startupPitch.teamTabInfoModal.nameRegex.errorMessage"
          defaultMessage="Name must contain only alphabets and whitespace"
        />
      ))
      .trim(),

    memberEmail: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.teamTabInfoModal.email.required.errorMessage"
          defaultMessage="Enter Email Id"
        />
      )
      .matches(emailRegex, () => (
        <FormattedMessage
          id="startupPitch.teamTabInfoModal.emailRegex.errorMessage"
          defaultMessage="Enter a valid email"
        />
      )),
    designation: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.teamTabInfoModal.role.required.errorMessage"
          defaultMessage="Select Role"
        />
      ),

    linkedinUrl: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.teamTabInfoModal.linkedInUrl.required.errorMessage"
          defaultMessage="Enter LinkedIn Url"
        />
      )
      .matches(linkedInRegex, () => (
        <FormattedMessage
          id="startupPitch.teamTabInfoModal.linkedInUrlRegex.errorMessage"
          defaultMessage="Enter a valid Link"
        />
      )),

    portfolioLink: yup
      .string()
      .nullable() // Allows the value to be null
      .test(
        "is-valid-url",
        "Enter a valid Link",
        (value) => !value || linkUrlRegex.test(value) // Return true if value is empty or matches the regex
      ),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const roles = [
    {
      id: "1",
      name: "Founder",
    },
    ,
    {
      id: "2",
      name: "Co-Founder",
    },
    {
      id: "3",
      name: "C-Suite (CTO , CEO or etc)",
    },
  ];
  const otherRoles = [
    {
      id: "4",
      name: "Software Team Member",
    },
    ,
    {
      id: "5",
      name: "Sales Team Member",
    },

    {
      id: "6",
      name: "Marketing Team Members",
    },
    {
      id: "7",
      name: "Operations Team Members",
    },
    {
      id: "8",
      name: "Advisor",
    },
    {
      id: "9",
      name: "Other",
    },
  ];

  const dispatch = useDispatch();
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const startupId = userDetails?.startupId;
  const intl = useIntl();

  const onSubmit = (data) => {
    dispatch(addTeamMember(startupId, data, intl)).then((res) => {
      const status = res?.response?.data?.status;
      if (status !== false || status === undefined) {
        dispatch(getUserProfile(startupId));
        setDialogOpen(false);
      }
    });
  };

  const placeHolder = {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-input::placeholder": {
      color: "#6d6d6d",
      opacity: 1,
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-input": {
      color: "black",
    },
  };

  return (
    <Dialog
      open={dialogOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ p: 4 }}>
        <Box
          style={{ display: "flex", justifyContent: "space-between", marginTop: "-15px" }}
          // onClick={handleClose}
        >
          <Grid item sx={{ margin: "auto" }}>
            {memberType === "Senior" ? (
              <Typography className={styles.heading}>
                <FormattedMessage
                  id="startupPitch.teamTabInfoModa.header"
                  defaultMessage="Add Founder / Co-Founder"
                />
              </Typography>
            ) : (
              <Typography className={styles.heading}>
                <FormattedMessage
                  id="startupPitch.teamTabInfoMod.header"
                  defaultMessage="Add Key Team Member"
                />
              </Typography>
            )}
          </Grid>

          <CancelIcon
            sx={{ fontSize: "1.2rem" }}
            color="disabled"
            style={{ cursor: "pointer", zIndex: 10000 }}
            onClick={handleClose}
          />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} xl={12}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="startupPitch.teamTabInfoModal.name.label"
                    defaultMessage="Name"
                  />{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  placeholder="Full Name"
                  {...register("memberName")}
                  sx={placeHolder}
                />
                {errors.memberName && (
                  <span className={styles.error}>{errors.memberName?.message}</span>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={12} xl={12}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="startupPitch.teamTabInfoModal.emailId.label"
                    defaultMessage="Email Id"
                  />{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  placeholder="abc@gmail.com"
                  {...register("memberEmail")}
                  sx={placeHolder}
                />
                {errors.memberEmail && (
                  <span className={styles.error}>{errors.memberEmail?.message}</span>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} xl={12}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="startupPitch.teamTabInfoModal.role.label"
                    defaultMessage=""
                  />{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <Controller
                  name="designation"
                  control={control}
                  placeholder="Select a Role"
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      labelId="single-select-label"
                      id="single-select"
                      {...field}
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected === "") {
                          return (
                            <Typography
                              sx={{ color: "#6d6d6d", fontWeight: 500, fontSize: "14px" }}
                            >
                              Select a role
                            </Typography>
                          ); // Placeholder text
                        }
                        return selected;
                      }}
                    >
                      {(memberType === "Senior" ? roles : otherRoles)?.map((option) => (
                        <MenuItem key={option?.id} value={option?.name}>
                          {/* <Checkbox checked={field.value.includes(option?.name)} /> */}
                          {option?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.designation && (
                  <span className={styles.error}>{errors.designation?.message}</span>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} xl={12}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="startupPitch.teamTabInfoModal.linkedInUrl.label"
                    defaultMessage="LinkedIn Url"
                  />{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  placeholder="https://www.linkedin.com/"
                  {...register("linkedinUrl")}
                  sx={placeHolder}
                />
                {errors.linkedinUrl && (
                  <span className={styles.error}>{errors.linkedinUrl?.message}</span>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={12} xl={12}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="startupPitch.teamTabInfoModal.portfolioLink.label"
                    defaultMessage="Portfolio Link"
                  />{" "}
                </FormLabel>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  placeholder="https://www.url.com"
                  {...register("portfolioLink")}
                  sx={placeHolder}
                />
                {errors.portfolioLink && (
                  <span className={styles.error}>{errors.portfolioLink?.message}</span>
                )}
              </Box>
            </Grid>
            <Box className={styles.buttonExternal}>
              <Button type="submit" className={styles.nextButton}>
                <FormattedMessage
                  id="startupPitch.teamTabInfoModal.submitButton.title"
                  defaultMessage="Submit"
                />
              </Button>
            </Box>
          </Grid>
        </form>
      </Box>
    </Dialog>
  );
};

export default FounderModal;
