import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../Profile/InvestorProfile/investorProfile.module.css";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
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
import {
  getIndividualProfileDetails,
  updateIndividualProfileDetails,
  updateIndividualProfileImage,
} from "src/action/individual";

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
    imageUrl: yup
      .mixed()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.image.required.errorMessage"
          defaultMessage="An image is required"
        />
      ),
  })
  .required();

const MyProfile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [investedBeforeToggle, setinvestedBeforeToggle] = useState(false);

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
      borderColor: "#FFB6C1", // Border color on hover
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFB6C1",
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

  const individualId = userDetails?.individualId;

  useEffect(() => {
    if (individualId) {
      dispatch(getIndividualProfileDetails(individualId));
    }
  }, [dispatch, individualId]);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getCountryNumberCode());
  }, [dispatch]);

  const countryData = useSelector((state) => state.globalApi.countries);
  const cityData = useSelector((state) => state.globalApi.cities);

  const investorProfileData = useSelector(
    (state) => state?.investorProfileStepper.investorProfileData
  );
  const countryNumberCode = useSelector((state) => state.globalApi.countryNumberCode);

  const individualProfile = useSelector((state) => state?.individual?.individualProfileDetails);
  // Watch the value of the "Country" field
  const countryValue = watch("country");
  useEffect(() => {
    if (individualProfile?.logoUrl) {
      const decodeBase64 = async () => {
        const response = await fetch(`data:image/png;base64,${individualProfile?.logoUrl}`);
        const blob = await response.blob();
        const dataUrl = URL.createObjectURL(blob);
        setSelectedImage(dataUrl);
        setValue("imageUrl", individualProfile?.logoUrl);
      };

      decodeBase64();
    }
  }, [individualProfile?.logoUrl]);

  useEffect(() => {
    if (
      individualProfile?.country?.map((r) => r?.code) &&
      countryValue === individualProfile?.country?.map((r) => r?.code) &&
      countryValue !== undefined
    ) {
      dispatch(getCity(individualProfile?.country?.map((r) => r?.code)));
    } else if (
      individualProfile?.country?.map((r) => r?.code) &&
      countryValue !== individualProfile?.country?.map((r) => r?.code) &&
      countryValue !== undefined
    ) {
      setValue(
        "city",
        ""
        // <FormattedMessage
        //   id="investorProfile.form.label4.placeholder"
        //   defaultMessage=""
        // />
      );
      dispatch(getCity(countryValue));
    } else if (countryValue !== undefined) {
      dispatch(getCity(countryValue));
    }
  }, [countryValue, individualProfile, dispatch, setValue]);

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
        dispatch(updateIndividualProfileImage(individualId, formData));
      };

      reader.readAsDataURL(file);
    }
  };

  // Use setValues to set the form field values from investorProfileData
  useEffect(() => {
    if (individualProfile) {
      setValue("fullName", individualProfile?.fullName || "");
      setValue("communication_email", individualProfile?.emailId || "");
      setValue("ContactNumber", individualProfile?.contactNo || "");
      setValue("country", individualProfile?.country?.[0]?.code || "");
      setValue("city", individualProfile?.city || "");
      setValue("imageUrl", individualProfile?.logoUrl || "");

      setValue("contactCode", individualProfile?.dialingCode || "");
    }

    // setValue("imageUrl", investorProfileData?.logoUrl || "");
  }, [individualProfile, setValue]);

  const onSubmit = (data) => {
    const { imageUrl, contactCode, ContactNumber, communication_email, ...rest } = data;

    const updateData = {
      ...rest,
      individualId,
      // investmentSector: Number(data.investmentSector),
      // fundType: Number(data.fundType),
      // startupStage: Number(data.startupStage),
      contact_no: `${contactCode}-${ContactNumber}`,
    };
    console.log(updateData);
    // dispatch(updateInvestorProfile(investorId, updateData)).then(res => {
    //   dispatch(getInvestorProfileCheck(investorId));
    //   setTab(prevValue => (prevValue + 1) % 3);
    // });
    dispatch(updateIndividualProfileDetails(individualId, updateData));
  };

  useEffect(() => {
    setValue("imageUrl", individualProfile?.logoUrl);
  }, [individualProfile?.logoUrl, setValue]);

  return (
    <>
      <Box
        sx={{
          // width: "100%",
          padding: "15px",
          // margin: "10px",
          background: "rgba(65, 148, 179,0.1)!important",
          // borderRadius: "8px"
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            background: "#FFFFFF",
            borderRadius: "8px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Calibri",
              fontWeight: 700,
              fontSize: "18px",
              textAlign: "left",
              padding: "20px 10px 10px 10px",
              color: "#0d4261",
              textTransform: "uppercase",
            }}
          >
            My Profile
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={styles.overviewExternal}>
              <Box style={{ marginLeft: "1%", width: "70%" }}>
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
                  {/* <Grid item xs={12} sm={12} md={12} xl={12}>
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
                          defaultMessage: "Enter Organization Name"
                        })}
                        size="small"
                        inputProps={{
                          style: {
                            ...feildInputProps
                          }
                        }}
                        {...register("organization")}
                      />
                      {errors.organization && (
                        <span className={styles.error}>{errors.organization?.message}</span>
                      )}
                    </Box>
                  </Grid> */}
                  {/* CommunicationEmail */}
                  <Grid item xs={12} sm={12} md={6} xl={6}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={formlabelStyle}>
                        <FormattedMessage
                          id="investorProfile.form.label19"
                          defaultMessage="Email"
                        />{" "}
                        <span className={styles.error}>*</span>
                      </FormLabel>
                      <TextField
                        sx={textFeildStyling}
                        disabled
                        inputProps={{
                          style: {
                            ...feildInputProps,
                            backgroundColor: "#f0f0f0",
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
                        <Box width={"30%"}>
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
                                  height: "42px",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    borderRight: "none",
                                    borderColor: "#FFB6C1",
                                  },
                                }}
                                displayEmpty
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      maxHeight: { xs: "200px", sm: "auto" },
                                      width: { xs: "30%", sm: "auto" },
                                    },
                                  },
                                }}
                                // renderValue={(selected) => {
                                //   if (selected?.length === 0) {
                                //     return (
                                //       <Typography sx={feildInputProps}>
                                //         {" "}
                                //         Select Team Background
                                //       </Typography>
                                //     );
                                //   }
                                //   const selectedNames = startupfetchedteamBackground.find(
                                //     (sector) => sector?.id === selected
                                //   );
                                //   return (
                                //     <Typography sx={feildInputProps}>
                                //       {selectedNames?.team_name}
                                //     </Typography>
                                //   );
                                // }}
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
                                    }}
                                  >
                                    {option?.dialing_code}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </Box>
                        <Box width={"70%"}>
                          <TextField
                            fullWidth
                            sx={{
                              ...textFeildStyling,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
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
                              if (selected === "") {
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
                                const countryOption = countryData?.find(
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
                      id="individual.OverViewTabInfo.profilePicture.label"
                      defaultMessage="Profile picture"
                    />{" "}
                    <span className={styles.error}>*</span>
                  </Typography>
                  <Box component="label" sx={{ cursor: "pointer" }}>
                    {/* <input hidden accept="image/*" type="file" onChange={handleImageChange} /> */}

                    <Controller
                      name="imageUrl"
                      control={control}
                      render={({ field }) => (
                        <input
                          hidden
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

MyProfile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MyProfile;
