import React, { useEffect, useState } from "react";
import ExternalContainer from "src/components/ExternalContainer";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCity, getCountries, getDomains, getTechnologies } from "src/action/globalApi";
import { addStartup, uploadDocument } from "src/action/startup";
import {
  descriptionRegex,
  digitRegex,
  emailRegex,
  mobileNumberRegex,
  startupNameRegex,
  urlRegex,
  facebookRegex,
  instagramRegex,
  nameRegex,
  XRegex,
  youTubeRegex,
} from "../../components/validators";
import BulkUpload from "./uploadDocument";
import { FormattedMessage, useIntl } from "react-intl";
import {
  startupcurrentTraction,
  startupStageTypeDetails,
  startupTeamBackground,
} from "src/action/seeNewMandate";
import { border } from "@mui/system";
import { getButtonCss, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";

const schema = yup.object({
  name: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.startupName.required.errorMessage"
        defaultMessage="Enter Startup Name"
      />
    )
    .min(
      2,
      <FormattedMessage
        id="addStartup.startupName.min2.errorMessage"
        defaultMessage="Name should be at least 2 characters"
      />
    )
    .max(
      150,
      <FormattedMessage
        id="addStartup.startupName.max150.errorMessage"
        defaultMessage="Name should not exceed 150 characters"
      />
    )
    .matches(startupNameRegex, () => (
      <FormattedMessage
        id="addStartup.startupName.whitespace.errorMessage"
        defaultMessage="Name must contain letters or spaces. it can't be only numbers."
      />
    ))
    .trim(),
  website: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.website.required.errorMessage"
        defaultMessage="Enter the website"
      />
    )
    .matches(urlRegex, () => (
      <FormattedMessage
        id="addStartup.website.urlRegex.errorMessage"
        defaultMessage="Enter a valid Link"
      />
    )),
  countryCode: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.countryCode.required.errorMessage"
        defaultMessage="Select at least one country"
      />
    ),
  city: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.city.required.errorMessage"
        defaultMessage="Select at least one city"
      />
    ),
  technology: yup
    .array()
    .min(
      1,
      <FormattedMessage
        id="addStartup.technology.required.errorMessage"
        defaultMessage="Select at least one technology"
      />
    ),
  description: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.description.required.errorMessage"
        defaultMessage="Enter the description"
      />
    )
    .min(
      10,
      <FormattedMessage
        id="addStartup.description.min.errorMessage"
        defaultMessage="Name should be at least 10 characters"
      />
    )
    .max(
      450,
      <FormattedMessage
        id="addStartup.description.max.errorMessage"
        defaultMessage="Name should not exceed 450 characters"
      />
    )
    .matches(
      descriptionRegex,
      <FormattedMessage
        id="addStartup.description.descriptionRegex.errorMessage"
        defaultMessage="Enter a valid description"
      />
    ),
  teamSize: yup
    .string()
    .min(
      1,
      <FormattedMessage
        id="addStartup.teamSize.req.errorMessage"
        defaultMessage="Select the number of employee"
      />
    ),
  foundedYear: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.foundedYear.req.errorMessage"
        defaultMessage="Enter the Year"
      />
    ),
  funding: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.funding.req.errorMessage"
        defaultMessage="Enter the last Funding"
      />
    ),
  // rounds: yup
  //   .string()
  //   .required(
  //     <FormattedMessage
  //       id="addStartup.rounds.req.errorMessage"
  //       defaultMessage="Enter the funding rounds"
  //     />
  //   )
  //   .matches(
  //     digitRegex,

  //     () => (
  //       <FormattedMessage
  //         id="addStartup.rounds.digitRegex.errorMessage"
  //         defaultMessage="Enter number between [0-9]"
  //       />
  //     )
  //   ),
  communicationEmail: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.communicationEmail.required.errorMessage"
        defaultMessage="Enter the communication email"
      />
    )
    .matches(
      emailRegex,
      // <FormattedMessage
      //   id="addStartup.communicationEmail.emailRegex.errorMessage"
      //   defaultMessage="Enter a valid communication email"
      // />
      () => (
        <FormattedMessage
          id="addStartup.communicationEmail.emailRegex.errorMessage"
          defaultMessage="Enter a valid communication email"
        />
      )
    ),
  contactNo: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.contactNo.required.errorMessage"
        defaultMessage="Enter the contact no."
      />
    )
    .min(
      8,
      <FormattedMessage
        id="addStartup.contactNo.min.errorMessage"
        defaultMessage="Number should be at least 8 digits"
      />
    )
    .max(
      15,
      <FormattedMessage
        id="addStartup.contactNo.max.errorMessage"
        defaultMessage="Number should not exceed 15 digits"
      />
    )
    .matches(
      mobileNumberRegex,

      () => (
        <FormattedMessage
          id="addStartup.contactNo.mobileNumberRegex.errorMessage"
          defaultMessage="Number should be in +111-123456789 format"
        />
      )
    ),
  teamBackgroundId: yup
    .string()
    .required(
      <FormattedMessage
        id="startupPitch.OverViewTabInfo.teamBackgroundId.errorMessage"
        defaultMessage="Enter the team Background"
      />
    ),
  currentTranctionId: yup
    .string()
    .required(
      <FormattedMessage
        id="startupPitch.OverViewTabInfo.teamBackgroundId.errorMessage"
        defaultMessage="Enter the current traction"
      />
    ),
  marketOpportunity: yup
    .string()
    .required(
      <FormattedMessage
        id="startupPitch.OverViewTabInfo.marketOpportunity.errorMessage"
        defaultMessage="Enter the Market Opportunity"
      />
    ),
  startupStage: yup
    .string()
    .required(
      <FormattedMessage
        id="startupPitch.OverViewTabInfo.startupStage.errorMessage"
        defaultMessage="Select stage"
      />
    ),
  lastfundingYear: yup
    .string()
    .required(
      <FormattedMessage
        id="addStartup.lastfundingYear.required.errorMessage"
        defaultMessage="Enter the last funding Year"
      />
    ),
  categories: yup
    .array()
    .min(
      1,
      <FormattedMessage
        id="addStartup.categories.required.errorMessage"
        defaultMessage="Select at least one sector"
      />
    ),
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

  twitterLink: yup
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
});
const AddStartups = (props) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFormat, setImageFormat] = useState(null);
  const [formData] = useState(new FormData());

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      formData.set("image", file);
    } else {
      console.error("No file detected!");
    }
  };

  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const intl = useIntl();

  useEffect(() => {
    dispatch(getDomains());
    dispatch(getCountries());
    dispatch(getTechnologies());
    dispatch(startupStageTypeDetails());
    dispatch(startupTeamBackground());
    dispatch(startupcurrentTraction());
  }, []);

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
  const countryValue = watch("countryCode");

  // useEffect to log the value whenever it changes
  useEffect(() => {
    dispatch(getCity(countryValue));
  }, [countryValue, dispatch]);

  const sectorData = useSelector((state) => state.globalApi.domain);
  const countryData = useSelector((state) => state.globalApi.countries);
  const cityData = useSelector((state) => state.globalApi.cities);
  const techData = useSelector((state) => state.globalApi.technologies);
  const startupStageTypeDetail = useSelector(
    (state) => state?.seeNewMandate?.startupStageType?.data
  );

  const startupfetchedteamBackground = useSelector(
    (state) => state?.seeNewMandate?.startupTeamBackground?.data
  );
  const startupCurrentTraction = useSelector(
    (state) => state?.seeNewMandate?.startupcurrenttTraction?.data
  );

  const storedUserDetails = localStorage.getItem("userDetails");
  let UserId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const adminUserId = UserId?.id;

  const onSubmit = (data) => {
    const { startupStage, currentTranctionId, teamBackgroundId, imageUrl, ...rest } = data;
    const startupData = {
      ...rest,
      country: data?.countryCode,
      currentTranctionId: Number(data.currentTranctionId),
      teamBackgroundId: Number(data.teamBackgroundId),
      startupStageId: Number(data.startupStage),
    };
    formData.set("data", JSON.stringify(startupData));

    // console.log(formData);
    dispatch(addStartup(adminUserId, formData)).then((res) => {
      console.log(res);
      if (res?.response?.status !== 500) {
        reset();
        setUploadedImage(null);
        formData.delete("data");
        formData.delete("image");
      }
    });
  };

  // const handleDownload = () => {
  //   // Path to the file in your assets folder
  //   const filePath = "/assets/excel/format.xlsx";

  //   // Create a temporary link element
  //   const link = document.createElement("a");
  //   link.href = filePath;
  //   link.download = "format.xlsx"; // The name you want the downloaded file to have
  //   document.body.appendChild(link);
  //   // Trigger the download
  //   link.click();
  //   // Cleanup
  //   document.body.removeChild(link);
  // };

  // const [file, setFile] = useState(null);
  // const [fileName, setFileName] = useState("");
  // const [dialogOpen, setDialogOpen] = useState(false);

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setFile(selectedFile);
  //   setFileName(selectedFile ? selectedFile.name : "");
  // };
  const [dialogOpen, setDialogOpen] = useState(false);
  const onUploadDocument = () => {
    console.log("working");
    setDialogOpen(true);
  };

  // const bulkUpload = () => {
  //   const formData = new FormData();
  //   formData?.append("uploadLetter", file, file?.name);
  //   // Call the dispatch function with the FormData object
  //   dispatch(uploadDocument(formData, adminUserId));
  // };
  const loader = useSelector((state) => state.startupSlice.loading);

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

  const formlabelStyle = {
    fontFamily: "Calibri",
    fontWeight: 700,
    fontSize: "17px",
    color: "rgb(32, 33, 66)",
    // color: "#0d4261",
  };

  const feildInputProps = {
    fontFamily: "Calibri",
    fontWeight: 500,
    fontSize: "17px",
    color: "#6d6d6d",
  };

  const errorStyling = {
    fontSize: "13px",
    marginTop: "3px",
    color: "red",
  };

  return (
    <>
      <ExternalContainer>
        <Box sx={{ p: 4, bgcolor: "#ffff" }}>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography
                style={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
                level="h2"
              >
                <FormattedMessage id="addStartups.addStartups" defaultMessage="Add Startup" />
              </Typography>
            </Box>
            {isPermitted(permissions.ADMIN_ADD_STARTUPS_BULK_UPLOAD) ? (
              <Box>
                <Button
                  onClick={onUploadDocument}
                  size="small"
                  style={{ color: "#ffff", backgroundColor: "#8a1538" }}
                >
                  Bulk Upload
                </Button>
              </Box>
            ) : null}
          </Box>

          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container rowSpacing={0} columnSpacing={2}>
                {/* Startup Name */}
                <Grid item xs={12} sm={12} md={8} xl={8}>
                  <Grid item xs={12} sm={12} md={12} xl={12}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="addStartups.startupName"
                        defaultMessage="Startup Name"
                      />{" "}
                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </FormLabel>
                    <TextField
                      size="small"
                      fullWidth
                      id="outlined-required"
                      placeholder={intl.formatMessage({
                        id: "addStartups.company.placeholder",
                        defaultMessage: "Enter Company Name",
                      })}
                      hiddenLabel
                      sx={textFeildStyling}
                      variant="outlined"
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      {...register("name")}
                    />
                    <p style={errorStyling}>{errors.name?.message}</p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} xl={12} sx={{ marginTop: "25px" }}>
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage id="addStartups.Website" defaultMessage="Website" />

                      <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                    </FormLabel>
                    <TextField
                      size="small"
                      fullWidth
                      id="outlined-required"
                      placeholder={intl.formatMessage({
                        id: "addStartups.website.placeholder",
                        defaultMessage: "Enter Company Website",
                      })}
                      hiddenLabel
                      sx={textFeildStyling}
                      variant="outlined"
                      inputProps={{
                        style: {
                          ...feildInputProps,
                        },
                      }}
                      {...register("website")}
                    />
                    <p style={errorStyling}>{errors.website?.message}</p>
                  </Grid>{" "}
                </Grid>
                <Grid item xs={12} sm={12} md={4} xl={4}>
                  <Grid
                    sx={{
                      flex: 1, // Equal width
                      display: "flex",
                      flexDirection: "column",
                      // height: "94%",
                    }}
                  >
                    {/* Label */}
                    <FormLabel sx={formlabelStyle}>
                      <FormattedMessage
                        id="addStartups.uploadLogoLabel"
                        defaultMessage="Company Logo"
                      />
                      <span style={{ color: "red" }}>*</span>
                    </FormLabel>

                    {/* Input */}
                    <Controller
                      name="imageUrl"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          id="photo-upload"
                          onChange={(event) => {
                            handleFileChange(event);
                            field.onChange(event.target.files[0]);
                          }}
                        />
                      )}
                    />
                    <label htmlFor="photo-upload" style={{ cursor: "pointer" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: "130px",
                          border: "1px dashed #ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          borderRadius: "8px",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <Grid
                          sx={{
                            padding: "10px",
                            textAlign: "center",
                            color: "#555",
                          }}
                        >
                          {uploadedImage ? (
                            <img
                              src={uploadedImage}
                              alt="Uploaded"
                              style={{
                                maxWidth: "90%",
                                maxHeight: "130px",
                                margin: "auto",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <>
                              <FormattedMessage
                                id="addStartups.uploadLogo"
                                defaultMessage="Upload Company Logo"
                              />
                            </>
                          )}
                        </Grid>
                      </Box>
                    </label>
                  </Grid>
                  <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.logoUpload.helperText"
                      defaultMessage="Allowed file types: .jpeg, .jpg, or .png"
                    />
                  </Typography>
                </Grid>
                {/* Website */}
                {/* country */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage id="addStartups.Country" defaultMessage="Country" />
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </FormLabel>
                  <Controller
                    name="countryCode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        size="small"
                        fullWidth
                        displayEmpty
                        labelId="single-select-label"
                        id="single-select"
                        sx={{
                          ...selectFeildStyling,
                          color:
                            control?._fields?.countryCode?._f?.value?.length === 0
                              ? "gray"
                              : "gray",
                        }}
                        {...field}
                        renderValue={(selected) => {
                          if (selected?.length === 0) {
                            return (
                              <FormattedMessage
                                id="addStartups.form.inputField1.placeholder"
                                defaultMessage="Select your startup country"
                              />
                            );
                          }
                          const countryOption = countryData.find(
                            (option) => option.countryCode === selected
                          );
                          return countryOption?.country || selected;
                        }}
                      >
                        {countryData.map((option) => (
                          <MenuItem key={option.countryCode} value={option.countryCode}>
                            {option.country}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <p style={errorStyling}>{errors.countryCode?.message}</p>
                </Grid>
                {/* city */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage id="addStartups.city" defaultMessage="City" />
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </FormLabel>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Select
                        size="small"
                        fullWidth
                        labelId="single-select-label"
                        id="single-select"
                        {...field}
                        displayEmpty
                        sx={{
                          ...selectFeildStyling,
                          color: control?._fields?.city?._f?.value?.length === 0 ? "gray" : "gray",
                        }}
                        renderValue={(selected) => {
                          if (selected?.length === 0) {
                            return (
                              <FormattedMessage
                                id="addStartups.form.inputField2.placeholder"
                                defaultMessage="Select your startup city"
                              />
                            );
                          }
                          return selected;
                        }}
                      >
                        {cityData?.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <p style={errorStyling}>{errors.city?.message}</p>
                </Grid>
                {/* Techonlogy */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.technology.label"
                      defaultMessage="Technology"
                    />{" "}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </FormLabel>
                  <Controller
                    name="technology"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        labelId="multi-select-label"
                        id="multi-select"
                        style={{ height: "68px" }}
                        multiple
                        displayEmpty
                        sx={{
                          ...selectFeildStyling,
                          color:
                            control?._fields?.technology?._f?.value?.length === 0 ? "gray" : "gray",
                        }}
                        {...field}
                        renderValue={(selected) => {
                          if (selected?.length === 0) {
                            return (
                              <FormattedMessage
                                id="addStartups.form.inputField3.placeholder"
                                defaultMessage="Select your startup technology"
                              />
                            );
                          }
                          const selectedNames = selected.map((value) => {
                            const option = techData.find((tech) => tech.name === value);
                            return option?.name || "";
                          });
                          return selectedNames.join(", ");
                        }}
                      >
                        {techData?.map((option) => (
                          <MenuItem key={option?.id} value={option?.name}>
                            <Checkbox checked={field.value.includes(option?.name)} />
                            {option?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.technology && <p style={errorStyling}>{errors.technology?.message}</p>}
                </Grid>
                {/* Startup desci */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="addStartups.startupDescription"
                      defaultMessage="Startup Description"
                    />

                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </FormLabel>

                  <TextField
                    size="small"
                    fullWidth
                    hiddenLabel
                    id="filled-hidden-label-small"
                    multiline
                    rows={2}
                    placeholder={intl.formatMessage({
                      id: "addStartups.website.enterCompanyDescription",
                      defaultMessage: "Enter Company Description",
                    })}
                    sx={textFeildStyling}
                    inputProps={{
                      sx: {
                        ...feildInputProps,
                        "&::placeholder": {
                          color: "grey",
                          opacity: 1,
                        },
                      },
                    }}
                    {...register("description")}
                  />
                  <p style={errorStyling}>{errors.description?.message}</p>
                </Grid>
                {/* Sector  */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage id="addStartups.Sector" defaultMessage="Sector" />

                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </FormLabel>
                  <Controller
                    name="categories"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        size="small"
                        fullWidth
                        labelId="multi-select-label"
                        id="multi-select"
                        multiple
                        displayEmpty
                        sx={{
                          ...selectFeildStyling,
                          color:
                            control?._fields?.categories?._f?.value?.length === 0 ? "gray" : "gray",
                        }}
                        {...field}
                        renderValue={(selected) => {
                          if (selected?.length === 0) {
                            return (
                              <FormattedMessage
                                id="addStartups.form.inputField4.placeholder"
                                defaultMessage="Select your startup sector"
                              />
                            );
                          } else {
                            return selected.join(", ");
                          }
                        }}
                      >
                        {sectorData?.map((option) => (
                          <MenuItem key={option?.id} value={option?.name}>
                            <Checkbox checked={field.value.includes(option?.name)} />
                            {option?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <p style={errorStyling}>{errors.categories?.message}</p>
                </Grid>
                {/* no of employee */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="addStartups.noOfEmployees"
                      defaultMessage=" No Of Employees"
                    />
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </FormLabel>
                  <Controller
                    name="teamSize"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        size="small"
                        sx={{
                          ...selectFeildStyling,
                          color:
                            control?._fields?.teamSize?._f?.value?.length === 0 ? "gray" : "gray",
                        }}
                        fullWidth
                        labelId="single-select-label"
                        id="single-select"
                        {...field}
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected?.length === 0) {
                            return (
                              <FormattedMessage
                                id="addStartups.form.inputField5.placeholder"
                                defaultMessage="Select your teamSize"
                              />
                            );
                          } else {
                            return selected;
                          }
                        }}
                      >
                        {employeeCounts?.map((option) => (
                          <MenuItem key={option?.id} value={option?.name}>
                            {option?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <p style={errorStyling}>{errors.teamSize?.message}</p>
                </Grid>
                {/* founded date */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage id="addStartups.foundedDate" defaultMessage="Founded Date" />{" "}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </FormLabel>
                  <TextField
                    fullWidth
                    hiddenLabel
                    id="filled-hidden-label-small"
                    sx={textFeildStyling}
                    variant="outlined"
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    type="date"
                    defaultValue="Choose date"
                    size="small"
                    {...register("foundedYear")}
                  />
                  <p style={errorStyling}>{errors.foundedYear?.message}</p>
                </Grid>
                {/* past funding
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      fontWeight: "bold",
                    }}
                  >
                    <FormattedMessage
                      id="addStartups.pastFunding"
                      defaultMessage=" Past Funding in (USD)"
                    />

                    <div style={errorStyling}>*</div>
                  </FormLabel>
                  <TextField
                    size="small"
                    fullWidth
                    id="outlined-required"
                    placeholder={intl.formatMessage({
                      id: "addStartups.website.enterPastFunding",
                      defaultMessage: "Enter Past Funding",
                    })}
                    hiddenLabel
                    sx={textFeildStyling}
                    variant="outlined"
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    {...register("funding")}
                  />
                  <p style={errorStyling}>
                    {errors.funding?.message}
                  </p>
                </Grid> */}
                {/* funding round */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="addStartups.fundingRounds"
                      defaultMessage="Funding Rounds"
                    />{" "}
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </FormLabel>

                  <TextField
                    fullWidth
                    size="small"
                    id="outlined-required"
                    placeholder={intl.formatMessage({
                      id: "addStartups.website.enterFundingRounds",
                      defaultMessage: "Funding amount raised",
                    })}
                    hiddenLabel
                    sx={textFeildStyling}
                    variant="outlined"
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    {...register("funding")}
                  />
                  <p style={errorStyling}>{errors.funding?.message}</p>
                </Grid>
                {/* Startup Stage */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.startupStage.label"
                      defaultMessage="Startup Stage"
                    />{" "}
                    <span style={errorStyling}>*</span>
                  </FormLabel>
                  <Controller
                    name="startupStage"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        size="small"
                        fullWidth
                        labelId="single-select-label"
                        id="single-select"
                        {...field}
                        sx={{ ...selectFeildStyling, color: "rgba(0, 0, 0, 0.523)" }}
                        displayEmpty // Ensure to display an empty item
                        defaultValue="" // Set the default value to an empty string to ensure the displayEmpty works
                      >
                        <MenuItem value="" disabled sx={{ display: "none" }}>
                          Select Stage
                        </MenuItem>
                        {startupStageTypeDetail?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.stage_name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.startupStage && (
                    <span style={errorStyling}>{errors.startupStage?.message}</span>
                  )}
                </Grid>{" "}
                {/* Current Traction */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.currentTraction.label"
                      defaultMessage="Current Traction"
                    />{" "}
                    <span style={errorStyling}>*</span>
                  </FormLabel>
                  <Controller
                    name="currentTranctionId"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        size="small"
                        fullWidth
                        labelId="single-select-label"
                        id="single-select"
                        {...field}
                        sx={{ ...selectFeildStyling, color: "rgba(0, 0, 0, 0.523)" }}
                        displayEmpty // Ensure to display an empty item"
                        renderValue={(selected) => {
                          if (selected?.length === 0) {
                            return (
                              <Typography sx={feildInputProps}> Select Current Traction</Typography>
                            );
                          }
                          const selectedNames = startupCurrentTraction.find(
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
                          <MenuItem key={option.id} value={option.id}>
                            {option.transaction_name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.currentTranctionId && (
                    <span style={errorStyling}>{errors.currentTranctionId?.message}</span>
                  )}
                </Grid>{" "}
                {/* Market Opportunity */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.marketOpportunity.label"
                      defaultMessage="Market Opportunity"
                    />{" "}
                    <span style={errorStyling}>*</span>
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    size="small"
                    fullWidth
                    sx={textFeildStyling}
                    inputProps={{
                      sx: {
                        "&::placeholder": {
                          color: "grey",
                          opacity: 1,
                        },
                      },
                    }}
                    variant="outlined"
                    placeholder="Like Growing Market"
                    {...register("marketOpportunity", { required: true })}
                  />
                  {errors.marketOpportunity && (
                    <span style={errorStyling}>{errors.marketOpportunity?.message}</span>
                  )}
                </Grid>{" "}
                {/* Team Background */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.teamBackground.label"
                      defaultMessage="Team Background"
                    />{" "}
                    <span style={errorStyling}>*</span>
                  </FormLabel>
                  <Controller
                    name="teamBackgroundId"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        size="small"
                        fullWidth
                        labelId="single-select-label"
                        id="single-select"
                        {...field}
                        sx={{ ...selectFeildStyling }}
                        displayEmpty // Ensure to display an empty item"
                        renderValue={(selected) => {
                          if (selected?.length === 0) {
                            return (
                              <Typography sx={feildInputProps}> Select Team Background</Typography>
                            );
                          }
                          const selectedNames = startupfetchedteamBackground.find(
                            (sector) => sector?.id === selected
                          );
                          return (
                            <Typography sx={feildInputProps}>{selectedNames?.team_name}</Typography>
                          );
                        }}
                      >
                        <MenuItem value="" disabled sx={{ display: "none" }}>
                          Select Team Background
                        </MenuItem>
                        {startupfetchedteamBackground?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.team_name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.teamBackgroundId && (
                    <span style={errorStyling}>{errors.teamBackgroundId?.message}</span>
                  )}
                </Grid>{" "}
                {/* email id */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage id="addStartups.Email" defaultMessage="Email" />{" "}
                    <span style={errorStyling}>*</span>
                  </FormLabel>
                  <TextField
                    size="small"
                    type="email"
                    fullWidth
                    id="outlined-required"
                    placeholder={intl.formatMessage({
                      id: "addStartups.website.enterEmailId",
                      defaultMessage: "Enter email id",
                    })}
                    hiddenLabel
                    sx={textFeildStyling}
                    variant="outlined"
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    {...register("communicationEmail")}
                  />
                  <p style={errorStyling}>{errors.communicationEmail?.message}</p>
                </Grid>
                {/* Contact NO */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="addStartups.contactNumber"
                      defaultMessage="Contact Number"
                    />
                    <span style={errorStyling}>*</span>
                  </FormLabel>
                  <TextField
                    // type="number"
                    fullWidth
                    size="small"
                    id="outlined-required"
                    placeholder={intl.formatMessage({
                      id: "addStartups.website.enterNumber",
                      defaultMessage: "Enter Number",
                    })}
                    hiddenLabel
                    sx={textFeildStyling}
                    variant="outlined"
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    {...register("contactNo")}
                  />
                  <p style={errorStyling}>{errors.contactNo?.message}</p>
                </Grid>
                {/* last funding date */}
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="addStartups.LastFundingDate"
                      defaultMessage="Last Funding Date"
                    />
                    <span style={errorStyling}>*</span>
                  </FormLabel>
                  <TextField
                    fullWidth
                    hiddenLabel
                    id="filled-hidden-label-small"
                    sx={textFeildStyling}
                    variant="outlined"
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    placeholder={intl.formatMessage({
                      id: "addStartups.website.mm/dd/yyyy",
                      defaultMessage: "mm/dd/yyyy",
                    })}
                    type="date"
                    defaultValue="Choose date"
                    size="small"
                    {...register("lastfundingYear")}
                  />
                  <p style={errorStyling}>{errors.lastfundingYear?.message}</p>
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    {" "}
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.facebook.label"
                      defaultMessage="Facebook"
                    />
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    sx={textFeildStyling}
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="https://www.facebook.com/john.doe"
                    {...register("facebookLink")}
                  />
                  {errors.facebookLink && (
                    <span style={errorStyling}>{errors.facebookLink?.message}</span>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    {" "}
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.twitter.label"
                      defaultMessage="X (Twitter)"
                    />
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    sx={textFeildStyling}
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="https://x.com/username"
                    {...register("twitterLink")}
                  />
                  {errors.twitterLink && (
                    <span style={errorStyling}>{errors.twitterLink?.message}</span>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.instagram.label"
                      defaultMessage="Instagram"
                    />
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={textFeildStyling}
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    placeholder="https://www.instagram.com/John"
                    {...register("instagramLink")}
                  />
                  {errors.instagramLink && (
                    <span style={errorStyling}>{errors.instagramLink?.message}</span>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <FormLabel sx={formlabelStyle}>
                    {" "}
                    <FormattedMessage
                      id="startupPitch.OverViewTabInfo.youTube.label"
                      defaultMessage="Youtube"
                    />
                  </FormLabel>
                  <TextField
                    id="outlined-basic"
                    sx={textFeildStyling}
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputProps={{
                      style: {
                        ...feildInputProps,
                      },
                    }}
                    placeholder="https://www.youtube.com/happy"
                    {...register("youtubeLink")}
                  />
                  {errors.youtubeLink && (
                    <span style={errorStyling}>{errors.youtubeLink?.message}</span>
                  )}
                </Grid>
                {isPermitted(permissions.ADMIN_ADD_STARTUPS_SUBMIT) ? (
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      type="submit"
                      style={{ backgroundColor: "#8a1538", color: "#ffff" }}
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                  </Grid>
                ) : null}
              </Grid>
            </form>
          </Box>
        </Box>
      </ExternalContainer>
      {dialogOpen && <BulkUpload dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />}
    </>
  );
};

AddStartups.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default AddStartups;
