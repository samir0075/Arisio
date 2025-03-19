import React, { useState, useEffect, useMemo, useRef } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Stack,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ExternalContainer from "src/components/ExternalContainer";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import ConfirmEventModal from "../PendingApprovals/PendingEvents/confirmEventModal";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { myEventDetail, myEventsFetch } from "src/action/events";
import { formattedDate, formattedEventDate, getButtonCss } from "src/utils/util";
import { getEvents } from "src/action/homepage";
import { border, display } from "@mui/system";
import { getLocation } from "src/action/globalApi";
import English from "../../locales/en-US";
import Arabic from "../../locales/ar-EG";
import { FormattedMessage, IntlProvider, useIntl } from "react-intl";
import NavBar from "src/components/NavBar/NavBar";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Footer from "src/components/Footer/Footer";
import dayjs from "dayjs";
import { Anchor } from "@mui/icons-material";

const DetailEvents = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale } = useRouter();

  const { eventId, section, module } = router.query;

  const [selectedEventId, setSelectedEventId] = useState(eventId || null);
  const [eventStatus, setEventStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const ButtonCss = getButtonCss();
  const [tooltipTitle, setTooltipTitle] = useState("Copy Event link");
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false); // Track mouse hover state

  const [scrollInterval, setScrollInterval] = useState(null); // Store the interval ID

  const goBack = () => {
    router.back();
  };

  const storedUserDetails = localStorage.getItem("userDetails");
  let UserId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const role = UserId?.role;

  // Start auto-scrolling
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += 1;

          // Reset scroll to top if it reaches the bottom to loop infinitely
          if (
            scrollContainerRef.current.scrollHeight ===
            scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight
          ) {
            scrollContainerRef.current.scrollTop = 0;
          }
        }
      }, 10); // Adjust the scroll speed here

      setScrollInterval(interval); // Store the interval ID

      // Clean up interval when component unmounts or when hover state changes
      return () => clearInterval(interval);
    }
  }, [isHovered]); // Re-run when the hover state changes

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Clear the interval when the mouse enters the container to stop scrolling
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const loadingState = useSelector((state) => state?.myEvents?.loading);
  const myEventsLoading = useSelector((state) => state?.myEvents?.myEventsLoading);

  useEffect(() => {
    dispatch(getLocation());
  }, [dispatch]);

  const UserCountry = useSelector((state) => state.globalApi.location);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    if (role === "INVESTOR") {
      dispatch(myEventsFetch(`investor/events/${1}`));
    } else if (role === "ENTREPRENEUR") {
      dispatch(myEventsFetch(`startup/events/${1}`));
    } else if (role === "ADMINISTRATOR" && section === "PendingEvents") {
      dispatch(myEventsFetch(`admin/events/${1}?listType=pending`));
    } else if (role === "ADMINISTRATOR") {
      dispatch(myEventsFetch(`admin/events/${1}?listType=active`));
    } else if (role === "INDIVIDUAL") {
      dispatch(myEventsFetch(`individual/events/${1}`));
    }
  }, [dispatch, section, role]);

  const eventsData = useSelector((state) => state?.myEvents?.myEvents);
  useEffect(() => {
    if (module === "homepage" && eventId) {
      dispatch(myEventDetail(`website/event/${eventId}`));
    } else {
      if (selectedEventId !== null) {
        if (role === "ADMINISTRATOR") {
          dispatch(myEventDetail(`admin/eventoverview/${selectedEventId}`));
        } else if (role === "ENTREPRENEUR") {
          dispatch(myEventDetail(`startup/eventoverview/${selectedEventId}`));
        } else if (role === "INVESTOR") {
          dispatch(myEventDetail(`investor/eventoverview/${selectedEventId}`));
        } else if (role === "INDIVIDUAL") {
          dispatch(myEventDetail(`individual/eventoverview/${selectedEventId}`));
        }
      }
    }
  }, [dispatch, eventId, module, role, selectedEventId]);

  let DetailEvent = useSelector((state) => state?.myEvents?.selectedEvent);

  useEffect(() => {
    setOpen(false);
  }, []);

  const handleApproveOrRejectEvents = (detailEventId, statusOfEvent) => {
    setOpen(true);
    setSelectedEventId(detailEventId);
    setEventStatus(statusOfEvent);
  };
  const handleAddClick = (detailEvent) => {
    setSelectedEventId(detailEvent?.id);
    if (module === "homepage") {
      const formattedTitle = detailEvent?.header.replace(/\s+/g, "-");

      router.push(
        `https://dic.hyperthink.io/DetailEventsPage/detailEvent?eventId=${detailEvent?.id}&module=${module}&header=${formattedTitle}`
      );
    }
  };

  const homepageEvents = useSelector((state) => state.homepage.events);

  const newsEventPage = true;
  const lang = localStorage.getItem("lang");

  const [appState, setAppState] = useState({ language: lang });
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [shortLocale] = locale ? locale.split("-") : [appState?.language];
  const messages = useMemo(() => {
    switch (appState?.language) {
      case "ar":
        return Arabic;
      case "en":
        return English;
      default:
        return English;
    }
  }, [appState?.language]);
  const pricingPage = "Pricing";

  const handleSignupLogin = () => {
    setLoginDialogOpen(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setTooltipTitle("Copied!");
    setTimeout(() => setTooltipTitle("Copy Event link"), 2000);
  };

  const currentDate = new Date();
  console.log(DetailEvent?.source_url);

  // const sourceUrl = `https://${DetailEvent?.source_url}` || "";

  const sourceUrl = (() => {
    const url = DetailEvent?.source_url || "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    } else {
      return `https://${url}`;
    }
  })();

  const noEventFilterLength = homepageEvents?.results?.filter(
    (data) => currentDate < new Date(data?.date)
  ).length;

  const intl = useIntl();

  const formateDateAndTime = (date) => {
    const dataString = dayjs(date); // Set locale if needed
    return dataString.format("DD/MM/YYYY hh:mm A");
  };

  return (
    <>
      <IntlProvider locale={shortLocale} messages={messages} onError={() => null}>
        {module === "homepage" && (
          <NavBar appState={appState} setAppState={setAppState} pricingPage={pricingPage} />
        )}
        <ExternalContainer>
          <Box sx={{ marginTop: module === "homepage" ? " 85px" : "" }}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ArrowBackOutlinedIcon
                onClick={goBack}
                style={{ marginRight: "10px", cursor: "pointer" }}
              />
              <Typography sx={{ fontSize: "0.75rem", fontWeight: lang === "ar" ? 600 : 400 }}>
                <FormattedMessage id="detailEvent.backtoEvent" defaultMessage="Back to Events" />
              </Typography>
            </Box>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={8} md={8} xl={8}>
                {loadingState ? (
                  <>
                    <Card
                      sx={{
                        padding: "30px",
                        marginTop: "20px",
                        marginRight:"20px",
                        borderRadius: "5px",
                        backgroundColor: "white",
                      }}
                    >
                      <Skeleton variant="text" width="50%" height={30} />

                      <Skeleton
                        variant="rectangular"
                        height={250}
                        width="80%"
                        style={{ marginTop: "10px" }}
                      />
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={20}
                        style={{ marginTop: "10px" }}
                      />
                      <Skeleton variant="text" width="80%" height={20} />
                    </Card>
                  </>
                ) : (
                  <Card style={{ padding: "20px", marginTop: "20px", borderRadius: "5px" }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Typography
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          maxWidth: "95%",
                          fontSize: "1.4rem",
                          fontWeight: "600",

                          // padding: "10px 0px",
                        }}
                      >
                        {DetailEvent?.header}
                      </Typography>

                      {module === "homepage" && (
                        <Grid>
                          {/* <Typography>
                          https://dic.hyperthink.io/DetailNewsPage/detailsNews?newsId={newsId}
                          &module={module}
                        </Typography> */}

                          <Typography>
                            <Tooltip placement="top" title={tooltipTitle} arrow>
                              <ContentCopyIcon
                                onClick={() =>
                                  copyToClipboard(
                                    ` https://dic.hyperthink.io/DetailEventsPage/detailEvent?eventId=${eventId}
                          &module=${module}`
                                  )
                                }
                                style={{ fontSize: "20px", cursor: "pointer" }}
                              />
                            </Tooltip>
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {DetailEvent?.image !== null ? (
                      <CardMedia
                        sx={{
                          height: { xs: 150, sm: 200, md: 250 },
                          width: "100%",
                          objectFit: "contain", // or 'contain' if you want to fit the image within the container
                          my: { xs: "3px", md: "10px" },
                        }}
                        component="img"
                        src={`data:image/PNG;base64,${DetailEvent?.image}`}
                        alt="Incorrect Event Image"
                      />
                    ) : (
                      <Typography
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          fontFamily: "Inter, sans-serif",
                          textAlign: "center",
                          height: "150px",
                          padding: "70px",
                          color: "#8080809c",
                        }}
                        component="div"
                      >
                        No image
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: { xs: "flex-start", md: "center" },
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "10px",
                          }}
                        >
                          <EventAvailableIcon style={{ fontSize: "0.9rem", marginRight: "3px" }} />
                          <Typography style={{ fontSize: "0.8rem" }}>
                            {/* {" "}
                          {new Date(DetailEvent?.date).toLocaleString("default", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}{" "} */}
                            <FormattedMessage
                              id="addEvent.field.startDate"
                              defaultMessage="Start date :"
                            />
                            : {formateDateAndTime(DetailEvent?.date)}
                          </Typography>
                        </Stack>
                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "10px",
                          }}
                        >
                          <EventBusyIcon style={{ fontSize: "0.9rem", marginRight: "3px" }} />
                          <Typography style={{ fontSize: "0.8rem" }}>
                            {/* {" "}
                          {new Date(DetailEvent?.date).toLocaleString("default", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}{" "} */}
                            <FormattedMessage
                              id="addEvent.field.endDate"
                              defaultMessage="End date "
                            />
                            : {formateDateAndTime(DetailEvent?.end_date)}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          // justifyContent: "center"
                        }}
                      >
                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "5px",
                            // width: "180px",
                            width: DetailEvent?.venue?.length > 25 ? "180px" : "auto",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <LocationCityIcon style={{ fontSize: "0.9rem", marginRight: "3px" }} />
                          <Typography
                            style={{
                              fontSize: "0.8rem",
                              whiteSpace: "nowrap", // Prevents wrapping
                              overflow: "hidden", // Clips any overflowing text
                              textOverflow: "ellipsis", // Adds ellipsis for overflowed text
                              display: "inline-block", // Ensures the element respects the overflow properties
                              width: "calc(100% - 10px)",
                            }}
                          >
                            <FormattedMessage
                              id="detailEvent.header.venue"
                              defaultMessage="Venue :"
                            />
                            :{" "}
                            {DetailEvent?.venue_type === "Virtual" ? (
                              <Tooltip
                                title={DetailEvent?.venue}
                                placement="bottom-start"
                                enterDelay={500}
                                leaveDelay={100}
                              >
                                <span
                                  style={{ cursor: "pointer", color: "blue" }}
                                  onClick={() => {
                                    window.open(
                                      DetailEvent?.venue?.startsWith("http")
                                        ? DetailEvent?.venue
                                        : `http://${DetailEvent?.venue}`,
                                      "_blank",
                                      "noreferrer"
                                    );
                                  }}
                                >
                                  {DetailEvent?.venue}
                                </span>
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title={DetailEvent?.venue}
                                placement="bottom-start"
                                enterDelay={500}
                                leaveDelay={100}
                              >
                                <span> {DetailEvent?.venue}</span>
                              </Tooltip>
                            )}
                            {/* <a>{DetailEvent?.venue}</a> */}
                          </Typography>
                        </Stack>
                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "5px",
                          }}
                        >
                          <LocationOnOutlinedIcon
                            style={{ fontSize: "0.9rem", marginRight: "3px" }}
                          />
                          <Typography style={{ fontSize: "0.8rem" }}>
                            <FormattedMessage
                              id="detailEvent.header.country"
                              defaultMessage="Country :"
                            />{" "}
                            <span>{DetailEvent?.country}</span>
                          </Typography>
                        </Stack>
                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "5px",
                          }}
                        >
                          <MergeTypeIcon style={{ fontSize: "0.9rem", marginRight: "3px" }} />
                          <Typography style={{ fontSize: "0.8rem" }}>
                            <FormattedMessage
                              id="addEvent.field.venueType"
                              defaultMessage="Venue Type "
                            />{" "}
                            <span>: {DetailEvent?.venue_type}</span>
                          </Typography>
                        </Stack>
                      </Box>

                      {/* <Stack
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          padding: "10px",
                        }}
                      >
                        <CorporateFareIcon style={{ fontSize: "0.8rem", marginRight: "3px" }} />
                        <Typography style={{ fontSize: "0.8rem" }}>
                          Organization : <span>{DetailEvent?.organization}</span>
                        </Typography>
                      </Stack> */}
                    </Box>
                    {/* {DetailEvent?.source_url ? (
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          margin: "5px",

                          fontSize: "14px",
                        }}
                      >
                        <LinkOutlinedIcon sx={{ fontSize: "16px" }} /> &nbsp;
                        <a
                          style={{ textDecoration: "none" }}
                          href={
                            sourceUrl
                              ? sourceUrl.startsWith("http")
                                ? sourceUrl
                                : `https://${sourceUrl}`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {sourceUrl}
                        </a>
                      </Typography>
                    ) : (
                      ""
                    )} */}

                    <Box>
                      <h5
                        style={{
                          fontWeight: "unset",
                          fontSize: "0.8rem",
                          margin: "10px",
                          textAlign: "justify",
                          wordWrap: "break-word", // Ensures that long words break and wrap to the next line
                          overflowWrap: "break-word", // Same as wordWrap but more widely supported
                          whiteSpace: "normal",
                        }}
                      >
                        {DetailEvent?.content}
                      </h5>
                    </Box>
                  </Card>
                )}
                {!section &&
                  (currentDate < new Date(DetailEvent?.date) ? (
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        margin: "10px 0px",
                      }}
                    >
                      <Button
                        onClick={() => {
                          window.open(sourceUrl, "_blank", "noreferrer");
                        }}
                        sx={{
                          ...ButtonCss,
                          marginRight: "10px",
                          background: (theme) => `${theme.palette.neutral.buttonBackground}`,
                          color: "#fff",
                          // cursor: "not-allowed",
                          padding: "8px 20px",
                          "&:hover": {
                            background: (theme) => `${theme.palette.neutral.buttonBackground}`,
                          },
                        }}
                      >
                        <FormattedMessage id="detailEvent.enroll" defaultMessage="Enroll" />
                      </Button>
                    </Box>
                  ) : (
                    ""
                  ))}
              </Grid>

              {myEventsLoading ? (
                <Grid item xs={12} md={4}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "700",
                      margin: "10px",
                      // textAlign: "center",
                    }}
                  >
                    Upcoming Events
                  </Typography>

                  {Array.from(new Array(3)).map((_, index) => (
                    <Card
                      key={index}
                      sx={{
                        padding: "16px",
                        borderRadius: "10px",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </div>
                      <Skeleton
                        variant="rectangular"
                        height={70}
                        width={85}
                        style={{ marginLeft: "16px" }}
                      />
                    </Card>
                  ))}
                </Grid>
              ) : (
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Box
                    sx={{
                      px: "10px",
                      // marginTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "700",
                        margin: "10px",
                        // textAlign: "center",
                      }}
                    >
                      {section !== "PendingEvents" ? (
                        <FormattedMessage
                          id="detailEvent.header.upcomingEvents"
                          defaultMessage="Upcoming Events"
                        />
                      ) : (
                        <FormattedMessage
                          id="detailEvent.header.approvalPendingEvents"
                          defaultMessage="Approval Pending Events"
                        />
                      )}
                    </Typography>
                    <Box
                      ref={scrollContainerRef}
                      onMouseEnter={handleMouseEnter} // Stop scroll on hover
                      onMouseLeave={handleMouseLeave} // Resume scroll when mouse leaves
                      sx={{
                        height: module ? "80vh" : "60vh",
                        overflowY: "auto",
                        scrollBehavior: "smooth",
                        "&::-webkit-scrollbar": {
                          width: "0px", // Hide scrollbar by default
                        },
                        "&:hover::-webkit-scrollbar": {
                          width: "6px", // Show scrollbar on hover
                          borderRadius: "30px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#888",
                          borderRadius: "30px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                          backgroundColor: "#555",
                        },
                        scrollbarWidth: "none", // Hide scrollbar for Firefox
                        "&:hover": {
                          scrollbarWidth: "thin", // Show thin scrollbar for Firefox on hover
                          scrollbarColor: "#888 #f1f1f1", // Customize Firefox scrollbar
                        },
                      }}
                    >
                      {!module ? (
                        eventsData?.rows?.length === 0 ? (
                          <Typography
                            sx={{
                              fontSize: "14px",
                              textAlign: "center",
                              marginTop: "50%",
                            }}
                          >
                            <FormattedMessage
                              id="detailEvent.noEvents"
                              defaultMessage="There is no Events"
                            />
                          </Typography>
                        ) : (
                          eventsData?.rows?.map(
                            (data) =>
                              data?.isApproved !== 2 && (
                                <Card
                                  key={data?.id}
                                  style={{
                                    borderRadius: "8px",
                                    margin: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleAddClick(data)}
                                >
                                  <Grid container alignItems="center">
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={8}
                                      xl={8}
                                      container
                                      direction="column"
                                      justifyContent="space-around"
                                      sx={{ padding: "10px 5px !important" }}
                                    >
                                      <Typography
                                        style={{
                                          fontSize: "0.7rem",
                                          fontWeight: "700",
                                          display: "-webkit-box",
                                          WebkitBoxOrient: "vertical",
                                          WebkitLineClamp: 2,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          maxHeight: "3.2rem",
                                          // lineHeight: "1rem",
                                        }}
                                      >
                                        {data?.header}
                                      </Typography>

                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alighItems: "center",
                                          flexWrap: "wrap",
                                          mt: 1,
                                        }}
                                      >
                                        <Typography component="div" sx={{ fontSize: "0.7rem" }}>
                                          <CalendarMonthRoundedIcon
                                            sx={{
                                              fontSize: "1rem",
                                              position: "relative",
                                              top: "3px",
                                            }}
                                          />{" "}
                                          {/* {new Date(data?.date).toLocaleString("default", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                          })}{" "} */}
                                          {formattedEventDate(data?.date)}
                                        </Typography>

                                        <Typography
                                          sx={{ fontSize: "0.7rem", marginRight: "10px" }}
                                        >
                                          <PlaceRoundedIcon
                                            sx={{
                                              fontSize: "1rem",
                                              position: "relative",
                                              top: "3px",
                                            }}
                                          />{" "}
                                          {data?.country}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      xl={4}
                                      container
                                      justifyItems="center"
                                      sx={{ padding: "10px 0px !important" }}
                                    >
                                      <CardMedia
                                        sx={{
                                          height: "80px",
                                          objectFit: "contain", // or 'contain' if you want to fit the image within the
                                          margin: 0,
                                        }}
                                        component="img"
                                        src={`data:image/PNG;base64,${data?.image}`}
                                        alt="News Image"
                                      />
                                    </Grid>
                                  </Grid>
                                </Card>
                              )
                          )
                        )
                      ) : homepageEvents?.results?.length === 0 || noEventFilterLength === 0 ? (
                        <Typography
                          sx={{
                            fontSize: "14px",
                            textAlign: "center",
                            marginTop: "50%",
                          }}
                        >
                          <FormattedMessage
                            id="detailEvent.noEvents"
                            defaultMessage="There is no Events"
                          />
                        </Typography>
                      ) : (
                        homepageEvents?.results
                          ?.filter((data) => currentDate < new Date(data?.date))
                          ?.map((data) => (
                            <Card
                              key={data?.id}
                              style={{
                                borderRadius: "8px",
                                margin: "10px 5px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleAddClick(data)}
                            >
                              <Grid container alignItems="center">
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={8}
                                  xl={8}
                                  container
                                  direction="column"
                                  justifyContent="space-around"
                                  sx={{ padding: "10px 5px !important" }}
                                >
                                  <Typography
                                    style={{
                                      fontSize: "0.7rem",
                                      fontWeight: "700",
                                      display: "-webkit-box",
                                      WebkitBoxOrient: "vertical",
                                      WebkitLineClamp: 2,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxHeight: "3.2rem",
                                      // lineHeight: "1rem",
                                    }}
                                  >
                                    {data?.header}
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alighItems: "center",
                                      flexDirection: "column",
                                      flexWrap: "wrap",
                                      mt: 1,
                                    }}
                                  >
                                    <Typography component="div" sx={{ fontSize: "0.7rem" }}>
                                      <CalendarMonthRoundedIcon
                                        sx={{
                                          fontSize: "1rem",
                                          position: "relative",
                                          top: "3px",
                                        }}
                                      />{" "}
                                      {/* {new Date(data?.date).toLocaleString("default", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                      })}{" "} */}
                                      {formattedEventDate(data?.date)}
                                    </Typography>

                                    <Typography sx={{ fontSize: "0.7rem", marginRight: "10px" }}>
                                      <PlaceRoundedIcon
                                        sx={{
                                          fontSize: "1rem",
                                          position: "relative",
                                          top: "3px",
                                        }}
                                      />{" "}
                                      {data?.country}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid
                                  container
                                  justifyContent="center"
                                  item
                                  xs={12}
                                  sm={12}
                                  md={4}
                                  xl={4}
                                  sx={{ padding: "10px 0px !important" }}
                                >
                                  <CardMedia
                                    sx={{
                                      width: "130px !important",
                                      height: "80px",
                                      objectFit: "cover", // or 'contain' if you want to fit the image within the
                                    }}
                                    component="img"
                                    src={`data:image/PNG;base64,${data?.image}`}
                                    alt="Events Image"
                                  />
                                </Grid>
                              </Grid>
                            </Card>
                          ))
                      )}
                    </Box>
                    {section && (
                      <Box
                        sx={{
                          m: 1,
                          gap: "10px",
                          display: "flex",

                          justifyContent: "center",
                        }}
                      >
                        <Button
                          style={{
                            ...ButtonCss,
                            marginRight: "10px",
                            background: "green",
                            color: "#fff",
                            padding: "8px 20px",
                          }}
                          onClick={() => handleApproveOrRejectEvents(DetailEvent?.id, 1)}
                        >
                          Approve
                        </Button>
                        <Button
                          style={{
                            ...ButtonCss,
                            marginRight: "10px",
                            background: "#d32f2f",
                            color: "#fff",
                            padding: "8px 20px",
                          }}
                          onClick={() => handleApproveOrRejectEvents(DetailEvent?.id, 2)}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </ExternalContainer>

        {module === "homepage" && <Footer newsEventPage={newsEventPage} />}
      </IntlProvider>

      {open == true && (
        <ConfirmEventModal
          openModal={open}
          selectedEventId={selectedEventId}
          setOpenModal={setOpen}
          eventStatus={eventStatus}
        />
      )}
    </>
  );
};
DetailEvents.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DetailEvents;
