import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { getNews } from "src/action/homepage";
import { useDispatch, useSelector } from "react-redux";
import NoDataMsg from "src/components/NoDataMsg";
import { useRouter } from "next/router";
import { formattedDate, getButtonCss } from "src/utils/util";
import NavBar from "src/components/NavBar/NavBar";
import { FormattedMessage, IntlProvider } from "react-intl";
import English from "../../locales/en-US";
import Arabic from "../../locales/ar-EG";
import { getCountries, getLocation } from "src/action/globalApi";
import { myNewsType } from "src/action/news";
import SignupLoginModal from "src/components/HomePageContent/SignupLogin/SignupLoginModal";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import Footer from "src/components/Footer/Footer";
import Loader from "src/components/Loader";

const NewsSection = () => {
  const { locale } = useRouter();
  const ButtonCss = getButtonCss();
  const router = useRouter();
  const dispatch = useDispatch();
  const [country, setCountry] = useState(null);
  const [category, setCategory] = useState("");

  const newsEventPage = true;
  const UserCountry = useSelector((state) => state.globalApi.location);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(myNewsType());
    if (Object.keys(UserCountry).length === 0) {
      dispatch(getLocation());
    }
  }, [dispatch, UserCountry]);

  useEffect(() => {
    if (UserCountry && UserCountry.country_code3) {
      setCountry(UserCountry.country_code3);
    }
  }, [UserCountry]);

  useEffect(() => {
    if (UserCountry.country_code3 === "ARE") {
      setCountry("UAE");
    }
  }, [UserCountry]);

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
  const heading = {
    color: (theme) => `${theme.palette.neutral.textColor}`,
    fontWeight: "600",
    fontSize: "1rem",
    overflow: "hidden",
    height: "45px !important",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word",
  };

  const countryData = useSelector((state) => state.globalApi.countries);

  const categoriesDetails = useSelector((state) => state.myNews.myNewsType);
  const [page, setPage] = useState(1);

  const handlePagination = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (country !== null) {
      dispatch(getNews(country, category, page));
    }
  }, [dispatch, country, category, page]);

  const newsData = useSelector((state) => state.homepage.news);

  const loader = useSelector((state) => state.homepage.newsLoading);

  const handleReadMoreClick = (news, e) => {
    e.preventDefault();

    const formattedTitle = news?.title.replace(/\s+/g, "-");

    news?.source_url === null
      ? router.push(
          `/DetailNewsPage/detailsNews?newsId=${news.id}&module=homepage&header=${formattedTitle}`
        )
      : window.open(news?.source_url, "_blank", "noopener noreferrer");
  };

  const filteredNewsData = newsData?.results;
  const home = "homepage";

  // const handleNewsClick = () => {
  //   router.push("./homepage_news");
  // };

  const [appState, setAppState] = useState({ language: "en" });
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    setPage(1);
  };
  const handleTechnologyChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSignupLogin = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <IntlProvider locale={shortLocale} messages={messages} onError={() => null}>
        <NavBar appState={appState} setAppState={setAppState} pricingPage={pricingPage} />

        <Grid
          id="news"
          // container
          // justifyContent="center"
          sx={{
            background: "rgba(65, 148, 179,0.1) !important",
            padding: { xs: "10px 0", md: "20px 5px" },
            marginTop: "75px",
          }}
        >
          <Grid sx={{ maxWidth: "1500px" }}>
            <Grid
              container
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{
                maxWidth: "1425px",
              }}
            >
              <Grid item xs={6} sm={4} md={6} xl={6} sx={{ mt: 1 }}>
                <Typography
                  sx={{
                    color: "#000000 !important",
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    paddingLeft: { xs: "10px", md: "20px", lg: "20px" },
                    marginLeft: { xs: "none", md: "30px", lg: "30px" },
                  }}
                >
                  News
                </Typography>
              </Grid>

              <Grid
                item
                xs={6}
                sm={8}
                md={6}
                xl={6}
                container
                justifyContent={"flex-end"}
                paddingRight={{ xs: "10px", md: "50px", lg: "50px" }}
                alignItems="center"
              >
                {/* <Grid item sx={{ mt: 1 }}>
                  <Select
                    style={{ background: "#FFFFFF" }}
                    size="small"
                    fullWidth
                    labelId="single-select-label"
                    id="single-select"
                    value={category}
                    label="Technology"
                    onChange={handleTechnologyChange}
                    displayEmpty
                  >
                    <MenuItem style={{ fontSize: "0.8rem" }} value="">
                      All Category
                    </MenuItem>
                    {categoriesDetails?.map((option) => (
                      <MenuItem style={{ fontSize: "0.8rem" }} key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid> */}

                <Grid item sx={{ ml: 2, mt: 1 }}>
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
                <Grid sx={{ mt: 1 }}>
                  <Button
                    onClick={handleSignupLogin}
                    sx={{
                      background: (theme) => `${theme.palette.neutral.buttonBackground}`,
                      color: "#fff !important",
                      ml: 2,
                      "&:hover": {
                        background: (theme) => `${theme.palette.neutral.buttonBackground}`,
                        color: "#fff !important",
                      },
                    }}
                  >
                    <FormattedMessage id="news.addNews" defaultMessage="Submit News" />
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Divider
              sx={{
                border: "1px solid #DDDDDD",
                maxWidth: "1390px",
                margin: { xs: "20px 0 0 0", md: "20px 50px 0 50px" },
                // marginTop: "20px",
              }}
            />
            <Box sx={{ display: "flex", marginTop: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  width: "100%",
                  padding: { xs: "0 ", sm: "0 40px", md: "0 40px" },
                }}
              >
                {loader ? (
                  <Grid container spacing={2} padding={2} sx={{ width: "80%" }}>
                    {Array.from(new Array(12)).map((_, index) => (
                      <Grid key={index} item xs={12} sm={6} md={4} xl={3}>
                        <Card
                          sx={{
                            background: (theme) =>
                              `linear-gradient(to right, ${theme.palette.neutral.theme1}, ${theme.palette.neutral.theme2})`,
                            margin: "5px", // Reduced margin for less space between cards
                            borderRadius: "5px",
                            boxShadow:
                              "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                            maxWidth: "100%", // Allow flexibility within the grid
                            padding: "20px",
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
                ) : filteredNewsData?.length > 0 ? (
                  filteredNewsData
                    .filter((data) => data.is_approved === 1)
                    .map((news) => (
                      <Grid key={news.id} xs={12} sm={6} md={3} xl={3}>
                        <Card
                          key={news.id}
                          style={{
                            background: (theme) =>
                              `linear-gradient(to right, ${theme.palette.neutral.theme1} , ${theme.palette.neutral.theme2} )`,
                            margin: "10px",
                            borderRadius: "5px",
                            boxShadow:
                              "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                            maxWidth: "320px",
                            padding: "20px",
                            marginTop: "10px",
                          }}
                        >
                          <Box>
                            <CardMedia
                              sx={{
                                height: 150,
                                width: 280,
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                              component="img"
                              src={
                                news?.source_url === null
                                  ? `data:image/PNG;base64,${news?.image_url}`
                                  : news?.image_url
                                  ? news?.image_url
                                  : "/Images/newsImage.jpg"
                              }
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
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                    "&::-webkit-scrollbar": {
                                      display: "none",
                                    },
                                  }}
                                >
                                  {news?.country}
                                </Typography>
                              </Tooltip>
                              <Typography style={{ fontSize: "0.8rem", fontWeight: "500" }}>
                                <CalendarMonthRoundedIcon
                                  sx={{
                                    fontSize: "1rem",
                                    position: "relative",
                                    top: "3px",
                                    right: "5px",
                                  }}
                                />
                                {formattedDate(news?.publishedOn)}
                              </Typography>
                            </Box>
                            <Typography sx={heading}>
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
                          </Box>

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
                        </Card>
                      </Grid>
                    ))
                ) : (
                  <NoDataMsg message={"There are no news to show"} />
                )}
              </Box>
            </Box>
          </Grid>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ my: 2, bgcolor: "#FFFFFF", p: 2, maxWidth: "1400px" }}
          >
            <Pagination
              count={newsData?.totalPages}
              showFirstButton
              showLastButton
              page={page}
              onChange={handlePagination}
            />
          </Grid>
        </Grid>

        <Footer newsEventPage={newsEventPage} />
      </IntlProvider>
      {dialogOpen && <SignupLoginModal dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />}
    </>
  );
};

export default NewsSection;
