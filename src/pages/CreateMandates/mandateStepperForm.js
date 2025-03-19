/* eslint-disable react/jsx-max-props-per-line */
import React, { useState } from "react";
import styles from "./createMandate.module.css";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { FormattedMessage, useIntl } from "react-intl";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Typography,
  Button,
  CardActionArea,
  Card,
  TextField,
  Grid,
  CardMedia
} from "@mui/material";
import { toast } from "react-toastify";
import { postMandateImage } from "src/action/createMandate";
import { useDispatch } from "react-redux";

const MandateStepperForm = ({
  activeStep,
  name,
  setName,
  desc,
  setDesc,
  picture,
  setPicture,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setSavePicture,
  savePicture
}) => {
  const intl = useIntl();
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1
  });

  const today = new Date();
  const dispatch = useDispatch();

  const shouldDisableDate = date => {
    const oneDayLessThanToday = new Date();
    oneDayLessThanToday.setDate(oneDayLessThanToday.getDate() - 1);
    return date <= oneDayLessThanToday;
  };
  const shouldDisableDateStarting = date => {
    // Disable dates before today or the start date
    if (startDate === null) {
      return date < today;
    } else {
      return date < startDate;
    }
  };
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;

  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState("");

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 2) {
        toast.error(
          intl.formatMessage({
            id: "mandateStepperForm.forMoreThan2MB.card.message.",
            defaultMessage: "File should be less than 2MB"
          })
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setSavePicture(5);
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
        formData.append("uploadLetter", blob, file.name);

        dispatch(postMandateImage(investorId, formData)).then(res => {
          setSelectedImageId(res);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getSelectedcard = () => {
    switch (savePicture) {
      case 1:
        return setPicture(1);
      case 2:
        return setPicture(2);
      case 3:
        return setPicture(3);
      case 4:
        return setPicture(4);
      case "":
        return;
      default:
        return setPicture(selectedImageId);
        break;
    }
  };

  const isInvalid = value => {
    // Check if the input value starts or ends with whitespace or if it's out of length bounds
    const regex = /^\S(.*\S)?$/;
    return value.length < 2 || value.length > 80 || !regex.test(value);
  };
  console.log("startDate", startDate);

  return (
    <Box
      sx={{
        maxWidth: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Card
        sx={{
          width: { xs: "90vw", sm: "90vw", lg: "50vw" },
          height: "auto",
          px: 2,
          py: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {activeStep === 0 ? (
          <>
            <Typography className={styles.formtext} sx={{ fontSize: "22px" }}>
              <FormattedMessage
                id="mandateStepperForm.step1.card.heading"
                defaultMessage="What is your mandate title?"
              />
            </Typography>

            <TextField
              autoFocus
              fullWidth
              id="standard-basic"
              variant="standard"
              placeholder=""
              value={name}
              onChange={e => setName(e.target.value)} // Trim the input value
              sx={{ marginTop: "20px" }}
              inputProps={{ minLength: 2, maxLength: 81 }}
              error={
                name?.length < 2 ||
                name?.length > 80 ||
                name?.length !== name?.length ||
                (name?.length > 0 && isInvalid(name)) // Check if trimmed length is different from original length
              }
              helperText={
                ((name?.length < 2 || name?.length > 80 || name?.length !== name?.length) &&
                  name?.length > 0) ||
                (name?.length > 0 && isInvalid(name))
                  ? intl.formatMessage({
                      id: "mandateStepperForm.step1.card.inputTextField.validation",
                      defaultMessage:
                        "Title must be between 2 and 80 characters long and should not start or end with a space"
                    })
                  : "" // Display error message if input length is not within the specified range or if it starts or ends with a space
              }
            />
          </>
        ) : activeStep === 1 ? (
          <>
            <Typography className={styles.formtext} sx={{ fontSize: "22px" }}>
              <FormattedMessage
                id="mandateStepperForm.step2.card.heading"
                defaultMessage="Tell us something about this mandate."
              />
            </Typography>
            <TextField
              autoFocus
              id="filled-multiline-static"
              placeholder={intl.formatMessage({
                id: "mandateStepperForm.step2.card.inputTextField.placeholder",
                defaultMessage: "Write a description ........"
              })}
              multiline
              rows={4}
              variant="filled"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              sx={{ marginTop: "10px", width: "100%" }}
              inputProps={{ minLength: 4, maxLength: 451 }} // Define min and max length for the input
              error={(desc?.length < 4 || desc?.length > 450) && desc !== ""} // Set error state based on min and max length criteria
              helperText={
                (desc?.length < 4 || desc?.length > 450) && desc !== ""
                  ? intl.formatMessage({
                      id: "mandateStepperForm.step2.card.inputTextField.validation",
                      defaultMessage: "Description must be between 4 and 300 characters long"
                    })
                  : "" // Display error message if input length is not within the specified range
              }
            />
          </>
        ) : activeStep === 2 ? (
          <>
            <Typography className={styles.formtext} sx={{ fontSize: "22px" }}>
              <FormattedMessage
                id="mandateStepperForm.step3.card.heading"
                defaultMessage="Upload or pick a thumbnail for your mandate."
              />
            </Typography>
            <Card
              sx={{
                backgroundColor: "#f2f2f2",
                marginTop: "15px ",
                overflow: "auto"
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

                      border: savePicture === 5 ? "3px solid rgba(108, 25, 62, 1)" : null
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
                            height: "14rem",
                            width: "100%",
                            border: savePicture === 5 ? "3px solid rgba(108, 25, 62, 1)" : null
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
                          height: "14rem",
                          width: "100%",
                          marginLeft: { xs: "0px", sm: "0px", lg: "5px" },
                          marginTop: { xs: "10px", sm: "10px" }
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
                </Grid>

                <Grid container justifyContent="space-between" item xs={12} sm={7} md={7} lg={7}>
                  <Grid item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                    <CardActionArea
                      onClick={() => setSavePicture(1)}
                      style={{
                        border: savePicture === 1 ? "3px solid rgba(108, 25, 62, 1)" : null,
                        borderRadius: savePicture === 1 ? "5px" : null
                      }}
                      defaultValue={picture}
                    >
                      <CardMedia component="img" image={`/Images/Image-1.png`} alt="Mandate Form" />
                    </CardActionArea>
                  </Grid>

                  <Grid item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                    <CardActionArea
                      onClick={() => setSavePicture(2)}
                      style={{
                        border: savePicture === 2 ? "3px solid rgba(108, 25, 62, 1)" : null,
                        borderRadius: savePicture === 2 ? "5px" : null
                      }}
                      defaultValue={picture}
                    >
                      <CardMedia component="img" image={`/Images/Image-2.png`} alt="Mandate Form" />
                    </CardActionArea>
                  </Grid>

                  <Grid item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                    <CardActionArea
                      onClick={() => setSavePicture(3)}
                      style={{
                        border: savePicture === 3 ? "3px solid rgba(108, 25, 62, 1)" : null,
                        borderRadius: savePicture === 3 ? "5px" : null
                      }}
                      defaultValue={picture}
                    >
                      <CardMedia component="img" image={`/Images/Image-3.png`} alt="Mandate Form" />
                    </CardActionArea>
                  </Grid>

                  <Grid item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                    <CardActionArea
                      onClick={() => setSavePicture(4)}
                      style={{
                        border: savePicture === 4 ? "3px solid rgba(108, 25, 62, 1)" : null,
                        borderRadius: savePicture === 4 ? "5px" : null
                      }}
                      defaultValue={picture}
                    >
                      <CardMedia component="img" image={`/Images/Image-4.png`} alt="Mandate Form" />
                    </CardActionArea>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </>
        ) : activeStep === 3 ? (
          <>
            <Typography className={styles.formtext}>
              {" "}
              <FormattedMessage
                id="mandateStepperForm.step4.card.heading"
                defaultMessage="Set the timeline for your mandate"
              />
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: "22px" }}>
              <Grid item xs={6}>
                <DatePicker
                  label={intl.formatMessage({
                    id: "mandateStepperForm.step4.card.datePicker.label",
                    defaultMessage: "Start Date"
                  })}
                  value={startDate}
                  onChange={newValue => {
                    if (newValue) {
                      const formattedDate = format(newValue, "yyyy/MM/dd");
                      setStartDate(formattedDate);
                      setEndDate(null);
                    } else {
                      setStartDate(null);
                    }
                  }}
                  renderInput={params => <TextField {...params} />}
                  sx={{ marginTop: "30px" }}
                  shouldDisableDate={shouldDisableDate}
                  maxDate={new Date()}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label={intl.formatMessage({
                    id: "mandateStepperForm.step4.card.datePicker2.label",
                    defaultMessage: "End Date"
                  })}
                  value={endDate}
                  onChange={newValue => {
                    const formattedDate = format(newValue, "yyyy/MM/dd");
                    setEndDate(formattedDate);
                  }}
                  renderInput={params => <TextField {...params} />}
                  sx={{ marginTop: "30px" }}
                  shouldDisableDate={shouldDisableDateStarting}
                  minDate={startDate}
                />
              </Grid>
            </Grid>
          </>
        ) : null}
      </Card>
      {getSelectedcard()}
    </Box>
  );
};

MandateStepperForm.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default MandateStepperForm;
