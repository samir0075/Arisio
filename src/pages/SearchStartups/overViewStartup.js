/* eslint-disable react-hooks/rules-of-hooks */
import React, { StrictMode, use, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { format } from "date-fns";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Paper,
  Rating,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from "next/router";
import { TabContext, TabPanel } from "@mui/lab";
import {
  getCompanyFundedHistoryGraph,
  getEmployeeHistoryGraph,
  getFullDescriptionOfStartUp,
  getSelectedStartUpsMandatesData,
  getPieChartGraph,
} from "src/action/searchStartups";
import ConfirmInvitePitchModal from "./confirmInvitePitchModal";
import { FormattedMessage, useIntl } from "react-intl";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LanguageIcon from "@mui/icons-material/Language";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import PhoneIcon from "@mui/icons-material/Phone";
import MapIcon from "@mui/icons-material/Map";
import { styled } from "@mui/material/styles";
// import { useDrawingArea } from "@mui/x-charts/hooks";

// import { Gauge } from "@mui/x-charts/Gauge";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
// import { Gauge } from "@mui/x-charts";
import dynamic from "next/dynamic";
import { border, fontSize, margin } from "@mui/system";
import millify from "millify";
import { searchStartUpsActions } from "src/store/searchStartupsSlice";
import { formattedDate } from "src/utils/util";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

const Gauge = dynamic(() => import("@mui/x-charts").then((mod) => mod.Gauge), { ssr: false });
const BarChart = dynamic(() => import("@mui/x-charts").then((mod) => mod.BarChart), { ssr: false });
const LineChart = dynamic(() => import("@mui/x-charts").then((mod) => mod.LineChart), {
  ssr: false,
});
const PieChart = dynamic(() => import("@mui/x-charts").then((mod) => mod.PieChart), { ssr: false });
const useDrawingArea = dynamic(() => import("@mui/x-charts").then((mod) => mod.useDrawingArea), {
  ssr: false,
});

const OverViewStartUp = () => {
  const theme = useTheme();
  const intl = useIntl();
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const dispatch = useDispatch();
  const [value, setValue] = useState("1");
  const [openModal, setOpenModal] = useState(false);
  const [selectedStartUpId, setSelectedStartUpId] = useState(0);
  const [mandatesList, setMandatesList] = useState([]);
  const startUpsData = useSelector((state) => state?.searchStartUps?.singleStartUpData?.company);

  const startUpsDataType = useSelector((state) => state?.searchStartUps?.singleStartUpData);

  const companyId = startUpsDataType?.company?.id;

  const employeeHistoryGraph = useSelector((state) => state?.searchStartUps?.employeeCountHistory);
  const companyFundHistoryGraph = useSelector(
    (state) => state?.searchStartUps?.employeeCompanyFundHistory
  );

  const pieChartGraphData = useSelector((state) => state?.searchStartUps.pieChartGraph.data);

  const fundingInvestorName = companyFundHistoryGraph.map(
    (item) => item.funding_milestone_investors
  );

  const employeeHistoryCount = employeeHistoryGraph.map((item) => parseInt(item?.emp_count));
  // const employeeHistoryCountDate = employeeHistoryGraph.map((item) => item?.date);
  const employeeHistoryCountDate = employeeHistoryGraph.map((item) => {
    const date = new Date(item?.date);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Format the date to "MMM YYYY"
    const formattedDate = `${months[date.getMonth()]} ${date.getFullYear()}`;

    return formattedDate;
  });

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const startUpsStage = useSelector(
    (state) => state?.searchStartUps?.singleStartUpData?.startupStage
  );

  const startUpsLogo = useSelector(
    (state) => state?.searchStartUps?.singleStartUpData?.StartupLogo
  );
  const listOfMandates = useSelector(
    (state) => state?.searchStartUps?.listOfSelectedStartUpMandates?.mandates
  )?.filter((r) => r?.isExpired === 0);
  const [checkedMandates, setCheckedMandates] = useState([]);
  const startUpID = localStorage.getItem("startUpId");
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;

  const investorId = userDetails?.investorId;
  const userId = userDetails?.id;
  const userRole = userDetails?.role;
  const roleConfirm = userRole === "ADMINISTRATOR" ? "admin" : "investor";

  /**Function with loop to make the list into arrays of 8 mandates per row*/
  const defaultArray = (array, size) => {
    const newArray = [];
    for (let i = 0; i < array?.length; i += size) {
      newArray?.push(array?.slice(i, i + size));
    }
    return newArray;
  };

  /**  Chunk the list of mandates into arrays of 6 mandates per row */
  const rowsOfMandates = defaultArray(listOfMandates, 7);

  const handleChange = (event, mandateId) => {
    if (event?.target?.checked) {
      /** If checkbox is checked, add mandateId to checkedMandates */
      setCheckedMandates((prevState) => [...prevState, mandateId]);
    } else {
      /** If checkbox is unchecked, remove mandateId from checkedMandates */
      setCheckedMandates((prevState) => prevState.filter((id) => id !== mandateId));
    }
  };

  const handelSubmit = (checkedMandatesList, startUpsId) => {
    setOpenModal(true);
    setSelectedStartUpId(startUpsId);
    setMandatesList(checkedMandatesList);
  };

  /** function used for switching back to the parent component */
  const goBack = () => {
    router.push({
      pathname: "/SearchStartups",
      query: { filter: true }, // Replace with your dynamic prop value
    });
    dispatch(
      searchStartUpsActions.fetchFullDescriptionOfStartUp({
        singleStartUpData: {},
      })
    );
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === "2") {
      setCheckedMandates([]);
    }
    setValue(newValue);
  };

  // useEffect(() => {
  //   dispatch(getFullDescriptionOfStartUp(startUpID, investorId));
  // }, []);

  useEffect(() => {
    dispatch(getSelectedStartUpsMandatesData(startUpID, userId));
    dispatch(getEmployeeHistoryGraph(companyId, roleConfirm));
    dispatch(getCompanyFundedHistoryGraph(companyId, roleConfirm));
    dispatch(getPieChartGraph(companyId, roleConfirm));
  }, [companyId, dispatch, investorId, roleConfirm, startUpID, userId]);

  const cardCss = {
    padding: "0px",
    borderRadius: "5px",
    border: "1px solid #7C7373",
    boxShadow: "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
  };
  const cardContentCss = {
    padding: "5px 0px",
    borderRadius: "5px",
    textAlign: "center",
    border: "1px solid #7C7373",
  };

  const formattedData = companyFundHistoryGraph?.length
    ? companyFundHistoryGraph?.map((item) => ({
        month: item.funded_on,
        amount: parseInt(`${item?.funding_milestone_amount_usd}$`, 10) || 0,
        // amount: item?.funding_milestone_amount_usd,
        // investor: item?.funding_milestone_investors || "",
      }))
    : [];

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          background: "rgba(65, 148, 179,0.1) !important",
        }}
      >
        <Container maxWidth="xl">
          <Grid container onClick={goBack}>
            <CancelIcon
              sx={{ fontSize: "1.5rem" }}
              color="disabled"
              style={{ cursor: "pointer" }}
            />
          </Grid>
          <Grid container>
            <TabContext value={value}>
              <Grid
                item
                style={{ marginTop: "30px" }}
                xs={12}
                md={12} // This ensures the element takes 8 out of 12 columns on medium and larger screens
                sx={{ mt: isSmallScreen ? 2 : 4 }}
              >
                <Paper
                  elevation={8}
                  style={{
                    padding: 4,
                  }}
                >
                  <Box
                    style={{
                      // marginTop: "8px",
                      padding: "10px",
                      borderBottom: "0.5px solid #e1e1e1",
                      display: "flex",
                      // height: isSmallScreen ? "150px" : "100px",
                      flexDirection: "row",
                    }}
                  >
                    {/* <Grid item xs={isSmallScreen ? 3 : 1.5}> */}
                    <Grid
                      container
                      alignItems={isSmallScreen ? "center" : "flex-start"}
                      // padding={"0 10px"}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        md={2}
                        xl={2}
                        textAlign={isSmallScreen ? "center" : "left"}
                      >
                        <CardMedia
                          component="img"
                          height="auto"
                          src={
                            startUpsLogo !== undefined
                              ? `data:image/png;base64,${startUpsLogo}`
                              : `/Images/company_default.png`
                          }
                          alt="green iguana"
                          sx={{
                            width: startUpsLogo !== undefined ? "100px" : "100px",
                            border: "0.5px solid #e1e1e1",
                            // borderRadius: "50%",
                            // marginLeft: "10px",
                            marginLeft: isSmallScreen ? "0" : "10px",
                            margin: isSmallScreen ? "0 auto" : "initial",
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={10}
                        md={10}
                        xl={10}
                        textAlign={isRTL ? "right" : isSmallScreen ? "center" : "left"}
                      >
                        <Box>
                          <Typography
                            style={{
                              fontFamily: "Calibri",
                              fontWeight: 600,
                              fontSize: "1.25rem",
                            }}
                          >
                            {startUpsData?.name}{" "}
                            {startUpsDataType?.type !== "crunchbase" ? (
                              <span>
                                <Tooltip title="Registered" placement="top">
                                  <DoneOutlineRoundedIcon
                                    style={{ color: "green", fontSize: "17px" }}
                                  />
                                </Tooltip>
                              </span>
                            ) : (
                              ""
                            )}
                          </Typography>
                          {/* <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end"
                            }}
                          >
                            <Rating
                              readOnly
                              name="text-feedback"
                              value={4.4}
                              size="medium"
                              precision={0.1}
                            />
                            <Typography sx={{ fontSize: "11px" }}>
                              Score as per Crunch base Data{" "}
                            </Typography>
                          </Box> */}
                        </Box>

                        <Typography
                          style={{
                            fontFamily: "Calibri",
                            fontWeight: 600,
                            fontSize: "1rem",
                            // marginTop: "5px",
                            color: "#808080",
                          }}
                        >
                          {startUpsData?.city !== null
                            ? startUpsData?.city
                            : startUpsDataType?.countryName}
                        </Typography>
                        {startUpsData?.score_card !== 0 &&
                          startUpsData?.score_card !== undefined && (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: isSmallScreen ? "center" : "flex-start",
                                paddingTop: "5px",
                              }}
                            >
                              <Tooltip title={`${(startUpsData?.score_card / 2).toFixed(1)} / 5`}>
                                <Rating
                                  readOnly
                                  name="text-feedback"
                                  value={startUpsData?.score_card / 2}
                                  size="small"
                                  precision={0.1}
                                />
                                <Typography sx={{ fontSize: "11px" }}>
                                  <FormattedMessage
                                    id="overViewStartup.heading.ranking"
                                    defaultMessage="(Ranking according to the Arisio AI Model)"
                                  />{" "}
                                </Typography>
                              </Tooltip>
                            </Box>
                          )}
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Tabs
                      value={value}
                      onChange={handleTabChange}
                      style={{
                        cursor: "pointer",
                        marginLeft: { xs: "5px", sm: "5px", md: "30px", lg: "30px" },
                        marginRight: isRTL ? "30px" : "0px",
                        marginBottom: "-7px",
                      }}
                      TabIndicatorProps={{
                        sx: {
                          height: 4, // Adjust this value to increase the height of the tab line
                          marginBottom: "5px",
                        },
                      }}
                      centered
                    >
                      <Tab
                        label={intl.formatMessage({
                          id: "overViewStartup.tab1.label",
                          defaultMessage: "OVERVIEW",
                        })}
                        value="1"
                        sx={{
                          fontFamily: "Calibri",
                          fontWeight: 900,
                          marginRight: "13px",
                          fontSize: { xs: "14px", sm: "15px", md: "17px", lg: "17px" },
                        }}
                      />

                      <Tab
                        label={
                          userRole === "ADMINISTRATOR"
                            ? intl.formatMessage({
                                id: "overViewStartup.tab2.Heading1",
                                defaultMessage: "RECOMMEND FOR?",
                              })
                            : intl.formatMessage({
                                id: "overViewStartup.tab2.Heading2",
                                defaultMessage: "INVITE TO PITCH",
                              })
                        }
                        value="3"
                        sx={{
                          fontFamily: "Calibri",
                          fontWeight: 900,
                          fontSize: { xs: "14px", sm: "15px", md: "17px", lg: "17px" },
                          marginRight: isRTL ? "24px" : "0px",
                        }}
                      />
                    </Tabs>
                  </Box>
                </Paper>
              </Grid>
              <Grid item direction="row" style={{ marginTop: "10px" }} xs={12} md={12}>
                <TabPanel value="1" style={{ padding: 0 }}>
                  <Paper elevation={16} sx={{ padding: 2 }}>
                    <Grid container sx={{ marginTop: "10px", padding: "0px 0px" }} gap={2}>
                      <Grid
                        style={{
                          borderRadius: "8px",
                          boxShadow: "rgb(111 106 108 / 58%) 0px 0px 6px",
                          padding: "15px 10px",
                          background: "#efefef52",
                          // margin: "5px",
                        }}
                        item
                        xs={12}
                        sm={12}
                        md={5.85}
                        xl={5.85}
                      >
                        <Typography
                          style={{ textAlign: "center", fontSize: "1rem", fontWeight: "600" }}
                        >
                          <FormattedMessage
                            id="overViewStartup.heading.about"
                            defaultMessage="About"
                          />
                        </Typography>
                        <Typography style={{ fontSize: "0.8rem" }}>
                          {startUpsData?.description ? startUpsData?.description : "-"}
                        </Typography>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <MapIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.7rem", fontWeight: "600" }}>
                            {startUpsDataType?.countryName ? startUpsDataType?.countryName : "-"}
                          </Typography>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <LocationOnIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.7rem", fontWeight: "600" }}>
                            {startUpsData?.city ? startUpsData?.city : "-"}
                          </Typography>
                        </Box>

                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <GroupsIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            {startUpsData?.employeeCount ? startUpsData?.employeeCount : "-"}
                          </Typography>
                        </Box>

                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <LanguageIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            <Link
                              style={{ cursor: "pointer" }}
                              href={`${startUpsData?.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {startUpsData?.website ? startUpsData?.website : "-"}
                            </Link>
                          </Typography>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <LocalActivityIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            <Tooltip title="Categories" placement="top">
                              {startUpsData?.categories ? startUpsData?.categories : "-"}
                            </Tooltip>
                          </Typography>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <FacebookIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            <Link
                              style={{ cursor: "pointer" }}
                              href={`${startUpsData?.facebook_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {startUpsData?.facebook_url ? startUpsData?.facebook_url : "-"}
                            </Link>
                          </Typography>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <LinkedInIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            <Link
                              style={{
                                cursor: "pointer",
                                wordBreak: "break-all",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                              href={`${startUpsData?.linkedin_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {startUpsData?.linkedin_url ? startUpsData?.linkedin_url : "-"}
                            </Link>
                          </Typography>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <XIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            <Link
                              style={{ cursor: "pointer" }}
                              href={`${startUpsData?.twitter_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {startUpsData?.twitter_url ? startUpsData?.twitter_url : "-"}
                            </Link>
                          </Typography>
                        </Box>

                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <YouTubeIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            <Link
                              style={{
                                cursor: "pointer",
                                wordBreak: "break-all",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                              href={`${startUpsData?.youtube_link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {startUpsData?.youtube_link ? startUpsData?.youtube_link : "-"}
                            </Link>
                          </Typography>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <InstagramIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            <Link
                              style={{
                                cursor: "pointer",
                                wordBreak: "break-all",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                              href={`${startUpsData?.insta_link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {startUpsData?.insta_link ? startUpsData?.insta_link : "-"}
                            </Link>
                          </Typography>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ marginRight: "5px" }}>
                            <PhoneIcon style={{ fontSize: "14px", color: "#7C7373" }} />
                          </Typography>
                          <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            {startUpsData?.phone ? startUpsData?.phone : "-"}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid
                        style={{
                          borderRadius: "8px",
                          boxShadow: "rgb(111 106 108 / 58%) 0px 0px 6px",
                          padding: "15px",
                          background: "#efefef52",
                          // margin: "5px",
                        }}
                        item
                        xs={12}
                        sm={12}
                        md={5.85}
                        xl={5.85}
                      >
                        <Typography
                          style={{ textAlign: "center", fontSize: "1rem", fontWeight: "600" }}
                        >
                          <FormattedMessage
                            id="overViewStartup.heading.highlight"
                            defaultMessage="Highlights"
                          />
                        </Typography>
                        <Grid container>
                          <Grid style={{ padding: "5px" }} item xs={12} sm={6} md={6} xl={6}>
                            <Card sx={cardCss}>
                              <CardContent style={cardContentCss}>
                                <Typography style={{ fontSize: "0.8rem" }}>
                                  <FormattedMessage
                                    id="overViewStartup.heading.foundedYear"
                                    defaultMessage="Founded Year"
                                  />
                                </Typography>
                                <Typography
                                  style={{
                                    fontSize: "1rem",
                                    color: "#8A1538",
                                    fontWeight: "600",
                                  }}
                                >
                                  {startUpsData?.foundedYear
                                    ? formattedDate(startUpsData?.foundedYear)
                                    : "-"}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid style={{ padding: "5px" }} item xs={12} sm={6} md={6} xl={6}>
                            <Card sx={cardCss}>
                              <CardContent style={cardContentCss}>
                                <Typography style={{ fontSize: "0.8rem" }}>
                                  <FormattedMessage
                                    id="overViewStartup.heading.startupstage"
                                    defaultMessage="Startup Stage"
                                  />
                                </Typography>
                                <Typography
                                  style={{
                                    fontSize: "1rem",
                                    color: "#8A1538",
                                    fontWeight: "600",
                                  }}
                                >
                                  {startUpsStage ? startUpsStage : "-"}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid style={{ padding: "5px" }} item xs={12} sm={6} md={6} xl={6}>
                            <Card sx={cardCss}>
                              <CardContent style={cardContentCss}>
                                <Typography style={{ fontSize: "0.8rem" }}>
                                  <FormattedMessage
                                    id="overViewStartup.heading.fundinground"
                                    defaultMessage="Funding Rounds"
                                  />
                                </Typography>
                                <Typography
                                  style={{
                                    fontSize: "1rem",
                                    color: "#8A1538",
                                    fontWeight: "600",
                                  }}
                                >
                                  {startUpsData?.funding_rounds
                                    ? startUpsData?.funding_rounds
                                    : "-"}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid style={{ padding: "5px" }} item xs={12} sm={6} md={6} xl={6}>
                            <Card sx={cardCss}>
                              <CardContent style={cardContentCss}>
                                <Typography style={{ fontSize: "0.8rem" }}>
                                  <FormattedMessage
                                    id="overViewStartup.heading.lastfundingdate"
                                    defaultMessage="Last Funding Date"
                                  />
                                </Typography>
                                <Typography
                                  style={{
                                    fontSize: "1rem",
                                    color: "#8A1538",
                                    fontWeight: "600",
                                  }}
                                >
                                  {" "}
                                  {startUpsData?.pastFunding
                                    ? formattedDate(startUpsData?.pastFunding)
                                    : "-"}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid style={{ padding: "5px" }} item xs={12} sm={6} md={6} xl={6}>
                            <Card sx={cardCss}>
                              <CardContent style={cardContentCss}>
                                <Typography style={{ fontSize: "0.8rem" }}>
                                  <FormattedMessage
                                    id="overViewStartup.heading.monthlyWebsite"
                                    defaultMessage="Monthly Website Visitors"
                                  />
                                </Typography>
                                <Typography
                                  style={{
                                    fontSize: "1rem",
                                    color: "#8A1538",
                                    fontWeight: "600",
                                  }}
                                >
                                  -
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid style={{ padding: "5px" }} item xs={12} sm={6} md={6} xl={6}>
                            <Card sx={cardCss}>
                              <CardContent style={cardContentCss}>
                                <Typography style={{ fontSize: "0.8rem" }}>
                                  <FormattedMessage
                                    id="overViewStartup.heading.totalInvestmentAmount"
                                    defaultMessage="Total Investment Amount"
                                  />
                                </Typography>
                                <Typography
                                  style={{
                                    fontSize: "1rem",
                                    color: "#8A1538",
                                    fontWeight: "600",
                                  }}
                                >
                                  {`$${
                                    startUpsData?.totalFundingUsd
                                      ? millify(startUpsData?.totalFundingUsd)
                                      : 0
                                  }`}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: "15px", padding: "0px 0px" }} gap={2}>
                      <Grid item xs={12} sm={12} md={5.85} xl={5.85}>
                        <Box
                          style={{
                            borderRadius: "8px",
                            boxShadow: "rgb(111 106 108 / 58%) 0px 0px 6px",
                            background: "#efefef52",
                          }}
                        >
                          <Typography
                            style={{
                              textAlign: "center",
                              color: "#8a1538",
                              fontWeight: "600",
                              padding: "10px 0px",
                            }}
                          >
                            <FormattedMessage
                              id="overViewStartup.heading.investmentTrends"
                              defaultMessage="Investment Trends"
                            />
                          </Typography>
                          <Box
                            style={{
                              height: "280px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {/* {employeeHistoryCount?.length ? (
                              <LineChart
                                height={290}
                                series={[{ data: employeeHistoryCount, label: "Employee Count" }]}
                                xAxis={[{ scaleType: "point", data: employeeHistoryCountDate }]}
                              />
                            ) : (
                              <Typography style={{ color: "#8a1538", fontWeight: "600" }}>
                                No Data
                              </Typography>
                            )} */}
                            {formattedData?.length ? (
                              <div dir="ltr" style={{ width: "100%", height: 300 }}>
                                <BarChart
                                  dataset={formattedData}
                                  margin={{ top: 60, right: 50, left: 90, bottom: 50 }}
                                  xAxis={[
                                    {
                                      scaleType: "band",
                                      dataKey: "month",
                                      label: isRTL ? "شهر" : "Month",
                                    },
                                  ]}
                                  layout="vertical"
                                  // yAxis={[{ scaleType: "band", dataKey: "month" }]}
                                  series={[
                                    {
                                      dataKey: "amount",
                                      label: isRTL ? "الاستثمار" : "Investment",
                                    },
                                  ]}
                                  height={250}
                                />
                              </div>
                            ) : (
                              <Typography style={{ color: "#8a1538", fontWeight: "600" }}>
                                <FormattedMessage
                                  id="overViewStartup.heading.nodata"
                                  defaultMessage="No Data"
                                />
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={12} md={5.85} xl={5.85}>
                        <Box
                          style={{
                            borderRadius: "8px",
                            boxShadow: "rgb(111 106 108 / 58%) 0px 0px 6px",
                            background: "#efefef52",
                          }}
                        >
                          <Typography
                            style={{
                              textAlign: "center",
                              color: "#8a1538",
                              fontWeight: "600",
                              padding: "10px 0px",
                            }}
                          >
                            <FormattedMessage
                              id="overViewStartup.heading.investmentType"
                              defaultMessage="Investment Type Comparison"
                            />
                          </Typography>

                          <Box
                            style={{
                              height: "280px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {pieChartGraphData?.length ? (
                              <div dir="ltr" style={{ width: "100%", height: 300 }}>
                                <PieChart
                                  series={[
                                    {
                                      paddingAngle: 1,
                                      innerRadius: 40,
                                      outerRadius: 60,
                                      data: pieChartGraphData.map((historyData) => {
                                        return {
                                          label: historyData?.funding_series,
                                          value: historyData?.total_amount,
                                        };
                                      }),
                                    },
                                  ]}
                                  margin={{ right: 0 }}
                                  height={280} // Align chart to the right
                                  slotProps={{
                                    legend: {
                                      // direction: "row",
                                      position: {
                                        vertical: "bottom",
                                        horizontal: isRTL ? "right" : "left",
                                      },
                                      padding: 20,
                                      itemMarkWidth: 10,
                                      itemMarkHeight: 3,
                                      markGap: 5,
                                      itemGap: 10,
                                      labelStyle: {
                                        fontSize: 10,
                                      },
                                    },
                                  }}
                                />
                              </div>
                            ) : (
                              <Typography style={{ color: "#8a1538", fontWeight: "600" }}>
                                <FormattedMessage
                                  id="overViewStartup.heading.nodata"
                                  defaultMessage="No Data"
                                />
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* <Box
                      style={{
                        borderRadius: "8px",
                        boxShadow: "rgb(111 106 108 / 58%) 0px 0px 6px",
                        background: "#efefef52",
                        margin: "20px 0px",
                      }}
                    >
                      <Typography
                        style={{
                          textAlign: "center",
                          color: "#8a1538",
                          fontWeight: "600",
                          padding: "20px 0px",
                        }}
                      >
                        Investment Trends
                      </Typography>
                      <Box
                        style={{
                          // border: "1px solid #8A1538",

                          background: "#efefef52",
                          height: "250px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {formattedData?.length ? (
                          <BarChart
                            dataset={formattedData}
                            margin={{ top: 60, right: 50, left: 90, bottom: 50 }}
                            xAxis={[{ scaleType: "band", dataKey: "month", label: "Month" }]}
                            layout="vertical"
                            // yAxis={[{ scaleType: "band", dataKey: "month" }]}
                            series={[{ dataKey: "amount", label: "Investments" }]}
                            height={250}
                          />
                        ) : (
                          <Typography style={{ color: "#8a1538", fontWeight: "600" }}>
                            No Data
                          </Typography>
                        )}
                      </Box>
                    </Box> */}
                  </Paper>
                </TabPanel>
                <TabPanel value="3" style={{ padding: 0 }}>
                  <Paper
                    elevation={16}
                    style={{
                      padding: 4,
                      width: "100%",
                      height: "auto",
                      position: "relative",
                      overflow: "auto",
                    }}
                  >
                    {" "}
                    {listOfMandates?.length === 0 ? (
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="auto"
                          image="/Images/no-application-recieved.png"
                          alt="green iguana"
                          style={{ width: "75px" }}
                        />
                        <Typography
                          gutterBottom
                          style={{
                            fontFamily: "Calibri",
                            fontWeight: 600,
                            fontSize: "18px",
                            color: "#b2acac",
                            // marginLeft: "25rem",
                          }}
                          component="div"
                        >
                          <FormattedMessage
                            id="newTableMainComponentShortList.table.noActiveData.text1"
                            defaultMessage="No active mandate found, please"
                          />{" "}
                          <Link href="/MandateCreation">
                            <FormattedMessage
                              id="newTableMainComponentShortList.table.noActiveData.text2"
                              defaultMessage="Create New Mandate"
                            />
                          </Link>
                          .
                        </Typography>
                      </Box>
                    ) : (
                      rowsOfMandates?.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row?.map((mandate, cellIndex) => (
                            <TableCell key={cellIndex}>
                              <FormControl component="fieldset">
                                <FormGroup>
                                  <FormControlLabel
                                    value={mandate?.id}
                                    control={
                                      <Checkbox
                                        checked={checkedMandates?.includes(mandate.id)}
                                        onChange={(e) => handleChange(e, mandate.id)}
                                        inputProps={{ "aria-label": "controlled" }}
                                      />
                                    }
                                    label={
                                      <Typography
                                        style={{
                                          fontFamily: "Arial", // Change font family
                                          fontWeight: 600,
                                          fontSize: "14px",
                                          color: "#393939",
                                        }}
                                      >
                                        {mandate.title}
                                      </Typography>
                                    }
                                    labelPlacement="end"
                                  />
                                </FormGroup>
                              </FormControl>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                    {rowsOfMandates?.length > 0 && (
                      <Grid style={{ float: "right", display: "flex" }}>
                        <Button
                          variant="contained"
                          size="small"
                          style={{
                            margin: "10px 0px",
                            padding: "4px 10px",
                            background: "#8a1538",
                            fontSize: "0.7rem",
                            borderRadius: "3px",
                          }}
                          onClick={() => handelSubmit(checkedMandates, startUpID)}
                        >
                          <FormattedMessage
                            id="overViewStartup.tab1.card.submit.button"
                            defaultMessage="Submit"
                          />
                        </Button>
                      </Grid>
                    )}
                  </Paper>
                </TabPanel>
              </Grid>
            </TabContext>
          </Grid>
          {openModal === true && (
            <ConfirmInvitePitchModal
              openModal={openModal}
              setMandatesList={setMandatesList}
              setSelectedStartUpId={setSelectedStartUpId}
              setOpenModal={setOpenModal}
              selectedStartUpId={selectedStartUpId}
              mandatesList={mandatesList}
              setCheckedMandates={setCheckedMandates}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

OverViewStartUp.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default OverViewStartUp;
