import React, { useState, useEffect, useRef } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Button,
  Chip,
  Stack,
  Typography,
  Grid,
  Tab,
  Card,
  CardContent,
  CardActions,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";
import TextField from "@mui/material/TextField";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { limitDecreaseIdeaSearch, myIdea } from "src/action/myIdea";
import { FormattedMessage, useIntl } from "react-intl";
import { isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import { height, minHeight } from "@mui/system";
import { startupSubscriptionLimitCheck } from "src/action/globalApi";
import { SWEETALERT } from "src/components/sweetalert2";
import { toast } from "react-toastify";

const useStyles = makeStyles(() => ({
  customContainer: {
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
  },
}));

const IdealSearch = () => {
  const intl = useIntl();
  const classes = useStyles();
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";

  const dispatch = useDispatch();

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
    setError("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && keyword.trim() !== "") {
      if (keywords.length < 10) {
        const apiKeyword = [...keywords, keyword.trim()];
        setKeywords((prevKeywords) => [...prevKeywords, keyword.trim()]);
        setKeyword("");
        event.preventDefault();
        dispatch(limitDecreaseIdeaSearch()).then((resp) => {
          if (resp?.success !== false) {
            dispatch(myIdea(apiKeyword, label));
          } else {
            setDisabled(true);
            toast.warning("Your plan limit exceeded, Please contact admin at contact@arisio.io", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      } else {
        setError("You can only add up to 10 keywords.");
      }
    }
  };

  const handleRemoveChip = (index) => {
    setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
    setError("");
  };
  const [value, setValue] = useState("0");
  const [label, setLabel] = useState("startups");
  const prevLabelRef = useRef();
  const handleChange = (event, newValue) => {
    setValue(newValue);
    const smallerCase = event.target.innerText;
    const Result = smallerCase.charAt(0).toLowerCase() + smallerCase.slice(1);
    setLabel(Result);
  };

  const storedUserDetails = localStorage.getItem("userDetails");
  let startupDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const userId = startupDetails?.id;

  const ideaSearchModule = "idea_search_limit";

  const [isAlertShown, setIsAlertShown] = useState(false);

  useEffect(() => {
    let isMounted = true; // To check if the component is still mounted
    let requestCounter = 0; // Track the number of API requests

    const checkStartupSubscriptionLimit = async () => {
      const currentRequest = ++requestCounter; // Increment the request counter

      dispatch(startupSubscriptionLimitCheck(userId, ideaSearchModule)).then((res) => {
        if (isMounted && currentRequest === requestCounter) {
          if (res?.status === false && !isAlertShown) {
            setIsAlertShown(true);
            SWEETALERT({
              text: "Your Idea Search limit has been reached. Please upgrade your plan to continue!",
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
  }, [dispatch, isAlertShown, userId, ideaSearchModule]);

  useEffect(() => {
    if (keywords.length !== 0) {
      dispatch(myIdea(keywords, label));
    }
  }, [label]);

  let seeMyIdeaSliceData = useSelector((state) => state?.seeMyIdeaSlice);
  let myIdeaData = useSelector((state) => state?.seeMyIdeaSlice?.myIdea);

  const getTabStyle = (tabValue) => ({
    backgroundColor: value === tabValue ? "#8A1538" : "rgba(183, 178, 180, 0.9)",
    color: value === tabValue ? "#FFFFFF" : "#2C2057",
    cursor: disabled ? "not-allowed" : "cursor",
    margin: "10px 50px",
    border: "0.4px solid #D1CDCD",
    padding: "6px 30px",
    minHeight: "30px",
    borderRadius: "3px", // Ensure that tabs have minimum width
  });

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
        <Container className={classes.customContainer}>
          <Box
            sx={{
              bgcolor: "#ffff",
              width: "auto",
              height: "auto",
            }}
          >
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Grid xs={12} sm={24} md={12} sx={{ margin: "25px", width: "100%" }}>
                <TextField
                  disabled={!isPermitted(permissions.STARTUP_IDEASEARCH_TOP_SEARCHBAR)}
                  component="div"
                  name="searchKey"
                  id="outlined"
                  variant="outlined"
                  value={keyword}
                  onChange={handleKeywordChange}
                  onKeyDown={handleKeyDown}
                  style={{
                    border: " 1px solid gray",
                    overflow: "auto",
                    scrollbarWidth: "20px",
                    WebkitTextFillColor: "gray",
                    marginBottom: "16px",
                    maxHeight: "150px",
                    height: "50px",
                    width: "100%",
                  }}
                  // placeholder={intl.formatMessage({
                  //   id: "describing.keywordTitle.ideaSearch",
                  //   defaultMessage: "Enter keywords describing your startup's product/service",
                  // })}
                  placeholder={
                    isPermitted(permissions.NEWS_ADD_NEWS)
                      ? intl.formatMessage({
                          id: "describing.keywordTitle.ideaSearch",
                          defaultMessage:
                            "Enter keywords describing your startup's product/service",
                        })
                      : intl.formatMessage({
                          id: "noPermission.placeholder",
                          defaultMessage: "You do not have permission to search",
                        })
                  }
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Box>
                        <InputAdornment position="start">
                          {!isPermitted(permissions.STARTUP_IDEASEARCH_TOP_SEARCHBAR) ? (
                            <LockIcon />
                          ) : (
                            <SearchIcon />
                          )}
                        </InputAdornment>
                      </Box>
                    ),
                    sx: {
                      height: "50px",
                    },
                  }}
                />
                {error && (
                  <Typography color="error" sx={{ fontSize: "0.7rem" }}>
                    {error}
                  </Typography>
                )}
                {keywords?.length > 0 && (
                  <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                    {keywords?.map((kw, index) => (
                      <Chip
                        variant="outlined"
                        key={index}
                        label={kw}
                        style={{ margin: "4px", display: "flex", alignItems: "center" }}
                        onDelete={() => handleRemoveChip(index)}
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Box>
            <Typography sx={{ fontSize: "12px", mx: "20px", paddingBottom: "10px" }}>
              <FormattedMessage
                id="helperText.searchExample.ideaSearch"
                defaultMessage="Example : Logistics aggregator or food delivery app (max 10 keyword)"
              />
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "#e7e3e3a3",
              height: "auto",
            }}
          >
            <TabContext value={value}>
              <Box style={{ height: "59px" }}>
                <TabList
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  onChange={handleChange}
                  dir={isRTL ? "ltr" : "ltr"}
                >
                  {isPermitted(permissions.STARTUP_IDEASEARCH_TAB_STARTUPS) ? (
                    <Tab
                      disabled={disabled}
                      style={getTabStyle("0")}
                      label={
                        <FormattedMessage id="tabs.startup.ideaSearch" defaultMessage="Startups" />
                      }
                      value="0"
                    />
                  ) : null}
                  {isPermitted(permissions.STARTUP_IDEASEARCH_TAB_NEWS) ? (
                    <Tab
                      disabled={disabled}
                      style={getTabStyle("1")}
                      label={<FormattedMessage id="tabs.news.ideaSearch" defaultMessage="News" />}
                      value="1"
                    />
                  ) : null}
                  {isPermitted(permissions.STARTUP_IDEASEARCH_TAB_PRESENTATIONS) ? (
                    <Tab
                      disabled={disabled}
                      style={getTabStyle("2")}
                      label={
                        <FormattedMessage
                          id="tabs.presentations.ideaSearch"
                          defaultMessage="Presentations"
                        />
                      }
                      value="2"
                    />
                  ) : null}
                  {isPermitted(permissions.STARTUP_IDEASEARCH_TAB_VIDEOS) ? (
                    <Tab
                      disabled={disabled}
                      style={getTabStyle("3")}
                      label={
                        <FormattedMessage id="tabs.videos.ideaSearch" defaultMessage="Videos" />
                      }
                      value="3"
                    />
                  ) : null}
                  {isPermitted(permissions.STARTUP_IDEASEARCH_TAB_PATENTS) ? (
                    <Tab
                      disabled={disabled}
                      style={getTabStyle("4")}
                      label={
                        <FormattedMessage id="tabs.patents.ideaSearch" defaultMessage="Patents" />
                      }
                      value="4"
                    />
                  ) : null}

                  {isPermitted(permissions.STARTUP_IDEASEARCH_TAB_RESEARCH_PAPERS) ? (
                    <Tab
                      disabled={disabled}
                      style={getTabStyle("5")}
                      label={
                        <FormattedMessage
                          id="tabs.researchPapers.ideaSearch"
                          defaultMessage="Research Papers"
                        />
                      }
                      value="5"
                    />
                  ) : null}
                </TabList>
              </Box>

              {myIdeaData?.length === 0 ? (
                seeMyIdeaSliceData?.loading === true ? (
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f8f8f8",
                      height: "54vh",
                    }}
                  >
                    <CircularProgress color="secondary" />
                  </Box>
                ) : (
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f8f8f8",
                      height: "54vh",
                    }}
                  >
                    <Typography style={{ padding: "30px", fontWeight: "bold", color: "#8a1538" }}>
                      <FormattedMessage id="noData.message.ideaSearch" defaultMessage="No data" />
                    </Typography>
                  </Box>
                )
              ) : (
                <TabPanel style={{ padding: "3px" }} value={value}>
                  {seeMyIdeaSliceData?.loading === true ? (
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f8f8f8",
                        height: "54vh",
                        marginTop: "-4px",
                      }}
                    >
                      <CircularProgress color="secondary" />
                    </Box>
                  ) : (
                    <Grid
                      container
                      spacing={1}
                      style={{ marginTop: "-4px", padding: "5px", backgroundColor: "#f8f8f8" }}
                    >
                      {myIdeaData.map((myIdea) => (
                        <Grid item xs={12} sm={4} md={4} lg={4} key={myIdea.id}>
                          <Card
                            style={{
                              // width: "355px",
                              height: "140px",
                              overflowX: "hidden",
                              overflowY: "scroll",
                              scrollbarWidth: "none",
                              borderRadius: "8px",
                              // marginLeft: "11px",
                              margin: "5px",
                            }}
                            key={myIdea.id}
                          >
                            <CardContent
                              sx={{
                                textOverflow: "ellipsis",
                                height: "180px",
                                overflow: "hidden",
                                padding: "12px",
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 14, fontWeight: 500, lineHeight: "18px" }}
                                color="#344054"
                                gutterBottom
                              >
                                {myIdea?.title}
                              </Typography>
                              <Typography
                                sx={{ fontSize: 12, fontWeight: 400, marginTop: "10px" }}
                                variant="body2"
                              >
                                {myIdea.description}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <a href={myIdea?.link} target="_blank" rel="noopener noreferrer">
                                <Button size="small">Learn More</Button>
                              </a>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </TabPanel>
              )}
            </TabContext>
          </Box>

          {/* <Box sx={{ width: "100%", typography: "body1" }}>
         
        </Box> */}
        </Container>
      </Box>
    </>
  );
};
IdealSearch.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default IdealSearch;
