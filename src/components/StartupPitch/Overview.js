import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./StartupPitch.module.css";
import { Controller, useForm } from "react-hook-form";
import {
  getDomains,
  getTechnologies,
  getCountries,
  getCity,
  getCompaniesLike,
  getCountryNumberCode,
} from "src/action/globalApi";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  startupcurrentTraction,
  startupStageTypeDetails,
  startupTeamBackground,
  updateProfile,
  updateStartupInfundedCompany,
  uploadStartupProfile,
} from "src/action/seeNewMandate";
import { toast } from "react-toastify";
import {
  descriptionRegex,
  digitRegex,
  emailRegex,
  facebookRegex,
  instagramRegex,
  mobileNumberRegex,
  nameRegex,
  startupNameRegex,
  urlRegex,
  XRegex,
  youTubeRegex,
} from "../validators";
import { FormattedMessage, useIntl } from "react-intl";
import { getUserProfile } from "src/action/signIn";
import { useMediaQuery } from "@mui/material";

const schema = yup
  .object({
    organizationName: yup
      .string()
      .trim()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.startupName.required.errorMessage"
          defaultMessage="Enter Startup Name"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.startupName.minLength.errorMessage"
          defaultMessage="Name should be at least 2 characters"
        />
      )
      .max(
        50,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.startupName.maxLength.errorMessage"
          defaultMessage="Name should not exceed 50 characters"
        />
      )
      .matches(startupNameRegex, () => (
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.startupNameRegex.errorMessage"
          defaultMessage="Name must contain letters or spaces; it can't be only numbers."
        />
      ))
      .trim(),
    country: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.country.required.errorMessage"
          defaultMessage="Select a country"
        />
      ),
    city: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.city.required.errorMessage"
          defaultMessage="Select a city"
        />
      ),
    space: yup
      .array()
      .min(
        1,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.sector.required.errorMessage"
          defaultMessage="Select at least one sector"
        />
      ),
    technology: yup
      .array()
      .min(
        1,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.technology.required.errorMessage"
          defaultMessage="Select at least one technology"
        />
      ),
    website: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.website.required.errorMessage"
          defaultMessage="Enter the website"
        />
      )
      .matches(urlRegex, () => (
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.websiteRegex.errorMessage"
          defaultMessage="Enter a valid Link"
        />
      )),
    description: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.description.required.errorMessage"
          defaultMessage="Enter the description"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.description.minLength.errorMessage"
          defaultMessage="Description should be at least 2 characters"
        />
      )
      .max(
        450,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.description.maxLength.errorMessage"
          defaultMessage="Description should not exceed 450 characters"
        />
      )
      .matches(descriptionRegex, () => (
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.descriptionRegex.errorMessag"
          defaultMessage="Enter a valid description (Word should not contain more than 48 characters) "
        />
      )),
    // foundedYear: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.foundedYear.errorMessage"
    //       defaultMessage="Enter the Year"
    //     />
    //   ),
    // pastFunding: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.pastFunding.errorMessage"
    //       defaultMessage="Enter the last funding date"
    //     />
    //   ),
    // teamBackgroundId: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.teamBackgroundId.errorMessage"
    //       defaultMessage="Enter the team Background"
    //     />
    //   ),
    // currentTranctionId: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.currentTranctionId.errorMessage"
    //       defaultMessage="Enter the current traction"
    //     />
    //   ),
    marketOpportunity: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.marketOpportunity.errorMessage"
          defaultMessage="Enter the Market Opportunity"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.marketOpportunity.minErrorMessage"
          defaultMessage="Market Opportunity must be at least 2 characters"
        />
      )
      .max(
        150,
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.marketOpportunity.maxErrorMessage"
          defaultMessage="Market Opportunity must be at most 150 characters"
        />
      ),

    // fundingTotalUsd: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.fundingRounds.errorMessage"
    //       defaultMessage="Enter the funding Amount"
    //     />
    //   )
    //   .min(2, "Funding Amount should be at least 2 digits")
    //   .max(10, "Funding Amount should not exceed 10 digits")
    //   .matches(digitRegex, () => (
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.fundingRoundsRegex.errorMessage"
    //       defaultMessage="Enter number between [0-9]"
    //     />
    //   )),
    fundingRounds: yup
      .string()
      .required("Enter the funding round")
      .matches(/^\d{1,3}$/, "Enter a number with 1 to 3 digits"),

    // startupStage: yup
    //   .array()
    //   .required(
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.startupStage.errorMessage"
    //       defaultMessage="Select stage"
    //     />
    //   ),
    // employeeCount: yup
    //   .string()
    //   .min(
    //     1,
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.employeeCount.errorMessage"
    //       defaultMessage="Select the number of employee"
    //     />
    //   ),
    communicationEmail: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.communicationEmail.errorMessage"
          defaultMessage="Enter the communication email"
        />
      )
      .matches(emailRegex, () => (
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.communicationEmailRegex.errorMessage"
          defaultMessage="Enter a valid communication email"
        />
      )),
    // imageUrl: yup
    //   .mixed()
    //   .required(
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.image.required.errorMessage"
    //       defaultMessage="An image is required"
    //     />
    // ),
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
    contactCode: yup.string().required("Enter Country Code"),
    facebookLink: yup
      .string()
      .nullable()
      .test(
        "is-valid-facebook",
        () => (
          <FormattedMessage
            id="startupPitch.OverViewTabInfo.comnicationEmailRegex.errorMessage"
            defaultMessage="Enter a valid Facebook link"
          />
        ),
        (value) => !value || facebookRegex.test(value)
      ),

    instagramLink: yup
      .string()
      .nullable()
      .test(
        "is-valid-instagram",
        () => (
          <FormattedMessage
            id="startupPitch.OverViewTabInfo.comnicatiEmailRegex.errorMessage"
            defaultMessage="Enter a valid Instagram link"
          />
        ),
        (value) => !value || instagramRegex.test(value)
      ),

    youtubeLink: yup
      .string()
      .nullable()
      .test(
        "is-valid-youtube",
        () => (
          <FormattedMessage
            id="startupPitch.OverViewTabInfo.mnicatiEmailRegex.errorMessage"
            defaultMessage="Enter a valid YouTube link"
          />
        ),
        (value) => !value || youTubeRegex.test(value)
      ),

    googleLink: yup
      .string()
      .nullable()
      .test(
        "is-valid-google",
        () => (
          <FormattedMessage
            id="startupPitch.OverViewTabIno.mnicatiEmailRegex.errorMessage"
            defaultMessage="Enter a valid X link"
          />
        ),
        (value) => !value || XRegex.test(value)
      ),
  })
  .required();

const Overview = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [selectedCompanyByName, setSelectedCompanyByName] = useState("");
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

  const { profileOverviewData, setTab, pitchingDisable } = props;

  const today = new Date();
  const yesterday = new Date(today);
  let lang = localStorage.getItem("lang");
  yesterday.setDate(yesterday.getDate() - 1);

  useEffect(() => {
    setValue("imageUrl", profileOverviewData?.logoUrl);
  }, [profileOverviewData?.logoUrl]);

  const formattedDate = yesterday.toISOString().split("T")[0];

  // Use this useEffect to set the image receiving from api.
  useEffect(() => {
    if (profileOverviewData.hasOwnProperty("logoUrl") === true) {
      const decodeBase64 = async () => {
        const response = await fetch(`data:image/png;base64,${profileOverviewData?.logoUrl}`);
        const blob = await response.blob();
        const dataUrl = URL.createObjectURL(blob);
        setSelectedImage(dataUrl);
        setValue("imageUrl", profileOverviewData?.logoUrl);
      };
      decodeBase64();
    } else {
      setSelectedImage(null);
    }
  }, [profileOverviewData, profileOverviewData?.logoUrl]);

  let userDetails = localStorage.getItem("userDetails");
  userDetails = userDetails ? JSON.parse(userDetails) : null;

  const profileId = userDetails?.id;

  useEffect(() => {
    dispatch(getDomains());
    dispatch(getTechnologies());
    dispatch(getCountries());
    dispatch(startupStageTypeDetails());
    dispatch(startupTeamBackground());
    dispatch(startupcurrentTraction());
    dispatch(getCountryNumberCode());
    setSelectedImage(null);
  }, [dispatch]);

  const sectorData = useSelector((state) => state?.globalApi?.domain);
  const techData = useSelector((state) => state?.globalApi?.technologies);
  const countryData = useSelector((state) => state?.globalApi?.countries);
  const cityData = useSelector((state) => state?.globalApi?.cities);
  const countryNumberCode = useSelector((state) => state?.globalApi?.countryNumberCode);

  const searchByNameCompaniesData = useSelector((state) => state?.globalApi?.startupsNameData);

  const startupStageTypeDetail = useSelector(
    (state) => state?.seeNewMandate?.startupStageType?.data
  );
  const startupfetchedteamBackground = useSelector(
    (state) => state?.seeNewMandate?.startupTeamBackground?.data
  );
  const startupCurrentTraction = useSelector(
    (state) => state?.seeNewMandate?.startupcurrenttTraction?.data
  );

  const employeeCounts = [
    {
      id: 1,
      name: "1-5",
    },
    {
      id: 2,
      name: "5-50",
    },
    {
      id: 3,
      name: "5-1000",
    },
    {
      id: 4,
      name: "1000+",
    },
  ];

  // Watch the value of the "Country" field
  const countryValue = watch("country");

  useEffect(() => {
    if (
      profileOverviewData?.countryCode &&
      countryValue === profileOverviewData?.countryCode &&
      profileOverviewData?.countryCode !== undefined
    ) {
      dispatch(getCity(profileOverviewData?.countryCode));
    } else if (
      profileOverviewData?.countryCode &&
      countryValue !== profileOverviewData?.countryCode &&
      countryValue !== undefined
    ) {
      dispatch(getCity(countryValue));
    } else if (countryValue !== undefined) {
      dispatch(getCity(countryValue));
    }
  }, [countryValue, profileOverviewData, dispatch]);

  const storedUserDetails = localStorage.getItem("userDetails");
  let startupId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  startupId = startupId?.startupId;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setValue("imageUrl", file);
    if (file) {
      if (file.size > 200 * 1024) {
        // Display an error message or perform any other action
        toast.error("File size exceeds 200 KB. Please choose a smaller file.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        setSelectedImage(reader.result);

        // Convert the base64-encoded data to binary
        const binaryImageData = atob(reader.result.split(",")[1]);

        // Create a Uint8Array from the binary data
        const uint8Array = new Uint8Array(binaryImageData.length);
        for (let i = 0; i < binaryImageData.length; i++) {
          uint8Array[i] = binaryImageData.charCodeAt(i);
        }

        // Create a Blob from the Uint8Array
        const blob = new Blob([uint8Array], { type: file.type });

        // Create FormData object and append the Blob
        const formData = new FormData();
        formData.append("startupLogo", blob, file.name);

        // Dispatch the action with formData
        dispatch(uploadStartupProfile(startupId, formData));
      };

      reader.readAsDataURL(file);
    }
  };

  // Use setValues to set the form field values from profileOverviewData

  useEffect(() => {
    if (profileOverviewData && Object.keys(profileOverviewData).length > 0) {
      setSelectedCompanyByName(profileOverviewData?.organizationName || "");
      setValue("organizationName", profileOverviewData?.organizationName || "");
      setValue("country", profileOverviewData?.countryCode || "");
      setValue("city", profileOverviewData?.city || "");
      setValue("space", profileOverviewData?.space?.map((data) => data?.id) || []);
      setValue("technology", profileOverviewData?.technology?.map((data) => data?.id) || []);
      setValue("website", profileOverviewData?.website || "");
      setValue("description", profileOverviewData?.description || "");
      setValue("foundedYear", profileOverviewData?.foundedYear || "");
      setValue("pastFunding", profileOverviewData?.pastFunding || "");
      setValue("fundingTotalUsd", profileOverviewData?.fundingTotalUsd || "");
      setValue("fundingRounds", profileOverviewData?.fundingRounds || "");
      setValue("startupStage", profileOverviewData?.startupStage || []);
      setValue("employeeCount", profileOverviewData?.employeeCount || "");
      setValue("communicationEmail", profileOverviewData?.communicationEmail || "");
      setValue("contactNo", profileOverviewData?.contactNo || "");
      setValue("facebookLink", profileOverviewData?.facebookLink || "");
      setValue("googleLink", profileOverviewData?.googleLink || "");
      setValue("instragramLink", profileOverviewData?.instragramLink || "");
      setValue("youtubeLink", profileOverviewData?.youtubeLink || "");
      setValue("imageUrl", profileOverviewData?.logoUrl);
      setValue("currentTranctionId", profileOverviewData?.currentTranction || "");

      setValue("teamBackgroundId", profileOverviewData?.teamBackground || "");
      setValue("contactCode", profileOverviewData?.dialingCode || "");

      setValue("marketOpportunity", profileOverviewData?.marketOpportunity || "");
    }
  }, [profileOverviewData, setValue]);

  const intl = useIntl();
  const onSubmit = (data) => {
    if (pitchingDisable) {
      setTab((prevValue) => (prevValue + 1) % 4);
      return;
    }

    const {
      imageUrl,
      teamBackgroundId,
      currentTranctionId,
      fundingTotalUsd,
      contactCode,
      contactNo,
      ...rest
    } = data;
    const profileData = {
      ...rest,
      id: startupId,
      teamBackgroundId: data.teamBackgroundId ? data?.teamBackgroundId : null,
      currentTranctionId: data.currentTranctionId ? data.currentTranctionId : null,
      countryCode: data.country,
      organizationName: selectedCompanyByName,
      fundingTotalUsd: data.fundingTotalUsd ? data.fundingTotalUsd : null,
      contactNo: `${contactCode}-${contactNo}`,
    };

    if (profileOverviewData?.organizationName !== data?.organizationName) {
      dispatch(updateProfile(profileId, profileData, intl, startupId)).then((res) => {
        if (res) {
          dispatch(updateStartupInfundedCompany(startupId)).then((res) => {
            if (res?.status === "success") {
              dispatch(getUserProfile(startupId));
              setTab((prevValue) => (prevValue + 1) % 4);
            }
          });
        }
      });
    } else {
      dispatch(updateProfile(profileId, profileData, intl, startupId)).then((res) => {
        if (res) {
          dispatch(getUserProfile(startupId));
          setTab((prevValue) => (prevValue + 1) % 4);
        }
      });
    }
  };
  const selectFeildStyling = {
    backgroundColor: pitchingDisable ? "#f0f0f0" : "transparent",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFB6C1", // Default border color
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(138, 21, 56, 1)", // Border color on hover
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(138, 21, 56, 1)",
      // Border color when focused
    },
  };
  const textFeildStyling = {
    backgroundColor: pitchingDisable ? "#f0f0f0" : "transparent",
    "& .MuiOutlinedInput-root": {
      // Class for the border around the input field
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FFB6C1",
      },
      "& .MuiInputLabel-outlined": {
        color: "black",
      },
    },
  };

  const feildInputProps = {
    fontFamily: "Calibri",
    fontWeight: 500,
    fontSize: "17px",
    color: "#6d6d6d",
    whiteSpace: "normal",
    wordBreak: "break-word",
  };

  const formlabelStyle = {
    marginBottom: "15px",
    fontFamily: "Calibri",
    fontWeight: 700,
    fontSize: "17px",
    color: "rgb(32, 33, 66)",
    // color: "#0d4261",
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  return (
    <>
      <Box>
        <Typography
          sx={{
            fontFamily: "Calibri",
            fontWeight: 700,
            fontSize: "18px",
            textAlign: "left",
            padding: "10px",
            color: "#0d4261",
            textTransform: "uppercase",
          }}
        >
          <FormattedMessage
            id="startupPitch.OverViewTabInfo.header"
            defaultMessage="Startup Information"
          />
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className={styles.overviewExternal}>
            <Box className={styles.formExternal}>
              <Grid container spacing={2}>
                {/* Company Name */}
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.startupName.label"
                        defaultMessage="Startup Name"
                      />

                      <span className={styles.error}>*</span>
                    </FormLabel>
                    <Autocomplete
                      disabled={pitchingDisable}
                      sx={selectFeildStyling}
                      value={selectedCompanyByName || ""}
                      noOptionsText="No Data"
                      options={
                        searchByNameCompaniesData?.length
                          ? searchByNameCompaniesData?.map((r) => ({
                              label: `${r.companyName}\nDomain: ${r.domain}\nCity: ${r.city}\nCountry: ${r.country}`,
                              companyName: r?.companyName,
                              value: r?.id,
                              domain: r?.domain,
                              city: r?.city,
                              country: r?.country,
                            }))
                          : []
                      }
                      getOptionDisabled={() =>
                        true
                      } /**  for Disabling the given options to get selected */
                      renderOption={(props, option) => (
                        <li {...props}>
                          <div style={{ ...selectFeildStyling, fontFamily: "Calibri" }}>
                            <Typography
                              variant="body1"
                              style={{ color: "black", fontWeight: 800, fontSize: "80%" }}
                            >
                              {option.companyName}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ color: "black", fontWeight: 500, fontSize: "80%" }}
                            >
                              <FormattedMessage
                                id="startupPitch.OverViewTabInfo.domain.label"
                                defaultMessage="Domain:"
                              />
                              Domain:{" "}
                              <span style={{ color: "grey", fontWeight: 400, fontSize: "80%" }}>
                                {option.domain}
                              </span>
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ color: "black", fontWeight: 500, fontSize: "80%" }}
                            >
                              <FormattedMessage
                                id="startupPitch.OverViewTabInfo.city.label"
                                defaultMessage="City:"
                              />{" "}
                              <span style={{ color: "grey", fontWeight: 400, fontSize: "80%" }}>
                                {option.city}
                              </span>
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ color: "black", fontWeight: 500, fontSize: "80%" }}
                            >
                              <FormattedMessage
                                id="startupPitch.OverViewTabInfo.country.label"
                                defaultMessage="Country:"
                              />{" "}
                              <span style={{ color: "grey", fontWeight: 400, fontSize: "80%" }}>
                                {option.country}
                              </span>
                            </Typography>
                          </div>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="organizationName"
                          InputProps={{
                            ...params.InputProps,
                            style: {
                              paddingTop: "2px", // Adjust padding top
                              paddingLeft: "8px", // Adjust padding left
                              ...params.InputProps.style, // Preserve existing input styles
                            },
                          }}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: " 1px solid gray",
                            borderRadius: 5,
                            WebkitTextFillColor: "gray",
                          }}
                          placeholder={intl.formatMessage({
                            id: "startupPitch.OverViewTabInfo.organizationName.placeholder",
                            defaultMessage: "Enter Company name",
                          })}
                          onChange={(e) => {
                            const regex = /^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$/;
                            const inputValue = e.target.value;
                            setSelectedCompanyByName(inputValue);
                            setValue("organizationName", inputValue);
                            if (inputValue !== "" && regex.test(inputValue)) {
                              dispatch(getCompaniesLike(inputValue));
                            }
                          }}
                        />
                      )}
                      {...register("organizationName")}
                    />
                    {errors.organizationName && (
                      <span className={styles.error}>{errors.organizationName?.message}</span>
                    )}
                  </Box>
                </Grid>
                {/* Communication Email */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.communicationEmail.label"
                        defaultMessage="Communication Email"
                      />{" "}
                      <span className={styles.error}>*</span>
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      sx={textFeildStyling}
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      placeholder="temp@abc.com"
                      className={styles.placeholder}
                      {...register("communicationEmail", { required: true })}
                    />
                    {errors.communicationEmail && (
                      <span className={styles.error}>{errors.communicationEmail?.message}</span>
                    )}
                  </Box>
                </Grid>
                {/* Contact No */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.contactNumber.label"
                        defaultMessage="Contact Number"
                      />{" "}
                      <span className={styles.error}>*</span>
                    </FormLabel>
                    <Box sx={{ display: "flex", width: "100%" }}>
                      <Box width={{ xs: "30%", sm: "30%", md: "40%" }}>
                        <Controller
                          name="contactCode"
                          control={control}
                          defaultValue=""
                          className={styles.placeholder}
                          render={({ field }) => (
                            <Select
                              disabled={pitchingDisable}
                              fullWidth
                              labelId="single-select-label"
                              id="single-select"
                              size="small"
                              {...field}
                              sx={{
                                ...selectFeildStyling,
                                height: "42px",
                                "& .MuiSelect-select": {
                                  color: "#6d6d6d", // Apply color to the selected value text
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderTopRightRadius: lang === "ar" ? 8 : 0,
                                  borderBottomRightRadius: lang === "ar" ? 8 : 0,
                                  borderTopLeftRadius: lang === "ar" ? 0 : 8,
                                  borderBottomLeftRadius: lang === "ar" ? 0 : 8,
                                  borderRight: lang === "ar" ? "1px solid" : "none",
                                  borderColor: "#FFB6C1",
                                },
                              }}
                              displayEmpty
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    maxHeight: { xs: "200px", sm: "auto" },
                                    width: { xs: "200px", sm: "300px" },
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
                      <Box width={{ xs: "70%", sm: "70%", md: "60%" }}>
                        <TextField
                          fullWidth
                          disabled={pitchingDisable}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          sx={{
                            ...textFeildStyling,

                            "& .MuiOutlinedInput-notchedOutline": {
                              borderTopLeftRadius: lang === "ar" ? 8 : 0,
                              borderBottomLeftRadius: lang === "ar" ? 8 : 0,
                              borderTopRightRadius: lang === "ar" ? 0 : 8,
                              borderBottomRightRadius: lang === "ar" ? 0 : 8,
                              borderRight: lang === "ar" ? "none" : "1px solid",
                            },
                          }}
                          inputProps={{
                            style: {
                              ...feildInputProps,
                            },
                          }}
                          placeholder="123456789"
                          className={styles.placeholder}
                          {...register("contactNo", { required: true })}
                        />
                      </Box>
                    </Box>

                    {errors.contactNo && (
                      <span className={styles.error}>{errors.contactNo?.message}</span>
                    )}
                    {errors.contactCode && (
                      <span className={styles.error}>{errors.contactCode?.message}</span>
                    )}
                  </Box>
                </Grid>
                {/* Country */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.country.label"
                        defaultMessage="Country"
                      />{" "}
                      <span className={styles.error}>*</span>
                    </FormLabel>
                    <Controller
                      name="country"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          disabled={pitchingDisable}
                          sx={selectFeildStyling}
                          labelId="single-select-label"
                          id="single-select"
                          size="small"
                          displayEmpty
                          {...field}
                          renderValue={(selected) => {
                            if (selected?.length === 0) {
                              return (
                                <Typography sx={feildInputProps}>
                                  <FormattedMessage
                                    id="startupPitch.OverViewTabInfo.country.placeholder"
                                    defaultMessage="Select your country"
                                  />
                                </Typography>
                              );
                            } else {
                              const countryOption = countryData?.find(
                                (option) => option.countryCode === selected
                              );
                              return (
                                <Typography sx={feildInputProps}>
                                  {countryOption?.country || selected}
                                </Typography>
                              );
                            }
                          }}
                        >
                          <MenuItem value="">
                            <FormattedMessage
                              id="startupPitch.OverViewTabInfo.country.menuitem"
                              defaultMessage="Select your country"
                            />
                          </MenuItem>
                          {countryData.map((option) => (
                            <MenuItem
                              sx={feildInputProps}
                              key={option.countryCode}
                              value={option.countryCode}
                            >
                              {option.country}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.country && (
                      <span className={styles.error}>{errors.country?.message}</span>
                    )}
                  </Box>
                </Grid>
                {/* City */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.city.label"
                        defaultMessage="City"
                      />{" "}
                      <span className={styles.error}>*</span>
                    </FormLabel>
                    <Controller
                      name="city"
                      control={control}
                      defaultValue={""}
                      render={({ field }) => (
                        <Select
                          disabled={pitchingDisable}
                          sx={selectFeildStyling}
                          labelId="single-select-label"
                          id="single-select"
                          size="small"
                          {...field}
                          displayEmpty
                          renderValue={(selected) => {
                            if (selected?.length === 0) {
                              return (
                                <Typography sx={feildInputProps}>
                                  <FormattedMessage
                                    id="startupPitch.OverViewTabInfo.city.placeholder"
                                    defaultMessage="Select your city"
                                  />
                                </Typography>
                              );
                            }
                            return <Typography sx={feildInputProps}>{selected}</Typography>;
                          }}
                        >
                          {cityData?.map((option) => (
                            <MenuItem sx={feildInputProps} key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.city && <span className={styles.error}>{errors.city?.message}</span>}
                  </Box>
                </Grid>
                {/* Sector */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.sector.label"
                        defaultMessage="Sector"
                      />{" "}
                      <span className={styles.error}>*</span>
                    </FormLabel>
                    <Controller
                      name="space"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Select
                          disabled={pitchingDisable}
                          labelId="multi-select-label"
                          id="multi-select"
                          size="small"
                          multiple
                          displayEmpty
                          sx={selectFeildStyling}
                          {...field}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: { xs: "240px", sm: "auto" },
                                width: { xs: "70%", sm: "auto" },
                              },
                            },
                          }}
                          renderValue={(selected) => {
                            if (selected?.length === 0) {
                              return (
                                <span
                                  style={{
                                    ...feildInputProps,
                                    color: "rgba(0, 0, 0, 0.523)",
                                  }}
                                >
                                  Select Sectors
                                </span>
                              );
                            }
                            const selectedNames = selected.map((value) => {
                              const option = sectorData?.find((sector) => sector.id === value);
                              return option?.name || "";
                            });
                            return (
                              <Typography sx={feildInputProps}>
                                {selectedNames.join(", ")}
                              </Typography>
                            );
                          }}
                        >
                          {sectorData?.map((option) => (
                            <MenuItem
                              key={option?.id}
                              value={option?.id}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <Checkbox checked={field.value.includes(option?.id)} />
                              {option?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.space && <span className={styles.error}>{errors.space?.message}</span>}
                  </Box>
                </Grid>
                {/* Select Technology */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.technology.label"
                        defaultMessage="Technology"
                      />{" "}
                      <span className={styles.error}>*</span>
                    </FormLabel>
                    <Controller
                      name="technology"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Select
                          disabled={pitchingDisable}
                          labelId="multi-select-label"
                          id="multi-select"
                          size="small"
                          multiple
                          displayEmpty
                          {...field}
                          sx={selectFeildStyling}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: { xs: "240px", sm: "auto" },
                                width: { xs: "70%", sm: "auto" },
                              },
                            },
                          }}
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return (
                                <span
                                  style={{
                                    ...feildInputProps,
                                    color: "rgba(0, 0, 0, 0.523)",
                                  }}
                                >
                                  Select Technologies
                                </span>
                              );
                            }
                            const selectedNames = selected.map((value) => {
                              const option = techData?.find((tech) => tech.id === value);
                              return option?.name || "";
                            });
                            return (
                              <Typography sx={feildInputProps}>
                                {selectedNames.join(", ")}
                              </Typography>
                            );
                          }}
                        >
                          {techData?.map((option) => (
                            <MenuItem
                              key={option?.id}
                              value={option?.id}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <Checkbox checked={field.value.includes(option?.id)} />
                              {option?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.technology && (
                      <span className={styles.error}>{errors.technology?.message}</span>
                    )}
                  </Box>
                </Grid>
                {/* Website */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.website.label"
                        defaultMessage="Website"
                      />{" "}
                      <span className={styles.error}>*</span>
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      // id="outlined-basic"
                      sx={textFeildStyling}
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      placeholder="www.abc.in"
                      className={styles.placeholder}
                      {...register("website", { required: true })}
                    />
                    {errors.website && (
                      <span className={styles.error}>{errors.website?.message}</span>
                    )}
                  </Box>
                </Grid>
                {/* No of employee */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.noOfEmployees.label"
                        defaultMessage="No Of Employees"
                      />{" "}
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <Controller
                      name="employeeCount"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          disabled={pitchingDisable}
                          labelId="single-select-label"
                          id="single-select"
                          size="small"
                          {...field}
                          sx={{
                            ...selectFeildStyling,
                            color: "rgba(0, 0, 0, 0.523)",
                          }}
                          displayEmpty
                        >
                          <MenuItem
                            value=""
                            disabled
                            sx={{ display: "none", color: "rgba(0, 0, 0, 0.523)" }}
                          >
                            Select No of Employee
                          </MenuItem>
                          {employeeCounts?.map((option) => (
                            <MenuItem key={option?.id} value={option?.name}>
                              {/* <Checkbox checked={field.value.includes(option?.name)} /> */}
                              {option?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.employeeCount && (
                      <span className={styles.error}>{errors.employeeCount?.message}</span>
                    )}
                  </Box>
                </Grid>{" "}
                {/* Startup Description */}
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.startupDescription.label"
                        defaultMessage="Startup Description"
                      />
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      sx={{
                        ...textFeildStyling,
                        "& textarea::placeholder": {
                          color: "#6d6d6d",
                          fontWeight: 600,
                        },
                      }}
                      className={styles.placeholder}
                      inputProps={{
                        style: {
                          ...feildInputProps,
                          "& textarea:": {
                            color: "#6d6d6d",
                          },
                        },
                      }}
                      placeholder="Enter up to 300 characters"
                      multiline
                      rows={5}
                      {...register(
                        "description"
                        // { required: true }
                      )}
                    />
                    {errors.description && (
                      <span className={styles.error}>{errors.description?.message}</span>
                    )}
                  </Box>
                </Grid>
                {/* Founded Date */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.foundedDate.label"
                        defaultMessage="Founded Date"
                      />{" "}
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      placeholder=""
                      type="date"
                      sx={{
                        ...textFeildStyling,
                        "& .MuiInputBase-input": {
                          color: "#6d6d6d", // Set the color of the placeholder here
                        },
                      }}
                      inputProps={{ max: formattedDate }}
                      {...register("foundedYear")}
                    />
                    {errors.foundedYear && (
                      <span className={styles.error}>{errors.foundedYear?.message}</span>
                    )}
                  </Box>
                </Grid>
                {/* Last Funding on */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.lastFundingOn.label"
                        defaultMessage="Last Funding on"
                      />{" "}
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      sx={{
                        ...textFeildStyling,
                        "& .MuiInputBase-input": {
                          color: "#6d6d6d", // Set the color of the placeholder here
                        },
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      placeholder=""
                      type="date"
                      className={styles.placeholder}
                      inputProps={{ max: formattedDate }}
                      {...register(
                        "pastFunding"
                        // { required: true }
                      )}
                    />
                    {errors.pastFunding && (
                      <span className={styles.error}>{errors.pastFunding?.message}</span>
                    )}
                  </Box>
                </Grid>
                {/* funding Amount in USD  */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.fundingRound.label"
                        defaultMessage="Funding amount raised (in USD)"
                      />{" "}
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      variant="outlined"
                      defaultValue={""}
                      size="small"
                      placeholder="Amount"
                      sx={textFeildStyling}
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      className={styles.placeholder}
                      {...register(
                        "fundingTotalUsd"
                        // { required: true }
                      )}
                    />
                    {errors.fundingTotalUsd && (
                      <span className={styles.error}>{errors.fundingTotalUsd?.message}</span>
                    )}
                  </Box>
                </Grid>{" "}
                {/* funding round  */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.round.label"
                        defaultMessage="Funding Round"
                      />{" "}
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      placeholder="Rounds"
                      sx={textFeildStyling}
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      className={styles.placeholder}
                      {...register(
                        "fundingRounds"
                        // { required: true }
                      )}
                    />
                    {errors.fundingRounds && (
                      <span className={styles.error}>{errors.fundingRounds?.message}</span>
                    )}
                  </Box>
                </Grid>{" "}
                {/* Startup Stage */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.startupStage.label"
                        defaultMessage="Startup Stage"
                      />{" "}
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <Controller
                      name="startupStage"
                      control={control}
                      defaultValue={[]}
                      className={styles.placeholder}
                      render={({ field }) => (
                        <Select
                          disabled={pitchingDisable}
                          labelId="single-select-label"
                          id="single-select"
                          size="small"
                          {...field}
                          multiple
                          sx={{
                            ...selectFeildStyling,
                            color: "rgba(0, 0, 0, 0.523)",
                          }}
                          displayEmpty // Ensure to display an empty item
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: { xs: "200px", sm: "auto" },
                                width: { xs: "30%", sm: "auto" },
                              },
                            },
                          }}
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return (
                                <span
                                  style={{
                                    ...feildInputProps,
                                    color: "rgba(0, 0, 0, 0.523)",
                                    // fontWeight: 600
                                  }}
                                >
                                  Select Stage
                                </span>
                              );
                            }
                            const selectedNames = selected.map((value) => {
                              const option = startupStageTypeDetail?.find(
                                (sector) => sector.id === value
                              );
                              return option?.stage_name || "";
                            });
                            return (
                              <Typography sx={feildInputProps}>
                                {selectedNames.join(", ")}
                              </Typography>
                            );
                          }}
                        >
                          {/* <MenuItem value="" disabled sx={{ display: "none" }}>
                            Select Stage
                          </MenuItem> */}
                          {startupStageTypeDetail?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              <Checkbox checked={field.value.includes(option?.id)} />

                              {option.stage_name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.startupStage && (
                      <span className={styles.error}>{errors.startupStage?.message}</span>
                    )}
                  </Box>
                </Grid>{" "}
                {/* Market Opportunity */}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.marketOpportunity.label"
                        defaultMessage="Market Opportunity"
                      />{" "}
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      sx={textFeildStyling}
                      variant="outlined"
                      size="small"
                      placeholder="Like Growing Market"
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      className={styles.placeholder}
                      {...register(
                        "marketOpportunity"
                        // { required: true }
                      )}
                    />
                    {errors.marketOpportunity && (
                      <span className={styles.error}>{errors.marketOpportunity?.message}</span>
                    )}
                  </Box>
                </Grid>{" "}
                {/* Current Traction */}
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.currentTraction.label"
                        defaultMessage="Current Traction"
                      />{" "}
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <Controller
                      name="currentTranctionId"
                      control={control}
                      defaultValue={""}
                      className={styles.placeholder}
                      render={({ field }) => (
                        <Select
                          disabled={pitchingDisable}
                          labelId="single-select-label"
                          id="single-select"
                          size="small"
                          {...field}
                          sx={{
                            ...selectFeildStyling,
                            color: "rgba(0, 0, 0, 0.523)",
                          }}
                          displayEmpty // Ensure to display an empty item"
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: { xs: "240px", sm: "auto" },
                                width: { xs: "70%", sm: "auto" },
                              },
                            },
                          }}
                          renderValue={(selected) => {
                            if (selected?.length === 0) {
                              return (
                                <Typography sx={feildInputProps}>
                                  Select Current Traction
                                </Typography>
                              );
                            }
                            const selectedNames = startupCurrentTraction?.find(
                              (sector) => sector?.id === selected
                            );
                            return (
                              <Typography sx={feildInputProps}>
                                {selectedNames?.transaction_name}
                              </Typography>
                            );
                          }}
                        >
                          <MenuItem value="" disabled sx={{ display: "none" }}>
                            Select Current Traction
                          </MenuItem>
                          {startupCurrentTraction?.map((option) => (
                            <MenuItem
                              key={option.id}
                              value={option.id}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              {option.transaction_name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.currentTranctionId && (
                      <span className={styles.error}>{errors.currentTranctionId?.message}</span>
                    )}
                  </Box>
                </Grid>{" "}
                {/* Team Background */}
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.teamBackground.label"
                        defaultMessage="Team Background"
                      />{" "}
                      {/* <span className={styles.error}>*</span> */}
                    </FormLabel>
                    <Controller
                      name="teamBackgroundId"
                      control={control}
                      defaultValue=""
                      className={styles.placeholder}
                      render={({ field }) => (
                        <Select
                          disabled={pitchingDisable}
                          labelId="single-select-label"
                          id="single-select"
                          size="small"
                          {...field}
                          sx={{ ...selectFeildStyling }}
                          displayEmpty // Ensure to display an empty item"
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: { xs: "240px", sm: "auto" },
                                width: { xs: "70%", sm: "auto" },
                              },
                            },
                          }}
                          renderValue={(selected) => {
                            if (selected?.length === 0) {
                              return (
                                <Typography sx={feildInputProps}>
                                  {" "}
                                  Select Team Background
                                </Typography>
                              );
                            }
                            const selectedNames = startupfetchedteamBackground?.find(
                              (sector) => sector?.id === selected
                            );
                            return (
                              <Typography sx={feildInputProps}>
                                {selectedNames?.team_name}
                              </Typography>
                            );
                          }}
                        >
                          {startupfetchedteamBackground?.map((option) => (
                            <MenuItem
                              key={option.id}
                              value={option.id}
                              sx={{
                                whiteSpace: "normal", // Allow text to wrap
                                wordBreak: "break-word",
                              }}
                            >
                              {option.team_name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.teamBackgroundId && (
                      <span className={styles.error}>{errors.teamBackgroundId?.message}</span>
                    )}
                  </Box>
                </Grid>{" "}
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      {" "}
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.facebook.label"
                        defaultMessage="Facebook"
                      />
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      sx={textFeildStyling}
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      placeholder="https://www.facebook.com/john.doe"
                      className={styles.placeholder}
                      {...register("facebookLink")}
                    />
                    {errors.facebookLink && (
                      <span className={styles.error}>{errors.facebookLink?.message}</span>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      {" "}
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.twitter.label"
                        defaultMessage="X (Twitter)"
                      />
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      sx={textFeildStyling}
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      placeholder="https://x.com/username"
                      className={styles.placeholder}
                      {...register("googleLink")}
                    />
                    {errors.googleLink && (
                      <span className={styles.error}>{errors.googleLink?.message}</span>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.instagram.label"
                        defaultMessage="Instagram"
                      />
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      sx={textFeildStyling}
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      placeholder="https://www.instagram.com/John"
                      className={styles.placeholder}
                      {...register("instragramLink")}
                    />
                    {errors.instragramLink && (
                      <span className={styles.error}>{errors.instragramLink?.message}</span>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <Box className={styles.inputExternal}>
                    <FormLabel sx={formlabelStyle}>
                      {" "}
                      <FormattedMessage
                        id="startupPitch.OverViewTabInfo.youTube.label"
                        defaultMessage="Youtube"
                      />
                    </FormLabel>
                    <TextField
                      disabled={pitchingDisable}
                      id="outlined-basic"
                      sx={textFeildStyling}
                      variant="outlined"
                      size="small"
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      placeholder="https://www.youtube.com/happy"
                      className={styles.placeholder}
                      {...register("youtubeLink")}
                    />
                    {errors.youtubeLink && (
                      <span className={styles.error}>{errors.youtubeLink?.message}</span>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box className={styles.imageExternal}>
              <Grid>
                <Typography
                  sx={{
                    fontFamily: "Calibri",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#393939",
                  }}
                >
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  <FormattedMessage
                    id="startupPitch.OverViewTabInfo.companyLogo.label"
                    defaultMessage="Company's Logo"
                  />{" "}
                  {/* <span className={styles.error}>*</span> */}
                </Typography>
                <Box component="label" sx={{ cursor: "pointer" }}>
                  {/* <input hidden accept="image/*" type="file" onChange={handleImageChange} /> */}

                  <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field }) => (
                      <input
                        hidden
                        disabled={pitchingDisable}
                        accept="image/*"
                        type="file"
                        onChange={(e) => {
                          handleImageChange(e);
                          field.onChange(e.target.files[0]); // Update React Hook Form's field value
                        }}
                      />
                    )}
                  />
                  {selectedImage !== null ? (
                    <div>
                      <img
                        src={selectedImage}
                        alt="Selected"
                        width="120px"
                        height="120px"
                        style={{ borderRadius: "50%" }}
                      />
                    </div>
                  ) : (
                    <img src="/Images/upload-company's-logo.png" alt="Upload" />
                  )}
                </Box>
                <Typography>
                  {errors.imageUrl && !selectedImage && (
                    <span className={styles.error}>{errors.imageUrl?.message}</span>
                  )}
                </Typography>

                <Typography sx={{ fontSize: "12px" }}>
                  <FormattedMessage
                    id="startupPitch.OverViewTabInfo.logoUpload.helperText"
                    defaultMessage="Allowed file types: .jpeg, .jpg, or .png"
                  />
                </Typography>
              </Grid>
            </Box>
          </Box>
          <Box className={styles.buttonExternal}>
            <Button type="submit" className={styles.nextButton}>
              <FormattedMessage
                id="startupPitch.OverViewTabInfo.nextButton.title"
                defaultMessage="Next"
              />
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default Overview;
