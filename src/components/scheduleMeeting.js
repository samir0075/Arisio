import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Dialog,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { scheduleMeeting } from "src/action/investorMandates";
import { FormattedMessage, useIntl } from "react-intl";
import { emailRegex } from "./validators";

// Configuration
const CLIENT_ID = "166556923351-831ru97m8gds6i1eopavntflo8gkvbet.apps.googleusercontent.com";
const API_KEY = "AIzaSyAJsZO2Bo7hCD7YuwLDuBNiLqMTqLX80eg";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES =
  "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly";
const PLUGIN_NAME = "Your Plugin Name"; // Replace with your actual plugin name

// Load gapi dynamically
const loadGapi = async () => {
  if (typeof window === "undefined") return;
  const { gapi } = await import("gapi-script");
  return gapi;
};

// Schema
const schema = yup
  .object({
    date: yup
      .string()
      .required(
        <FormattedMessage
          id="scheduleMeeting.chooseDate.error.message"
          defaultMessage="Select Date"
        />
      ),
    startMeetingAt: yup
      .string()
      .required(
        <FormattedMessage
          id="scheduleMeeting.startTime.error.message"
          defaultMessage="Enter Start Time"
        />
      )
      .test(
        "is-valid-start-time",
        <FormattedMessage
          id="scheduleMeeting.invalidStartTime.error.message"
          defaultMessage="Start time should be in the future"
        />,
        function (value) {
          const { date } = this.parent;
          const selectedDate = new Date(`${date}T${value}`);
          const now = new Date();

          const todayDate = now.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
          const selectedStartTime = new Date(`${date}T${value}`);
          // If selected date is today, ensure the start time is in the future
          if (date === todayDate && selectedStartTime <= now) {
            return false;
          }
          return true;
        }
      ),
    endMeetingAt: yup
      .string()
      .required(
        <FormattedMessage
          id="scheduleMeeting.endTime.error.message"
          defaultMessage="Enter End Time"
        />
      )
      .test(
        "is-greater",
        <FormattedMessage
          id="scheduleMeeting.invalidEndTime.error.message"
          defaultMessage="End time should be after the start time"
        />,
        function (value) {
          const { startMeetingAt, date } = this.parent;
          const startTime = new Date(`${date}T${startMeetingAt}`);
          const endTime = new Date(`${date}T${value}`);

          return endTime > startTime; // Ensure end time is later than start time
        }
      ),

    organizerEamilId: yup
      .string()
      .required(
        <FormattedMessage
          id="scheduleMeetingModal.email.error.message"
          defaultMessage="Email is required"
        />
      )
      .matches(emailRegex, () => (
        <FormattedMessage
          id="scheduleMeeting.email.error.message"
          defaultMessage="Invalid email address "
        />
      )),

    location: yup
      .string()
      .min(
        0,
        <FormattedMessage
          id="scheduleMeeting.location.error.min.message"
          defaultMessage="Minimum 4 character required"
        />
      )
      .max(
        150,
        <FormattedMessage
          id="scheduleMeeting.location.error.max.message"
          defaultMessage="Maximum 150 characters are allowed"
        />
      ),
    meetingLink: yup
      .string()
      .min(
        0,
        <FormattedMessage
          id="scheduleMeeting.location.error.min.message"
          defaultMessage="Minimum 4 character required"
        />
      )
      .max(
        150,
        <FormattedMessage
          id="scheduleMeeting.location.error.max.message"
          defaultMessage="Maximum 150 characters are allowed"
        />
      ),
  })
  .required();

const ScheduleMeeting = ({ meetingDialog, setMeetingDialog, startupProfile }) => {
  const [meetingDetails, setMeetingDetails] = useState({});
  const [isChecked1, setIsChecked1] = useState(false);
  const intl = useIntl();
  const [isChecked2, setIsChecked2] = useState(true);
  const handleClose = () => {
    setMeetingDialog(false);
  };

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const mandateId = localStorage.getItem("selectedMandateId");

  const [auth2, setAuth2] = useState(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [eventLink, setEventLink] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [todayDate, setTodayDate] = useState("");

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCheckbox1Change = (e) => {
    setIsChecked1(e.target.checked);
    if (e.target.checked) {
      setIsChecked2(false); /** Close the second text box */
    }
  };

  const handleCheckbox2Change = (e) => {
    setIsChecked2(e.target.checked);
    if (e.target.checked) {
      setIsChecked1(false); /**  Close the first text box */
    }
  };

  useEffect(() => {
    const initClient = async () => {
      try {
        const gapi = await loadGapi();
        if (gapi) {
          await new Promise((resolve) => gapi.load("client:auth2", resolve));

          await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
            plugin_name: PLUGIN_NAME,
          });

          await gapi.client.load("calendar", "v3");
          console.log("Google Calendar API loaded.");

          const authInstance = gapi.auth2.getAuthInstance();
          setAuth2(authInstance);
          setIsAuthInitialized(true);
          console.log("Google API client initialized.");
        }
      } catch (error) {
        console.error("Error initializing Google API client:", error);
      }
    };

    initClient();
  }, []);

  const onSubmit = (data) => {
    onSubmitMailSend(data);
    // console.log("Submitting form data:", data);
    // if (isChecked2) {
    //   onSubmitGoogleMeet(data);
    // } else {
    //   onSubmitMailSend(data);
    // }
  };

  const onSubmitGoogleMeet = async (data) => {
    if (!isAuthInitialized) {
      console.error("Auth instance is not initialized.");
      return;
    }
    console.log("Working submit.");

    if (auth2) {
      try {
        if (!auth2.isSignedIn.get()) {
          console.log("User is not signed in. Attempting to sign in...");
          await auth2.signIn();
          console.log("User signed in.");
        }
        if (data) {
          createEvent(data);
        } else {
          console.error("No data provided to create event.");
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    } else {
      console.error("Auth instance is not available.");
    }
  };

  // const onSubmitMailSend = (data) => {
  //   // console.log("date", data);

  //   setMeetingDetails({
  //     ...data,
  //     association: "application",
  //     description: "ARISIO: New appointment Scheduled!",
  //     summary: "ARISIO: New appointment Scheduled!",
  //     timeOffSet: -530,
  //     endMeetingAt: `${data.date} ${data.endMeetingAt}:00`,
  //     startMeetingAt: `${data.date} ${data.startMeetingAt}:00`,
  //   });

  //   setTimeout(() => {
  //     dispatch(
  //       scheduleMeeting(investorId, mandateId, startupProfile?.startup?.id, meetingDetails)
  //     ).then((res) => {
  //       if (res?.message === "confirmed") {
  //         setMeetingDialog(false);
  //         setMeetingDetails("");
  //       }
  //     });
  //   }, 5000);
  // };
  const onSubmitMailSend = (data) => {
    const updatedMeetingDetails = {
      ...data,
      association: "application",
      description: "ARISIO: New appointment Scheduled!",
      summary: "ARISIO: New appointment Scheduled!",
      timeOffSet: -530,
      endMeetingAt: `${data.date} ${data.endMeetingAt}:00`,
      startMeetingAt: `${data.date} ${data.startMeetingAt}:00`,
    };

    setMeetingDetails(updatedMeetingDetails);

    dispatch(
      scheduleMeeting(investorId, mandateId, startupProfile?.startup?.id, updatedMeetingDetails)
    ).then((res) => {
      if (res?.message === "confirmed") {
        reset(); // Clear details after successful dispatch
        setMeetingDialog(false);
      }
    });
  };

  const createEvent = async (data) => {
    // console.log("Creating event with data:", data);
    const gapi = await loadGapi();

    if (!data.date || !data.startMeetingAt || !data.endMeetingAt) {
      console.error("Required fields are missing.");
      return;
    }

    const startDateTime = new Date(`${data.date}T${data.startMeetingAt}`);
    const endDateTime = new Date(`${data.date}T${data.endMeetingAt}`);

    const event = {
      summary: "ARISIO: New appointment Scheduled!",
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "America/Los_Angeles",
      },
      attendees: selectedUsers.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
          requestId: "some-random-request-id",
        },
      },
    };

    // console.log("Creating event with the following data:", event);

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
      });

      const createdEvent = response.result;
      // console.log("Event created:", createdEvent);
      setEventLink(createdEvent.htmlLink);
      onSubmitMailSend({
        ...data,
        meetingLink: createdEvent.htmlLink,
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentDate = now.toISOString().split("T")[0];

    setCurrentTime(`${hours}:${minutes}`);
    setTodayDate(currentDate);
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const startDate = watch("startMeetingAt");
  const endDate = watch("endMeetingAt");

  // const today = new Date().toISOString().split("T")[0];
  // const today = getCurrentDateTime();

  const selectedDate = watch("date");
  console.log(currentTime);
  const isToday = selectedDate === todayDate;

  console.log(isToday);

  return (
    <>
      <Dialog
        open={meetingDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid sx={{ p: 4 }}>
          <Box style={{ float: "right" }} onClick={() => handleClose()}>
            <CancelIcon
              sx={{ fontSize: "1.2rem" }}
              color="disabled"
              style={{ cursor: "pointer", width: "40px" }}
            />
          </Box>
          <Grid container>
            <CalendarMonthIcon sx={{ position: "relative", right: "5px" }} />
            <Typography sx={{ fontWeight: 600 }}>
              <FormattedMessage
                id="scheduleMeetingModal.main.heading"
                defaultMessage="Schedule Meeting"
              />
            </Typography>
          </Grid>
          <Typography sx={{ margin: "10px 0px", fontWeight: 500, color: "rgba(108, 25, 62, 1)" }}>
            {startupProfile?.startup?.user?.name} | {startupProfile?.startup?.organizationName}
          </Typography>
          <Divider sx={{ border: "1px solid #F5F5F5" }} />

          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "10px" }} noValidate>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <Typography>
                    <FormattedMessage
                      id="scheduleMeetingModal.main.sub.heading"
                      defaultMessage="Invite People"
                    />{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    placeholder={intl.formatMessage({
                      id: "scheduleMeetingModal.email.placeholder",
                      defaultMessage: "Enter Email",
                    })}
                    {...register("organizerEamilId")}
                    onChange={(event) => setSelectedUsers([event.target.value])}
                  />
                  {errors.organizerEamilId && (
                    <span style={{ color: "red" }}>{errors.organizerEamilId?.message}</span>
                  )}
                </Grid>
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography>
                    <FormattedMessage
                      id="scheduleMeeting.card.form.label1"
                      defaultMessage="Choose Date"
                    />{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>

                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        fullWidth
                        id="outlined-basic"
                        variant="outlined"
                        placeholder=""
                        type="date"
                        inputProps={{
                          min: todayDate,
                        }}
                        {...field}
                      />
                    )}
                  />
                  {errors.date && <span style={{ color: "red" }}>{errors.date.message}</span>}
                </Grid>
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography>
                    <FormattedMessage
                      id="scheduleMeeting.card.form.label2"
                      defaultMessage="Start time"
                    />{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>

                  <Controller
                    name="startMeetingAt"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        fullWidth
                        id="outlined-basic"
                        variant="outlined"
                        placeholder=""
                        type="time"
                        inputProps={{
                          min: todayDate === watch("date") ? currentTime : "00:00", // Disable past times if today
                        }}
                        {...field}
                      />
                    )}
                  />
                  {errors.startMeetingAt && (
                    <span style={{ color: "red" }}>{errors.startMeetingAt.message}</span>
                  )}
                </Grid>

                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography>
                    <FormattedMessage
                      id="scheduleMeeting.card.form.label3"
                      defaultMessage="End time"
                    />{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>

                  <Controller
                    name="endMeetingAt"
                    control={control}
                    rules={{
                      required: "End date is required",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        if (startDate && new Date(startDate) >= selectedDate) {
                          return "End date should be greater than start date";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        fullWidth
                        id="outlined-basic"
                        variant="outlined"
                        placeholder=""
                        type="time"
                        inputProps={{
                          min: startDate
                            ? startDate.split(":").slice(0, 2).join(":")
                            : `${todayDate}T00:00`,
                        }}
                        {...field}
                      />
                    )}
                  />
                  {errors.endMeetingAt && (
                    <span style={{ color: "red" }}>{errors.endMeetingAt.message}</span>
                  )}
                </Grid>

                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <Typography>
                    <FormattedMessage
                      id="scheduleMeetingModal.card.form.label4"
                      defaultMessage="Choose Meeting Type"
                    />
                    <span style={{ marginLeft: "5px", color: "red" }}>*</span>
                  </Typography>
                  <FormControlLabel
                    control={<Radio checked={isChecked2} onChange={handleCheckbox2Change} />}
                    label={intl.formatMessage({
                      id: "scheduleMeetingModal.card.option1.online.label",
                      defaultMessage: "Online",
                    })}
                  />
                  <FormControlLabel
                    control={<Radio checked={isChecked1} onChange={handleCheckbox1Change} />}
                    label={intl.formatMessage({
                      id: "scheduleMeetingModal.card.option2.inPerson.label",
                      defaultMessage: "In Person",
                    })}
                  />
                </Grid>

                {isChecked1 && (
                  <Grid item xs={12} sm={12} md={12} xl={12}>
                    <Typography>
                      <FormattedMessage
                        id="scheduleMeetingModal.card.form.label5"
                        defaultMessage="Venue"
                      />
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      multiline
                      minRows={2}
                      placeholder="Enter Venue Details"
                      {...register("location")}
                    />
                    {errors.location && (
                      <span style={{ color: "red" }}>{errors.location?.message}</span>
                    )}
                  </Grid>
                )}

                {isChecked2 && (
                  <Grid item xs={12} sm={12} md={12} xl={12}>
                    <Typography>
                      <FormattedMessage
                        id="scheduleMeetingModal.card.form.label6"
                        defaultMessage="CalendlyLink"
                      />
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      multiline
                      minRows={1}
                      placeholder={intl.formatMessage({
                        id: "scheduleMeetingModal.card.calenderLink.placeholder",
                        defaultMessage: "Enter a link",
                      })}
                      {...register("meetingLink")}
                    />
                    {errors.meetingLink && (
                      <span style={{ color: "red" }}>{errors.meetingLink?.message}</span>
                    )}
                  </Grid>
                )}
              </Grid>
              <Grid container justifyContent="flex-end" sx={{ marginTop: "20px" }}>
                <Button type="submit" sx={{ bgcolor: "rgba(138, 21, 56, 0.15) !important" }}>
                  <FormattedMessage
                    id="scheduleMeeting.card.submit.button"
                    defaultMessage="Schedule"
                  />
                </Button>
              </Grid>
            </Stack>
          </form>
        </Grid>
      </Dialog>
    </>
  );
};

export default ScheduleMeeting;
