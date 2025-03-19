import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import styles from "../../components/HomePageContent/EventSection/EventSection.module.css";
import {
  Box,
  Container,
  Grid,
  Typography,
  CardMedia,
  CardContent,
  Tooltip,
  Button,
  Pagination,
  CircularProgress,
  Card,
  MenuItem,
  Select,
  Tab,
  TextField,
  InputAdornment,
  Skeleton
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { formattedDate, formattedEventDate, getButtonCss, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import { useRouter } from "next/router";
import NoDataMsg from "src/components/NoDataMsg";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddEventsModal from "./AddEvents";
import DeleteModal from "src/components/DeleteModal";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { deleteMyEvent, myEventsFetch } from "src/action/events";
import ExternalContainer from "src/components/ExternalContainer";
import SearchIcon from "@mui/icons-material/Search";

import { toast } from "react-toastify";
import {
  getCountries,
  investorSubscriptionLimitCheck,
  startupSubscriptionLimitCheck
} from "src/action/globalApi";
import { TabContext, TabList } from "@mui/lab";
import { SWEETALERT } from "src/components/sweetalert2";
import dayjs from "dayjs";

const Events = ({ flow, section }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const intl = useIntl();
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState();
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDeleteEventId, setSelectedDeleteEventId] = useState(null);
  const [eventSearch, setEventSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(eventSearch);
  const [tooltipTitle, setTooltipTitle] = useState("Copy link");
  const storedUserDetails = localStorage.getItem("userDetails");

  const [value, setValue] = useState("all");

  let User = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const role = User?.role;
  const [country, setCountry] = useState("");

  const countryData = useSelector(state => state.globalApi.countries);

  // let location = useSelector((state) => state.globalApi.location);
  // const country = "India";

  let startupDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const userId = startupDetails?.id;

  const eventsModule = "event_limit";

  const [isAlertShown, setIsAlertShown] = useState(false);

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedQuery(eventSearch);
  //   }, 3000); // Delay in milliseconds

  //   return () => {
  //     clearTimeout(handler); // Cleanup the timeout on unmount or query change
  //   };
  // }, [eventSearch]);

  useEffect(() => {
    if (role === "ENTREPRENEUR") {
      let isMounted = true; // To check if the component is still mounted
      let requestCounter = 0; // Track the number of API requests

      const checkStartupSubscriptionLimit = async () => {
        const currentRequest = ++requestCounter; // Increment the request counter

        dispatch(startupSubscriptionLimitCheck(userId, eventsModule)).then(res => {
          if (isMounted && currentRequest === requestCounter) {
            if (res?.status === false && !isAlertShown) {
              setIsAlertShown(true);
              SWEETALERT({
                text:
                  "Your Events posting limit has been reached. Please upgrade your plan to continue!"
              });
            }
          }
        });
      };
      checkStartupSubscriptionLimit();

      // Cleanup function to avoid memory leaks
      return () => {
        isMounted = false;
      };
    } else if (role === "INVESTOR") {
      let isMounted = true; // To check if the component is still mounted
      let requestCounter = 0; // Track the number of API requests

      const checkInvestorSubscriptionLimit = async () => {
        const currentRequest = ++requestCounter; // Increment the request counter

        dispatch(investorSubscriptionLimitCheck(userId, eventsModule)).then(res => {
          if (isMounted && currentRequest === requestCounter) {
            if (res?.status === false && !isAlertShown) {
              setIsAlertShown(true);
              SWEETALERT({
                text:
                  "Your Events posting limit has been reached. Please upgrade your plan to continue!"
              });
            }
          }
        });
      };
      checkInvestorSubscriptionLimit();

      // Cleanup function to avoid memory leaks
      return () => {
        isMounted = false;
      };
    } else {
      return;
    }
  }, [dispatch, isAlertShown, role, userId]);

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  useEffect(() => {
    if (role === "INVESTOR") {
      dispatch(myEventsFetch(`investor/events/${page}?eventType=${value}&country=${country}`));
    } else if (role === "ENTREPRENEUR") {
      dispatch(myEventsFetch(`startup/events/${page}?eventType=${value}&country=${country}`));
    } else if (role === "ADMINISTRATOR" && section === "PendingEvents") {
      dispatch(myEventsFetch(`admin/events/${page}?listType=pending&country=${country}`));
    } else if (role === "ADMINISTRATOR" && section !== "PendingEvents") {
      dispatch(
        myEventsFetch(`admin/events/${page}?listType=active&eventType=${value}&country=${country}`)
      );
    } else if (role === "INDIVIDUAL") {
      dispatch(myEventsFetch(`individual/events/${page}?eventType=${value}&country=${country}`));
    }
    setSelectedEvent(null);
  }, [dispatch, role, page, section, country, value]);

  const eventsData = useSelector(state => state?.myEvents?.myEvents);
  const loadingState = useSelector(state => state?.myEvents?.myEventsLoading);
  const eventsImage = useSelector(state => state?.myEvents?.eventsImage?.image);

  const onAddEvents = () => {
    setDialogOpen(true);
  };
  const ButtonCss = getButtonCss();

  const handlePagination = (event, value) => {
    setPage(value);
  };

  const buttonStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "16px",
    cursor: "pointer",
    color: "#0000008a",
    padding: "0px 5px",
    width: "25px",
    textAlign: "center"
  };

  const detailEvent = eventId => {
    !section
      ? router.push(`./Events/detailEvents?eventId=${eventId}`)
      : router.push(
          `../PendingApprovals/PendingEvents/eventDetail?eventId=${eventId}&section=${section}`
        );
  };

  const onEdit = eventDetails => {
    setDialogOpen(true);
    setSelectedEvent(eventDetails);
  };

  const handleDeleteEvent = () => {
    if (role === "INVESTOR") {
      dispatch(deleteMyEvent("investor", selectedDeleteEventId, `investor/events/${page}`)).then(
        resp => {
          if (resp) {
            dispatch(
              myEventsFetch(`investor/events/${page}?eventType=${value}&country=${country}`)
            );
          }
        }
      );
      setOpen(false);
    } else if (role === "ENTREPRENEUR") {
      dispatch(deleteMyEvent("startup", selectedDeleteEventId, `startup/events/${page}`)).then(
        resp => {
          if (resp) {
            dispatch(myEventsFetch(`startup/events/${page}?eventType=${value}&country=${country}`));
          }
        }
      );
      setOpen(false);
    } else if (role === "ADMINISTRATOR" && section === "PendingEvents") {
      dispatch(
        deleteMyEvent("admin", selectedDeleteEventId`admin/events/${page}?listType=pending`)
      ).then(resp => {
        if (resp)
          dispatch(myEventsFetch(`admin/events/${page}?listType=pending&country=${country}`));
      });
      setOpen(false);
    } else if (role === "ADMINISTRATOR" && section !== "PendingEvents") {
      dispatch(
        deleteMyEvent("admin", selectedDeleteEventId, `admin/events/${page}?listType=active`)
      ).then(resp => {
        if (resp)
          dispatch(
            myEventsFetch(
              `admin/events/${page}?listType=active&eventType=${value}&country=${country}`
            )
          );
      });
      setOpen(false);
    }
  };

  /** Define how many records you want per page */
  const recordsPerPage = 12;
  /** Total number of records */
  const totalRecords = eventsData?.count || 0;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
    setTooltipTitle("Copied!");
    setTimeout(() => setTooltipTitle("Copy link"), 2000);
  };
  const handleCountryChange = event => {
    setCountry(event.target.value);
  };

  const getTabStyle = tabValue => ({
    color: "black",
    fontSize: "12px",
    textAlign: "left",
    padding: "0px 30px",
    borderRadius: "3px"
  });

  const handleChange = (event, newValue) => {
    setPage(1);
    setValue(newValue);
  };

  const todayDate = dayjs();

  return (
    <>
      <ExternalContainer>
        {section === "PendingEvents" ? (
          <Box style={{ display: "flex", justifyContent: "space-between", padding: "5px 0px" }}>
            <Box>
              <Select
                style={{ background: "#FFFFFF" }}
                size="small"
                fullWidth
                labelId="single-select-label"
                id="single-select"
                value={country}
                onChange={handleCountryChange}
                displayEmpty
              >
                <MenuItem style={{ fontSize: "0.8rem" }} value="">
                  All Country
                </MenuItem>
                {countryData.map(option => (
                  <MenuItem
                    style={{ fontSize: "0.8rem" }}
                    key={option.countryCode}
                    value={option.countryCode}
                  >
                    {option.country}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            {/* <Button onClick={onAddEvents} style={ButtonCss}>
                Add Events
              </Button> */}
          </Box>
        ) : (
          <TabContext value={value}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={role === "INDIVIDUAL" ? 8 : 7} xl={7}>
                <TabList
                  onChange={handleChange}
                  sx={{
                    textAlign: "left",
                    display: "flex"
                  }}
                >
                  <Tab
                    label={<FormattedMessage id="event.allEvent" defaultMessage="All event" />}
                    value="all"
                    style={getTabStyle("all")}
                    disabled={loadingState}
                  />
                  {role !== "INDIVIDUAL" && (
                    <Tab
                      label={<FormattedMessage id="event.onwEvent" defaultMessage="Own event" />}
                      value="own"
                      style={getTabStyle("own")}
                      disabled={loadingState}
                    />
                  )}
                </TabList>
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3} xl={3}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search"
                  variant="outlined"
                  value={eventSearch}
                  onChange={e => {
                    setEventSearch(e.target.value);
                  }}
                  sx={{
                    background: "#FFFFFF",
                    height: "90%",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.8rem"
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    sx: {
                      // for inner side like the input styling
                      height: "100%",
                      boxSizing: "border-box"
                    }
                  }}
                />
              </Grid> */}
              <Grid item xs={6} sm={6} md={role === "INDIVIDUAL" ? 4 : 3} xl={3}>
                <Select
                  sx={{ background: "#FFFFFF", height: "90%" }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: { xs: "240px", sm: "auto" },
                        width: { xs: "70%", sm: "auto" }
                      }
                    }
                  }}
                  size="small"
                  fullWidth
                  labelId="single-select-label"
                  id="single-select"
                  value={country}
                  onChange={handleCountryChange}
                  displayEmpty
                >
                  <MenuItem style={{ fontSize: "0.8rem" }} value="">
                    <FormattedMessage
                      id="addEvent.filter.allCountry"
                      defaultMessage="All Country"
                    />
                  </MenuItem>
                  {countryData.map(option => (
                    <MenuItem
                      sx={{ fontSize: "0.8rem", whiteSpace: "normal", wordBreak: "break-word" }}
                      key={option.countryCode}
                      value={option.countryCode}
                    >
                      {option.country}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              {isPermitted(permissions.EVENTS_ADD_EVENTS) ? (
                <Grid
                  item
                  justifyContent="flex-end"
                  alignItems={"center"}
                  xs={6}
                  sm={6}
                  md={2}
                  xl={2}
                >
                  <Button
                    onClick={onAddEvents}
                    style={{
                      // paddingBottom: "0px",
                      backgroundColor: "#eedce1",
                      fontSize: "0.8rem",
                      borderRadius: "5px",
                      padding: "10px 20px"
                    }}
                  >
                    <FormattedMessage id="addEvent.addEvent.header" defaultMessage="Add Events" />
                  </Button>
                </Grid>
              ) : null}
            </Grid>
          </TabContext>
        )}

        {loadingState === true ? (
          <Grid container spacing={2} justifyContent="center">
            {Array.from(new Array(3)).map((_, index) => (
              <Grid
                item
                xs={12}
                sm={5.5}
                md={3.5}
                xl={3.5}
                style={{
                  margin: "10px",
                  borderRadius: "5px"
                }}
                key={index}
              >
                <Card
                  sx={{
                    background: "#FFFFFF",
                    borderRadius: "10px",
                    margin: "8px 0px",
                    position: "relative",
                    maxWidth: "350px !important",
                    padding: "20px"
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    height={150}
                    sx={{ borderRadius: "5px", mb: 2 }}
                  />
                  <CardContent>
                    <Skeleton width="80%" height={30} sx={{ mb: 1 }} />
                    <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                    <Skeleton width="40%" height={20} />
                  </CardContent>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={26}
                      style={{ borderRadius: "4px" }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : eventsData?.rows?.length === 0 ? (
          <Box sx={{ marginTop: "15px" }}>
            <NoDataMsg message={"There are no events to show"} />
          </Box>
        ) : (
          <Grid container justifyContent="center">
            {eventsData?.rows?.map(card => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={5.5}
                  md={3.5}
                  xl={3.5}
                  style={{
                    pointer: "none",
                    margin: "10px",

                    // backgroundColor: "white",
                    borderRadius: "5px"
                  }}
                  key={card.id}
                >
                  <Card
                    sx={{
                      background: "#FFFFFF",
                      borderRadius: "10px",
                      margin: "8px 0px",
                      position: "relative",
                      maxWidth: "350px !important",
                      padding: "20px"
                    }}
                    // onClick={() => detailEvent(card?.id)}
                    // onClick={() => (value === "all" ? detailEvent(card?.id) : "")}
                  >
                    {value === "own" || role === "ADMINISTRATOR" ? (
                      <Box className={styles.mandateStatus}>
                        <Typography
                          sx={{
                            position: "absolute",
                            top: "25px",
                            right: "20px",
                            fontSize: "1rem",
                            color: "#fff",
                            fontSize: "0.8rem",
                            margin: "0px 5px",
                            backgroundColor:
                              card?.isApproved === 2
                                ? "#8a1538"
                                : card?.isApproved === 0
                                ? "#68D2E8"
                                : "green",
                            padding: "0px 8px",
                            borderRadius: "5px",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          {card?.isApproved === 0 ? (
                            <FormattedMessage
                              id="news.card.pendingStatus"
                              defaultMessage="PENDING"
                            />
                          ) : card?.isApproved === 1 ? (
                            <FormattedMessage
                              id="news.card.approvedStatus"
                              defaultMessage="Approved"
                            />
                          ) : (
                            <FormattedMessage
                              id="news.card.rejectStatus"
                              defaultMessage="Rejected"
                            />
                          )}
                        </Typography>
                      </Box>
                    ) : (
                      ""
                    )}

                    {card?.image !== null ? (
                      <CardMedia
                        style={{
                          borderRadius: "5px",
                          width: "100%"
                        }}
                        component="img"
                        height="150"
                        src={`data:image/PNG;base64,${card?.image}`}
                      />
                    ) : (
                      <Typography
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          fontFamily: "Inter, sans-serif",
                          textAlign: "center",
                          height: "150px",
                          padding: "70px"
                          // color: "#8080809c",
                        }}
                        component="div"
                      >
                        No image
                      </Typography>
                    )}

                    <CardContent style={{ padding: "9px 0px" }}>
                      <Grid
                        style={{
                          display: "flex",
                          flexDirection: "row-reverse",
                          justifyContent: "space-between",
                          marginBottom: "5px"
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: "0.8rem",
                            // fontWeight: "400 !important",
                            fontFamily: "Inter, sans-serif"
                          }}
                          component="div"
                        >
                          {formattedEventDate(card?.date)}
                        </Typography>
                        <Typography
                          style={{
                            fontSize: "0.8rem",
                            // fontWeight: "400 !important",
                            fontFamily: "Inter, sans-serif",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "40%"
                          }}
                          component="div"
                        >
                          <Tooltip title={card?.venue} placement="top">
                            {card?.venue}
                          </Tooltip>
                        </Typography>
                      </Grid>

                      <Typography
                        style={{
                          fontSize: "1rem",
                          fontWeight: "700",
                          fontFamily: "Inter, sans-serif",
                          textAlign: "left",
                          height: "50px",
                          // whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                          display: "-webkit-box",
                          "-webkit-line-clamp": "2",
                          "-webkit-box-orient": "vertical"
                        }}
                        component="div"
                      >
                        <Tooltip title={card?.header}> {card?.header}</Tooltip>
                      </Typography>

                      <Tooltip title={card.content} placement="top">
                        <Typography
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "400 !important",
                            fontFamily: "Inter, sans-serif",
                            textAlign: "left",
                            display: "inline-block",
                            "-webkit-line-clamp": "2",
                            "-webkit-box-orient": "vertical",
                            color: "black",
                            height: "40px",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginTop: "10px"
                          }}
                          component="div"
                        >
                          {card.content}
                        </Typography>
                      </Tooltip>
                      {card.source_url !== null &&
                      card.source_url !== "" &&
                      (todayDate.isBefore(card.date) || todayDate.isSame(card.date)) ? (
                        <Box
                          sx={{
                            my: "5px",
                            // color: "#8A1538",
                            borderRadius: "2px",
                            padding: "4px",
                            alignItems: "center",
                            border: "1px solid #f5f5f5",
                            marginTop: "10px",

                            display: "flex",
                            justifyContent: "space-between"
                          }}
                        >
                          {" "}
                          <Typography
                            sx={{
                              fontSize: "14px",
                              width: "90%",
                              display: "-webkit-box",
                              "-webkit-line-clamp": "1",
                              "-webkit-box-orient": "vertical",
                              height: "20px",
                              overflow: "hidden",
                              textOverflow: "ellipsis"

                              // padding: "3px 2px",
                            }}
                          >
                            {card.source_url}
                          </Typography>
                          <Tooltip placement="top" title={tooltipTitle} arrow>
                            <ContentCopyOutlinedIcon
                              sx={{ fontSize: "14px", cursor: "pointer" }}
                              onClick={() => {
                                copyToClipboard(card.source_url);
                              }}
                            />
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography style={{ marginTop: "23px", fontSize: "0.7rem" }}>
                          No Link
                        </Typography>
                      )}
                    </CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        // marginBottom: "10px",
                        justifyContent: "flex-end"
                      }}
                    >
                      {role === "ADMINISTRATOR" && section === "PendingEvents" ? (
                        <Button
                          style={{ ...ButtonCss, width: "90%", margin: "auto" }}
                          onClick={() => detailEvent(card?.id)}
                        >
                          <FormattedMessage
                            id="newMandates.card.eventDetailsButton.title"
                            defaultMessage="Event Details"
                          />{" "}
                        </Button>
                      ) : value === "own" || (role === "ADMINISTRATOR" && value === "own") ? (
                        <Box
                          sx={{
                            display: "flex",
                            gap: "5px",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "auto"
                          }}
                        >
                          <Tooltip title="Delete" placement="top" arrow>
                            <DeleteOutlineOutlinedIcon
                              onClick={() => {
                                setSelectedDeleteEventId(card?.id);
                                setOpen(true);
                              }}
                              style={buttonStyle}
                            />
                          </Tooltip>
                          {card?.isApproved === 0 ||
                          (role === "ADMINISTRATOR" && value === "own") ? (
                            <Tooltip title="Edit" placement="top" arrow>
                              <EditOutlinedIcon
                                style={buttonStyle}
                                onClick={() => {
                                  onEdit(card);
                                }}
                              />
                            </Tooltip>
                          ) : (
                            ""
                          )}

                          <Tooltip title="View" placement="top" arrow>
                            <VisibilityOutlinedIcon
                              onClick={() => detailEvent(card?.id)}
                              style={buttonStyle}
                            />
                          </Tooltip>
                        </Box>
                      ) : (
                        <Button
                          onClick={() => {
                            detailEvent(card?.id);
                          }}
                          style={{
                            // paddingBottom: "0px",
                            backgroundColor: "#eedce1",
                            fontSize: "0.7rem",
                            padding: "5px 12px",
                            borderRadius: "5px"
                          }}
                        >
                          <FormattedMessage
                            id="addEvent.button.readmore"
                            defaultMessage="Read More"
                          />
                        </Button>
                      )}

                      {/* {value === "own" || (role === "ADMINISTRATOR" && value === "own") ? (
                        <Box
                          style={{
                            display: "flex",
                            gap: "5px",
                            justifyContent: "center",
                            margin: "5px 0px",
                          }}
                        >
                          <Tooltip title="Delete" placement="top" arrow>
                            <DeleteOutlineOutlinedIcon
                              onClick={() => {
                                setSelectedDeleteEventId(card?.id);
                                setOpen(true);
                              }}
                              style={buttonStyle}
                            />
                          </Tooltip>
                          {card?.isApproved === 0 ||
                          (role === "ADMINISTRATOR" && value === "own") ? (
                            <Tooltip title="Edit" placement="top" arrow>
                              <EditOutlinedIcon
                                style={buttonStyle}
                                onClick={() => {
                                  onEdit(card);
                                }}
                              />
                            </Tooltip>
                          ) : (
                            ""
                          )}

                          <Tooltip title="View" placement="top" arrow>
                            <VisibilityOutlinedIcon
                              onClick={() => detailEvent(card?.id)}
                              style={buttonStyle}
                            />
                          </Tooltip>
                        </Box>
                      ) : (
                        <Button
                          style={{
                            // paddingBottom: "0px",
                            backgroundColor: "#eedce1",
                            fontSize: "0.7rem",
                            padding: "5px 12px",
                            borderRadius: "5px",
                          }}
                        >
                          Read More
                        </Button>
                      )} */}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ my: 2, bgcolor: "#FFFFFF", p: 2, width: "100%" }}
        >
          <Pagination
            count={totalPages}
            showFirstButton
            showLastButton
            page={page}
            onChange={handlePagination}
          />
        </Grid>

        {dialogOpen && (
          <AddEventsModal
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            role={role}
            page={page}
            country={country}
            value={value}
            section={section}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        )}
        {open == true && (
          <DeleteModal
            visible={open}
            setDeleteModal={setOpen}
            // title={intl.formatMessage({
            //   id: "myUpdates.deleteUpdate.title",
            //   defaultMessage: "Are You Sure To Delete The Updates?",
            // })}
            title={"Are you sure to Delete the Event?"}
            handleDelete={handleDeleteEvent}
          />
        )}
      </ExternalContainer>
    </>
  );
};
Events.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default Events;
