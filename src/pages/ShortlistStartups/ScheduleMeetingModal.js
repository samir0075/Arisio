import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { createScheduleMeeting } from "src/action/shortListStartUps";
import { FormattedMessage, useIntl } from "react-intl";

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const ScheduleMeetingModal = ({ scheduleModal, setScheduleModal, selectedStartUp }) => {
  const [isChecked1, setIsChecked1] = useState(false);
  const intl = useIntl();
  const [isChecked2, setIsChecked2] = useState(true);
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;
  const [formData, setFormData] = useState({
    email: "",
    location: "",
    startMeetingAt: "",
    endMeetingAt: "",
    meetingLink: "",
    date: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    location: "",
    startMeetingAt: "",
    endMeetingAt: "",
    meetingLink: "",
    date: "",
  });

  const emailResponse = useSelector((state) => state?.shortListStartUps?.scheduleMeetingResponse);

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

  const currentTime = getCurrentTime();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    /**  Clear error message when user starts typing in the field */
    if (value.trim() !== "") {
      setFormErrors({ ...formErrors, [name]: "" });
    } else {
      const errors = {
        /** Validating form fields */
        email: "Email is required",
        location: "Venue is required",
        startMeetingAt: "Please provide start time",
        endMeetingAt: "Please provide end time",
        meetingLink: "Link is required",
        date: "Please provide Date",
      };
      setFormErrors({ ...formErrors, [name]: errors[name] });
    }
    const now = new Date();
    const selectedTime = new Date();
    const [hours, minutes] = value.split(":");
    selectedTime.setHours(hours, minutes, 0, 0);

    let newFormErrors = {};

    if (name === "startMeetingAt" && selectedTime < now) {
      newFormErrors.startMeetingAt = (
        <FormattedMessage
          id="scheduleMeetingModal.startTime.greaterThan.error.message"
          defaultMessage="Start time must be greater than the current time"
        />
      );
    } else if (name === "endMeetingAt") {
      const startTime = new Date();
      const [startHours, startMinutes] = formData.startMeetingAt.split(":");
      startTime.setHours(startHours, startMinutes, 0, 0);

      if (startTime >= selectedTime) {
        newFormErrors.endMeetingAt = (
          <FormattedMessage
            id="scheduleMeetingModal.endTime.greaterThan.error.message"
            defaultMessage="End time must be greater than the start time"
          />
        );
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      ...newFormErrors,
    }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    let errors = {};
    /** Validating form fields */
    if (!formData.email) {
      errors.email = (
        <FormattedMessage
          id="scheduleMeetingModal.email.error.message"
          defaultMessage="Email is required"
        />
      );
    }
    if (!formData.location && isChecked1) {
      errors.location = (
        <FormattedMessage
          id="scheduleMeetingModal.venue.error.message"
          defaultMessage="Venue is required"
        />
      );
    }
    if (!formData.startMeetingAt) {
      errors.startMeetingAt = (
        <FormattedMessage
          id="scheduleMeetingModal.startTime.error.message"
          defaultMessage="Please provide start time"
        />
      );
    } else {
      const selectedDate = new Date(`${date}T${formData.startMeetingAt}`);
      const now = new Date();
      const todayDate = now.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      // Validate if the selected start time is in the future
      if (date === todayDate && selectedDate <= now) {
        errors.startMeetingAt = (
          <FormattedMessage
            id="scheduleMeeting.invalidStartTime.error.message"
            defaultMessage="Start time should be in the future"
          />
        );
      }
    }
    if (!formData.endMeetingAt) {
      errors.endMeetingAt = (
        <FormattedMessage
          id="scheduleMeetingModal.endTime.error.message"
          defaultMessage="Please provide end time"
        />
      );
    } else {
      const { startMeetingAt } = formData;
      const startTime = new Date(`${date}T${startMeetingAt}`);
      const endTime = new Date(`${date}T${formData.endMeetingAt}`);

      // Validate if end time is after start time
      if (endTime <= startTime) {
        errors.endMeetingAt = (
          <FormattedMessage
            id="scheduleMeeting.invalidEndTime.error.message"
            defaultMessage="End time should be after the start time"
          />
        );
      }
    }
    if (!formData.meetingLink && isChecked2) {
      errors.meetingLink = (
        <FormattedMessage
          id="scheduleMeetingModal.link.error.message"
          defaultMessage="Link is required"
        />
      );
    }
    if (!formData.date) {
      errors.date = (
        <FormattedMessage
          id="scheduleMeetingModal.date.error.message"
          defaultMessage="Please provide Date"
        />
      );
    }
    if (Object.keys(errors).length > 0) {
      /** Update error state if there are errors */
      setFormErrors(errors);
    } else {
      /** Proceed with form submission if there are no errors */
      const modifiedData = {
        description: "ARISIO: New appointment Scheduled!",
        association: "startup",
        organizerEamilId: formData?.email,
        summary: "ARISIO: New appointment Scheduled!",
        timeOffSet: -330,
        endMeetingAt: `${formData?.date} ${formData?.endMeetingAt}:00`,
        startMeetingAt: `${formData?.date} ${formData?.startMeetingAt}:00`,
        meetingLink: formData?.meetingLink,
        location: "location",
      };
      dispatch(
        createScheduleMeeting(
          investorId,
          selectedStartUp?.eventId,
          selectedStartUp?.id,
          modifiedData
        )
      );
    }
  };

  useEffect(() => {
    if (Object.keys(emailResponse).length > 0) {
      setTimeout(() => {
        setScheduleModal(false);
        setFormData({
          email: "",
          location: "",
          startMeetingAt: "",
          endMeetingAt: "",
          meetingLink: "",
          date: "",
        });
        setFormErrors({
          email: "",
          location: "",
          startMeetingAt: "",
          endMeetingAt: "",
          meetingLink: "",
          date: "",
        });
      }, 4000);
    }
  }, [emailResponse]);

  const handleClose = () => {
    setScheduleModal(false);
    setFormErrors({
      email: "",
      location: "",
      startMeetingAt: "",
      endMeetingAt: "",
      meetingLink: "",
      date: "",
    });
    setFormData({
      email: "",
      location: "",
      startMeetingAt: "",
      endMeetingAt: "",
      meetingLink: "",
      date: "",
    });
  };

  return (
    <>
      <Dialog open={scheduleModal}>
        <Box style={{ alignItems: "center" }}>
          <Grid style={{ float: "left", display: "flex", flexDirection: "row" }}>
            <img
              style={{ height: "40px", width: "40px", marginLeft: "20px", marginTop: "9px" }}
              src="/Images/Schedule-meeting-logo.png"
              alt="Meeting LOGO"
            />
            <DialogTitle style={{ color: "#8a1538" }}>
              {" "}
              <FormattedMessage
                id="scheduleMeetingModal.main.heading"
                defaultMessage="Schedule Meeting"
              />
            </DialogTitle>
          </Grid>
          <Box style={{ float: "right" }} onClick={() => handleClose()}>
            <CancelIcon
              sx={{ fontSize: "1.2rem" }}
              color="disabled"
              style={{ cursor: "pointer", width: "40px", marginTop: "10px" }}
            />
          </Box>
        </Box>
        <DialogTitle style={{ color: "#8a1538", fontSize: "15px" }}>
          {selectedStartUp?.startup?.user?.name} | {selectedStartUp?.startup?.organizationName}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent style={{ padding: "9px 16px" }}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} xl={12} style={{ paddingRight: "25px" }}>
                  <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                    <FormattedMessage
                      id="scheduleMeetingModal.main.sub.heading"
                      defaultMessage="Invite People"
                    />
                    <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                  </FormLabel>
                  <TextField
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    id="outlined-required"
                    placeholder={intl.formatMessage({
                      id: "scheduleMeetingModal.email.placeholder",
                      defaultMessage: "Enter Email",
                    })}
                    hiddenLabel
                    size="small"
                    style={{ margin: "10px 0px" }}
                    variant="filled"
                    inputProps={{
                      sx: {
                        "&::placeholder": {
                          color: "grey",
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                    <FormattedMessage
                      id="scheduleMeetingModal.card.form.label1"
                      defaultMessage="Choose Date"
                    />
                    <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                  </FormLabel>
                  <TextField
                    hiddenLabel
                    fullWidth
                    id="filled-hidden-label-small"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    error={!!formErrors.date}
                    helperText={formErrors.date}
                    variant="filled"
                    style={{ margin: "10px 0px" }}
                    type="date"
                    size="small"
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                      max: `${new Date().getFullYear() + 10}-12-31`,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                    <FormattedMessage
                      id="scheduleMeetingModal.card.form.label2"
                      defaultMessage="Choose Start Time"
                    />
                    <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                  </FormLabel>
                  <TextField
                    fullWidth
                    hiddenLabel
                    id="filled-hidden-label-small"
                    variant="filled"
                    type="time"
                    name="startMeetingAt"
                    value={formData.startMeetingAt}
                    onChange={handleChange}
                    error={!!formErrors.startMeetingAt}
                    helperText={formErrors.startMeetingAt}
                    size="small"
                    style={{ margin: "10px 0px" }}
                    inputProps={{
                      min: currentTime,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} xl={4} style={{ paddingRight: "25px" }}>
                  <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                    <FormattedMessage
                      id="scheduleMeetingModal.card.form.label3"
                      defaultMessage="Choose End Time"
                    />
                    <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                  </FormLabel>
                  <TextField
                    fullWidth
                    hiddenLabel
                    id="filled-hidden-label-small"
                    variant="filled"
                    type="time"
                    name="endMeetingAt"
                    value={formData.endMeetingAt}
                    onChange={handleChange}
                    error={!!formErrors.endMeetingAt}
                    helperText={formErrors.endMeetingAt}
                    size="small"
                    style={{ margin: "10px 0px" }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                    <FormattedMessage
                      id="scheduleMeetingModal.card.form.label4"
                      defaultMessage="Choose Meeting Type"
                    />
                    <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                  </FormLabel>
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
                  {/* {isChecked1 && <TextField label="Text Box 1" variant="outlined" fullWidth />} */}
                </Grid>
                {isChecked1 && (
                  <Grid item xs={12} sm={12} md={12} xl={12} style={{ paddingRight: "25px" }}>
                    <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                      <FormattedMessage
                        id="scheduleMeetingModal.card.form.label5"
                        defaultMessage="Venue"
                      />
                      <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                    </FormLabel>
                    <TextField
                      fullWidth
                      hiddenLabel
                      id="filled-hidden-label-small"
                      variant="filled"
                      type="text"
                      size="small"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      error={!!formErrors.location}
                      helperText={formErrors.location}
                      multiline
                      maxRows={4}
                      style={{ margin: "10px 0px" }}
                    />
                  </Grid>
                )}
                {isChecked2 && (
                  <Grid item xs={12} sm={12} md={12} xl={12} style={{ paddingRight: "25px" }}>
                    <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                      <FormattedMessage
                        id="scheduleMeetingModal.card.form.label6"
                        defaultMessage="CalendlyLink"
                      />
                      <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                    </FormLabel>
                    <TextField
                      inputProps={{
                        sx: {
                          "&::placeholder": {
                            color: "grey",
                            opacity: 1,
                          },
                        },
                      }}
                      fullWidth
                      hiddenLabel
                      id="filled-hidden-label-small"
                      variant="filled"
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "scheduleMeetingModal.card.calenderLink.placeholder",
                        defaultMessage: "Enter a link",
                      })}
                      size="small"
                      multiline
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleChange}
                      error={!!formErrors.meetingLink}
                      helperText={formErrors.meetingLink}
                      maxRows={4}
                      style={{ margin: "10px 0px" }}
                    />
                  </Grid>
                )}
              </Grid>
              {Object.keys(emailResponse).length > 0 && (
                <Typography color="green">
                  <FormattedMessage
                    id="scheduleMeetingModal.card.response.message"
                    defaultMessage="Your meeting has been scheduled successfully."
                  />
                </Typography>
              )}

              <Button
                size="small"
                style={{ color: "#ffff", backgroundColor: "#8a1538", borderRadius: "5px" }}
                type="submit"
              >
                <FormattedMessage
                  id="scheduleMeetingModal.card.submit.button"
                  defaultMessage="Submit"
                />
              </Button>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default ScheduleMeetingModal;
