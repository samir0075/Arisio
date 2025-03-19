import React, { useState, useEffect } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import ExternalContainer from "src/components/ExternalContainer";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  TextField,
  Typography,
  Skeleton,
} from "@mui/material";
import { formattedDate, getButtonCss, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import { useRouter } from "next/router";
import AddNewsModal from "./newsModal";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  adminAllNewsFetch,
  adminNewsFetch,
  deleteMyNews,
  myAllNewsFetch,
  myNewsFetch,
  myNewsType,
} from "src/action/news";
import DeleteModal from "src/components/DeleteModal";
import { FormattedMessage, useIntl } from "react-intl";
import NoDataMsg from "src/components/NoDataMsg";
import { TabContext, TabList } from "@mui/lab";
import { TabPanel } from "@mui/joy";
import styles from "../SeeMandates/seeNewMandate.module.css";
import {
  getCountries,
  investorSubscriptionLimitCheck,
  startupSubscriptionLimitCheck,
} from "src/action/globalApi";
import { SWEETALERT } from "src/components/sweetalert2";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";

const NewsCard = ({ flow, section }) => {
  const dispatch = useDispatch();
  const [newsId, setSelectedNewsId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState("");
  const [value, setValue] = useState("all");
  const [country, setCountry] = useState("");
  const [newsType, setNewsType] = useState("");

  const [newsTitleSearch, setNewsTitleSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(newsTitleSearch);

  const countryData = useSelector((state) => state.globalApi.countries);

  const router = useRouter();
  const detailNews = (news) => {
    console.log(news);
    if (news?.source_url !== null) {
      window.open(news.source_url, "_blank");
    } else {
      !section
        ? router.push(`../../News/detailsNews?newsId=${news?.id}&newsType=${value}`)
        : router.push(
            `../../PendingApprovals/PendingNews/newsDetail?newsId=${news?.id}&section=${section}`
          );
    }
  };
  const onAddNews = () => {
    setDialogOpen(true);
  };
  const ButtonCss = getButtonCss();
  const handleChange = (event, newValue) => {
    setPage(1);
    setValue(newValue);
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
    textAlign: "center",
  };

  const getTabStyle = (tabValue) => ({
    color: "black",
    fontSize: "12px",
    textAlign: "left",
    padding: "0px 30px",
    borderRadius: "3px",
  });

  const storedUserDetails = localStorage.getItem("userDetails");
  let UserId = storedUserDetails ? JSON.parse(storedUserDetails) : null;

  let startupDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const userId = startupDetails?.id;

  const newsModule = "news_limit";

  // console.log(UserId?.role);
  const [isAlertShown, setIsAlertShown] = useState(false);

  useEffect(() => {
    if (UserId?.role === "ENTREPRENEUR" || UserId?.role === "INVESTOR") {
      let isMounted = true; // To check if the component is still mounted
      let requestCounter = 0; // Track the number of API requests

      const checkSubscriptionLimit = async () => {
        const currentRequest = ++requestCounter; // Increment the request counter
        const action =
          UserId?.role === "ENTREPRENEUR"
            ? startupSubscriptionLimitCheck
            : investorSubscriptionLimitCheck;

        dispatch(action(userId, newsModule)).then((res) => {
          if (isMounted && currentRequest === requestCounter) {
            if (res?.status === false && !isAlertShown) {
              setIsAlertShown(true);
              SWEETALERT({
                text: "Your News posting limit has been reached. Please upgrade your plan to continue!",
              });
            }
          }
        });
      };

      checkSubscriptionLimit();

      // Cleanup function to avoid memory leaks
      return () => {
        isMounted = false;
      };
    } else {
      return;
    }
  }, [UserId?.role, dispatch, isAlertShown, userId, newsModule, setIsAlertShown]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(newsTitleSearch);
    }, 500); // Delay in milliseconds

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or query change
    };
  }, [newsTitleSearch]);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(myNewsType());
    if (value === "own") {
      if (UserId?.role === "ENTREPRENEUR") {
        dispatch(myNewsFetch("startup", page, value, country, newsType, debouncedQuery));
      } else if (UserId?.role === "INVESTOR") {
        dispatch(myNewsFetch("investor", page, value, country, newsType, debouncedQuery));
      } else if (section === "PendingNews") {
        dispatch(adminNewsFetch("pending", page, value, country, newsType, debouncedQuery));
      } else if (section !== "PendingNews" && UserId?.role === "ADMINISTRATOR") {
        dispatch(adminNewsFetch("active", page, value, country, newsType, debouncedQuery));
      }
    } else {
      if (UserId?.role === "ENTREPRENEUR") {
        dispatch(myAllNewsFetch("startup", page, value, country, newsType, debouncedQuery));
      } else if (UserId?.role === "INVESTOR") {
        dispatch(myAllNewsFetch("investor", page, value, country, newsType, debouncedQuery));
      } else if (section === "PendingNews") {
        dispatch(adminAllNewsFetch("pending", page, value, country, newsType, debouncedQuery));
      } else if (section !== "PendingNews" && UserId?.role === "ADMINISTRATOR") {
        dispatch(adminAllNewsFetch("active", page, value, country, newsType, debouncedQuery));
      } else if (UserId?.role === "INDIVIDUAL") {
        dispatch(myAllNewsFetch("individual", page, value, country, newsType, debouncedQuery));
      }
    }
  }, [UserId?.role, dispatch, page, section, value, country, newsType, debouncedQuery]);

  const handlePagination = (event, value) => {
    setPage(value);
  };

  let newsData = useSelector((state) => state?.myNews?.myNews?.result?.rows);

  let onwNewsCount = useSelector((state) => state?.myNews?.myNews?.result?.count);

  let newsAllData = useSelector((state) => state?.myNews?.myAllNews?.result?.rows);

  let newsCount = useSelector((state) => state?.myNews?.myAllNews?.result?.count);

  let loadingState = useSelector((state) => state?.myNews?.myAllNewsLoading);

  let newsTypes = useSelector((state) => state?.myNews?.myNewsType);

  const intl = useIntl();

  const onDelete = (record) => {
    setDeleteModal(true);
    setSelectedNewsId(record);
  };

  const handleDelete = () => {
    const message = intl.formatMessage({
      id: "myUpdateModl.delete.successMessage",
      defaultMessage: "News deleted successfully",
    });
    if (UserId?.role === "ENTREPRENEUR") {
      dispatch(deleteMyNews(`startup/deleteNews/${newsId}`, message))
        .then(() => {
          dispatch(myNewsFetch("startup", page, value, country, newsType, debouncedQuery));
          setDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error deleting news:", error);
        });
    } else if (UserId?.role === "INVESTOR") {
      dispatch(deleteMyNews(`investor/deleteNews/${newsId}`, message))
        .then(() => {
          dispatch(myNewsFetch("investor", page, value, country, newsType, debouncedQuery));
          setDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error deleting news:", error);
        });
    } else if (UserId?.role === "ADMINISTRATOR" && section !== "PendingNews") {
      dispatch(deleteMyNews(`admin/deleteNews/${newsId}`, message))
        .then(() => {
          dispatch(adminNewsFetch("active", page, value, country, newsType, debouncedQuery));
          setDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error deleting news:", error);
        });
    }
    setSelectedNewsId("");
  };

  const onEdit = (newsDetails) => {
    setDialogOpen(true);
    setSelectedNewsId(newsDetails);
  };

  const recordsPerPage = 12;
  const totalRecords = value === "own" ? onwNewsCount || 0 : newsCount || 0;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  const handleNewsTypeChange = (event) => {
    setNewsType(event.target.value);
  };

  return (
    <>
      <ExternalContainer>
        {section != "PendingNews" ? (
          <Box
            sx={{
              width: "100%",
              padding: "0rem 0 1rem 0",
            }}
          >
            <TabContext value={value}>
              {/* <Box
                sx={{
                  borderBottom: "1px solid lightgrey",
                  width: "100%",
                  display: "flex",
                  justifyContent: { xs: "center", sm: "space-between", md: "space-between" },
                  alignItems: "center",
                  flexWrap: "wrap-reverse",
                  gap: "10px",
                }}
              > */}
              <Grid container justifyContent="start" spacing={1} alignItems={"center"}>
                <Grid item xs={12} sm={12} md={4.5} xl={4.5}>
                  <TabList
                    onChange={handleChange}
                    sx={{
                      textAlign: "left",
                      display: "flex",
                    }}
                  >
                    <Tab
                      label={<FormattedMessage id="news.allNews" defaultMessage="All News" />}
                      value="all"
                      style={getTabStyle("all")}
                      disabled={loadingState}
                    />
                    {UserId?.role !== "INDIVIDUAL" && (
                      <Tab
                        label={<FormattedMessage id="news.ownNews" defaultMessage="Own News" />}
                        value="own"
                        style={getTabStyle("own")}
                        disabled={loadingState}
                      />
                    )}
                  </TabList>
                </Grid>
                <Grid item xs={12} sm={6} md={UserId?.role === "INDIVIDUAL" ? 3.5 : 3} xl={3}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Search"
                    variant="outlined"
                    value={newsTitleSearch}
                    onChange={(e) => {
                      setNewsTitleSearch(e.target.value);
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
                <Grid item xs={7} sm={7} md={UserId?.role === "INDIVIDUAL" ? 3 : 2.5} xl={2.5}>
                  <Select
                    style={{ background: "#FFFFFF" }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: { xs: "240px", sm: "auto" },
                          width: { xs: "70%", sm: "auto" },
                        },
                      },
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
                      <FormattedMessage id="addnews.filter.Country" defaultMessage="All Country" />
                    </MenuItem>
                    {countryData.map((option) => (
                      <MenuItem
                        sx={{ fontSize: "0.8rem", whiteSpace: "normal", wordBreak: "break-word" }}
                        key={option.countryCode}
                        value={option.country}
                      >
                        {option.country}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                {/* <Grid item xs={6} sm={6} md={2.8} xl={2.8}>
                  <Select
                    style={{ background: "#FFFFFF" }}
                    size="small"
                    fullWidth
                    labelId="single-select-label"
                    id="single-select"
                    value={newsType}
                    label="Country"
                    onChange={handleNewsTypeChange}
                    displayEmpty
                  >
                    <MenuItem style={{ fontSize: "0.8rem" }} value="">
                      News Type
                    </MenuItem>
                    {newsTypes?.map((option) => (
                      <MenuItem style={{ fontSize: "0.8rem" }} key={option.id} value={option.name}>
                        {option?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid> */}
                {isPermitted(permissions.NEWS_ADD_NEWS) ? (
                  <Grid item xs={5} sm={5} md={2} xl={2}>
                    <Button
                      onClick={onAddNews}
                      style={{
                        // paddingBottom: "0px",
                        backgroundColor: "#eedce1",
                        fontSize: "0.8rem",
                        borderRadius: "5px",
                      }}
                    >
                      <FormattedMessage id="news.addNews" defaultMessage="Submit News" />
                    </Button>
                  </Grid>
                ) : null}
              </Grid>
              {/* </Box> */}
            </TabContext>
          </Box>
        ) : (
          <Box style={{ marginBottom: "10px" }}>
            <Grid container justifyContent="start" spacing={1}>
              <Grid item xs={6} sm={6} md={3} xl={3}>
                <Select
                  style={{ background: "#FFFFFF" }}
                  size="small"
                  fullWidth
                  labelId="single-select-label"
                  id="single-select"
                  value={country}
                  label="Country"
                  onChange={handleCountryChange}
                  displayEmpty
                >
                  <MenuItem style={{ fontSize: "0.8rem" }} value="">
                    All Country
                  </MenuItem>
                  {countryData.map((option) => (
                    <MenuItem
                      style={{ fontSize: "0.8rem" }}
                      key={option.countryCode}
                      value={option.country}
                    >
                      {option.country}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6} sm={6} md={3} xl={3}>
                <Select
                  style={{ background: "#FFFFFF" }}
                  size="small"
                  fullWidth
                  labelId="single-select-label"
                  id="single-select"
                  value={newsType}
                  label="Country"
                  onChange={handleNewsTypeChange}
                  displayEmpty
                >
                  <MenuItem style={{ fontSize: "0.8rem" }} value="">
                    News Type
                  </MenuItem>
                  {newsTypes?.map((option) => (
                    <MenuItem style={{ fontSize: "0.8rem" }} key={option.id} value={option.name}>
                      {option?.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Box>
        )}

        {loadingState ? (
          <Grid container spacing={2}>
            {Array.from(new Array(12)).map((_, index) => (
              <Grid key={index} item xs={12} sm={4} md={4} xl={4}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    margin: { xs: "10px 0px", sm: "20px", md: "20px" },
                    borderRadius: "4px",
                    // cursor: value === "all" ? "pointer" : "",
                    maxWidth: "350px !important",
                    padding: "20px",
                    boxShadow:
                      "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Skeleton variant="rectangular" height={120} />
                  <CardContent>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="30%" />
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
        ) : (
          <>
            {value === "own" && newsData?.length > 0 ? (
              <Grid container justifyContent="center">
                {newsData?.map((data) => (
                  <Grid key={data.id} xs={12} sm={4} md={4} xl={4}>
                    <Card
                      // onClick={() => (value === "all" ? detailNews(data.id) : "")}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        margin: { xs: "10px 0px", sm: "20px", md: "20px" },
                        borderRadius: "4px",
                        // cursor: value === "all" ? "pointer" : "",
                        maxWidth: "350px !important",
                        padding: "20px",
                        boxShadow:
                          "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                      }}
                    >
                      {" "}
                      {UserId?.role === "ADMINISTRATOR" || value === "own" ? (
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Box className={styles.mandateStatus}>
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                color: "#fff",
                                fontSize: "0.8rem",
                                margin: "0px 5px",
                                backgroundColor:
                                  data?.is_approved === 2
                                    ? "#8a1538"
                                    : data?.is_approved === 0
                                    ? "#68D2E8"
                                    : "green",
                                padding: "0px 8px",
                                borderRadius: "5px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {data?.is_approved === 0 ? (
                                <FormattedMessage
                                  id="news.card.pendingStatus"
                                  defaultMessage="PENDING"
                                />
                              ) : data?.is_approved === 1 ? (
                                <FormattedMessage
                                  id="news.card.approvedStatus"
                                  defaultMessage="Approved"
                                />
                              ) : (
                                <FormattedMessage
                                  id="news.card.rejectedStatus"
                                  defaultMessage="REJECTED"
                                />
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        // <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        //   <Box className={styles.mandateStatus}>
                        //     <Typography
                        //       sx={{
                        //         fontSize: "1rem",
                        //         color: "#fff",
                        //         fontSize: "0.8rem",
                        //         margin: "0px 5px",
                        //         backgroundColor: "green",
                        //         padding: "0px 8px",
                        //         borderRadius: "5px",
                        //         display: "flex",
                        //         justifyContent: "center",
                        //         alignItems: "center",
                        //       }}
                        //     >
                        //       {data.categories}
                        //     </Typography>
                        //   </Box>
                        // </Box>
                        ""
                      )}
                      <CardMedia
                        sx={{
                          height: "150px",
                          borderRadius: "5px",
                        }}
                        component="img"
                        // src={`data:image/PNG;base64,${data?.image_url}`}
                        src={
                          data?.source_url === null
                            ? `data:image/PNG;base64,${data?.image_url}`
                            : data?.image_url
                            ? data?.image_url
                            : "/Images/newsImage.jpg"
                        }
                        alt="News Image"
                      />
                      <Box
                        sx={{
                          padding: "0px 10px",
                          // height: "120px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%", // Ensure the box stretches to full width
                          }}
                        >
                          <Tooltip title={data?.country}>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                maxWidth: "120px", // Constrain the country name width (adjust as needed)
                                display: "inline-block", // Ensure it's an inline block for text truncation
                                overflow: "hidden", // Hide overflow text
                                textOverflow: "ellipsis", // Apply ellipsis if text overflows
                                whiteSpace: "nowrap", // Prevent wrapping of text
                              }}
                            >
                              {data?.country?.split(",")[0].trim().charAt(0).toUpperCase() +
                                data?.country?.split(",")[0].trim().slice(1).toLowerCase()}
                            </Typography>
                          </Tooltip>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              maxWidth: "calc(100% - 120px)", // Allow the date to take the remaining space
                              display: "inline-block",
                              whiteSpace: "nowrap", // Prevent wrapping of the date
                              // overflow: "hidden", // Hide overflow if the text is too long
                              // textOverflow: "ellipsis", // Truncate the date with ellipsis if it's too long
                              margin: "5px 0",
                            }}
                          >
                            {formattedDate(data?.publishedOn)}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: "700",
                            color: "#8A1538",
                            maxWidth: "100%",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            height: "50px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical",
                            // marginBottom: "5px",
                            // height: "60px",
                          }}
                        >
                          <Tooltip title={data?.title} placement="top">
                            {data?.title}
                          </Tooltip>
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: "400",
                            // color: "#00000099",
                            maxWidth: "100%",
                            height: "40px",

                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical",
                            margin: "5px 0",
                          }}
                        >
                          {data?.description}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ marginBottom: "10px" }}>
                          {/* <Chip
                            style={{
                              padding: "10px 8px",
                              fontSize: "0.8rem",
                              borderRadius: "5px",
                              background: "#83B4FF",
                              color: "#fff",
                              margin: "10px 0px",
                            }}
                            size="small"
                            label={data.categories}
                            variant="outlined"
                          /> */}
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: "700" }}>
                            {data?.categories}
                          </Typography>
                        </Stack>

                        {/* <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            paddingBottom: "10px",
                          }}
                        >
                          <Tooltip title="Categories" placement="top">
                            {data.categories}
                          </Tooltip>
                        </Typography> */}
                        {/* {value === "own" ? (
                          <Box
                            style={{
                              display: "flex",
                              gap: "5px",
                              justifyContent: "center",
                              margin: "5px 0px",
                            }}
                          >
                            <Tooltip title="Delete">
                              <DeleteOutlineOutlinedIcon
                                style={buttonStyle}
                                onClick={() => onDelete(data.id)}
                              />
                            </Tooltip>
                            {data?.is_approved === 0 ||
                            (UserId?.role === "ADMINISTRATOR" && value === "own") ? (
                              <Tooltip title="Edit">
                                <EditOutlinedIcon
                                  style={buttonStyle}
                                  onClick={() => onEdit(data)}
                                />
                              </Tooltip>
                            ) : (
                              ""
                            )}

                            <Tooltip title="View">
                              <VisibilityOutlinedIcon
                                style={buttonStyle}
                                onClick={() => detailNews(data.id)}
                              />
                            </Tooltip>
                          </Box>
                        ) : (
                          ""
                        )} */}
                        <Divider sx={{ border: "1px solid #f5f5f5" }} />
                        {UserId?.role === "ADMINISTRATOR" && section === "PendingNews" ? (
                          <Button
                            style={{ ...ButtonCss, width: "100%" }}
                            onClick={() => detailNews(data)}
                          >
                            <FormattedMessage
                              id="newMandates.card.newsDetailsButton.title"
                              defaultMessage="News Details"
                            />{" "}
                          </Button>
                        ) : value === "own" ? (
                          <Box
                            style={{
                              display: "flex",
                              gap: "5px",
                              justifyContent: "center",
                              margin: "10px 0px 0px 0px",
                            }}
                          >
                            <Tooltip title="Delete">
                              <DeleteOutlineOutlinedIcon
                                style={buttonStyle}
                                onClick={() => onDelete(data.id)}
                              />
                            </Tooltip>
                            {data?.is_approved === 0 ||
                            (UserId?.role === "ADMINISTRATOR" && value === "own") ? (
                              <Tooltip title="Edit">
                                <EditOutlinedIcon
                                  style={buttonStyle}
                                  onClick={() => onEdit(data)}
                                />
                              </Tooltip>
                            ) : (
                              ""
                            )}

                            <Tooltip title="View">
                              <VisibilityOutlinedIcon
                                style={buttonStyle}
                                onClick={() => detailNews(data)}
                              />
                            </Tooltip>
                          </Box>
                        ) : (
                          <Button
                            onClick={() => {
                              detailNews(data);
                            }}
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
                        )}
                      </Box>
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
            ) : value === "all" && newsAllData?.length > 0 ? (
              <Grid container justifyContent="center">
                {newsAllData?.map((data) => (
                  <Grid key={data.id} xs={12} sm={4} md={4} xl={4}>
                    <Card
                      // onClick={() => (value === "all" ? detailNews(data.id) : "")}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        margin: { xs: "10px 0px", sm: "20px", md: "20px" },
                        borderRadius: "4px",
                        // cursor: value === "all" ? "pointer" : "",
                        maxWidth: "350px !important",
                        padding: "20px",
                        boxShadow:
                          "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                      }}
                    >
                      {" "}
                      {UserId?.role === "ADMINISTRATOR" || value === "own" ? (
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Box className={styles.mandateStatus}>
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                color: "#fff",
                                fontSize: "0.8rem",
                                margin: "0px 5px",
                                backgroundColor:
                                  data?.is_approved === 2
                                    ? "#8a1538"
                                    : data?.is_approved === 0
                                    ? "#68D2E8"
                                    : "green",
                                padding: "0px 8px",
                                borderRadius: "5px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {data?.is_approved === 0 ? (
                                <FormattedMessage
                                  id="news.card.pendingStatus"
                                  defaultMessage="PENDING"
                                />
                              ) : data?.is_approved === 1 ? (
                                <FormattedMessage
                                  id="news.card.approvedStatus"
                                  defaultMessage="Approved"
                                />
                              ) : (
                                <FormattedMessage
                                  id="news.card.rejectedStatus"
                                  defaultMessage="REJECTED"
                                />
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        // <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        //   <Box className={styles.mandateStatus}>
                        //     <Typography
                        //       sx={{
                        //         fontSize: "1rem",
                        //         color: "#fff",
                        //         fontSize: "0.8rem",
                        //         margin: "0px 5px",
                        //         backgroundColor: "green",
                        //         padding: "0px 8px",
                        //         borderRadius: "5px",
                        //         display: "flex",
                        //         justifyContent: "center",
                        //         alignItems: "center",
                        //       }}
                        //     >
                        //       {data.categories}
                        //     </Typography>
                        //   </Box>
                        // </Box>
                        ""
                      )}
                      <CardMedia
                        sx={{
                          height: "150px",
                          borderRadius: "5px",
                        }}
                        component="img"
                        src={
                          data?.source_url === null
                            ? `data:image/PNG;base64,${data?.image_url}`
                            : data?.image_url
                            ? data?.image_url
                            : "/Images/newsImage.jpg"
                        }
                        alt="News Image"
                      />
                      <Box
                        sx={{
                          padding: "0px 10px",
                          // height: "120px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Tooltip title={data?.country}>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                // fontWeight: "600",
                                // color: "#00000099",
                                maxWidth: "100%",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitBoxOrient: "vertical",
                                // margin: "5px 0",
                              }}
                            >
                              {data?.country?.split(",")[0].trim().charAt(0).toUpperCase() +
                                data?.country?.split(",")[0].trim().slice(1).toLowerCase()}
                            </Typography>
                          </Tooltip>
                          <Typography
                            sx={{
                              fontSize: "12px",

                              maxWidth: "100%",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitBoxOrient: "vertical",
                              margin: "5px 0",
                            }}
                          >
                            {formattedDate(data?.publishedOn)}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: "700",
                            color: "#8A1538",
                            maxWidth: "100%",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            height: "50px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical",
                            // marginBottom: "5px",
                            // height: "60px",
                          }}
                        >
                          <Tooltip title={data?.title} placement="top">
                            {data?.title}
                          </Tooltip>
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: "400",
                            // color: "#00000099",
                            maxWidth: "100%",
                            height: "40px",

                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical",
                            margin: "5px 0",
                          }}
                        >
                          {data?.description}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ marginBottom: "10px" }}>
                          {/* <Chip
                            style={{
                              padding: "10px 8px",
                              fontSize: "0.8rem",
                              borderRadius: "5px",
                              background: "#83B4FF",
                              color: "#fff",
                              margin: "10px 0px",
                            }}
                            size="small"
                            label={data.categories}
                            variant="outlined"
                          /> */}
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: "700" }}>
                            {data?.categories}
                          </Typography>
                        </Stack>

                        {/* <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            paddingBottom: "10px",
                          }}
                        >
                          <Tooltip title="Categories" placement="top">
                            {data.categories}
                          </Tooltip>
                        </Typography> */}
                        {/* {value === "own" ? (
                          <Box
                            style={{
                              display: "flex",
                              gap: "5px",
                              justifyContent: "center",
                              margin: "5px 0px",
                            }}
                          >
                            <Tooltip title="Delete">
                              <DeleteOutlineOutlinedIcon
                                style={buttonStyle}
                                onClick={() => onDelete(data.id)}
                              />
                            </Tooltip>
                            {data.is_approved !== 1 ? (
                              <Tooltip title="Edit">
                                <EditOutlinedIcon
                                  style={buttonStyle}
                                  onClick={() => onEdit(data)}
                                />
                              </Tooltip>
                            ) : (
                              ""
                            )}
                            <Tooltip title="View">
                              <VisibilityOutlinedIcon
                                style={buttonStyle}
                                onClick={() => detailNews(data.id)}
                              />
                            </Tooltip>
                          </Box>
                        ) : (
                          ""
                        )} */}
                        {UserId?.role === "ADMINISTRATOR" && section === "PendingNews" ? (
                          <Button
                            style={{ ...ButtonCss, width: "100%" }}
                            onClick={() => detailNews(data)}
                          >
                            <FormattedMessage
                              id="newMandates.card.newsDetailsButton.title"
                              defaultMessage="News Details"
                            />{" "}
                          </Button>
                        ) : value === "own" ? (
                          <Box
                            style={{
                              display: "flex",
                              gap: "5px",
                              justifyContent: "center",
                              margin: "5px 0px",
                            }}
                          >
                            <Tooltip title="Delete">
                              <DeleteOutlineOutlinedIcon
                                style={buttonStyle}
                                onClick={() => onDelete(data.id)}
                              />
                            </Tooltip>
                            {data.is_approved !== 1 ? (
                              <Tooltip title="Edit">
                                <EditOutlinedIcon
                                  style={buttonStyle}
                                  onClick={() => onEdit(data)}
                                />
                              </Tooltip>
                            ) : (
                              ""
                            )}
                            <Tooltip title="View">
                              <VisibilityOutlinedIcon
                                style={buttonStyle}
                                onClick={() => detailNews(data)}
                              />
                            </Tooltip>
                          </Box>
                        ) : (
                          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                              onClick={() => {
                                detailNews(data);
                              }}
                              style={{
                                // paddingBottom: "0px",
                                backgroundColor: "#eedce1",
                                fontSize: "0.7rem",
                                padding: "5px 12px",
                                borderRadius: "5px",
                              }}
                            >
                              <FormattedMessage
                                id="addnews.button.readmore"
                                defaultMessage="Read More"
                              />
                            </Button>
                          </Box>
                        )}
                      </Box>
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
            ) : (
              <NoDataMsg
                message={
                  <FormattedMessage id="news.noData" defaultMessage="There are no news to show" />
                }
              />
            )}
          </>
        )}

        {dialogOpen && (
          <AddNewsModal
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            section={section}
            newsId={newsId}
            country={country}
            newsType={newsType}
            debouncedQuery={debouncedQuery}
            page={page}
            value={value}
            setSelectedNewsId={setSelectedNewsId}
          />
        )}
        {deleteModal && (
          <DeleteModal
            visible={deleteModal}
            setDeleteModal={setDeleteModal}
            // title={intl.formatMessage({
            //   id: "myUpdates.deleteUpdate.title",
            //   defaultMessage: "Are You Sure To Delete The Updates?",
            // })}
            title={
              <FormattedMessage
                id="myUpdates.deleteUpdte.title"
                defaultMessage="Are You Sure To Delete The News?"
              />
            }
            handleDelete={handleDelete}
          />
        )}
      </ExternalContainer>
    </>
  );
};

NewsCard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NewsCard;
