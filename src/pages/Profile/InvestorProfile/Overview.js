import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./investorProfile.module.css";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getCity,
  getCountries,
  getCountryNumberCode,
  getDomains,
  getTechnologies,
} from "src/action/globalApi";
import { getButtonCss } from "src/utils/util";
import {
  getFundTicket,
  getFundType,
  getInvestorProfileData,
  getInvestorSector,
  getStartupStageType,
  updateInvestorProfile,
  uploadInvestorProfileImage,
} from "src/action/investorProfileStepper";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { emailRegex, mobileNumberRegex, urlRegex } from "src/components/validators";
import { getInvestorProfileCheck } from "src/action/signIn";

const schema = yup
  .object({
    fullName: yup
      .string()
      .required(
        <FormattedMessage
          id="investorProfile.form.fullName.error.message"
          defaultMessage="Enter Full Name"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="investorProfile.form.fullName.minLength.error.message"
          defaultMessage="Name should not less than 2 characters"
        />
      )
      .max(
        80,
        <FormattedMessage
          id="investorProfile.form.fullName.maxLength.error.message"
          defaultMessage="Name should not exceed 80 characters"
        />
      )
      .matches(/^\S.*\S$/, {
        message: (
          <FormattedMessage
            id="investorProfile.form.fullName.noSpaces.error.message"
            defaultMessage="Name should not have spaces at the start or end"
          />
        ),
        excludeEmptyString: true,
      })
      .matches(/^[^\d]*$/, {
        message: (
          <FormattedMessage
            id="investorProfile.form.fullName.noNumbers.error.message"
            defaultMessage="Name should not contain numbers"
          />
        ),
        excludeEmptyString: true,
      }),

    organization: yup
      .string()
      .required(
        <FormattedMessage
          id="investorProfile.form.organizationName.error.message"
          defaultMessage="Enter Organization Name"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="investorProfile.form.fullName.minLength.errorMessage"
          defaultMessage="Organization name should not less than 2 characters"
        />
      )
      .max(
        80,
        <FormattedMessage
          id="investorProfile.form.fullName.maxLength.errorMessage"
          defaultMessage="Organization name should not exceed 80 characters"
        />
      )
      .matches(/^\S.*\S$/, {
        message: (
          <FormattedMessage
            id="investorProfile.form.organizationName.noSpaces.error.message"
            defaultMessage="Organization name should not have spaces at the start or end"
          />
        ),
        excludeEmptyString: true,
      }),
    communication_email: yup
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
    ContactNumber: yup
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
    country: yup
      .string()
      .required(
        <FormattedMessage
          id="investorProfile.form.country.error.message"
          defaultMessage="Select a country"
        />
      ),
    contactCode: yup.string().required("Enter Country Code"),
    city:
      yup
        .string()
        .required(
          <FormattedMessage
            id="investorProfile.form.city.error.message"
            defaultMessage="Select a city"
          />
        ) || yup.object({ defaultMessage: yup.string.required("hoiiiiiiii") }),

    investorType: yup
      .string()
      .required(
        <FormattedMessage
          id="investorProfile.form.investorType.error.message"
          defaultMessage="Select investor type"
        />
      ),
    // investmentSector: yup
    //   .array()
    //   .min(
    //     1,
    //     <FormattedMessage
    //       id="investorProfile.form.investmentType.error.message"
    //       defaultMessage="Select Investment Sector type"
    //     />
    //   )
    //   .required(
    //     <FormattedMessage
    //       id="investorProfile.form.investmentType.error.message"
    //       defaultMessage="Select Investment Sector type"
    //     />
    //   ),
    // fundType: yup
    //   .array()
    //   .min(
    //     1,
    //     <FormattedMessage
    //       id="investorProfile.form.fundType.error.message"
    //       defaultMessage="Select Fund type"
    //     />
    //   )
    //   .required(
    //     <FormattedMessage
    //       id="investorProfile.form.fundType.error.message"
    //       defaultMessage="Select Fund type"
    //     />
    //   ),
    // startupStage: yup
    //   .array()
    //   .min(
    //     1,
    //     <FormattedMessage
    //       id="investorProfile.form.startupType.error.message"
    //       defaultMessage="Select Stage of Startup Type"
    //     />
    //   )
    //   .required(
    //     <FormattedMessage
    //       id="investorProfile.form.startupType.error.message"
    //       defaultMessage="Select Stage of Startup Type"
    //     />
    //   ),
    // FundWebsite: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.website.required.errorMessage"
    //       defaultMessage="Enter the website"
    //     />
    //   )
    //   .matches(urlRegex, () => (
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.websiteRegex.errorMessage"
    //       defaultMessage="Enter a valid Link"
    //     />
    //   )),

    // JobTitle: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="investorProfile.form.jobProfile.error.message"
    //       defaultMessage="Enter Job Profile"
    //     />
    //   )
    //   .min(2, "Job Title should be at least 2 characters")
    //   .max(
    //     80,
    //     <FormattedMessage
    //       id="investorProfile.form.jobTitle.maxLength.errorMessage"
    //       defaultMessage="Job Title should not exceed 80 characters"
    //     />
    //   ),
    // FundTicketSize: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="investorProfile.form.fundTicketSize.error.message"
    //       defaultMessage="Select Fund Ticket Size"
    //     />
    //   ),
    // investedBefore: yup
    //   .boolean()
    //   .required(
    //     <FormattedMessage
    //       id="investorProfile.form.investedBefore.error.message"
    //       defaultMessage="Select a if invested before"
    //     />
    //   ),
    // notableInvestment: yup
    //   .string()
    //   .max(150, "Notable Investment should not exceed 150 characters")
    //   .test("notableInvestment-required", "Please enter notable investment", function (value) {
    //     const { investedBefore } = this.parent;
    //     if (investedBefore && !value) {
    //       return false; // 'notableInvestment' is required if 'investedBefore' is true
    //     }
    //     return true;
    //   }),
    // imageUrl: yup
    //   .mixed()
    //   .required(
    //     <FormattedMessage
    //       id="startupPitch.OverViewTabInfo.image.required.errorMessage"
    //       defaultMessage="An image is required"
    //     />
    //   ),
  })
  .required();

const Overview = ({ setTab }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [investedBeforeToggle, setinvestedBeforeToggle] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const intl = useIntl();
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const ButtonCss = getButtonCss();

  const formlabelStyle = {
    marginBottom: "15px",
    fontFamily: "Calibri",
    fontWeight: 600,
    fontSize: "17px",
    color: "rgb(32, 33, 66)",
    // color: "#0d4261",
  };

  const textFeildStyling = {
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

  const selectFeildStyling = {
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

  const feildInputProps = {
    fontFamily: "Calibri",
    fontWeight: 500,
    fontSize: "17px",
    color: "#6d6d6d",
    whiteSpace: "normal",
    wordBreak: "break-word",
  };
  // Use this useEffect to set the image receiving from api.

  let userDetails = localStorage.getItem("userDetails");
  userDetails = userDetails ? JSON.parse(userDetails) : null;
  const investorId = userDetails?.investorId;
  const profileId = userDetails?.id;
  let lang = localStorage.getItem("lang");

  useEffect(() => {
    dispatch(getInvestorProfileData(investorId));
    dispatch(getCountries());
    dispatch(getFundType());
    dispatch(getFundTicket());
    dispatch(getInvestorSector());
    dispatch(getStartupStageType());
    dispatch(getCountryNumberCode());
  }, [dispatch, investorId]);

  const investorData = [
    {
      id: "1",
      name: "Angel Investor",
    },
    {
      id: "2",
      name: "Family Office",
    },
    {
      id: "3",
      name: "Venture Capital (VC)",
    },
    {
      id: "4",
      name: "Venture Builder",
    },
    {
      id: "5",
      name: "Incubator",
    },
    {
      id: "6",
      name: "Accelerator",
    },
    {
      id: "7",
      name: "Corporate Venture Investor",
    },
    {
      id: "8",
      name: "Government/Development Fund",
    },
    {
      id: "9",
      name: "Sovereign Wealth Fund",
    },
    {
      id: "10",
      name: "Private Equity (PE)",
    },
  ];

  const countryData = useSelector((state) => state.globalApi.countries);
  const cityData = useSelector((state) => state.globalApi.cities);

  const investorProfileData = useSelector(
    (state) => state?.investorProfileStepper.investorProfileData
  );
  const investorFundType = useSelector((state) => state?.investorProfileStepper.fundType);
  const investorFundTicket = useSelector((state) => state?.investorProfileStepper.fundTicket);
  const investmentSector = useSelector((state) => state?.investorProfileStepper.investorSector);
  const startupStageType = useSelector((state) => state?.investorProfileStepper.startupStageType);
  const countryNumberCode = useSelector((state) => state.globalApi.countryNumberCode);
  // Watch the value of the "Country" field
  const countryValue = watch("country");
  useEffect(() => {
    if (investorProfileData?.logoUrl) {
      const decodeBase64 = async () => {
        const response = await fetch(`data:image/png;base64,${investorProfileData?.logoUrl}`);
        const blob = await response.blob();
        const dataUrl = URL.createObjectURL(blob);
        setSelectedImage(dataUrl);
        setValue("imageUrl", investorProfileData?.logoUrl);
      };

      decodeBase64();
    }
  }, [investorProfileData?.logoUrl]);

  console.log(investorProfileData);
  // useEffect(() => {
  //   if (
  //     investorProfileData?.country?.map((r) => r?.code) &&
  //     countryValue === investorProfileData?.country?.map((r) => r?.code) &&
  //     countryValue !== undefined
  //   ) {
  //     dispatch(getCity(investorProfileData?.country?.map((r) => r?.code)));
  //   } else if (
  //     investorProfileData?.country?.map((r) => r?.code) &&
  //     countryValue !== investorProfileData?.country?.map((r) => r?.code) &&
  //     countryValue !== undefined
  //   ) {
  //     setValue(
  //       "city",
  //       ""
  //       // <FormattedMessage
  //       //   id="investorProfile.form.label4.placeholder"
  //       //   defaultMessage=""
  //       // />
  //     );
  //     dispatch(getCity(countryValue));
  //   } else if (countryValue !== undefined) {
  //     dispatch(getCity(countryValue));
  //   }
  // }, [countryValue, investorProfileData, dispatch, setValue]);

  useEffect(() => {
    if (countryValue !== undefined) {
      dispatch(getCity(countryValue));
    }
  }, [countryValue, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setValue("imageUrl", file);

    if (file) {
      if (file.size > 200 * 1024) {
        // Display an error message or perform any other action
        toast.error(
          <FormattedMessage
            id="investorProfile.form.fileSize.error.message"
            defaultMessage="File size exceeds 200 KB. Please choose a smaller file."
          />,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
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
        formData.append("uploadImage", blob, file.name);

        // Dispatch the action with formData
        dispatch(uploadInvestorProfileImage(profileId, formData));
      };

      reader.readAsDataURL(file);
    }
  };

  // Use setValues to set the form field values from investorProfileData

  useEffect(() => {
    if (investorProfileData) {
      setinvestedBeforeToggle(investorProfileData?.additionalinfo?.investedBefore);
      setValue("fullName", investorProfileData?.fullName || "");
      setValue("organization", investorProfileData?.organization || "");
      setValue("communication_email", investorProfileData?.communication_email || "");
      setValue("ContactNumber", investorProfileData?.contactNo || "");
      setValue("country", investorProfileData?.country?.[0]?.code || "");
      setValue("city", investorProfileData?.city || "");
      setValue("investorType", investorProfileData?.investorType || "");
      setValue("investmentSector", investorProfileData?.investmentSector || []);
      setValue("fundType", investorProfileData?.fundtype || []);
      setValue("startupStage", investorProfileData?.startupStage || []);
      setValue("FundWebsite", investorProfileData?.additionalinfo?.FundWebsite || "");
      setValue("JobTitle", investorProfileData?.additionalinfo?.JobTitle || "");
      setValue("FundTicketSize", investorProfileData?.fundticketSize || "");
      setValue("notableInvestment", investorProfileData?.additionalinfo?.notableInvestments || "");
      setValue("investedBefore", investorProfileData?.additionalinfo?.investedBefore || false);
      setValue("contactCode", investorProfileData?.dialingCode || "");
    }

    // setValue("imageUrl", investorProfileData?.logoUrl || "");
  }, [investorProfileData, setValue]);

  const onSubmit = (data) => {
    const {
      imageUrl,
      contactCode,
      notableInvestment,
      investedBefore,
      FundWebsite,
      JobTitle,
      ContactNumber,
      ...rest
    } = data;

    const updateData = {
      investorId,
      ...rest,
      // investmentSector: Number(data.investmentSector),
      // fundType: Number(data.fundType),
      // startupStage: Number(data.startupStage),
      FundTicketSize: data.FundTicketSize === "" ? null : Number(data.FundTicketSize),
      ContactNumber: `${contactCode}-${ContactNumber}`,
      additionalinfo: {
        FundWebsite: data.FundWebsite,
        JobTitle: data.JobTitle,
        notableInvestments: data.notableInvestment,
        investedBefore: data.investedBefore,
      },
    };
    console.log(updateData);
    dispatch(updateInvestorProfile(investorId, updateData)).then((res) => {
      dispatch(getInvestorProfileCheck(investorId));
      setTab((prevValue) => (prevValue + 1) % 3);
    });
  };

  useEffect(() => {
    setValue("imageUrl", investorProfileData?.logoUrl);
  }, [investorProfileData?.logoUrl, setValue]);

  return (
    <>
      <Box sx={{ width: "100%", background: "#FFFFFF", borderRadius: "8px" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography
            style={{
              fontFamily: "Calibri",
              fontWeight: 700,
              fontSize: "17px",
              textAlign: "left",
              padding: "10px 10px 10px 10px",
              color: "#0d4261",
              textTransform: "uppercase",
            }}
          >
            <FormattedMessage
              id="investorProfile.main.heading"
              defaultMessage="Investor Information"
            />
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={styles.overviewExternal}>
              <Box sx={{ marginLeft: "1%", width: { xs: "100%", sm: "100%", md: "70%" } }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} xl={12}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage id="investorProfile.form.label1" />{" "}
                        <span className={styles.error}>*</span>
                      </FormLabel>
                      <TextField
                        sx={textFeildStyling}
                        inputProps={{
                          style: {
                            ...feildInputProps,
                          },
                        }}
                        id="outlined-basic"
                        variant="outlined"
                        placeholder={intl.formatMessage({
                          id: "investorProfile.form.label1.placeholder",
                          defaultMessage: "Enter Full Name",
                        })}
                        size="small"
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <span className={styles.error}>{errors.fullName?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} xl={12}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label2"
                          defaultMessage="Organization Name"
                        />{" "}
                        <span className={styles.error}>*</span>
                      </FormLabel>
                      <TextField
                        sx={textFeildStyling}
                        id="outlined-basic"
                        variant="outlined"
                        placeholder={intl.formatMessage({
                          id: "investorProfile.form.label2.placeholder",
                          defaultMessage: "Enter Organization Name",
                        })}
                        size="small"
                        inputProps={{
                          style: {
                            ...feildInputProps,
                          },
                        }}
                        {...register("organization")}
                      />
                      {errors.organization && (
                        <span className={styles.error}>{errors.organization?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/* CommunicationEmail */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label11"
                          defaultMessage="Communication Email"
                        />{" "}
                        <span className={styles.error}>*</span>
                      </FormLabel>
                      <TextField
                        sx={textFeildStyling}
                        inputProps={{
                          style: {
                            ...feildInputProps,
                          },
                        }}
                        id="outlined-basic"
                        variant="outlined"
                        placeholder={intl.formatMessage({
                          id: "investorProfile.form.label11.placeholder",
                          defaultMessage: "abc@xyz.com",
                        })}
                        size="small"
                        {...register("communication_email")}
                      />
                      {errors.communication_email && (
                        <span className={styles.error}>{errors.communication_email?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/* Contact No */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label12"
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
                                fullWidth
                                labelId="single-select-label"
                                id="single-select"
                                {...field}
                                sx={{
                                  ...selectFeildStyling,
                                  "& .MuiSelect-select": {
                                    color: "#6d6d6d", // Apply color to the selected value text
                                  },
                                  height: "41.5px",
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
                                    <Box
                                      sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                                    >
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
                            id="outlined-basic"
                            variant="outlined"
                            placeholder={intl.formatMessage({
                              id: "investorProfile.form.label11.placeholder",
                              defaultMessage: "123456789",
                            })}
                            size="small"
                            {...register("ContactNumber")}
                          />
                        </Box>
                      </Box>

                      {errors.ContactNumber && (
                        <span className={styles.error}>{errors.ContactNumber?.message}</span>
                      )}
                      {errors.contactCode && (
                        <span className={styles.error}>{errors.contactCode?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/* <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label12"
                          defaultMessage="Contact Number"
                        />{" "}
                        <span className={styles.error}>*</span>
                      </FormLabel>
                      <Controller
                        name="ContactNumber"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <PhoneInput
                            inputStyle={{
                              height: "41px",
                              width: "100%",
                              borderRadius: "8px",
                              color: "#6d6d6d",
                              fontSize: "17px",
                              borderColor: "#FFB6C1",
                            }}
                            containerStyle={{
                              width: "100%", // Optional: Control container width
                            }}
                            specialLabel={""}
                            value={`${countryCode}${phone}`}
                            onChange={(value, data) => {
                              // data contains country information
                              const countryCallingCode = data?.dialCode;
                              // Remove country code from the full number to get just the phone number
                              const phoneWithoutCode = value.slice(countryCallingCode?.length);

                              setCountryCode(countryCallingCode);
                              setPhone(phoneWithoutCode);
                              // setValue("ContactNumber", phone);
                            }}
                            // {...register("ContactNumber")}
                          />
                        )}
                      />

                      {contactNumberError && (
                        <span className={styles.error}>{contactNumberErrorMessage}</span>
                      )}
                    </Box>
                  </Grid> */}
                  {/* Country */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label3"
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
                            sx={selectFeildStyling}
                            labelId="single-select-label"
                            displayEmpty
                            id="single-select"
                            size="small"
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
                              if (selected === "" && investorProfileData?.country === null) {
                                return (
                                  <Typography sx={feildInputProps}>
                                    {" "}
                                    <FormattedMessage
                                      id="investorProfile.form.label3.placeholder"
                                      defaultMessage="Select Your Country"
                                    />
                                  </Typography>
                                );
                              } else {
                                const countryOption = countryData.find(
                                  (option) =>
                                    option.countryCode ===
                                    (selected || investorProfileData?.country?.[0]?.code)
                                );
                                return (
                                  <Typography sx={feildInputProps}>
                                    {" "}
                                    {countryOption?.country || selected}
                                  </Typography>
                                );
                              }
                            }}
                          >
                            <MenuItem
                              value=""
                              disabled
                              sx={{ ...feildInputProps, marginBottom: "15px" }}
                            >
                              <FormattedMessage
                                id="investorProfile.form.label3.placeholder"
                                defaultMessage="Select Your Country"
                              />
                            </MenuItem>
                            {countryData.map((option) => (
                              <MenuItem
                                key={option.countryCode}
                                value={option.countryCode}
                                sx={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
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
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage id="investorProfile.form.label4" defaultMessage="City" />{" "}
                        <span className={styles.error}>*</span>
                      </FormLabel>
                      <Controller
                        name="city"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            sx={selectFeildStyling}
                            labelId="single-select-label"
                            id="single-select"
                            displayEmpty
                            {...field}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: { xs: "240px", sm: "auto" },
                                  width: { xs: "70%", sm: "auto" },
                                },
                              },
                            }}
                            size="small"
                            renderValue={(selected) => {
                              if (
                                (selected === "" && investorProfileData?.country === null) ||
                                selected === ""
                              ) {
                                return (
                                  <Typography sx={feildInputProps}>
                                    <FormattedMessage
                                      id="investorProfile.form.label4.placeholder"
                                      defaultMessage="Please select city"
                                    />
                                  </Typography>
                                );
                              } else {
                                return <Typography sx={feildInputProps}> {selected}</Typography>;
                              }
                            }}
                          >
                            <MenuItem value="" disabled>
                              <Typography sx={feildInputProps}>
                                <FormattedMessage
                                  id="investorProfile.form.label4.placeholder"
                                  defaultMessage="Please select city"
                                />
                              </Typography>
                            </MenuItem>
                            {cityData?.map((option) => (
                              <MenuItem
                                key={option}
                                value={option}
                                sx={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                <Typography sx={feildInputProps}>{option}</Typography>
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.city && <span className={styles.error}>{errors.city?.message}</span>}
                    </Box>
                  </Grid>
                  {/* Investor Type */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label5"
                          defaultMessage="Investor Type"
                        />{" "}
                        <span className={styles.error}>*</span>
                      </FormLabel>
                      <Controller
                        name="investorType"
                        defaultValue={""}
                        control={control}
                        render={({ field }) => (
                          <Select
                            sx={selectFeildStyling}
                            size="small"
                            displayEmpty
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
                                  <Typography sx={feildInputProps}>
                                    {" "}
                                    <FormattedMessage
                                      id="investorProfile.form.label5.placeholder"
                                      defaultMessage="Select Investor Type"
                                    />
                                  </Typography>
                                );
                              }
                              const selectedNames = investorData.find(
                                (sector) => sector?.name === selected
                              );
                              return (
                                <Typography sx={feildInputProps}>{selectedNames?.name}</Typography>
                              );
                            }}
                          >
                            {investorData?.map((option) => (
                              <MenuItem
                                key={option?.id}
                                value={option?.name}
                                sx={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                <Typography sx={feildInputProps}>{option?.name}</Typography>
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.investorType && (
                        <span className={styles.error}>{errors.investorType?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/* Investment Sector */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label20"
                          defaultMessage="Investment Sector"
                        />{" "}
                        {/* <span className={styles.error}>*</span> */}
                      </FormLabel>

                      <Controller
                        name="investmentSector"
                        defaultValue={[]}
                        control={control}
                        multiple
                        render={({ field }) => (
                          <Select
                            labelId="multi-select-label"
                            id="multi-select"
                            sx={selectFeildStyling}
                            size="small"
                            displayEmpty
                            multiple
                            {...field}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: { xs: "240px", sm: "auto" },
                                  width: { xs: "70%", sm: "auto" },
                                },
                              },
                            }}
                            renderValue={(selected = []) => {
                              if (selected?.length === 0) {
                                return (
                                  <Typography sx={feildInputProps}>
                                    {" "}
                                    <FormattedMessage
                                      id="investorProfile.form.label10.placeholder"
                                      defaultMessage="Investment Sector"
                                    />
                                  </Typography>
                                );
                              }

                              // const selectedSector = investmentSector.find(
                              //   sector => sector?.id === selected
                              // );
                              const selectedSector = selected.map((value) => {
                                const option = investmentSector.find(
                                  (sector) => sector?.id === value
                                );
                                return option?.sector_name || "";
                              });
                              return (
                                <Typography sx={feildInputProps}>
                                  {/* {selectedSector?.sector_name} */}
                                  {selectedSector.join(", ")}
                                </Typography>
                              );
                            }}
                          >
                            {investmentSector.map((option) => (
                              <MenuItem
                                key={option.id}
                                value={option.id}
                                sx={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                <Checkbox checked={field.value.includes(option?.id)} />
                                {option.sector_name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.investmentSector && (
                        <span className={styles.error}>{errors.investmentSector?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/* Fund Type  */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label13"
                          defaultMessage="Fund Type"
                        />{" "}
                        {/* <span className={styles.error}>*</span> */}
                      </FormLabel>
                      <Controller
                        name="fundType"
                        defaultValue={[]}
                        control={control}
                        render={({ field }) => (
                          <Select
                            sx={selectFeildStyling}
                            labelId="multi-select-label"
                            id="multi-select"
                            size="small"
                            displayEmpty
                            multiple
                            {...field}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: { xs: "240px", sm: "auto" },
                                  width: { xs: "70%", sm: "auto" },
                                },
                              },
                            }}
                            renderValue={(selected = []) => {
                              if (selected?.length === 0) {
                                return (
                                  <Typography sx={feildInputProps}>
                                    {" "}
                                    <FormattedMessage
                                      id="investorProfile.form.label13.placeholder"
                                      defaultMessage="Fund Type"
                                    />
                                  </Typography>
                                );
                              }
                              // const selectedNames = investorFundType.find(
                              //   sector => sector?.id === selected
                              // );
                              const selectedNames = selected.map((value) => {
                                const option = investorFundType.find(
                                  (sector) => sector?.id === value
                                );
                                return option?.fund_name || "";
                              });

                              return (
                                <Typography sx={feildInputProps}>
                                  {/* {selectedNames?.fund_name} */}
                                  {selectedNames.join(", ")}
                                </Typography>
                              );
                            }}
                          >
                            {investorFundType.map((option) => (
                              <MenuItem
                                key={option.id}
                                value={option.id}
                                sx={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                <Checkbox checked={field.value.includes(option?.id)} />
                                {option.fund_name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.fundType && (
                        <span className={styles.error}>{errors.fundType?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/* Stage of startup type */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label9"
                          defaultMessage="Stage of Startup Type"
                        />{" "}
                        {/* <span className={styles.error}>*</span> */}
                      </FormLabel>
                      <Controller
                        name="startupStage"
                        defaultValue={[]}
                        control={control}
                        render={({ field }) => (
                          <Select
                            sx={selectFeildStyling}
                            size="small"
                            displayEmpty
                            multiple
                            {...field}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: { xs: "240px", sm: "auto" },
                                  width: { xs: "70%", sm: "auto" },
                                },
                              },
                            }}
                            renderValue={(selected = []) => {
                              if (selected?.length === 0) {
                                return (
                                  <Typography sx={feildInputProps}>
                                    {" "}
                                    <FormattedMessage
                                      id="investorProfile.form.label9.placeholder"
                                      defaultMessage="Stage of Startup Type"
                                    />
                                  </Typography>
                                );
                              }
                              // const selectedNames = startupStageType.find(
                              //   sector => sector?.id === selected
                              // );
                              const selectedNames = selected.map((value) => {
                                const option = startupStageType.find(
                                  (sector) => sector?.id === value
                                );
                                return option?.stage_name || "";
                              });
                              return (
                                <Typography sx={feildInputProps}>
                                  {/* {selectedNames?.stage_name} */}
                                  {selectedNames.join(", ")}
                                </Typography>
                              );
                            }}
                          >
                            {startupStageType.map((option) => (
                              <MenuItem
                                key={option.id}
                                value={option.id}
                                sx={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
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
                  </Grid>
                  {/* Fund Website */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label15"
                          defaultMessage="Website"
                        />{" "}
                        {/* <span className={styles.error}>*</span> */}
                      </FormLabel>
                      <TextField
                        sx={textFeildStyling}
                        inputProps={{
                          style: {
                            ...feildInputProps,
                          },
                        }}
                        id="outlined-basic"
                        variant="outlined"
                        placeholder={intl.formatMessage({
                          id: "investorProfile.form.label15.placeholder",
                        })}
                        size="small"
                        {...register("FundWebsite")}
                      />
                      {errors.FundWebsite && (
                        <span className={styles.error}>{errors.FundWebsite?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/*Job Title */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label16"
                          defaultMessage="Title"
                        />{" "}
                        {/* <span className={styles.error}>*</span> */}
                      </FormLabel>
                      <TextField
                        sx={textFeildStyling}
                        inputProps={{
                          style: {
                            ...feildInputProps,
                          },
                        }}
                        id="outlined-basic"
                        variant="outlined"
                        placeholder={intl.formatMessage({
                          id: "investorProfile.form.label16.placeholder",
                        })}
                        size="small"
                        {...register("JobTitle")}
                      />
                      {errors.JobTitle && (
                        <span className={styles.error}>{errors.JobTitle?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/* TicketSize */}
                  <Grid item xs={12} sm={12} md={11} xl={11}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label14"
                          defaultMessage="Fund Ticket Size"
                        />{" "}
                        {/* <span className={styles.error}>*</span> */}
                      </FormLabel>
                      <Controller
                        name="FundTicketSize"
                        defaultValue={null}
                        control={control}
                        render={({ field }) => (
                          <Select
                            sx={selectFeildStyling}
                            size="small"
                            displayEmpty
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
                                  <Typography sx={feildInputProps}>
                                    {" "}
                                    <FormattedMessage
                                      id="investorProfile.form.label14.placeholder"
                                      defaultMessage="Avg. Fund Size"
                                    />
                                  </Typography>
                                );
                              }
                              const selectedNames = investorFundTicket.find(
                                (sector) => sector?.id === selected
                              );
                              return (
                                <Typography sx={feildInputProps}>
                                  {selectedNames?.ticket_name}
                                </Typography>
                              );
                            }}
                          >
                            {investorFundTicket.map((option) => (
                              <MenuItem
                                key={option.id}
                                value={option.id}
                                sx={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                {option.ticket_name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />

                      {errors.FundTicketSize && (
                        <span className={styles.error}>{errors.FundTicketSize?.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/* Radio Thing */}
                  <Grid item xs={12} sm={12} md={12} xl={12}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage id="investorProfile.form.label17" />{" "}
                        {/* <span className={styles.error}>*</span> */}
                      </FormLabel>
                      <Controller
                        name="investedBefore"
                        control={control}
                        defaultValue={investorProfileData?.additionalinfo?.investedBefore || false}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "1rem",
                              marginLeft: "5px",
                            }}
                          >
                            <FormControlLabel
                              onChange={() => {
                                setinvestedBeforeToggle(true);
                              }}
                              value={true}
                              control={<Radio />}
                              label="Yes"
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 18,
                                },
                              }}
                            />
                            <FormControlLabel
                              onChange={() => {
                                setinvestedBeforeToggle(false);
                              }}
                              value={false}
                              control={<Radio />}
                              label="No"
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 18,
                                },
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                      {errors.investedBefore && (
                        <span className={styles.error}>{errors.investedBefore.message}</span>
                      )}
                    </Box>
                  </Grid>
                  {/* Question for yes or no */}
                  {investedBeforeToggle ? (
                    <Grid item xs={12} sm={12} md={12} xl={12}>
                      <Box style={{ display: "flex", flexDirection: "column" }}>
                        <FormLabel sx={formlabelStyle}>
                          <FormattedMessage id="investorProfile.form.label18" />{" "}
                          {/* <span className={styles.error}>*</span> */}
                        </FormLabel>
                        <TextField
                          multiline
                          rows={4}
                          sx={{
                            ...textFeildStyling,
                            "& textarea::placeholder": {
                              color: "#6d6d6d",
                            },
                          }}
                          inputProps={{
                            style: {
                              ...feildInputProps,
                            },
                          }}
                          id="outlined-basic"
                          variant="outlined"
                          placeholder={intl.formatMessage({
                            id: "investorProfile.form.label18.placeholder",
                          })}
                          size="small"
                          {...register("notableInvestment")}
                        />
                        {errors.notableInvestment && (
                          <span className={styles.error}>{errors.notableInvestment?.message}</span>
                        )}
                      </Box>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </Box>
              {/* <Box 
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: { xs: "100%", sm: "70%", md: "50%" }
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Calibri",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#393939"
                  }}
                >
                  eslint-disable-next-line react/no-unescaped-entities
                  <FormattedMessage
                    id="investorProfile.form.label6"
                    defaultMessage="Company Profile"
                  />{" "}
                  <span className={styles.error}>*</span>
                </Typography>
                <Grid
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: { xs: "column", sm: "row", md: "row", lg: "row" }
                  }}
                >
                  <Box
                    component="label"
                    sx={{
                      cursor: "pointer",
                      width: { xs: "60%", sm: "70%", md: "90%", lg: "90%" }
                    }}
                  >
                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                    <Controller
                      name="imageUrl"
                      control={control}
                      render={({ field }) => (
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={e => {
                            handleImageChange(e);
                            field.onChange(e.target.files[0]); // Update React Hook Form's field value
                          }}
                        />
                      )}
                    />
                    {selectedImage ? (
                      <div>
                        <img
                          src={selectedImage}
                          alt="Selected"
                          width="120px"
                          height="120px"
                          style={{ width: "100%", marginTop: "20px", borderRadius: "10px" }}
                        />
                      </div>
                    ) : (
                      <img
                        src="/Images/upload-company's-logo.png"
                        alt="Upload"
                        style={{ width: "100%", marginTop: "20px" }}
                      />
                    )}
                  </Box>

                  <Box sx={{ marginLeft: { xs: "", sm: "30px", md: "30px" } }}>
                    <Typography
                      style={{
                        fontFamily: "Calibri",
                        fontWeight: 700,
                        fontSize: "19px",
                        color: "#6d6d6d",
                        marginTop: "25px",
                        marginBottom: "0px"
                      }}
                    >
                      <FormattedMessage
                        id="investorProfile.form.label7"
                        defaultMessage="Update Profile Picture"
                      />
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: "Calibri",
                        fontSize: "14px",
                        color: "#808080",
                        marginTop: "5px"
                      }}
                    >
                      <FormattedMessage
                        id="investorProfile.form.label8"
                        defaultMessage="in jpeg or .jpg or .png format"
                      />
                    </Typography>
                  </Box>
                </Grid>
                <Typography>
                  {errors.imageUrl && !selectedImage && (
                    <span className={styles.error}>{errors.imageUrl?.message}</span>
                  )}
                </Typography>
              </Box> */}
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
                          // disabled={pitchingDisable}
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
            <Box
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
                padding: "20px",
                marginLeft: "-60px",
              }}
              className={styles.buttonExternal}
            >
              <Button type="submit" sx={ButtonCss}>
                <FormattedMessage
                  id="investorProfile.form.submit.button.text"
                  defaultMessage="Update"
                />
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Overview;
