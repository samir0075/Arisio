import React, { useState, useEffect, useMemo, useRef } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import English from "../../locales/en-US";
import Arabic from "../../locales/ar-EG";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { formattedDate, getButtonCss } from "src/utils/util";
import NewsModal from "./newsModal";
import ExternalContainer from "src/components/ExternalContainer";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  adminAllNewsFetch,
  adminNewsFetch,
  myAllNewsFetch,
  myNewsDetail,
  myNewsFetch,
} from "src/action/news";
import ConfirmationModal from "../PendingApprovals/PendingNews/confirmationModal";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { FormattedMessage, IntlProvider, useIntl } from "react-intl";
import { getNews } from "src/action/homepage";
import NavBar from "src/components/NavBar/NavBar";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SignupLoginModal from "src/components/HomePageContent/SignupLogin/SignupLoginModal";
import Footer from "src/components/Footer/Footer";

const NewsDetail = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const { locale } = useRouter();

  const { newsId, section, module, newsType } = router.query;

  const [selectedNewsId, setSelectedNewsId] = useState(newsId || null);
  const [inputTextShow, setInputTextShow] = useState(1);
  const [action, setAction] = useState("");

  const [thirdPartyNews, setThirdPartyNews] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const handleClose = () => {
  //   setDialogOpen(false);
  // };
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false); // Track mouse hover state

  const [scrollInterval, setScrollInterval] = useState(null); // Store the interval ID

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

  const handleApproval = () => {
    setDialogOpen(true);
    setInputTextShow(0);
    setAction(
      intl.formatMessage({
        id: "pending.approvals.approveNewsMessage",
        defaultMessage: "Do you want to approve this News ?",
      })
    );
  };
  const handleRejection = () => {
    setDialogOpen(true);
    setInputTextShow(1);
    setAction(
      intl.formatMessage({
        id: "pending.approvals.rejectNewsMessage",
        defaultMessage: "Do you want to reject this News ?",
      })
    );
  };

  const goBack = () => {
    router.back();
  };

  const storedUserDetails = localStorage.getItem("userDetails");
  let UserId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const userId = UserId?.id;
  const ButtonCss = getButtonCss();

  const loadingState = useSelector((state) => state?.myNews?.loading);
  const myAllNewsLoading = useSelector((state) => state?.myNews?.myAllNewsLoading);
  console.log(myAllNewsLoading);

  useEffect(() => {
    if (module === "homepage" && newsId) {
      dispatch(myNewsDetail(newsId));
      dispatch(getNews());
    } else {
      // if (newsType === "own") {
      //   if (UserId?.role === "ENTREPRENEUR") {
      //     dispatch(myNewsFetch("startup", 1, "own", "", "", ""));
      //   } else if (UserId?.role === "INVESTOR") {
      //     dispatch(myNewsFetch("investor", 1, "own", "", "", ""));
      //   } else if (section === "PendingNews") {
      //     dispatch(adminNewsFetch("pending", 1, "own", "", "", ""));
      //   } else if (UserId?.role === "ADMINISTRATOR") {
      //     dispatch(adminNewsFetch("active", 1, "own", "", "", ""));
      //   } else if (module) {
      //     dispatch(getNews());
      //   }
      // } else {
      if (UserId?.role === "ENTREPRENEUR") {
        dispatch(myAllNewsFetch("startup", 1, "all", "", "", ""));
      } else if (UserId?.role === "INVESTOR") {
        dispatch(myAllNewsFetch("investor", 1, "all", "", "", ""));
      } else if (section === "PendingNews") {
        dispatch(adminAllNewsFetch("pending", 1, "all", "", "", ""));
      } else if (UserId?.role === "ADMINISTRATOR") {
        dispatch(adminAllNewsFetch("active", 1, "all", "", "", ""));
      } else if (module) {
        dispatch(getNews());
      } else if (UserId?.role === "INDIVIDUAL") {
        dispatch(myAllNewsFetch("individual", 1, "all", "", "", ""));
      }
      // }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserId?.role, dispatch, section, module, selectedNewsId]);

  useEffect(() => {
    if (selectedNewsId !== null && !thirdPartyNews) {
      dispatch(myNewsDetail(selectedNewsId));
    }
  }, [dispatch, router, selectedNewsId, thirdPartyNews]);

  let DetailNews = useSelector((state) => state?.myNews?.selectedMyNews);

  let newsData = useSelector((state) => state?.myNews?.myNews?.result?.rows);
  let AllNewsData = useSelector((state) => state?.myNews?.myAllNews?.result?.rows);

  const handleAddClick = (news) => {
    setSelectedNewsId(news?.id);
    if (module === "homepage") {
      const formattedTitle = news?.title.replace(/\s+/g, "-");

      if (news?.source_url === null) {
        router.push(
          `https://dic.hyperthink.io/DetailNewsPage/detailsNews?newsId=${news?.id}&module=${module}&header=${formattedTitle}`
        );
      } else {
        router.push(news?.source_url);
      }
    } else {
      if (news?.source_url !== null) {
        setThirdPartyNews(true);
        window.open(news.source_url, "_blank");
      } else {
        console.log("first");
        router.push(`../../News/detailsNews?newsId=${news?.id}&newsType=${newsType}`);
      }
    }
  };
  const lang = localStorage.getItem("lang");

  const homepageNews = useSelector((state) => state.homepage.news);
  const [tooltipTitle, setTooltipTitle] = useState("Copy News Link");
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

  const intl = useIntl();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setTooltipTitle("Copied!");
    setTimeout(() => setTooltipTitle("Copy News link"), 2000);
  };

  const newsEventPage = true;

  return (
    <>
      <style>
        {`
          @keyframes scrollEffect {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(10px); /* Adjust the effect for your needs */
            }
          }
        `}
      </style>

      <IntlProvider locale={shortLocale} messages={messages} onError={() => null}>
        {module === "homepage" && (
          <NavBar appState={appState} setAppState={setAppState} pricingPage={pricingPage} />
        )}
        <ExternalContainer>
          <Box sx={{ marginTop: module === "homepage" ? " 85px" : "" }}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ArrowBackOutlinedIcon onClick={goBack} sx={{ cursor: "pointer", mx: "10px" }} />
              <Typography style={{ fontSize: "0.75rem", fontWeight: lang === "ar" ? 600 : 500 }}>
                <FormattedMessage id="news.button.backToNews" defaultMessage="Back to news" />
              </Typography>
            </Box>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={8} md={8} xl={8}>
                {loadingState ? (
                  <>
                    <Card
                      sx={{
                        padding: "30px",
                        marginTop: "20px",
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
                        {DetailNews?.title}
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
                                    ` https://dic.hyperthink.io/DetailNewsPage/detailsNews?newsId=${newsId}
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

                    <CardMedia
                      sx={{
                        height: 250,
                        width: "100%",
                        objectFit: "contain", // or 'contain' if you want to fit the image within the container
                        marginTop: "10px",
                        // margin: "auto"
                      }}
                      component="img"
                      src={`data:image/PNG;base64,${DetailNews?.image_url}`}
                      alt="News Image"
                    />
                    {/* </Card> */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                        // border: "1px solid"
                      }}
                    >
                      <Stack
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          padding: "10px",
                        }}
                      >
                        <EventAvailableIcon style={{ fontSize: "0.8rem", marginRight: "3px" }} />
                        <Typography style={{ fontSize: "0.8rem" }}>
                          {/* {new Date(DetailNews?.publishedOn).toLocaleDateString("default", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })} */}
                          {formattedDate(DetailNews?.publishedOn)}
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
                        <DescriptionOutlinedIcon
                          style={{ fontSize: "0.8rem", marginRight: "3px" }}
                        />

                        <Typography style={{ fontSize: "0.8rem" }}>
                          <FormattedMessage id="detailNews.category" defaultMessage="Category :" />
                          <span>{DetailNews?.categories}</span>
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
                        <PlaceOutlinedIcon style={{ fontSize: "0.8rem", marginRight: "3px" }} />
                        <Tooltip title={DetailNews?.country}>
                          <Typography
                            style={{
                              fontSize: "0.8rem",
                              display: "inline-block", // Ensure it's an inline block for text truncation
                              overflow: "hidden", // Hide overflow text
                              textOverflow: "ellipsis", // Apply ellipsis if text overflows
                              whiteSpace: "nowrap",
                              // width: "150px"
                            }}
                          >
                            <FormattedMessage id="detailNews.country" defaultMessage="Country :" />
                            <span>{DetailNews?.country}</span>
                          </Typography>
                        </Tooltip>
                      </Stack>
                    </Box>
                    <Box>
                      <h5
                        style={{
                          fontWeight: "unset",
                          fontSize: "0.8rem",
                          margin: "5px",
                          textAlign: "justify",
                        }}
                      >
                        {DetailNews?.description}
                      </h5>
                    </Box>
                  </Card>
                )}
              </Grid>

              {myAllNewsLoading ? (
                <Grid item xs={12} md={4}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "700",
                      margin: "10px",
                      // textAlign: "center",
                    }}
                  >
                    Recent News
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
                <Grid xs={12} sm={4} md={4} xl={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column-reverse",
                        sm: "column",
                      },
                    }}
                  >
                    <Box item sx={{ px: 2, marginTop: "20px" }}>
                      <h4 style={{ margin: "4px" }}>
                        <FormattedMessage
                          id="detailNews.heading.recentNews"
                          defaultMessage="Recent News"
                        />
                      </h4>
                      <Box
                        ref={scrollContainerRef}
                        onMouseEnter={handleMouseEnter} // Stop scroll on hover
                        onMouseLeave={handleMouseLeave} // Resume scroll when mouse leaves
                        sx={{
                          height: module ? "80vh" : "60vh",
                          overflowY: "auto",
                          scrollBehavior: "smooth", // Default smooth scrolling
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
                        {!module
                          ? AllNewsData?.map((data) => (
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
                                      }}
                                    >
                                      {data?.title}
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
                                        {/* {new Date(data?.publishedOn).toLocaleString("default", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric"
                                        })}{" "} */}
                                        {formattedDate(data?.publishedOn)}
                                      </Typography>

                                      {/* <Typography
                                        sx={{
                                          fontSize: "0.7rem",
                                          marginRight: "10px",
                                          height: "20px !important",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        <PlaceRoundedIcon
                                          sx={{
                                            fontSize: "1rem",
                                            position: "relative",
                                            top: "3px",
                                          }}
                                        />{" "}
                                        {data?.country}
                                      </Typography> */}
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
                                        width: "130px !important",
                                        height: "80px",
                                        objectFit: "cover", // or 'contain' if you want to fit the image within the
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
                                  </Grid>
                                </Grid>
                              </Card>
                            ))
                          : homepageNews?.results
                              // ?.filter((news) => news?.source_url === null)
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
                                        {data?.title}
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
                                          {/* {new Date(data?.publishedOn).toLocaleString("default", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                          })}{" "} */}
                                          {formattedDate(data?.publishedOn)}
                                        </Typography>

                                        {/* <Typography
                                          sx={{
                                            fontSize: "0.7rem",
                                            marginRight: "10px",
                                            height: "20px !important",
                                            overflowX: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          <PlaceRoundedIcon
                                            sx={{
                                              fontSize: "1rem",
                                              position: "relative",
                                              top: "3px",
                                            }}
                                          />{" "}
                                          {data?.country}
                                        </Typography> */}
                                      </Box>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      xl={4}
                                      container
                                      justifyContent="center"
                                      sx={{ padding: "10px 0px !important" }}
                                    >
                                      <CardMedia
                                        sx={{
                                          width: "130px !important",
                                          height: "80px",
                                          objectFit: "cover", // or 'contain' if you want to fit the image within the
                                        }}
                                        component="img"
                                        src={
                                          data?.source_url === null
                                            ? `data:image/PNG;base64,${data?.image_url}`
                                            : data?.image_url
                                            ? data?.image_url
                                            : "/Images/newsImage.jpg"
                                        }
                                        // src={`data:image/PNG;base64,${data?.image_url}`}
                                        alt="News Image"
                                      />
                                    </Grid>
                                  </Grid>
                                </Card>
                              ))}
                      </Box>
                    </Box>
                    {section && (
                      <Box sx={{ m: 2, gap: "10px", display: "flex", justifyContent: "center" }}>
                        <Button
                          onClick={handleApproval}
                          style={{
                            ...ButtonCss,
                            marginRight: "10px",
                            background: "green",
                            color: "#fff",
                            padding: "8px 20px",
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={handleRejection}
                          size="small"
                          style={{
                            ...ButtonCss,
                            marginRight: "10px",
                            background: "#d32f2f",
                            color: "#fff",
                            padding: "8px 20px",
                          }}
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

      {dialogOpen && (
        <ConfirmationModal
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          // adminId={adminId}
          // selectedMandateId={selectedMandateId}
          // confirmDialogOpen={confirmDialogOpen}
          // setConfirmDialogModal={setConfirmDialogModal}
          action={action}
          selectedNewsId={selectedNewsId}
          inputTextShow={inputTextShow}
        />
      )}

      {loginDialogOpen && (
        <SignupLoginModal dialogOpen={loginDialogOpen} setDialogOpen={setLoginDialogOpen} />
      )}
    </>
  );
};
NewsDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NewsDetail;
