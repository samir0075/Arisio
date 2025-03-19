import React, { useEffect } from "react";
import styles from "./EventSection.module.css";
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "src/action/homepage";
import { useRouter } from "next/router";
import NoDataMsg from "src/components/NoDataMsg";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { formattedDate, getButtonCss, formattedEventDate } from "src/utils/util";
import Loader from "src/components/Loader";
const EventSection = () => {
  const ButtonCss = getButtonCss();
  const dispatch = useDispatch();
  const router = useRouter();

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
  const UserCountry = useSelector((state) => state.globalApi.location);
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";

  useEffect(() => {
    if (UserCountry?.country_code3 !== undefined) dispatch(getEvents(UserCountry?.country_code3));
  }, [dispatch, UserCountry?.country_code3]);

  const loader = useSelector((state) => state.homepage.loading);

  const events = useSelector((state) => state.homepage.events);

  const isMobileScreen = useMediaQuery("(max-width:1440px)");

  const slicedEvents = isMobileScreen ? events?.results?.slice(0, 3) : events?.results?.slice(0, 4);
  const home = "homepage";

  const handleReadMoreClick = (event, e) => {
    e.preventDefault();
    const formattedTitle = event?.header.replace(/\s+/g, "-");

    router.push(
      `/DetailEventsPage/detailEvent?eventId=${event?.id}&module=homepage&header=${formattedTitle}`
    );
  };

  const handleEventsClick = () => {
    router.push("./homepage_events");
  };

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

  return (
    <>
      <Grid
        sx={{
          background: (theme) =>
            `linear-gradient(to right, ${theme.palette.neutral.primary} 0%,      
               
            ${theme.palette.neutral.tertiary} 150% )`,
          // minHeight: "calc(100vh - 85px)",
          padding: "0px 5px",
        }}
        id="events"
        // className={styles.eventExternal}
      >
        <Typography
          sx={{
            paddingTop: "85px",
            // marginRight: { xs: "20px", sm: "0" },
            paddingLeft: { xs: "20px", sm: "0" },
            textAlign: { xs: "left", sm: "center" },
          }}
          className={styles.eventOuterHeading}
        >
          <FormattedMessage id="homepage.events.title" defaultMessage="Events" />
        </Typography>
        {events?.results?.length >= 1 && (
          <Grid
            container
            justifyContent="flex-end"
            sx={{
              position: "relative",
              bottom: "35px",
              right: isRTL ? "none" : { xs: "10px", sm: "25px" },
              left: isRTL ? { xs: "10px", sm: "25px" } : "none",
              cursor: events?.results?.length >= 1 && "pointer",
            }}
          >
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
                  color: events?.results?.length >= 1 ? "#fff" : "#E4E0E1",
                  fontWeight: "500",
                  marginLeft: isRTL ? "4px" : "0", // Add space between arrow and text in RTL
                  marginRight: !isRTL ? "4px" : "0", // Add space between arrow and text in LTR
                }}
                onClick={events?.results?.length >= 1 ? handleEventsClick : null}
              >
                <FormattedMessage id="homepage.section.viewAll" defaultMessage="View All" />
              </Typography>

              {!isRTL && (
                <ArrowRightAltIcon sx={{ color: "#E4E0E1", fontSize: "24px", marginLeft: "8px" }} /> // Same here
              )}
            </Box>
          </Grid>
        )}

        {/* <Box sx={{ display: "flex", justifyContent: "center" }}> */}
        {/* <Box sx={{ display: { xs: "none", sm: "flex", md: "flex" } }}>
            <button
              onClick={() => scrollContainer(-300)}
              style={scrollButtonStyle}
              className={styles.scrollButtonLeft}
            >
              <KeyboardDoubleArrowLeftOutlinedIcon sx={{ fontSize: "30px" }} />
            </button>
          </Box> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          // ref={scrollRef}
        >
          {loader === true ? (
            <Loader color="#FFFFFF" />
          ) : slicedEvents?.length > 0 ? (
            // <Grid container xs={12} sm={12} md={12} xl={12} className={styles.eventOuter}>
            slicedEvents?.map((card) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={3}
                sx={{
                  maxWidth: { xs: "295px !important", sm: "320px !important" },
                  pointer: "none",
                  margin: "10px",
                  background: "#fff",
                  borderRadius: "10px",
                }}
                key={card.id}
              >
                {/* <CardActionArea className={styles.eventCardExternal}> */}
                <Box sx={{ background: "#FFFFFF", borderRadius: "10px", margin: "20px" }}>
                  <CardMedia
                    // className={styles.eventImg}
                    sx={{
                      borderRadius: "10px",
                      width: { xs: "255px", sm: "280px" },
                    }}
                    component="img"
                    height="150"
                    src={
                      card?.image
                        ? `data:image/PNG;base64,${card?.image}`
                        : "/Images/no-results.png"
                    }
                    alt="No correct Event Image"
                  />
                </Box>
                <CardContent style={{ padding: "0px 24px" }}>
                  <Grid container justifyContent="space-between">
                    <Tooltip title={card?.venue}>
                      <Typography
                        className={styles.eventDate}
                        component="div"
                        sx={{
                          width: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {card?.venue}
                      </Typography>
                    </Tooltip>
                    <Typography className={styles.eventDate} component="div">
                      {formattedEventDate(card.date)}
                    </Typography>
                  </Grid>

                  <Typography sx={heading} component="div">
                    <Tooltip title={card.header}> {card.header}</Tooltip>
                  </Typography>
                  {/* <Typography className={styles.eventOrgSubTitle} component="div">
                      Organization Name
                    </Typography>
                    <Typography className={styles.eventOrgTitle} component="div">
                      <Tooltip title={card.organization}> {card.organization}</Tooltip>
                    </Typography> */}

                  {/* <Tooltip title={card.content}> */}
                  <Typography className={styles.eventDescription} component="div">
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

                    margin: "10px 20px",
                  }}
                >
                  <Button
                    sx={buttonColor}
                    onClick={(e) => {
                      handleReadMoreClick(card, e);
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Grid>
            ))
          ) : (
            // </Grid>
            <NoDataMsg message={"There are no events to show"} home={home} />
          )}
        </Box>
        {/* </Box> */}
      </Grid>
    </>
  );
};

export default EventSection;
