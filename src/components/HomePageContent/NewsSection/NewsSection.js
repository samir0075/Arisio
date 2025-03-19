import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import styles from "./NewsSection.module.css";
import { getNews } from "src/action/homepage";
import { useDispatch, useSelector } from "react-redux";
import NoDataMsg from "src/components/NoDataMsg";
import { useRouter } from "next/router";
// import { getButtonCss } from "src/utils/util";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { color } from "@mui/system";
import Loader from "src/components/Loader";
import { formattedDate } from "src/utils/util";
import { FormattedMessage } from "react-intl";
const NewsSection = () => {
  // const ButtonCss = getButtonCss();
  const router = useRouter();
  const dispatch = useDispatch();
  const UserCountry = useSelector((state) => state.globalApi.location);
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  useEffect(() => {
    if (UserCountry?.country_code3 !== undefined) {
      dispatch(getNews(UserCountry?.country_code3));
    }
  }, [dispatch, UserCountry.country_code3]);

  const buttonColor = {
    background: (theme) => `${theme.palette.neutral.buttonBackground}`,
    color: "#fff",
    padding: "3px 8px",
    fontSize: "0.8rem",
    borderRadius: "5px",
    "&:hover": {
      background: (theme) => `${theme.palette.neutral.buttonBackground}`,
    },
  };

  const loader = useSelector((state) => state.homepage.loading);
  const newsData = useSelector((state) => state.homepage.news);
  const handleReadMoreClick = (news, e) => {
    e.preventDefault();

    const formattedTitle = news?.title.replace(/\s+/g, "-");

    news?.source_url === null && news?.source_id === 3
      ? router.push(
          `/DetailNewsPage/detailsNews?newsId=${news.id}&module=homepage&header=${formattedTitle}`
        )
      : window.open(news?.source_url, "_blank", "noopener noreferrer");
  };

  const isMobileScreen = useMediaQuery("(max-width:1440px)");

  const filteredNewsData = isMobileScreen
    ? newsData?.results?.filter((news) => news.source_url !== null).slice(0, 3)
    : newsData?.results?.filter((news) => news.source_url !== null).slice(0, 4);

  const home = "homepage";

  const handleNewsClick = () => {
    router.push("./homepage_news");
  };

  return (
    <>
      <Grid
        id="news"
        // container

        sx={{
          background: (theme) =>
            `linear-gradient(to right, ${theme.palette.neutral.primary} 0%,      
               
            ${theme.palette.neutral.tertiary} 150% )`,
          // minHeight: "calc(100vh - 85px)",
          padding: "0px 5px",
        }}
      >
        <Typography
          className={styles.NewsHeading}
          sx={{
            paddingTop: "85px",
            paddingLeft: { xs: "20px", sm: "0" },
            textAlign: { xs: "left", sm: "center" },
          }}
        >
          <FormattedMessage id="homepage.nav.News" defaultMessage="News" />
        </Typography>
        {newsData?.results?.length >= 1 && (
          <Grid
            container
            justifyContent="flex-end"
            sx={{
              position: "relative",
              bottom: "35px",
              right: isRTL ? "none" : { xs: "10px", sm: "25px" },
              left: isRTL ? { xs: "10px", sm: "25px" } : "none",
              cursor: newsData?.results?.length >= 1 && "pointer",
            }}
          >
            {/* {isRTL && <ArrowRightAltIcon sx={{ position: "relative", top: "7px" }} />} */}
            <Box
              sx={{
                display: "flex",
                // justifyContent: isRTL ? "flex-end" : "flex-start",
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
              }}
            >
              {isRTL && (
                <ArrowRightAltIcon
                  sx={{
                    transform: "rotate(-180deg)",
                    color: "#E4E0E1",
                    fontSize: "24px",
                    marginLeft: "8px",
                  }}
                /> // Same here
              )}

              <Typography
                sx={{
                  color: newsData?.results?.length >= 1 ? "#fff" : "#E4E0E1",
                  fontWeight: "500",
                  marginLeft: isRTL ? "4px" : "0", // Add space between arrow and text in RTL
                  marginRight: !isRTL ? "4px" : "0", // Add space between arrow and text in LTR
                }}
                onClick={newsData?.results?.length >= 1 ? handleNewsClick : null}
              >
                <FormattedMessage id="homepage.section.viewAll" defaultMessage="View All" />
              </Typography>

              {!isRTL && (
                <ArrowRightAltIcon sx={{ color: "#E4E0E1", fontSize: "24px", marginLeft: "8px" }} /> // Same here
              )}
            </Box>
          </Grid>
        )}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {loader === true ? (
              <Loader color="#FFFFFF" />
            ) : filteredNewsData?.length > 0 ? (
              filteredNewsData.map((news) => (
                <Grid
                  key={news.id}
                  xs={12}
                  sm={6}
                  md={4}
                  xl={3}
                  sx={{
                    maxWidth: "320px !important",
                    // width: "280px",
                    pointer: "none",
                    margin: "10px",
                    background: "#fff",
                    borderRadius: "10px",
                  }}
                >
                  <Grid
                    sx={{
                      background: "#FFFFFF",
                      borderRadius: "10px",
                      padding: "20px",
                      minWidth: "300px !important",
                    }}
                  >
                    <CardMedia
                      sx={{
                        height: 150,
                        // width: 280,
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                      component="img"
                      src={
                        // news?.source_url === null
                        // `data:image/PNG;base64,${news?.image_url}`
                        news?.image_url ? news?.image_url : "/Images/newsImage.jpg"
                      }
                      onError={(e) => {
                        e.target.src = "/Images/newsImage.jpg"; // Set fallback image if the original image fails
                      }}
                      loading="lazy"
                      alt="News Image"
                    />
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <Tooltip title={news?.country}>
                        <Typography
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "400",
                            height: "20px",
                            // width: "190px",
                            overflow: "auto",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            "&::-webkit-scrollbar": {
                              display: "none",
                            },
                          }}
                        >
                          {news?.country.split(",")[0].trim().charAt(0).toUpperCase() +
                            news?.country.split(",")[0].trim().slice(1).toLowerCase()}
                          {/* {UserCountry?.country} */}
                        </Typography>
                      </Tooltip>
                      <Typography style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        {formattedDate(news?.publishedOn)}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "700",
                        color: (theme) => `${theme.palette.neutral.textColor}`,
                        maxWidth: "100%",
                        overflowY: "hidden",
                        textOverflow: "ellipsis",
                        marginTop: "5px",
                        padding: "5px",
                        height: "75px",
                        "&:hover": {
                          color: (theme) => `${theme.palette.neutral.textColor}`,
                        },
                      }}
                    >
                      <Tooltip title={news?.title}>{news?.title}</Tooltip>
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: "400",
                        maxWidth: "100%",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: "2",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginTop: "10px",
                        padding: "5px",
                        height: "45px",
                      }}
                    >
                      {news?.description}
                    </Typography>

                    <CardContent
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "10px",
                        padding: "5px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {/* <a
                        onClick={(e) => {
                          handleReadMoreClick(news, e);
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "0px",
                          cursor: "pointer",
                          color: "rgba(108, 25, 62, 1)",
                          fontWeight: "600",
                        }}
                      >
                        Read More ...
                      </a> */}
                      <Stack direction="row" spacing={1}>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: "700",
                            borderRadius: "5px",
                            color: (theme) => `${theme.palette.neutral.textColor}`,
                          }}
                        >
                          {news?.categories.split(",")[0].trim().charAt(0).toUpperCase() +
                            news?.categories.split(",")[0].trim().slice(1)}
                        </Typography>
                      </Stack>
                      <Button
                        sx={buttonColor}
                        onClick={(e) => {
                          handleReadMoreClick(news, e);
                        }}
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Grid>
                </Grid>
              ))
            ) : (
              <NoDataMsg message={"There are no news to show"} home={home} />
            )}
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default NewsSection;
