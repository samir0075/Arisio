import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import {
  getMandateMeetingDetails,
  getMandateShortDetails,
  getNewPitches,
  getSelectedMandateStatus,
} from "src/action/investorMandates";
import ExternalContainer from "src/components/ExternalContainer";
import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Typography,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  Button,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./allMandate.module.css";
import { useRouter } from "next/router";
import Dashboard from "./dashboard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import MandateStatusModal from "./mandateStatusModal";
import ManageExtendedDateModal from "./manageExtendedDateModal";
import MandateTabs from "./mandateTabs";
import { FormattedMessage } from "react-intl";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import PreviewMandate from "../CreateMandates/previewMandate";
import { getButtonCss } from "src/utils/util";
import InfoIcon from "@mui/icons-material/Info";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getEventsQuestions, navigateIncompleteMandate } from "src/action/createMandate";

const Gauge = dynamic(() => import("@mui/x-charts").then((mod) => mod.Gauge), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const MandateStatus = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [overview, setOverview] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openExtendedDateModal, setOpenExtendedDateModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const buttonCss = getButtonCss();

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;

  const mandateId = localStorage.getItem("selectedMandateId");

  useEffect(() => {
    dispatch(getMandateShortDetails(investorId, mandateId));
    dispatch(getSelectedMandateStatus(investorId, mandateId));
    dispatch(getMandateMeetingDetails(investorId, mandateId));
    dispatch(getNewPitches(investorId, mandateId));
    dispatch(navigateIncompleteMandate(investorId, mandateId));
    dispatch(getEventsQuestions(mandateId));
  }, [dispatch, investorId, mandateId]);

  const goBack = () => {
    if (overview) {
      setOverview(false);
    } else {
      router.back();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month?.padStart(2, "0");
    const paddedDay = day?.padStart(2, "0");

    return `${paddedDay}/${paddedMonth}/${year}`;
  };

  const mandateShortDetails = useSelector((state) => state.investorMandates.shortDetails);
  const pitchStatus = useSelector((state) => state.investorMandates.mandateAction);
  const meetingDetails = useSelector((state) => state.investorMandates.meetStatus);
  const investorMandatesData = useSelector((state) => state?.investorMandates);
  const mandateDetails = useSelector((state) => state.newMandate.incompleteMandateData);
  const mandateQuestionList = useSelector((state) => state?.newMandate?.eventQuestions);

  function formatDateTime(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startDay = startDate.getDate();
    const startMonth = startDate.toLocaleString("default", { month: "long" });
    const startYear = startDate.getFullYear();
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();
    const startPeriod = startHour >= 12 ? "PM" : "AM";
    const startHourFormatted = startHour % 12 || 12; // Convert hour to 12-hour format

    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();
    const endPeriod = endHour >= 12 ? "PM" : "AM";
    const endHourFormatted = endHour % 12 || 12; // Convert hour to 12-hour format

    const formattedStartTime = `${startHourFormatted}:${
      (startMinute < 10 ? "0" : "") + startMinute
    } ${startPeriod}`;
    const formattedEndTime = `${endHourFormatted}:${
      (endMinute < 10 ? "0" : "") + endMinute
    } ${endPeriod}`;

    return `on ${startDay}${getDaySuffix(
      startDay
    )} ${startMonth} ${startYear} from ${formattedStartTime} to ${formattedEndTime}`;
  }

  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const handleView = () => {
    setOverview(!overview);
  };

  const currentDateForExtend = dayjs();
  const EndDateForExtend = dayjs(mandateShortDetails?.endDate);

  const differenceInDays = currentDateForExtend.diff(EndDateForExtend, "day");

  return (
    <>
      {investorMandatesData?.loading === true ? (
        <Box className={styles.spinner}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <ExternalContainer>
          <Grid container onClick={goBack}>
            <ArrowBackIcon className={styles.backButtonColor} />
            <Typography sx={{ px: 1 }} className={`${styles.backButtonColor} ${styles.backButton}`}>
              <FormattedMessage
                id="mandateStatus.back.button.text"
                defaultMessage="Back to mandates"
              />
            </Typography>
          </Grid>
          {overview === false ? (
            <Grid>
              <Grid container marginTop={"1rem"} columnGap={4.5}>
                <Grid
                  item
                  container
                  xs={12}
                  sm={12}
                  md={6}
                  xl={6}
                  className={styles.cardOuter}
                  sx={{
                    boxShadow: "0 0 6px #dd094194",
                    flexDirection: "column",
                    gap: "15px",
                    margin: "10px 0px",
                    position: "relative",
                    // height: "270px",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      top: 0,
                      right: 0,
                      // padding: "10px"
                    }}
                  >
                    <Box sx={{ position: "absolute", top: 1, right: 2 }}>
                      <Tooltip title={"Know more"}>
                        <VisibilityIcon onClick={() => setDialogOpen(true)} />
                      </Tooltip>
                    </Box>
                    <Typography className={styles.mandateHeader}>
                      <FormattedMessage
                        id="mandateStatus.card.detail.heading"
                        defaultMessage="Mandate Details"
                      />
                    </Typography>
                  </Box>
                  {/* <Typography className={styles.mandateHeader}>Mandate Details </Typography> */}

                  <Box>
                    <Typography className={`${styles.points} ${styles.dateColor}`}>
                      <FormattedMessage
                        id="mandateStatus.card.detail.name"
                        defaultMessage="Name :"
                      />
                      <span className={styles.points}> {mandateShortDetails?.title}</span>
                    </Typography>
                  </Box>

                  <Box>
                    <Typography className={`${styles.points} ${styles.dateColor}`} component="div">
                      <FormattedMessage
                        id="mandateStatus.card.content.heading1"
                        defaultMessage="Mandate Starting Date :"
                      />
                      <span className={styles.points}>
                        {" "}
                        {formatDate(mandateShortDetails?.startDate)}
                      </span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography className={`${styles.points} ${styles.dateColor}`} component="div">
                      <FormattedMessage
                        id="mandateStatus.card.content.heading2"
                        defaultMessage="Mandate Closing Date :"
                      />
                      <span className={styles.points}>
                        {" "}
                        {formatDate(mandateShortDetails?.endDate)}
                      </span>
                    </Typography>
                  </Box>
                  {mandateShortDetails?.is_active === 1 || differenceInDays <= 7 ? (
                    <Grid item container>
                      {" "}
                      <Grid item md={4}>
                        <Typography
                          className={`${styles.points} ${styles.dateColor}`}
                          component="div"
                        >
                          Manage Mandates :
                        </Typography>
                      </Grid>
                      <Grid item md={6}>
                        <FormControl>
                          <Select
                            sx={{
                              ".MuiSelect-select": {
                                padding: "5px 5px", // Adjust padding here
                              },
                            }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedValue}
                            label=""
                            renderValue={(value) => {
                              if (value === 0) {
                                return (
                                  <FormattedMessage
                                    id="mandateStatus.card.content.heading3"
                                    defaultMessage="Manage Mandate"
                                  />
                                );
                              }
                            }}
                          >
                            <>
                              {mandateShortDetails?.is_active === 1 ? (
                                <MenuItem
                                  value={10}
                                  onClick={() => {
                                    setOpenModal(true);
                                  }}
                                >
                                  <FormattedMessage
                                    id="mandateStatus.card.form.label1.option1"
                                    defaultMessage="Close"
                                  />
                                </MenuItem>
                              ) : (
                                ""
                              )}
                              {differenceInDays <= 7 ? (
                                <MenuItem value={20} onClick={() => setOpenExtendedDateModal(true)}>
                                  <FormattedMessage
                                    id="mandateStatus.card.form.label2"
                                    defaultMessage="Extend Date"
                                  />
                                </MenuItem>
                              ) : (
                                ""
                              )}
                            </>
                          </Select>
                        </FormControl>
                      </Grid>
                      {/* <Grid container justifyContent={"center"} marginTop={"15px"}>
                        <Button
                          sx={{ ...buttonCss, padding: "6px 10px" }}
                          onClick={() => setDialogOpen(true)}
                        >
                          Know more
                        </Button>
                      </Grid> */}
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid
                  xs={12}
                  sm={12}
                  md={5.5}
                  xl={5.5}
                  item
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    padding: "10px",
                    margin: "10px 0px",
                    // height: "270px",

                    boxShadow: "0 0 6px #dd094194",
                  }}
                >
                  <Grid>
                    <Typography className={styles.mandateHeader}>
                      {" "}
                      <FormattedMessage
                        id="mandateStatus.card1.heading"
                        defaultMessage="Overall Pitch status"
                      />
                    </Typography>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Grid
                      onClick={handleView}
                      item
                      container
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="center"
                      // className={styles.cardOuter}
                      sx={{
                        my: 2,
                        p: 1,
                        cursor: "pointer",
                        // height: { xs: "auto", sm: "auto", md: "200px", xl: "200px" },
                      }}
                      xs={12}
                      sm={12}
                      md={4}
                      xl={4}
                    >
                      <Typography className={`${styles.points} ${styles.dateColor}`}>
                        <FormattedMessage
                          id="mandateStatus.card1.sub.heading1"
                          defaultMessage="Total Pitches"
                        />
                      </Typography>
                      <Gauge
                        color="primary"
                        width={120}
                        height={120}
                        value={pitchStatus?.TotalApplication || 0}
                        valueMax={100}
                        innerRadius="70%"
                        outerRadius="100%"
                        text={({ value, valueMax }) => `${value} / ${valueMax}`}
                      />
                    </Grid>
                    <Grid
                      onClick={handleView}
                      item
                      container
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{
                        my: 2,
                        p: 1,
                        cursor: "pointer",
                        // height: { xs: "auto", sm: "auto", md: "200px", xl: "230px" },
                      }}
                      xs={12}
                      sm={12}
                      md={6}
                      xl={6}
                    >
                      <Typography className={`${styles.points} ${styles.dateColor}`}>
                        <FormattedMessage
                          id="mandateStatus.card1.sub.heading2"
                          defaultMessage="New Pitches/Total Pitches"
                        />
                      </Typography>
                      {/* <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} /> */}
                      {/* <Typography style={{ fontSize: "1.8rem", color: "#8A1538" }}>
                        {pitchStatus?.NewApplication}
                      </Typography> */}
                      <Gauge
                        color="primary"
                        width={120}
                        height={120}
                        value={pitchStatus?.TotalApplication || 0}
                        // valueMin={10}
                        valueMax={pitchStatus?.TotalApplication || 0}
                        innerRadius="70%"
                        outerRadius="100%"
                        text={({ value, valueMax }) => `${value} / ${valueMax}`}
                      />
                    </Grid>
                  </Grid>

                  {/* <Dashboard
                    formatDateTime={formatDateTime}
                    pitchStatus={pitchStatus}
                    meetingDetails={meetingDetails}
                    handleView={handleView}
                  /> */}
                </Grid>
              </Grid>
              <Grid md={12}>
                <Grid
                  // className={styles.cardOuter}
                  sx={{
                    marginTop: "20px",
                    // boxShadow: "0 0 6px #dd094194",
                  }}
                >
                  <Typography className={styles.mandateHeader}>
                    <FormattedMessage
                      id="mandateStatus.card2.heading"
                      defaultMessage="Pitch Action status"
                    />
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Grid
                    // onClick={handleShortlisted}
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    className={styles.cardOuter}
                    sx={{
                      my: 2,
                      p: 1,
                      border: "1px solid #8A1538",
                      borderRadius: "8px",
                      boxShadow: "0 0 6px #dd094194",
                    }}
                    xs={12}
                    sm={5}
                    md={2.8}
                    xl={2.8}
                  >
                    <Typography className={`${styles.points} ${styles.dateColor}`}>
                      <FormattedMessage
                        id="mandateStatus.card2.sub.heading1"
                        defaultMessage="Shortlisted"
                      />
                    </Typography>
                    <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
                    <Typography style={{ fontSize: "1.8rem", color: "#8A1538" }}>
                      {pitchStatus?.Accepted}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    className={styles.cardOuter}
                    sx={{
                      my: 2,
                      p: 1,
                      border: "1px solid #8A1538",
                      borderRadius: "8px",
                      boxShadow: "0 0 6px #dd094194",
                    }}
                    xs={12}
                    sm={5}
                    md={2.8}
                    xl={2.8}
                  >
                    <Typography className={`${styles.points} ${styles.dateColor}`}>
                      <FormattedMessage
                        id="mandateStatus.card2.sub.heading2"
                        defaultMessage="Investor watching"
                      />
                    </Typography>
                    <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
                    <Typography style={{ fontSize: "1.8rem", color: "#8A1538" }}>
                      {pitchStatus?.Watchlist}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    className={styles.cardOuter}
                    sx={{
                      my: 2,
                      p: 1,
                      border: "1px solid #8A1538",
                      borderRadius: "8px",
                      boxShadow: "0 0 6px #dd094194",
                    }}
                    xs={12}
                    sm={5}
                    md={2.8}
                    xl={2.8}
                  >
                    <Typography className={`${styles.points} ${styles.dateColor}`}>
                      <FormattedMessage
                        id="mandateStatus.card2.sub.heading3"
                        defaultMessage="Not a good fit"
                      />
                    </Typography>
                    <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
                    <Typography style={{ fontSize: "1.8rem", color: "red" }}>
                      {pitchStatus?.Rejected}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    className={styles.cardOuter}
                    sx={{
                      my: 2,
                      p: 1,
                      border: "1px solid #8A1538",
                      borderRadius: "8px",
                      boxShadow: "0 0 6px #dd094194",
                    }}
                    xs={12}
                    sm={5}
                    md={2.8}
                    xl={2.8}
                  >
                    <Typography className={`${styles.points} ${styles.dateColor}`}>
                      <FormattedMessage
                        id="mandateStatus.card2.sub.heading4"
                        defaultMessage="Contacted"
                      />
                    </Typography>
                    <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
                    <Typography style={{ fontSize: "1.8rem", color: "#8A1538" }}>
                      {pitchStatus?.Contacted}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  className={styles.cardOuter}
                  sx={{
                    boxShadow: "0 0 6px #dd094194",
                  }}
                >
                  <Grid>
                    <Typography className={styles.mandateTitle}>
                      <FormattedMessage
                        id="mandateStatus.card3.heading"
                        defaultMessage="Upcoming Scheduled meeting"
                      />
                    </Typography>
                  </Grid>
                </Grid>

                {meetingDetails?.map((data) => (
                  <Accordion sx={{ my: 2 }} key={data.meetingId}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Grid container>
                        <Grid xs={12} sm={3} md={2} xl={2}>
                          <img
                            loading="lazy"
                            height="30"
                            width="30"
                            style={{ borderRadius: "100%" }}
                            src={
                              data?.logo
                                ? `data:image/PNG;base64,${data?.logo}`
                                : "/Images/company_default.png"
                            }
                            alt="Logo"
                          />
                        </Grid>
                        <Grid xs={12} sm={3} md={2} xl={2}>
                          <Typography className={styles.dateColor}>
                            {" "}
                            <FormattedMessage
                              id="mandateStatus.card3.sub.heading1"
                              defaultMessage="Meeting with"
                            />
                          </Typography>
                        </Grid>
                        <Grid xs={12} sm={3} md={4} xl={4}>
                          <Typography className={styles.mandateTitle}>{data?.Startup}</Typography>
                        </Grid>
                        <Grid xs={12} sm={3} md={4} xl={4}>
                          <Typography className={styles.backButtonColor}>
                            {formatDateTime(data?.start_time, data?.end_time)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container justifyContent="center" sx={{ bgcolor: "#F5F5F5", p: 2 }}>
                        <Typography className={styles.dateColor}>
                          <FormattedMessage
                            id="mandateStatus.card3.sub.heading2"
                            defaultMessage="Venue :"
                          />{" "}
                          <span className={styles.primary}>
                            {data?.location ? data?.location : "Online Meeting Scheduled "}
                          </span>
                        </Typography>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>
            </Grid>
          ) : (
            <MandateTabs mandateShortDetails={mandateShortDetails} />
          )}
          {openModal === true && (
            <MandateStatusModal openModal={openModal} setOpenModal={setOpenModal} />
          )}
          {openExtendedDateModal === true && (
            <ManageExtendedDateModal
              openExtendedDateModal={openExtendedDateModal}
              setOpenExtendedDateModal={setOpenExtendedDateModal}
            />
          )}
        </ExternalContainer>
      )}
      {dialogOpen && (
        <PreviewMandate
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          previewDetails={mandateDetails}
          eventQuestionList={mandateQuestionList}
        />
      )}
    </>
  );
};
MandateStatus.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MandateStatus;
