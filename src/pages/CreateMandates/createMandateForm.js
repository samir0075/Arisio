import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./createMandate.module.css";
import { DatePicker } from "@mui/x-date-pickers";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  getMandateNameDuplication,
  getMandateType,
  postMandateImage,
} from "src/action/createMandate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast } from "react-toastify";

const schema = yup
  .object({
    mandateTypeId: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.OverViewTabInfo.mandateType.required.errorMessage"
          defaultMessage="Select a Mandate Type"
        />
      ),
    title: yup
      .string()
      .trim()
      .required(
        <FormattedMessage
          id="investor.createMandate.title.required.errorMessage"
          defaultMessage="Enter Mandate Title"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="investor.createMandate.title.minLength.errorMessage"
          defaultMessage="Mandate Title should be at least 2 characters"
        />
      )
      .max(
        150,
        <FormattedMessage
          id="investor.createMandate.title.maxLength.errorMessage"
          defaultMessage="Mandate Title should not exceed 150 characters"
        />
      )
      .matches(/^[^/]+$/, {
        message: (
          <FormattedMessage
            id="investor.createMandate.title.noSpecialChars.errorMessage"
            defaultMessage="Mandate Title should not contain slashes"
          />
        ),
      }),
    description: yup
      .string()
      .trim()
      .required(
        <FormattedMessage
          id="investor.createMandate.description.required.errorMessage"
          defaultMessage="Enter Mandate Description"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="investor.createMandate.description.minLength.errorMessage"
          defaultMessage="Mandate Description should be at least 2 characters"
        />
      )
      .max(
        450,
        <FormattedMessage
          id="investor.createMandate.description.maxLength.errorMessage"
          defaultMessage="Mandate Description should not exceed 450 characters"
        />
      ),
    startDate: yup
      .string()
      .required(
        <FormattedMessage
          id="investor.createMandate.startDate.required.errorMessage"
          defaultMessage="Select a Start Date"
        />
      ),
    endDate: yup
      .string()
      .required(
        <FormattedMessage
          id="investor.createMandate.endDate.required.errorMessage"
          defaultMessage="Select an End Date"
        />
      ),
  })
  .required();

const MandateForm = ({
  mandateDetails,
  setMandateDetails,
  picture,
  setPicture,
  savePicture,
  setSavePicture,
  setDisable,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMandateType());
  }, []);

  const mandateType = useSelector((state) => state.newMandate.mandateType);

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

  const shouldDisableDate = (date) => {
    const oneDayLessThanToday = new Date();
    oneDayLessThanToday.setDate(oneDayLessThanToday.getDate() - 1);
    return date <= oneDayLessThanToday;
  };

  const shouldDisableDateStarting = (date) => {
    const today = new Date();
    if (startDate === null) {
      return date < today;
    } else {
      return date < startDate;
    }
  };

  const startDate = watch("startDate");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState("");
  const mandateName = watch("title");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mandateError, setMandateError] = useState("");

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;

  useEffect(() => {
    if (mandateDetails?.images?.imageContent) {
      setUploadedImage(`data:image/PNG;base64,${mandateDetails?.images?.imageContent}`);
    }
  }, [mandateDetails?.images?.imageContent]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(mandateName);
    }, 1000); // Delay in milliseconds

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or query change
    };
  }, [mandateName]);

  useEffect(() => {
    dispatch(getMandateNameDuplication(debouncedQuery)).then((res) => {
      if (res.success === false) {
        setMandateError(res.message);
      } else {
        setMandateError("");
      }
    });
  }, [debouncedQuery, dispatch]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 2) {
        toast.error(
          intl.formatMessage({
            id: "mandateStepperForm.forMoreThan2MB.card.message.",
            defaultMessage: "File should be less than 2MB",
          })
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);

        setSavePicture(5);
        const binaryImageData = atob(reader.result.split(",")[1]);
        const uint8Array = new Uint8Array(binaryImageData.length);
        for (let i = 0; i < binaryImageData.length; i++) {
          uint8Array[i] = binaryImageData.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: file.type });
        const formData = new FormData();
        formData.append("uploadLetter", blob, file.name);
        dispatch(postMandateImage(investorId, formData)).then((res) => {
          setSelectedImageId(res);
        });
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (mandateDetails?.images) {
      setSavePicture(mandateDetails?.images?.id);
    }
  }, [mandateDetails?.images, setSavePicture]);

  useEffect(() => {
    const updatePicture = () => {
      switch (savePicture) {
        case 1:
          setPicture(1);
          setDisable(true);
          break;
        case 2:
          setPicture(2);
          setDisable(true);
          break;
        case 3:
          setPicture(3);
          setDisable(true);
          break;
        case 4:
          setPicture(4);
          setDisable(true);
          break;
        case 5:
          setPicture(selectedImageId);
          setDisable(false);
          break;
        case "":
          setPicture(null);
          break;
        default:
          setPicture(null);
          break;
      }
    };

    updatePicture(); // Call the function to update the picture
  }, [savePicture, selectedImageId, setPicture]);

  useEffect(() => {
    setValue("title", mandateDetails?.title || "");
    setValue("mandateTypeId", mandateDetails?.mandateTypeId || "");
    setValue("description", mandateDetails?.description || "");
    setValue("startDate", mandateDetails?.startDate || "");
    setValue("endDate", mandateDetails?.endDate || "");
  }, [setValue, mandateDetails]);

  const currentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  // console.log(mandateDetails);
  const onSubmit = (data) => {
    if (!savePicture) {
      toast.warn("Please select a mandate thumbnail", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (data?.startDate < currentDate()) {
      // console.log(object);
      toast.warn("Start Date cannot be in the past. Please select a valid date ", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // else if (data?.endDate < new Date()) {
    //   toast.warn("End Date cannot be in the past. Please select a valid date ", {
    //     position: "top-right",
    //     autoClose: 10000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // }
    else {
      const mandateData = {
        ...data,
        picture: savePicture === 5 ? picture : savePicture,
      };
      setDisable(false);
      setMandateDetails(mandateData);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid sx={{ px: { sx: "", sm: "", md: 4, lg: 4 }, py: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="space-between">
            <Grid className={styles.inputExternal} xs={12} sm={12} md={12} xl={12}>
              <FormLabel className={styles.inputField}>
                <FormattedMessage
                  id="mandateStepperForm.card.mandateType.label"
                  defaultMessage="Mandate Type"
                />{" "}
                <span className={styles.error}>*</span>
              </FormLabel>
              <Controller
                name="mandateTypeId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    labelId="single-select-label"
                    id="single-select"
                    {...field}
                    // sx={{ ...selectFeildStyling, color: "rgba(0, 0, 0, 0.523)" }}
                    displayEmpty // Ensure to display an empty item
                    defaultValue="" // Set the default value to an empty string to ensure the displayEmpty works
                  >
                    <MenuItem value="" disabled sx={{ display: "none" }}>
                      <FormattedMessage
                        id="mandateStepperForm.card.mandateType.label.placeHolder"
                        defaultMessage="Select Mandate Type"
                      />
                    </MenuItem>
                    {mandateType?.data?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.mandate_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.mandateTypeId && (
                <span className={styles.error}>{errors.mandateTypeId?.message}</span>
              )}
            </Grid>
            <Grid className={styles.inputExternal} xs={12} sm={12} md={12} xl={12}>
              <FormLabel className={styles.inputField}>
                <FormattedMessage
                  id="mandateStepperForm.step1.card.heading"
                  defaultMessage="Mandate Title"
                />
                <span className={styles.error}>*</span>
              </FormLabel>
              <TextField
                size="small"
                id="outlined-basic"
                variant="outlined"
                placeholder=""
                {...register("title", { required: true })}
              />
              {errors.title && <span className={styles.error}>{errors.title?.message}</span>}
              {mandateError && <span className={styles.error}>{mandateError}</span>}
            </Grid>
            <Grid className={styles.inputExternal} xs={12} sm={12} md={12} xl={12}>
              <FormLabel className={styles.inputField}>
                <FormattedMessage
                  id="mandateStepperForm.card.Description"
                  defaultMessage="Description"
                />
                <span className={styles.error}>*</span>
              </FormLabel>
              <TextField
                multiline
                rows={4}
                id="outlined-basic"
                variant="outlined"
                placeholder=""
                {...register("description", { required: true })}
              />
              {errors.description && (
                <span className={styles.error}>{errors.description?.message}</span>
              )}
            </Grid>
            <Grid className={styles.inputExternal} xs={12} sm={12} md={5.5} xl={5.5}>
              <FormLabel className={styles.inputField}>
                <FormattedMessage
                  id="mandateStepperForm.card.startDate.label"
                  defaultMessage="Start Date"
                />
                <span className={styles.error}>*</span>
              </FormLabel>
              <Controller
                name="startDate"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": {
                            position: "relative !important",
                            bottom: "6px !important",
                          },
                        }}
                        {...params}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    )}
                    shouldDisableDate={shouldDisableDate}
                    maxDate={new Date()}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      setValue("endDate", null);
                    }}
                    format="DD/MM/YYYY"
                  />
                )}
              />
              {errors.startDate && (
                <span className={styles.error}>{errors.startDate?.message}</span>
              )}
            </Grid>
            <Grid className={styles.inputExternal} xs={12} sm={12} md={5.5} xl={5.5}>
              <FormLabel className={styles.inputField}>
                <FormattedMessage
                  id="mandateStepperForm.card.EndDate.label"
                  defaultMessage="End Date"
                />
                <span className={styles.error}>*</span>
              </FormLabel>
              <Controller
                name="endDate"
                defaultValue={null}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            position: "relative !important",
                            bottom: "6px !important",
                          },
                        }}
                      />
                    )}
                    shouldDisableDate={shouldDisableDateStarting}
                    minDate={startDate}
                  />
                )}
              />
              {errors.endDate && <span className={styles.error}>{errors.endDate?.message}</span>}
            </Grid>

            <Grid className={styles.inputExternal}>
              <Typography className={styles.inputField}>
                <FormattedMessage
                  id="mandateStepperForm.step3.card.heading"
                  defaultMessage="Upload or pick a thumbnail for your mandate."
                />
                <span className={styles.error}>*</span>
              </Typography>
              <Card
                sx={{
                  backgroundColor: "#f2f2f2",
                  marginTop: "15px ",
                  overflow: "auto",
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-around"
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                >
                  <Grid item xs={11} sm={11} md={4} lg={4}>
                    <input
                      accept="image/*"
                      style={{
                        display: "none",

                        border: savePicture === 5 ? "3px solid rgba(108, 25, 62, 1)" : null,
                      }}
                      id="upload-file"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="upload-file">
                      {uploadedImage ? (
                        <div>
                          <img
                            src={uploadedImage}
                            alt="Selected"
                            style={{
                              height: { xs: "10rem", sm: "14rem", md: "14rem" },
                              width: "100%",
                              border: savePicture === 5 ? "3px solid rgba(108, 25, 62, 1)" : null,
                            }}
                          />
                        </div>
                      ) : (
                        <Button
                          component="span"
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            backgroundColor: "#c4c5c9",
                            borderRadius: "10px",
                            height: { xs: "10rem", sm: "14rem", md: "14rem" },
                            width: "100%",
                            marginLeft: { xs: "0px", sm: "0px", lg: "5px" },
                            marginTop: { xs: "10px", sm: "10px" },
                          }}
                        >
                          <FormattedMessage
                            id="mandateStepperForm.step3.card.upload.button.text"
                            defaultMessage="Upload file"
                          />
                        </Button>
                      )}
                    </label>
                    <Typography sx={{ fontSize: "0.75rem", textAlign: "center" }}>
                      <FormattedMessage
                        id="mandateStepperForm.step3.card.upload.warning.message"
                        defaultMessage="Upload thumbnail (upto 2MB)"
                      />
                    </Typography>
                    <Typography sx={{ fontSize: "0.60rem", textAlign: "center" }}>
                      {/* <FormattedMessage
                        id="mandateStepperForm.step3.card.upload.warning.message"
                        defaultMessage="Upload thumbnail (upto 2MB)"
                      /> */}
                      Image dimensions should be 550 x 250 pixels.
                    </Typography>
                  </Grid>

                  <Grid container justifyContent="space-between" item xs={12} sm={7} md={7} lg={7}>
                    <Grid item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                      <CardActionArea
                        onClick={() => setSavePicture(1)}
                        style={{
                          border: savePicture === 1 ? "3px solid rgba(108, 25, 62, 1)" : null,
                          borderRadius: savePicture === 1 ? "5px" : null,
                        }}
                        defaultValue={picture}
                      >
                        <CardMedia
                          component="img"
                          image={`/Images/Image-1.png`}
                          alt="Mandate Form"
                        />
                      </CardActionArea>
                    </Grid>

                    <Grid item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                      <CardActionArea
                        onClick={() => setSavePicture(2)}
                        style={{
                          border: savePicture === 2 ? "3px solid rgba(108, 25, 62, 1)" : null,
                          borderRadius: savePicture === 2 ? "5px" : null,
                        }}
                        defaultValue={picture}
                      >
                        <CardMedia
                          component="img"
                          image={`/Images/Image-2.png`}
                          alt="Mandate Form"
                        />
                      </CardActionArea>
                    </Grid>

                    <Grid item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                      <CardActionArea
                        onClick={() => setSavePicture(3)}
                        style={{
                          border: savePicture === 3 ? "3px solid rgba(108, 25, 62, 1)" : null,
                          borderRadius: savePicture === 3 ? "5px" : null,
                        }}
                        defaultValue={picture}
                      >
                        <CardMedia
                          component="img"
                          image={`/Images/Image-3.png`}
                          alt="Mandate Form"
                        />
                      </CardActionArea>
                    </Grid>

                    <Grid item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                      <CardActionArea
                        onClick={() => setSavePicture(4)}
                        style={{
                          border: savePicture === 4 ? "3px solid rgba(108, 25, 62, 1)" : null,
                          borderRadius: savePicture === 4 ? "5px" : null,
                        }}
                        defaultValue={picture}
                      >
                        <CardMedia
                          component="img"
                          image={`/Images/Image-4.png`}
                          alt="Mandate Form"
                        />
                      </CardActionArea>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Button variant="outlined" type="submit" sx={{ mt: 2, mr: 2 }}>
              <FormattedMessage defaultMessage="Save" id="mandateStepperForm.card.save.button" />
            </Button>
          </Grid>
        </form>
      </Grid>
    </LocalizationProvider>
  );
};

export default MandateForm;
