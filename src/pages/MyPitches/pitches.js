// import React from "react";
// import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";

// const Pitches = () => {
//   return <div>Pitches</div>;
// };
// Pitches.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
// export default Pitches;

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Unstable_Grid2 as Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  StepConnector,
  StepIcon,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { seeNewMandate } from "src/action/seeNewMandate";
import styles from "./myPitches.module.css";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import { useRouter } from "next/navigation";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { allMandatesDashboardCountStartup, pitchMandateCount, pitches } from "src/action/pitches";
import { makeStyles } from "@mui/styles";
import NoDataMsg from "src/components/NoDataMsg";
import { FormattedMessage } from "react-intl";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { getButtonCss } from "src/utils/util";
import ExternalContainer from "src/components/ExternalContainer";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckIcon from "@mui/icons-material/Check";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { getCountries, startupSubscriptionLimitCheck } from "src/action/globalApi";
import { SWEETALERT } from "src/components/sweetalert2";

const useStyles = makeStyles({
  circle: {
    fill: "#6C193E", // Change circle color to green
  },
});

const CustomStepIcon = (props) => {
  const classes = useStyles();
  const { active, completed } = props;

  return (
    <StepIcon
      {...props}
      classes={{
        active: classes.circle,
        completed: classes.circle,
      }}
      active={active}
      completed={completed}
    />
  );
};

const steps = [
  <Typography style={{ fontSize: "0.7rem" }} key={1}>
    <FormattedMessage
      id="seeMandates.pitchSuccess.stepper.applicationSubmitted.title"
      defaultMessage="Application Submitted."
    />
  </Typography>,
  <Typography style={{ fontSize: "0.7rem" }} key={1}>
    <FormattedMessage
      key={1}
      id="seeMandates.pitchSuccess.stepper.investorsReview.title"
      defaultMessage="Investors Review."
    />
  </Typography>,
  <Typography style={{ fontSize: "0.7rem" }} key={1}>
    <FormattedMessage
      key={1}
      id="seeMandates.pitchSuccess.stepper.investorsAction.title"
      defaultMessage="Investor's Action."
    />
  </Typography>,
];

const Pitches = (props) => {
  const ButtonCss = getButtonCss();
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedMandateId, setSelectedMandateId] = useState({});
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [country, setCountry] = useState("");

  // useEffect(() => {
  //   dispatch(getCountries());
  //   dispatch(pitches());
  // }, [dispatch]);

  /*
   * API CALL
   */

  const storedUserDetails = localStorage.getItem("userDetails");
  let startupId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const userId = startupId?.id;
  startupId = startupId?.startupId;

  const countryData = useSelector((state) => state.globalApi.countries);

  const handleStatusChange = (event) => {
    setEventStatus(event.target.value);
  };
  // const handleCountryChange = (event) => {
  //   setCountry(event.target.value);
  // };

  const mandateModule = "pitches_limit";

  const [isAlertShown, setIsAlertShown] = useState(false);

  useEffect(() => {
    let isMounted = true; // To check if the component is still mounted
    let requestCounter = 0; // Track the number of API requests

    const checkStartupSubscriptionLimit = async () => {
      const currentRequest = ++requestCounter; // Increment the request counter

      dispatch(startupSubscriptionLimitCheck(userId, mandateModule)).then((res) => {
        if (isMounted && currentRequest === requestCounter) {
          if (res?.status === false && !isAlertShown) {
            setIsAlertShown(true);
            SWEETALERT({
              text: "Your pitching limit has been reached. Please upgrade your plan to continue!",
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
  }, [dispatch, isAlertShown, userId, mandateModule]);

  useEffect(() => {
    dispatch(pitches(startupId, page, eventStatus));
    // dispatch(allMandatesDashboardCountStartup());
    dispatch(pitchMandateCount(startupId, page, eventStatus)).then((res) => {
      setPageCount(res?.pagesCount);
    });
  }, [dispatch, startupId, page, eventStatus]);

  useEffect(() => {
    dispatch(allMandatesDashboardCountStartup());
  }, [dispatch]);

  /*
   *UseSelector used to get data from redux store
   */
  let pitchData = useSelector((state) => state?.pitchesSlice);
  let loading = useSelector((state) => state?.pitchesSlice?.loading);
  let pitchDataCount = useSelector((state) => state?.pitchesSlice?.pitchesCount?.count);
  let allPitchesDashboardCount = useSelector(
    (state) => state?.pitchesSlice.allMandatesDashboardStartup
  );
  const countLoading = useSelector((state) => state?.pitchesSlice?.pitchCountLoading);

  const recordsPerPage = 12;
  const totalRecords = pitchDataCount || 0;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const onEdit = (mandate) => {
    console.log(mandate);
    setSelectedMandateId(mandate?.investorEvent?.id);
    localStorage.setItem("pitchId", JSON.stringify(mandate?.id));
    mandate?.currentStatus === "incomplete"
      ? router.push("./MyPitches/Pitching")
      : router.push("./MyPitches/pitchSubmission");
  };

  /**
   * Used UseEffect Hooks to store the data of Selected MandateId in local Storage.
   */
  useEffect(() => {
    localStorage.setItem("selectedMandateId", JSON.stringify(selectedMandateId));
  }, [selectedMandateId]);

  const handlePagination = (event, value) => {
    setPage(value);
  };
  const lang = localStorage.getItem("lang");

  return (
    <>
      <ExternalContainer>
        {countLoading ? (
          <Grid style={{ marginBottom: "20px" }} container spacing={0.5} padding={0}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Grid key={index} item xs={12} sm={6} md={2.4} xl={2.4}>
                <Card
                  style={{
                    margin: "2px",
                    padding: "7px",
                    borderRadius: "4px",
                    boxShadow:
                      "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <CardContent
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Skeleton variant="circular" width={30} height={30} />
                    <Box>
                      <Skeleton variant="number" width={30} height={20} />
                      <Skeleton variant="text" width={80} height={15} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box style={{ marginBottom: "20px" }}>
            <Grid container justifyContent="start" spacing={1}>
              {/* <Grid item xs={12} sm={6} md={2} xl={2}>
                <Card
                  style={{
                    padding: "0px",
                    borderRadius: "4px",
                    boxShadow:
                      "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <CardContent
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleOutlineOutlinedIcon style={{ fontSize: "30px", color: "green" }} />

                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "green",
                          textAlign: "right",
                        }}
                      >
                        {allPitchesDashboardCount?.readyToPitch}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        Ready to pitch{" "}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid> */}
              <Grid item xs={12} sm={6} md={2.4} xl={2.4}>
                <Card
                  style={{
                    padding: "0px",
                    borderRadius: "4px",
                    boxShadow:
                      "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <CardContent
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* <Typography
                      style={{ fontSize: "0.9rem", fontWeight: "600", textAlign: "center" }}
                    > */}
                    <VisibilityOutlinedIcon style={{ fontSize: "30px", color: "#f50" }} />
                    {/* </Typography> */}
                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "#f50",
                          textAlign: "right",
                        }}
                      >
                        {allPitchesDashboardCount?.watchlistedPitch}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        <FormattedMessage
                          id="seeNewMandate.top.watchList"
                          defaultMessage="Watchlisted"
                        />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4} xl={2.4}>
                <Card
                  style={{
                    padding: "0px",
                    borderRadius: "4px",
                    boxShadow:
                      "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <CardContent
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* <Typography
                      style={{ fontSize: "0.9rem", fontWeight: "600", textAlign: "center" }}
                    > */}
                    <CheckIcon style={{ fontSize: "30px", color: "#87d068" }} />
                    {/* </Typography> */}
                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "#87d068",
                          textAlign: "right",
                        }}
                      >
                        {allPitchesDashboardCount?.submittedPitch}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        <FormattedMessage
                          id="seeNewMandate.top.submitted"
                          defaultMessage="Submitted"
                        />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4} xl={2.4}>
                <Card
                  style={{
                    padding: "0px",
                    borderRadius: "4px",
                    boxShadow:
                      "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <CardContent
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* <Typography
                      style={{ fontSize: "0.9rem", fontWeight: "600", textAlign: "center" }}
                    > */}
                    <CelebrationIcon style={{ fontSize: "30px", color: "#819633" }} />
                    {/* </Typography> */}
                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "#819633",
                          textAlign: "right",
                        }}
                      >
                        {allPitchesDashboardCount?.shortlistedPitch}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        {" "}
                        <FormattedMessage
                          id="seeNewMandate.top.shortlisted"
                          defaultMessage="Shortlisted"
                        />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4} xl={2.4}>
                <Card
                  style={{
                    padding: "0px",
                    borderRadius: "4px",
                    boxShadow:
                      "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <CardContent
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* <Typography
                      style={{ fontSize: "0.9rem", fontWeight: "600", textAlign: "center" }}
                    > */}
                    <BlockOutlinedIcon style={{ fontSize: "30px", color: "#cd201f" }} />
                    {/* </Typography> */}
                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "#d32f2f",
                          textAlign: "right",
                        }}
                      >
                        {allPitchesDashboardCount?.rejectedPitch}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        {" "}
                        <FormattedMessage
                          id="seeNewMandate.top.rejected"
                          defaultMessage="Rejected"
                        />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4} xl={2.4}>
                <Card
                  style={{
                    padding: "0px",
                    borderRadius: "4px",
                    boxShadow:
                      "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <CardContent
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* <Typography
                      style={{ fontSize: "0.9rem", fontWeight: "600", textAlign: "center" }}
                    > */}
                    <EditOutlinedIcon style={{ fontSize: "30px", color: "#2db7f5" }} />
                    {/* </Typography> */}
                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "#2db7f5",
                          textAlign: "right",
                        }}
                      >
                        {allPitchesDashboardCount?.incompletePitch}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        <FormattedMessage
                          id="seeNewMandate.top.incomplete"
                          defaultMessage="Incomplete"
                        />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        <Box
        // component="main"
        // sx={{
        //   flexGrow: 1,
        //   p: 2,
        //   background: "rgba(65, 148, 179,0.1) !important",
        // }}
        >
          <Grid container justifyContent="start" spacing={1}>
            <Grid item xs={6} sm={6} md={2} xl={2}>
              <InputLabel id="demo-simple-select-label">
                {/* <FormattedMessage id="allMandate.filter.label2" defaultMessage="Status" /> */}
              </InputLabel>
              <Select
                style={{ background: "#FFFFFF", fontSize: "0.8rem" }}
                size="small"
                fullWidth
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={eventStatus}
                onChange={handleStatusChange}
                displayEmpty
              >
                <MenuItem style={{ fontSize: "0.8rem" }} value="">
                  <FormattedMessage
                    id="seeNewMandate.filter.allStatus"
                    defaultMessage="All Status"
                  />
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value={1}>
                  <FormattedMessage
                    id="seeNewMandate.filter.shortlist"
                    defaultMessage="Shortlisted"
                  />
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value={2}>
                  <FormattedMessage
                    id="seeNewMandate.filter.watchListed"
                    defaultMessage="Watchlisted"
                  />
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value={3}>
                  <FormattedMessage id="seeNewMandate.filter.rejected" defaultMessage="Rejected" />
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value={4}>
                  <FormattedMessage
                    id="seeNewMandate.filter.incomplete"
                    defaultMessage="Incomplete"
                  />
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value={5}>
                  <FormattedMessage
                    id="seeNewMandate.filter.submitted"
                    defaultMessage="Submitted"
                  />
                </MenuItem>
                {/* <MenuItem style={{ fontSize: "0.8rem" }} value={6}>
                    Ready to pitch
                  </MenuItem> */}
              </Select>
            </Grid>
          </Grid>

          {loading ? (
            <Grid container spacing={0.5} padding={0}>
              {Array.from(new Array(12)).map((_, index) => (
                <Grid key={index} item xs={12} sm={6} md={3} xl={3}>
                  <Card
                    style={{
                      margin: "4px",
                      borderRadius: "4px",
                      boxShadow:
                        "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                    }}
                  >
                    <Skeleton variant="rectangular" height={120} />
                    <CardContent>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton
                        variant="rectangular"
                        height={25}
                        width="100%"
                        style={{ marginTop: "10px", borderRadius: "8px" }} // Add border radius here
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : pitchData?.pitches?.length > 0 ? (
            <Container style={{ padding: "0px" }}>
              <Grid container justifyContent="flex-start">
                {pitchData?.pitches?.map((pitch) => (
                  <Grid key={pitch?.id} xs={12} sm={6} md={3} xl={3}>
                    <Card
                      style={{
                        margin: "10px 4px",
                        borderRadius: "4px",
                        boxShadow:
                          "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                        height: "325px",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Box className={styles.mandateStatus}>
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              color: "#fff",
                              fontSize: "0.8rem",
                              margin: "0px 5px",
                              backgroundColor:
                                pitch?.investorEvent?.is_active === 0
                                  ? "#8a1538 !important"
                                  : "green !important",
                              padding: "0px 8px",
                              borderRadius: "5px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {pitch?.investorEvent?.is_active === 0 ? (
                              <FormattedMessage
                                id="pitches.status.closed"
                                defaultMessage="CLOSED"
                              />
                            ) : (
                              <FormattedMessage id="pitches.status.open" defaultMessage="OPEN" />
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      <CardMedia
                        component="img"
                        height="120"
                        src={
                          pitch?.investorEvent?.images?.imageName === "Image-1.png" ||
                          pitch?.investorEvent?.images?.imageName === "Image-2.png" ||
                          pitch?.investorEvent?.images?.imageName === "Image-3.png" ||
                          pitch?.investorEvent?.images?.imageName === "Image-4.png"
                            ? `/Images/${pitch?.investorEvent?.images?.imageName}`
                            : `data:image/PNG;base64,${pitch?.investorEvent?.images?.imageContent}`
                        }
                        alt="Mandate Image"
                      />

                      <CardContent style={{ padding: "10px" }}>
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "0px",
                            // alignItems: "center",
                          }}
                        >
                          <Stack
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.9rem",
                                color: "#8A1538",
                                fontWeight: "700",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "90%",
                              }}
                              gutterBottom
                            >
                              <Tooltip placement="top" title={pitch?.investorEvent?.title}>
                                {pitch?.investorEvent?.title}
                              </Tooltip>
                            </Typography>
                          </Stack>
                          <Tooltip title={pitch?.investorEvent?.Mandate_country} placement="top">
                            <Typography
                              style={{
                                fontSize: "0.7rem",
                                color: "#6A6A6A",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "90%",
                              }}
                              variant="body2"
                            >
                              {pitch?.investorEvent?.Mandate_country}
                            </Typography>
                          </Tooltip>
                        </Box>
                        <Stack>
                          <Stack
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              style={{
                                fontSize: "0.8rem",
                                color: "#6A6A6A",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "40%",
                              }}
                              variant="body2"
                            >
                              <Tooltip
                                placement="top"
                                title={pitch?.investorEvent?.investor?.organization}
                              >
                                {pitch?.investorEvent?.investor?.organization}
                              </Tooltip>
                            </Typography>
                            <Typography
                              style={{ fontSize: "0.7rem", color: "#6A6A6A" }}
                              variant="body2"
                            >
                              {pitch?.appliedDays <= 0 ? (
                                <FormattedMessage
                                  id="seeMandates.appliedStatus.today.title"
                                  defaultMessage="Applied Today"
                                />
                              ) : (
                                // `Applied ${parseInt(pitch?.appliedDays)} days ago`
                                <FormattedMessage
                                  id="seeMandates.appliedStatus.dayAgo.title"
                                  defaultMessage="Applied {days} days ago"
                                  values={{ days: parseInt(pitch?.appliedDays) }}
                                />
                              )}
                            </Typography>
                          </Stack>
                          <Typography
                            style={{ fontSize: "0.7rem", color: "#6A6A6A" }}
                            variant="body2"
                          >
                            <FormattedMessage
                              id="pitches.applicationStatus"
                              defaultMessage="Status:"
                            />

                            {pitch?.currentStatus === "accepted" ? (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                  color: "#819633",
                                  marginLeft: "3px",
                                }}
                              >
                                <FormattedMessage
                                  id="pitches.Shortlisted"
                                  defaultMessage="Shortlisted"
                                />
                              </span>
                            ) : pitch?.currentStatus === "applied" ? (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                  color: "#87d068",
                                  marginLeft: "3px",
                                }}
                              >
                                <FormattedMessage
                                  id="pitches.Submitted"
                                  defaultMessage="Submitted"
                                />
                              </span>
                            ) : pitch?.currentStatus === "incomplete" ? (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                  color: "#2db7f5",
                                  marginLeft: "3px",
                                }}
                              >
                                <FormattedMessage
                                  id="pitches.Incomplete"
                                  defaultMessage="Incomplete"
                                />
                              </span>
                            ) : pitch?.currentStatus === "watch" ? (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                  color: "#f50",
                                  marginLeft: "3px",
                                }}
                              >
                                <FormattedMessage
                                  id="pitches.Watchlisted"
                                  defaultMessage="Watchlisted"
                                />
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: "600",
                                  color: "#d32f2f",
                                  marginLeft: "3px",
                                }}
                              >
                                <FormattedMessage id="pitches.Rejected" defaultMessage="Rejected" />
                              </span>
                            )}
                          </Typography>
                        </Stack>

                        <Box
                          sx={{
                            fontSize: "12px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "8px",
                          }}
                        >
                          <Stepper
                            activeStep={
                              pitch?.currentStatus === "accepted"
                                ? 2
                                : pitch?.currentStatus === "applied"
                                ? 1
                                : pitch?.currentStatus === "incomplete"
                                ? -1
                                : 3
                            }
                            alternativeLabel
                            connector={
                              <StepConnector
                                sx={{
                                  position: "absolute",
                                  top: "12px",

                                  ...(lang === "en"
                                    ? { left: `calc(-50% + 20px)`, right: `calc(50% + 20px)` }
                                    : { left: `calc(50% + 20px)`, right: `calc(-50% + 20px)` }),
                                }}
                              />
                            }
                          >
                            {steps.map((label) => (
                              <Step key={label}>
                                <StepLabel
                                  StepIconProps={{
                                    style: { transform: "scale(0.75)" }, // Adjust the scale as needed
                                  }}
                                  StepIconComponent={CustomStepIcon}
                                  sx={{
                                    "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
                                      marginTop: "0px",
                                    },
                                  }}
                                >
                                  {label}
                                </StepLabel>
                              </Step>
                            ))}
                          </Stepper>
                        </Box>
                        <Stack>
                          {pitch?.investorEvent?.isExpired === 1 &&
                          pitch?.currentStatus === "incomplete" ? (
                            <Button>
                              <FormattedMessage
                                id="pitches.ViewDetails"
                                defaultMessage="View Details"
                              />
                            </Button>
                          ) : (
                            <Button
                              style={ButtonCss}
                              onClick={() => {
                                onEdit(pitch);
                              }}
                            >
                              <FormattedMessage
                                id="pitches.ViewDetails"
                                defaultMessage="View Details"
                              />

                              <span
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <ArrowRightAltIcon />
                              </span>
                            </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
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
              </Grid>
            </Container>
          ) : (
            <NoDataMsg message={"There are no mandates to show."} />
          )}
        </Box>
      </ExternalContainer>
    </>
  );
};

Pitches.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Pitches;
