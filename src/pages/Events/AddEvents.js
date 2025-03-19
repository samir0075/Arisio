import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCountries, getEventVenueType } from "src/action/globalApi";
import { getButtonCss } from "src/utils/util";
import { FormattedMessage, useIntl } from "react-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { linkRegex } from "src/components/validators";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { addMyEvents, myEventsFetch, updateMyEvents, uploadEventsImage } from "src/action/events";
import { myEventsActions } from "src/store/eventsSlice";
import { DateTimePicker, DesktopDateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/en";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const TypoStyle = { fontSize: "0.8rem", fontWeight: "600" };
const today = new Date();
const minDate = new Date(today.setDate(today.getDate() + 6)); // Set the min date to 6 days from today
minDate.setHours(0, 0, 0, 0);

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() + 10);

const schema = yup
  .object()
  .shape({
    header: yup
      .string()
      .required(
        <FormattedMessage
          id="addEventsModal.header.required.errorMessage"
          defaultMessage="Header is required"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="addEventsModal.header.minLength.required.errorMessage"
          defaultMessage="Minimum 2 characters are required"
        />
      )
      .max(
        150,
        <FormattedMessage
          id="addEventsModal.header.maxLength.required.errorMessage"
          defaultMessage="Maximum 150 characters are allowed"
        />
      )
      // .matches(nameRegex, () => (
      //   <FormattedMessage
      //     id="addEventsModal.header.nameRegex.errorMessage"
      //     defaultMessage="Name must contain only alphabets and whitespace"
      //   />
      // ))
      .trim(),
    content: yup
      .string()
      .required(
        <FormattedMessage
          id="addEventsModal.content.required.errorMessage"
          defaultMessage="content is required"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="addEventsModal.content.minLength.required.errorMessage"
          defaultMessage="content should be at least 2 characters"
        />
      )
      .max(
        3000,
        <FormattedMessage
          id="addEventsModal.content.maxLength.required.errorMessa"
          defaultMessage="Maximum 3000 characters are allowed"
        />
      ),
    source_url: yup
      .string()
      .required(
        <FormattedMessage
          id="addEventsModal.venue.required.errorMessa"
          defaultMessage="Link is required"
        />
      )
      .matches(linkRegex, {
        message: (
          <FormattedMessage
            id="addEvent.field.link.validation.error"
            defaultMessage="Please enter a valid URL "
          />
        ),
      }),
    venue: yup
      .string()
      .required(
        <FormattedMessage
          id="addEventsModal.venue.required.errorMessa"
          defaultMessage="venue is required"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="addEventsModal.venue.minLength.required.errorMessage"
          defaultMessage="Minimum 2 characters are required"
        />
      )
      .max(
        150,
        <FormattedMessage
          id="addEventsModal.venue.maxLength.required.errorMessage"
          defaultMessage="Maximum 150 characters are allowed"
        />
      )
      .matches(/^\S.*\S$/, {
        message: (
          <FormattedMessage
            id="investorProfile.form.organizationName.noSpaces.error.message"
            defaultMessage="Venue name should not have spaces at the start or end"
          />
        ),
        excludeEmptyString: true,
      }),

    country: yup
      .string()
      .required(
        <FormattedMessage
          id="addStartups.form.inputField.placeholder"
          defaultMessage="Country is required"
        />
      ),
    date: yup.date().required("Start date and time are required"),
    end_date: yup.date().required("End date and time are required"),
    venue_type: yup.string().required("Please select venue type"),
  })
  .required();

const AddEventsModal = ({
  dialogOpen,
  setDialogOpen,
  page,
  role,
  section,
  selectedEvent,
  country,
  value,
  setSelectedEvent,
}) => {
  const [fileName, setFileName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const intl = useIntl();
  const ButtonCss = getButtonCss();
  const dispatch = useDispatch();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const venueType = watch("venue_type");

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getEventVenueType());
    dispatch(
      myEventsActions.fetchImageEvents({
        eventsImage: {},
      })
    );
  }, [dispatch, reset]);

  // const storedUserDetails = localStorage.getItem("userDetails");
  // let User = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const eventsImage = useSelector((state) => state?.myEvents?.eventsImage?.image);
  const countryData = useSelector((state) => state.globalApi.countries);
  const eventVenueType = useSelector((state) => state.globalApi.venueType.venue_raw);

  const closeDialog = () => {
    setDialogOpen(false);
    reset();
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (selectedEvent) {
      setValue("header", selectedEvent?.header || "");
      setValue("source_url", selectedEvent?.source_url || "");
      setValue("date", selectedEvent?.date || "");
      setValue("end_date", selectedEvent?.end_date || "");
      setValue("country", selectedEvent?.countryCode || "");
      setValue("venue", selectedEvent?.venue || "");
      setValue("content", selectedEvent?.content || "");
      setValue("venue_type", selectedEvent?.venue_id || "");
    }
  }, [selectedEvent, setValue]);

  const onSubmit = (data) => {
    // const countryName = countryData.find((option) => option.countryCode === data?.country);
    if (selectedEvent === null && fileName === "") {
      toast.error(
        <FormattedMessage
          id="addEventsModal.updateImage.fileFormat.errorMessage"
          defaultMessage="Please provide event image"
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
      setDialogOpen(true);
    } else {
      if (selectedEvent === null) {
        setDisableButton(true);
        const { venue_type, ...rest } = data;
        const updateData = {
          image: eventsImage,
          venue_type: Number(venue_type),
          ...rest,
        };

        const message = intl.formatMessage({
          id: "myEventsModal.addEvents.successMessage",
          defaultMessage: "Events created successfully",
        });
        if (role === "INVESTOR") {
          dispatch(addMyEvents("investor", updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              setDialogOpen(false);
              setSelectedEvent(null);
              dispatch(
                myEventsActions.fetchImageEvents({
                  eventsImage: {},
                })
              );
              dispatch(
                myEventsFetch(`investor/events/${page}?eventType=${value}&country=${country}`)
              );
            });
        } else if (role === "ADMINISTRATOR") {
          dispatch(addMyEvents("admin", updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (role === "ADMINISTRATOR" && section === "PendingEvents") {
                dispatch(myEventsFetch(`admin/events/${page}?listType=pending`));
              } else {
                dispatch(
                  myEventsFetch(
                    `admin/events/${page}?listType=active&eventType=${value}&country=${country}`
                  )
                );
                setDialogOpen(false);
                setSelectedEvent(null);
                dispatch(
                  myEventsActions.fetchImageEvents({
                    eventsImage: {},
                  })
                );
              }
            });
        } else if (role === "ENTREPRENEUR") {
          dispatch(addMyEvents("startup", updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (role === "ENTREPRENEUR") {
                setDialogOpen(false);
                setSelectedEvent(null);
                dispatch(
                  myEventsActions.fetchImageEvents({
                    eventsImage: {},
                  })
                );
                dispatch(
                  myEventsFetch(`startup/events/${page}?eventType=${value}&country=${country}`)
                );
              }
            });
        }
      } else {
        const { venue_type, ...rest } = data;
        const eventId = selectedEvent?.id;
        const updateData = {
          image: eventsImage === undefined ? "" : eventsImage,
          venue_type: Number(venue_type),
          ...rest,
        };
        const message = intl.formatMessage({
          id: "myEventsModal.addEvents.successMessage",
          defaultMessage: "Events Updated successfully",
        });
        if (role === "INVESTOR") {
          dispatch(updateMyEvents("investor", eventId, updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (role === "INVESTOR") {
                dispatch(
                  myEventsFetch(`investor/events/${page}?eventType=${value}&country=${country}`)
                );
              }
            });
        } else if (role === "ADMINISTRATOR") {
          dispatch(updateMyEvents("admin", eventId, updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (role === "ADMINISTRATOR" && section === "PendingEvents") {
                dispatch(myEventsFetch(`admin/events/${page}?listType=pending`));
              } else {
                dispatch(
                  myEventsFetch(
                    `admin/events/${page}?listType=active?eventType=${value}&country=${country}`
                  )
                );
              }
            });
        } else if (role === "ENTREPRENEUR") {
          dispatch(updateMyEvents("startup", eventId, updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (role === "ENTREPRENEUR") {
                dispatch(
                  myEventsFetch(`startup/events/${page}?eventType=${value}&country=${country}`)
                );
              }
            });
        }
        setDialogOpen(false);
        setSelectedEvent(null);
        dispatch(
          myEventsActions.fetchImageEvents({
            eventsImage: {},
          })
        );
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (["image/jpg", "image/jpeg", "image/png"].includes(file.type) === false) {
        toast.error(
          <FormattedMessage
            id="addEventsModal.updateImage.fileFormat.errorMessage"
            defaultMessage="Supported only for  .JPEG or .PNG or .JPG file"
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
        setDialogOpen(true);
        return;
      }
      if (file.size > 500 * 1024) {
        // Display an error message or perform any other action
        toast.error(
          <FormattedMessage
            id="events.form.fileSize.error.message"
            defaultMessage="File size exceeds 500 KB. Please choose a smaller file."
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
        setDialogOpen(true);
        return;
      } else {
        setFileName(file.name);
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
          formData.append("uploadEventImage", blob, file.name);
          /**
           *  Dispatch the action with formData
           *  */
          if (role === "INVESTOR") {
            dispatch(uploadEventsImage("investor", formData)).then((res) => {
              if (res?.status === true) {
              }
            });
          } else if (role === "ADMINISTRATOR") {
            dispatch(uploadEventsImage("admin", formData));
          } else if (role === "ENTREPRENEUR") {
            dispatch(uploadEventsImage("startup", formData));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const adjustedStartDate = new Date(startDate);
  adjustedStartDate.setMinutes(adjustedStartDate.getMinutes() + 1);

  return (
    <Dialog
      open={dialogOpen}
      maxWidth={false}
      sx={{ "& .MuiDialog-paper": { width: { xs: "80%", sm: "60%", md: "50%", lg: "50%" } } }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Typography style={{ fontSize: "0.9rem", fontWeight: "600" }}>
          {selectedEvent ? (
            <FormattedMessage id="addEvent.updateEvent.header" defaultMessage="Update event" />
          ) : (
            <FormattedMessage id="addEvent.addEvent.header" defaultMessage="Add event" />
          )}
        </Typography>
        <CloseIcon style={{ cursor: "pointer" }} onClick={closeDialog} />
      </Box>
      <Divider sx={{ border: "1px solid #F5F5F5", width: "95%", margin: "auto" }} />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent style={{ width: "auto", padding: "0px" }}>
            <FormControl size="small" fullWidth>
              <Grid container rowSpacing={2}>
                {/* Event Header */}
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    {" "}
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addEvent.field.header" defaultMessage="Header" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <TextField
                    name=""
                    fullWidth
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    // placeholder="Event Name"
                    placeholder={intl.formatMessage({
                      id: "addEvent.field.placeholder.eventName",
                      defaultMessage: "Event Name",
                    })}
                    {...register("header")}
                    sx={{
                      "& input::placeholder": {
                        color: "rgba(0, 0, 0, 0.523)",
                      },
                    }}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.header?.message}
                  </p>
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                {/* Link */}
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addEvent.field.link" defaultMessage="Link" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <TextField
                    name=""
                    fullWidth
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    // placeholder=""
                    placeholder={intl.formatMessage({
                      id: "addEvent.field.placeholder",
                      defaultMessage: "https://www.abc.com",
                    })}
                    {...register("source_url")}
                    sx={{
                      "& input::placeholder": {
                        color: "rgba(0, 0, 0, 0.523)",
                      },
                    }}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.source_url?.message}
                  </p>
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                {/* Venue Type */}
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addEvent.field.venueType" defaultMessage="Venue Type" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <Controller
                    name="venue_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="single-select-label"
                        id="single-select"
                        displayEmpty
                        defaultValue=""
                        {...field}
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <FormattedMessage
                                id="addEvent.field.placeholder.venueType"
                                defaultMessage="Select Venue type"
                              />
                            );
                          }

                          const eventtypeOption = eventVenueType?.find(
                            (option) => option.id === selected
                          );

                          return eventtypeOption?.mode;
                        }}
                        sx={{
                          width: "100%",
                          color: field.value ? "black" : "gray",
                        }}
                      >
                        {eventVenueType?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.mode}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "2px",
                      marginLeft: "5px",
                    }}
                  >
                    {errors.venue_type?.message}
                  </p>
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                {/* <Grid item xs={12} sm={4} md={4} xl={4}>
                    <Typography style={TypoStyle}>
                      <span style={{ color: "red" }}>*</span>
                      <FormattedMessage id="addEvent.field.date" defaultMessage="Date" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} xl={6}>
                    <Controller
                      name="date"
                      control={control}
                      defaultValue={""}
                      render={({ field }) => (
                        <TextField
                          hiddenLabel
                          fullWidth
                          id="filled-hidden-label-small"
                          variant="filled"
                          style={{ margin: "10px 0px" }}
                          type="date"
                          size="small"
                          inputProps={{
                            min: new Date().toISOString().split("T")[0],
                            max: `${new Date().getFullYear() + 10}-12-31`
                          }}
                          {...field}
                        />
                      )}
                    />
                    <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                      {errors.date?.message}
                    </p>
                  </Grid> */}
                {/* Start Date */}
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addEvent.field.startDate" defaultMessage="Start date" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <Controller
                    name="date" // Field name in form data
                    control={control}
                    defaultValue={null} // Start with null value
                    render={({ field, fieldState }) => {
                      const today = new Date();
                      const minDate = new Date(today.setDate(today.getDate() + 6)); // Set the min date to 6 days from today

                      // Ensure that the time is set to midnight (00:00:00) for the min date
                      minDate.setHours(0, 0, 0, 0); // Set to midnight
                      return (
                        <DateTimePicker
                          {...field} // Spread react-hook-form field props
                          minDateTime={minDate}
                          maxDateTime={new Date().setFullYear(new Date().getFullYear() + 10)}
                          inputFormat="MM/dd/yyyy hh:mm a"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              variant="filled"
                              size="small"
                              InputProps={{
                                ...params.InputProps,
                                readOnly: true, // This prevents direct typing in the input field
                                onKeyDown: (e) => e.preventDefault(), // Block any keyboard events (typing)
                                onInput: (e) => e.preventDefault(), // Block any input events (typing)
                              }}
                              // error={!!errors.dateTime} // Highlight field if error occurs
                              // helperText={fieldState?.error?.message}
                            />
                          )}
                          onChange={(value) => {
                            setStartDate(value); // Update start date when user selects a date
                            field.onChange(value); // Update react-hook-form value
                          }}
                        />
                      );
                    }}
                  />
                  {/* Render error message below the DateTimePicker */}
                  {errors.date && (
                    <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                      {errors.date.message}
                    </p>
                  )}
                </Grid>
                {/* End Date  */}
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addEvent.field.endDate" defaultMessage="End date" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <Controller
                    name="end_date" // Field name in form data
                    control={control}
                    defaultValue={null} // Start with null value
                    render={({ field }) => (
                      <DateTimePicker
                        {...field} // Spread react-hook-form field props
                        minDateTime={adjustedStartDate}
                        maxDateTime={new Date().setFullYear(new Date().getFullYear() + 10)}
                        inputFormat="MM/dd/yyyy hh:mm a"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="filled"
                            size="small"
                            InputProps={{
                              ...params.InputProps,
                              readOnly: true, // This prevents direct typing in the input field
                              onKeyDown: (e) => e.preventDefault(), // Block any keyboard events (typing)
                              onInput: (e) => e.preventDefault(), // Block any input events (typing)
                            }}
                          />
                        )}
                      />
                    )}
                  />
                  {/* Render error message below the DateTimePicker */}
                  {errors.end_date && (
                    <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                      {errors.end_date.message}
                    </p>
                  )}
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                {/* Event Images */}
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addEvent.field.eventImage" defaultMessage="Event Image" />
                  </Typography>
                  <Typography style={{ fontSize: "0.7rem" }}>
                    <FormattedMessage
                      id="addEvent.field.eventImage.tagLine"
                      defaultMessage="This will be displayed as main event image"
                    />
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  xl={6}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {selectedEvent !== null && fileName === "" ? (
                    <img
                      src={`data:image/PNG;base64,${selectedEvent?.image}`}
                      alt="Selected"
                      width="120px"
                      height="120px"
                    />
                  ) : null}
                  <Button
                    size="small"
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    style={{
                      marginTop: "10px",
                      width: "90%",
                      borderRadius: "5px",
                      mx: "auto",
                      gap: "10px",
                    }}
                    onChange={handleImageChange}
                  >
                    <FormattedMessage id="addEvent.field.button" defaultMessage="Upload Image" />
                    <VisuallyHiddenInput type="file" />
                  </Button>
                  {fileName !== ""
                    ? fileName && (
                        <Typography variant="body2">
                          <FormattedMessage
                            id="  addEvent.field.uploadedImage"
                            defaultMessage="Uploaded File"
                          />
                          {fileName}
                        </Typography>
                      )
                    : null}
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                {/* Country */}
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addEvent.field.Country" defaultMessage="Country" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="single-select-label"
                        id="single-select"
                        displayEmpty
                        defaultValue=""
                        {...field}
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <FormattedMessage
                                id="addEvent.field.placeholder.country"
                                defaultMessage="Select country"
                              />
                            );
                          }

                          const countryOption = countryData.find(
                            (option) => option.countryCode === selected
                          );

                          return countryOption?.country;
                        }}
                        sx={{
                          width: "100%",
                          color: field.value ? "black" : "gray",
                        }}
                      >
                        {countryData.map((option) => (
                          <MenuItem key={option.country} value={option.countryCode}>
                            {option.country}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "2px",
                      marginLeft: "5px",
                    }}
                  >
                    {errors.country?.message}
                  </p>
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                {/* Venue  */}
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    {venueType === 1 ? (
                      <FormattedMessage id="addEvent.field.venueLink" defaultMessage="Venue link" />
                    ) : (
                      <FormattedMessage id="addEvent.field.venue" defaultMessage="Venue" />
                    )}
                    {/* <FormattedMessage id="addEvent.field.venue" defaultMessage="Venue" /> */}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <TextField
                    name=""
                    fullWidth
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    placeholder={intl.formatMessage({
                      id:
                        venueType === 1
                          ? "addEvent.field.placeholder.venueLink"
                          : "addEvent.field.placeholder.venue",
                      defaultMessage: venueType === 1 ? "Venue link" : "venue name",
                    })}
                    {...register("venue")}
                    sx={{
                      "& input::placeholder": {
                        color: "rgba(0, 0, 0, 0.523)",
                      },
                    }}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.venue?.message}
                  </p>
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addEvent.field.content" defaultMessage="Content" />
                  </Typography>
                  <Typography style={{ fontSize: "0.7rem" }}>
                    <FormattedMessage
                      id="addEvent.field.content.tagLine"
                      defaultMessage="Write a short introduction about event"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <TextField
                    fullWidth
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    multiline
                    rows={10}
                    // placeholder="Event Content"
                    placeholder={intl.formatMessage({
                      id: "addEvent.field.placeholder.venue",
                      defaultMessage: "Event Content",
                    })}
                    {...register("content")}
                    sx={{
                      "& textarea::placeholder": {
                        color: "rgba(0, 0, 0, 0.523)",
                      },
                    }}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.content?.message}
                  </p>
                </Grid>
                <Typography
                  sx={{ fontSize: "12px", margin: "auto", display: "flex", alignItems: "center" }}
                >
                  <span style={{ color: "red" }}>*</span>
                  <FormattedMessage
                    id="addEvent.waring.tagLine"
                    defaultMessage="Your event will be automatically deleted 7 days after it concludes."
                  />
                </Typography>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
              </Grid>
            </FormControl>
            <Stack
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                flexDirection: "row",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <Button
                onClick={closeDialog}
                size="small"
                style={{
                  ...ButtonCss,
                  padding: "8px 15px",
                  background: "#d32f2f",
                  color: "#fff",
                }}
              >
                <FormattedMessage id="myUpdatesModal.cancelButton.title" defaultMessage="Cancel" />
              </Button>
              <Button
                size="small"
                style={{ ...ButtonCss, padding: "8px 15px", background: "green", color: "#ffff" }}
                type="submit"
                disabled={disableButton === true}
              >
                <FormattedMessage id="myUpdatesModal.submitButton.title" defaultMessage="Submit" />
              </Button>
            </Stack>
          </DialogContent>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventsModal;
