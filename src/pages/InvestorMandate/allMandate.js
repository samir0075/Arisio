import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import ExternalContainer from "src/components/ExternalContainer";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tooltip,
  Typography,
  Skeleton,
  Backdrop,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  allMandatesCount,
  allMandatesDashboardCount,
  deleteIncompleteMandate,
  getInvestorMandates,
} from "src/action/investorMandates";
import styles from "./allMandate.module.css";
import { useRouter } from "next/router";
import EditIcon from "@mui/icons-material/Edit";
import { getCountries } from "src/action/globalApi";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "../../components/DeleteModal";
import { FormattedMessage, useIntl } from "react-intl";
import {
  fetchDomains,
  getEventsQuestions,
  navigateIncompleteMandate,
  newMandate,
} from "src/action/createMandate";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getButtonCss } from "src/utils/util";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ExposureOutlinedIcon from "@mui/icons-material/ExposureOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import PreviewMandate from "../CreateMandates/previewMandate";
import { LoadingButton } from "@mui/lab";
import { mandateActions } from "src/store/createMandateSlice";
import { NoDataComponent } from "src/components/NotFound/notfound";
import SearchIcon from "@mui/icons-material/Search";
import { investorMandatesActions } from "src/store/investorMandatesSlice";
import { toast } from "react-toastify";

const AllMandate = () => {
  const ButtonCss = getButtonCss();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const router = useRouter();
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const [pageCount, setPageCount] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [country, setCountry] = useState("");
  const [technology, setTechnology] = useState("");
  const [selectedMandate, setSelectedMandate] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("Copy link");
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [mandateLoading, setMandateLoading] = useState(false);
  const [backdropLoading, setBackdropLoading] = useState(false);
  const [mandateTitle, setMandateTitle] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(mandateTitle);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(fetchDomains());
    dispatch(
      mandateActions.fetchIncompleteMandate({
        incompleteMandateData: {},
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(mandateTitle);
    }, 500); // Delay in milliseconds

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or query change
    };
  }, [mandateTitle]);

  const countryData = useSelector((state) => state.globalApi.countries);
  const technologyDetails = useSelector((state) => state.newMandate.mandate);

  const handleStatusChange = (event) => {
    setEventStatus(event.target.value);
  };
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  const handleTechnologyChange = (event) => {
    setTechnology(event.target.value);
  };

  const handlePagination = (event, value) => {
    setPage(value);
  };

  const investorMandatesData = useSelector((state) => state?.investorMandates);
  const allMandatesDashboardLoading = useSelector(
    (state) => state?.investorMandates?.allMandatesDashboardLoading
  );

  const investorDashboardMandatesData = useSelector(
    (state) => state?.investorMandates.allMandatesDashboard
  );
  const mandateDetails = useSelector((state) => state?.newMandate?.incompleteMandateData);
  const mandateQuestionList = useSelector((state) => state?.newMandate?.eventQuestions);

  useEffect(() => {
    dispatch(
      getInvestorMandates(investorId, page, country, eventStatus, technology, debouncedQuery)
    );
    // dispatch(allMandatesDashboardCount());
    dispatch(allMandatesCount(investorId, country, eventStatus, technology, debouncedQuery)).then(
      (res) => {
        setPageCount(res?.pagesCount);
      }
    );
  }, [dispatch, investorId, page, country, eventStatus, technology, debouncedQuery]);

  useEffect(() => {
    dispatch(allMandatesDashboardCount());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month.padStart(2, "0");
    const paddedDay = day.padStart(2, "0");

    return `${paddedDay}/${paddedMonth}/${year}`;
  };

  const handleMandateStatus = (mandate) => {
    if (mandate?.is_active === 2 || mandate?.is_active === 3) {
      return;
    } else if (mandate?.is_active === 4) {
      // setMandateLoading(true);
      setBackdropLoading(true);
      dispatch(navigateIncompleteMandate(investorId, mandate?.id)).then((res) => {
        setDialogOpen(true);
        setBackdropLoading(false);
        // setMandateLoading(false);
      });
      dispatch(getEventsQuestions(mandate?.id));
    } else {
      localStorage.setItem("selectedMandateId", mandate?.id);
      router.push("/InvestorMandate/mandateStatus");
    }
  };

  const onEdit = (mandate) => {
    setBackdropLoading(true);

    dispatch(navigateIncompleteMandate(investorId, mandate?.id)).then((res) => {
      router.push(`/MandateCreation?edit=true&id=${mandate?.id}`);
      if (mandate?.is_edited === 0 && mandate?.is_active === 1) {
        toast.warn("Once admin approved only 1 time a mandate can be edited !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      setBackdropLoading(false);
    });
  };

  const onDelete = (record) => {
    setDeleteModal(true);
    setSelectedMandate(record);
  };

  const handleDelete = () => {
    dispatch(deleteIncompleteMandate(investorId, selectedMandate))
      .then(() => {
        dispatch(getInvestorMandates(investorId, page, country, eventStatus, technology));
        dispatch(allMandatesDashboardCount());
        setDeleteModal(false);
      })
      .catch((error) => {
        // Handle error, if any
        console.error("Error deleting mandate:", error);
      });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setTooltipTitle("Copied");
    setTimeout(() => setTooltipTitle("Copy link"), 2000);
  };

  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <>
      <ExternalContainer>
        {allMandatesDashboardLoading ? (
          <Grid container spacing={0.5} padding={0}>
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
                      <Skeleton variant="text" width={50} height={20} />
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
                    <CheckCircleOutlineOutlinedIcon style={{ fontSize: "30px", color: "green" }} />
                    {/* </Typography> */}
                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "green",
                          textAlign: "right",
                        }}
                      >
                        {investorDashboardMandatesData?.approvedCount}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        <FormattedMessage
                          id="allMandate.mandate.top.label2"
                          defaultMessage="Open"
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
                    <CancelOutlinedIcon style={{ fontSize: "30px", color: "#d32f2f" }} />
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
                        {investorDashboardMandatesData?.closedCount}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        {" "}
                        <FormattedMessage
                          id="allMandate.mandate.top.label3"
                          defaultMessage="Closed"
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
                    <ExposureOutlinedIcon style={{ fontSize: "30px", color: "#68D2E8" }} />
                    {/* </Typography> */}
                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "#68D2E8",
                          textAlign: "right",
                        }}
                      >
                        {investorDashboardMandatesData?.pendingCount}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        <FormattedMessage
                          id="allMandate.mandate.top.label4"
                          defaultMessage="Approvals pending"
                        />{" "}
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
                    <BlockOutlinedIcon style={{ fontSize: "30px", color: "#8a1538" }} />
                    {/* </Typography> */}
                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "#8a1538",
                          textAlign: "right",
                        }}
                      >
                        {investorDashboardMandatesData?.rejectedCount}
                      </Typography>
                      <Typography
                        style={{ fontSize: "0.8rem", fontWeight: "600", textDecoration: "lower" }}
                      >
                        <FormattedMessage
                          id="allMandate.mandate.top.label1"
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
                    <EditOutlinedIcon style={{ fontSize: "30px", color: "grey" }} />
                    {/* </Typography> */}
                    <Box>
                      <Typography
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          color: "grey",
                          textAlign: "right",
                        }}
                      >
                        {investorDashboardMandatesData?.incompleteCount}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        <FormattedMessage
                          id="allMandate.mandate.top.label5"
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

        <Grid container justifyContent="start" spacing={1} my={"10px"}>
          <Grid item xs={12} sm={6} md={5} xl={6}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search"
              variant="outlined"
              value={mandateTitle}
              onChange={(e) => {
                setMandateTitle(e.target.value);
              }}
              sx={{
                background: "#FFFFFF",
                height: "40px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.8rem",
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
                  boxSizing: "border-box",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} xl={3}>
            <InputLabel id="demo-simple-select-label">
              {/* <FormattedMessage id="allMandate.filter.label1" defaultMessage="Country" /> */}
            </InputLabel>
            <Select
              style={{ background: "#FFFFFF" }}
              size="small"
              fullWidth
              labelId="single-select-label"
              id="single-select"
              value={technology}
              onChange={handleTechnologyChange}
              displayEmpty
            >
              <MenuItem style={{ fontSize: "0.8rem" }} value="">
                <FormattedMessage
                  id="allMandate.mandate.filter.alltechno"
                  defaultMessage="All Technology"
                />
              </MenuItem>
              {technologyDetails?.map((option) => (
                <MenuItem style={{ fontSize: "0.8rem" }} key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={2} xl={2}>
            <InputLabel id="demo-simple-select-label">
              {/* <FormattedMessage id="allMandate.filter.label1" defaultMessage="Country" /> */}
            </InputLabel>
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
                <FormattedMessage
                  id="allMandate.mandate.filter.allcountry"
                  defaultMessage="All Country"
                />
              </MenuItem>
              {countryData.map((option) => (
                <MenuItem
                  style={{ fontSize: "0.8rem" }}
                  key={option.countryCode}
                  value={option.countryCode}
                >
                  {option.country}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} sm={6} md={2} xl={2}>
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
                  id="allMandate.mandate.filter.allstatus"
                  defaultMessage="All Status"
                />
              </MenuItem>
              <MenuItem style={{ fontSize: "0.8rem" }} value={1}>
                Open
              </MenuItem>
              <MenuItem style={{ fontSize: "0.8rem" }} value={0}>
                Closed
              </MenuItem>
              <MenuItem style={{ fontSize: "0.8rem" }} value={4}>
                Rejected
              </MenuItem>
              <MenuItem style={{ fontSize: "0.8rem" }} value={2}>
                Incomplete
              </MenuItem>
              <MenuItem style={{ fontSize: "0.8rem" }} value={3}>
                Pending
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
        {investorMandatesData?.loading ? (
          <Grid container spacing={2} padding={0}>
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
        ) : investorMandatesData?.allMandates.length > 0 ? (
          <Grid container justifyContent="flex-start">
            {investorMandatesData?.allMandates?.map((mandate) => (
              <Grid key={mandate?.id} xs={12} sm={6} md={3} xl={3}>
                <Card
                  sx={{
                    margin: "4px",
                    borderRadius: "4px",
                    boxShadow:
                      "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                    minHeight: "290px",
                  }}
                >
                  {/* <CardActionArea
                    onClick={() => {
                      handleMandateStatus(mandate);
                    }}
                  > */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Box className={styles.mandateStatus}>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          color: "#fff",
                          fontSize: "0.8rem",
                          margin: "0px 5px",
                          backgroundColor:
                            mandate?.is_active === 1
                              ? "green"
                              : mandate?.is_active === 2
                              ? "grey"
                              : mandate?.is_active === 3
                              ? "#68D2E8 !important"
                              : mandate?.is_active === 4
                              ? "#8a1538"
                              : "#d32f2f !important",
                          padding: "0px 8px",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {mandate?.is_active === 4 ? (
                          <FormattedMessage
                            id="allMandate.mandate.status.label1"
                            defaultMessage="REJECTED"
                          />
                        ) : mandate?.is_active === 1 ? (
                          <FormattedMessage
                            id="allMandate.mandate.status.label2"
                            defaultMessage="OPEN"
                          />
                        ) : mandate?.is_active === 2 ? (
                          <FormattedMessage
                            id="allMandate.mandate.status.label5"
                            defaultMessage="INCOMPLETE"
                          />
                        ) : mandate?.is_active === 3 ? (
                          <FormattedMessage
                            id="allMandate.mandate.status.label4"
                            defaultMessage="PENDING APPROVAL"
                          />
                        ) : (
                          <FormattedMessage
                            id="allMandate.mandate.status.label3"
                            defaultMessage="CLOSED"
                          />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  {/* <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Box className={styles.mandateStatus}>
                      <Typography
                        sx={{
                          fontSize: "0.6rem",
                          color: "white",
                          fontSize: "0.8rem",
                          margin: "0px 5px",
                          backgroundColor: "black",
                          // backgroundColor:
                          //   mandate?.is_active === 1
                          //     ? "green"
                          //     : mandate?.is_active === 2
                          //     ? "grey"
                          //     : mandate?.is_active === 3
                          //     ? "#68D2E8 !important"
                          //     : mandate?.is_active === 4
                          //     ? "#8a1538"
                          //     : "#d32f2f !important",
                          padding: "0px 8px",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        Total pitches :10
                      </Typography>
                    </Box>
                  </Box> */}
                  <CardMedia
                    component="img"
                    height="120"
                    src={
                      mandate?.images?.imageName === "Image-1.png" ||
                      mandate?.images?.imageName === "Image-2.png" ||
                      mandate?.images?.imageName === "Image-3.png" ||
                      mandate?.images?.imageName === "Image-4.png"
                        ? `/Images/${mandate?.images?.imageName}`
                        : `data:image/PNG;base64,${mandate?.images?.imageContent}`
                    }
                    alt="Mandate Image"
                    // sx={{ objectFit: "contain" }}
                  />
                  <CardContent style={{ padding: "10px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: "0px",
                          height: "100%",
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
                          <Tooltip placement="top" title={mandate?.title}>
                            <Typography
                              sx={{
                                color: "#8A1538",
                                fontSize: "0.9rem",
                                fontWeight: "700",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "150px",
                              }}
                              gutterBottom
                            >
                              {/* <Tooltip placement="top" title={mandate?.title}> */}
                              {mandate?.title}
                            </Typography>
                          </Tooltip>
                          <Box>
                            <Tooltip
                              title={
                                (mandate?.is_edited === 0 && mandate?.is_active === 1) ||
                                (mandate?.is_edited === 0 && mandate?.is_active === 3)
                                  ? "Edit"
                                  : "Limit Exhausted"
                              }
                              placement="top"
                            >
                              <span>
                                <EditIcon
                                  sx={{
                                    cursor:
                                      (mandate?.is_edited === 0 && mandate?.is_active === 1) ||
                                      (mandate?.is_edited === 0 && mandate?.is_active === 3)
                                        ? "pointer"
                                        : "not-allowed",
                                    fontSize: "16px",
                                    marginRight: "10px",
                                    color:
                                      (mandate?.is_edited === 0 && mandate?.is_active === 1) ||
                                      (mandate?.is_edited === 0 && mandate?.is_active === 3)
                                        ? "inherit"
                                        : "gray",
                                  }}
                                  onClick={() => {
                                    if (
                                      (mandate?.is_edited === 0 && mandate?.is_active === 1) ||
                                      (mandate?.is_edited === 0 && mandate?.is_active === 3)
                                    ) {
                                      onEdit(mandate);
                                    }
                                  }}
                                />
                              </span>
                            </Tooltip>

                            {mandate.is_active === 2 && "INCOMPLETE" && (
                              <Tooltip title="Delete" placement="top">
                                <DeleteIcon
                                  sx={{ cursor: "pointer", fontSize: "16px" }}
                                  onClick={() => {
                                    onDelete(mandate.id);
                                  }}
                                />
                              </Tooltip>
                            )}
                          </Box>
                        </Stack>
                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              // flexDirection: "column",
                            }}
                          >
                            <EventAvailableIcon
                              style={{ color: "green", fontSize: "16px", marginRight: "2px" }}
                            />

                            <Typography
                              sx={{
                                color: "#6A6A6A",
                                fontSize: "0.7rem",
                                margin: "4px 0px",
                              }}
                            >
                              {/* <FormattedMessage
                            id="newMandates.card.launched.title"
                            defaultMessage="Launched"
                          /> */}
                              <Tooltip
                                placement="top"
                                title={
                                  <FormattedMessage
                                    id="allMandate.mandate.card.content.startingDate"
                                    defaultMessage="Mandate Starting Date"
                                  />
                                }
                              >
                                <span>{formatDate(mandate?.startDate)}</span>
                              </Tooltip>
                            </Typography>
                          </Box>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              // flexDirection: "row",
                            }}
                          >
                            {" "}
                            <EventBusyIcon
                              style={{ color: "#8A1538", fontSize: "16px", marginRight: "2px" }}
                            />
                            <Typography
                              sx={{
                                color: "#6A6A6A",
                                margin: "4px 0px",
                                fontSize: "0.7rem",
                              }}
                            >
                              {/* <FormattedMessage
                            id="newMandates.card.closing.title"
                            defaultMessage="Closing"
                          />{" "} */}
                              <Tooltip
                                placement="top"
                                title={
                                  <FormattedMessage
                                    id="allMandate.mandate.card.content.closingDate"
                                    defaultMessage="Mandate Closing Date"
                                  />
                                }
                              >
                                <span> {formatDate(mandate?.endDate)}</span>
                              </Tooltip>
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      {/* <Divider style={{ margin: "10px", borderWidth: "1.5px" }} variant="middle" /> */}
                      {mandate.is_active === 1 || mandate.is_active === 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",

                            // alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#8A1538",
                              fontWeight: "600",
                              margin: "5px 0",
                            }}
                          >
                            Startup pitches :
                            <span sx={{ fontSize: "11px" }}> {mandate?.pitch_count}</span>
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#8A1538",
                              fontWeight: "600",
                              margin: "5px 0",
                            }}
                          >
                            No pitches
                          </Typography>
                        </Box>
                      )}
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",

                          // alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.7rem", color: "#8A1538", fontWeight: "600" }}
                          gutterBottom
                        >
                          <FormattedMessage
                            id="allMandate.mandate.card.content.text1"
                            defaultMessage="Promote your mandate"
                          />
                        </Typography>
                        <Box style={{ height: "20px" }}>
                          {mandate.is_active === 1 ? (
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                style={{
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "80%",
                                }}
                              >
                                https://dic.hyperthink.io/event_details/{mandate?.eventUrl}
                              </Typography>
                              <Typography>
                                <Tooltip placement="top" title={tooltipTitle} arrow>
                                  <ContentCopyIcon
                                    onClick={() =>
                                      copyToClipboard(
                                        `https://dic.hyperthink.io/event_details/${mandate?.eventUrl}?id=${mandate?.id}`
                                      )
                                    }
                                    style={{ fontSize: "14px", cursor: "pointer" }}
                                  />
                                </Tooltip>
                              </Typography>
                            </Box>
                          ) : mandate.is_active === 0 ? (
                            <Typography style={{ fontSize: "12px" }}>
                              <FormattedMessage
                                id="allMandate.mandate.card.content.text2"
                                defaultMessage="This mandate is closed."
                              />
                            </Typography>
                          ) : mandate.is_active === 4 ? (
                            <Typography style={{ fontSize: "12px" }}>
                              {" "}
                              <FormattedMessage
                                id="allMandate.mandate.card.content.rejected"
                                defaultMessage="This mandate is rejected."
                              />
                            </Typography>
                          ) : (
                            <Typography style={{ fontSize: "12px" }}>
                              <FormattedMessage
                                id="allMandate.mandate.card.content.text3"
                                defaultMessage="This mandate is not yet launched."
                              />
                            </Typography>
                          )}
                          {/* {mandate.is_active === 2 && "INCOMPLETE" ? (
                            <DeleteIcon
                              sx={{ marginBottom: "15px", cursor: "pointer" }}
                              onClick={() => {
                                onDelete(mandate.id);
                              }}
                            />
                          ) : (
                            ""
                          )} */}
                        </Box>
                      </Box>
                    </Box>
                    <Stack
                      sx={{
                        marginTop: "10px",
                      }}
                    >
                      {/* {mandate?.is_active === 4 ? (
                        <LoadingButton
                          size="small"
                          loading={mandateLoading}
                          loadingPosition="end"
                          sx={{
                            ...ButtonCss,
                            "& .MuiLoadingButton-loadingIndicator": {
                              margin: "10px",
                              color: "#8A1538",
                            },
                          }}
                          onClick={() => {
                            handleMandateStatus(mandate);
                          }}
                          disabled={mandate.is_active === 3}
                        >
                          <FormattedMessage
                            id="newMandates.card.mandateDetailsButton.title"
                            defaultMessage="Mandate Details"
                          />{" "}
                        </LoadingButton>
                      ) : ( */}
                      <Button
                        style={ButtonCss}
                        onClick={() => {
                          handleMandateStatus(mandate);
                        }}
                        // disabled={mandate.is_active === 3}
                      >
                        <FormattedMessage
                          id="newMandates.card.mandateDetailsButton.title"
                          defaultMessage="Mandate Details"
                        />{" "}
                      </Button>
                      {/* )} */}
                    </Stack>
                  </CardContent>
                  {/* </CardActionArea> */}
                </Card>
              </Grid>
            ))}
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ my: 2, bgcolor: "#FFFFFF", p: 2 }}
            >
              {investorMandatesData?.allMandates.length > 0 ? (
                <Pagination
                  size={isSmall ? "small" : "medium"}
                  count={pageCount}
                  showFirstButton={!isSmall}
                  showLastButton={!isSmall}
                  page={page}
                  onChange={handlePagination}
                />
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        ) : (
          <NoDataComponent />
        )}
      </ExternalContainer>

      {deleteModal && (
        <DeleteModal
          visible={deleteModal}
          setDeleteModal={setDeleteModal}
          title="Are You Sure To Delete The Mandate?"
          handleDelete={handleDelete}
        />
      )}
      {dialogOpen && (
        <PreviewMandate
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          previewDetails={mandateDetails}
          eventQuestionList={mandateQuestionList}
        />
      )}
      {backdropLoading && (
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={backdropLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};
AllMandate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default AllMandate;
