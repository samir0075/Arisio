import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { formattedDate, formattedEventDate, getButtonCss } from "src/utils/util";
import English from "../../locales/en-US";
import Arabic from "../../locales/ar-EG";
import NavBar from "src/components/NavBar/NavBar";
import { getEvents } from "src/action/homepage";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Tooltip,
  Typography,
  Skeleton,
  Card,
} from "@mui/material";
import styles from "../../components/HomePageContent/EventSection/EventSection.module.css";
import NoDataMsg from "src/components/NoDataMsg";
import { getCountries, getLocation } from "src/action/globalApi";
import SignupLoginModal from "src/components/HomePageContent/SignupLogin/SignupLoginModal";
import Footer from "src/components/Footer/Footer";
import Loader from "src/components/Loader";

const Events = () => {
  const { locale } = useRouter();
  const ButtonCss = getButtonCss();
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [country, setCountry] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appState, setAppState] = useState({ language: "en" });
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

  const buttonColor = {
    background: theme => `${theme.palette.neutral.buttonBackground}`,
    color: "#fff",
    padding: "3px 8px",
    fontSize: "0.8rem",
    borderRadius: "5px",
    "&:hover": {
      background: theme => `${theme.palette.neutral.buttonBackground}`
    }
  };

  const heading = {
    color: theme => `${theme.palette.neutral.textColor}`,
    fontWeight: "600",
    fontSize: "1rem",
    overflow: "hidden",
    height: "45px !important",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word"
  };

  // const formatDate = dateString => {
  //   const options = { year: "numeric", month: "numeric", day: "numeric" };
  //   const date = new Date(dateString);

  //   const formattedDate = date.toLocaleDateString(undefined, options);

  //   // Pad day and month with leading zeros if less than 10
  //   const [month, day, year] = formattedDate.split("/");
  //   const paddedMonth = month?.padStart(2, "0");
  //   const paddedDay = day?.padStart(2, "0");

  //   return `${paddedDay}/${paddedMonth}/${year}`;
  // };

  useEffect(() => {
    dispatch(getCountries());
    // if (Object.keys(UserCountry).length === 0) {
    //   dispatch(getLocation());
    // }
  }, [dispatch]);

  const countryData = useSelector(state => state.globalApi.countries);
  const UserCountry = useSelector(state => state?.globalApi?.location);

  // useEffect(() => {
  //   if (UserCountry && UserCountry.country_code3) {
  //     setCountry(UserCountry.country_code3);
  //   }
  // }, [UserCountry]);
  // useEffect(() => {
  //   if (UserCountry.country_code3 === "ARE") {
  //     setCountry("UAE");
  //   }
  // }, [UserCountry]);

  const handlePagination = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (country !== null) {
      dispatch(getEvents(country, page));
    }
  }, [dispatch, country, page]);

  const events = useSelector(state => state.homepage.events);

  const loader = useSelector(state => state.homepage.eventsLoading);

  const slicedEvents = events?.results;

  const home = "homepage";

  const handleReadMoreClick = (event, e) => {
    e.preventDefault();

    console.log(event);

    const formattedTitle = event?.header.replace(/\s+/g, "-");

    router.push(
      `/DetailEventsPage/detailEvent?eventId=${event?.id}&module=homepage&header=${formattedTitle}`
    );
  };

  const handleCountryChange = event => {
    setCountry(event.target.value);
    setPage(1);
  };

  const handleSignupLogin = () => {
    setDialogOpen(true);
  };

  const newsEventPage = true;

  return (
    <>
      <IntlProvider locale={shortLocale} messages={messages} onError={() => null}>
        <NavBar appState={appState} setAppState={setAppState} pricingPage={pricingPage} />
        <Grid
          sx={{
            background: "rgba(65, 148, 179,0.1) !important",
            padding: { xs: "10px 0", md: "20px 5px" },
            marginTop: "75px"
          }}
          id="events"
          // className={styles.eventExternal}
        >
          <Grid sx={{ maxWidth: "1500px" }}>
            <Grid
              container
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ maxWidth: "1400px" }}
            >
              <Grid item xs={6} sm={6} md={6} xl={6} sx={{ mt: 1 }}>
                <Typography
                  sx={{
                    color: "#000000 !important",
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    paddingLeft: { xs: "10px", md: "20px", lg: "20px" },
                    marginLeft: { xs: "none", md: "30px", lg: "30px" }
                  }}
                >
                  Events
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                xl={6}
                container
                justifyContent={"flex-end"}
                paddingRight={{ xs: "10px", md: "50px", lg: "50px" }}
                // marginLeft={{ xs: "none", md: "30px", lg: "30px" }}
                alignItems="center"
              >
                <Grid item sx={{ mt: 1 }}>
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
                </Grid>
                <Grid sx={{ mt: 1 }}>
                  <Button
                    onClick={handleSignupLogin}
                    sx={{
                      background: theme => `${theme.palette.neutral.buttonBackground}`,
                      ml: 2,
                      color: "#fff !important",
                      "&:hover": {
                        color: "#fff !important",
                        background: theme => `${theme.palette.neutral.buttonBackground}`
                      }
                    }}
                  >
                    Add Events
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Divider
              sx={{
                border: "1px solid #DDDDDD",
                maxWidth: "1390px",
                margin: { xs: "20px 0 0 0", md: "20px 50px 0 50px" }
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
                  padding: { xs: "0 ", sm: "0 40px", md: "0 40px" }
                }}
                // ref={scrollRef}
              >
                {loader === true ? (
                  <Grid container spacing={2} padding={2} sx={{width:"80%", }}>
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
                ) : slicedEvents?.length > 0 ? (
                  // <Grid container xs={12} sm={12} md={12} xl={12} className={styles.eventOuter}>
                  slicedEvents?.map(card => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      xl={3}
                      sx={{
                        maxWidth: "320px !important",
                        pointer: "none",
                        margin: "10px",
                        background: "#fff",
                        borderRadius: "5px"
                      }}
                      key={card.id}
                    >
                      <Grid sx={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
                        {/* <CardActionArea className={styles.eventCardExternal}> */}
                        <Box sx={{ background: "#FFFFFF", borderRadius: "10px", margin: "20px" }}>
                          <CardMedia
                            sx={{
                              height: 150,
                              width: 280,
                              objectFit: "cover",
                              borderRadius: "5px"
                            }}
                            component="img"
                            src={
                              card?.image
                                ? `data:image/PNG;base64,${card?.image}`
                                : "/Images/no-results.png"
                            }
                            alt="No correct Event Image"
                          />
                        </Box>
                        <CardContent style={{ padding: "0px 24px", width: "100%" }}>
                          <Grid container justifyContent="space-between">
                            <Tooltip title={card?.venue}>
                              <Typography
                                className={styles.eventDate}
                                component="div"
                                sx={{
                                  width: "110px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.8rem"
                                }}
                              >
                                {card?.venue}
                              </Typography>
                            </Tooltip>
                            <Typography
                              className={styles.eventDate}
                              component="div"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              <CalendarMonthRoundedIcon
                                sx={{ fontSize: "1rem", position: "relative", top: "3px" }}
                              />{" "}
                              {/* {formatDate(card.date)} */}
                              {formattedEventDate(card?.date)}
                            </Typography>
                          </Grid>
                          <Typography sx={heading} component="div">
                            <Tooltip title={card?.header}> {card?.header}</Tooltip>
                          </Typography>
                          {/* <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}> */}
                          {/* <Typography className={styles.eventOrgSubTitle} component="div">
                            Organization Name
                          </Typography>
                          <Typography className={styles.eventOrgTitle} component="div">
                            <Tooltip title={card.organization}> {card.organization}</Tooltip>
                          </Typography> */}
                          {/* </Box> */}
                          {/* <Tooltip title={card.content}> */}{" "}
                          <Typography
                            className={styles.eventDescription}
                            sx={{
                              // width: "50%",
                              wordWrap: "break-word", // Allows long words to break and wrap to the next line
                              overflowWrap: "break-word", // Same as word-wrap for better support across browsers
                              whiteSpace: "normal", // Ensures text will wrap normally
                              display: "block" // Ensure the element behaves as a block element for wrapping
                            }}
                            component="div"
                          >
                            {card.content}
                          </Typography>
                          {/* </Tooltip> */}
                        </CardContent>
                        <CardContent
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: "5px",
                            fontSize: "0.8rem",

                            margin: "10px 20px"
                          }}
                        >
                          {/* <a
                      onClick={(e) => {
                        handleReadMoreClick(card?.id, e);
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
                          <Button
                            sx={buttonColor}
                            onClick={e => {
                              handleReadMoreClick(card, e);
                            }}
                          >
                            Read More
                          </Button>
                        </CardContent>
                      </Grid>
                    </Grid>
                  ))
                ) : (
                  // </Grid>
                  <NoDataMsg message={"There are no events to show"} />
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
              count={events?.totalPages}
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

export default Events;
