import React, { useEffect, useState } from "react";
import styles from "./MandateSection.module.css";
import {
  Box,
  Card,
  Typography,
  Button,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Tooltip,
  Grid,
  useMediaQuery,
} from "@mui/material";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import SignupLoginModal from "../SignupLogin/SignupLoginModal";
import { getNewMandate } from "../../../action/homepage";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import NoDataMsg from "src/components/NoDataMsg";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { getButtonCss } from "src/utils/util";
import Loader from "src/components/Loader";

const MandateSection = () => {
  const ButtonCss = getButtonCss();
  const [dialogOpen, setDialogOpen] = useState(false);
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";

  const dispatch = useDispatch();

  const UserCountry = useSelector((state) => state.globalApi.location);

  useEffect(() => {
    if (UserCountry?.country_code3 !== undefined) {
      dispatch(getNewMandate(UserCountry?.country_code3));
    }
  }, [UserCountry?.country_code3, dispatch]);

  /*
   *UseSelector used to get data from redux store
   */
  let mandatesData = useSelector((state) => state?.homepage);

  const loader = useSelector((state) => state.homepage.loading);

  let slicedMandateArray = {};

  if (mandatesData?.newMandate?.length) {
    slicedMandateArray = mandatesData?.newMandate?.slice(0, 4);
  }

  const isMobileScreen = useMediaQuery("(max-width:1440px)");

  slicedMandateArray = isMobileScreen
    ? mandatesData?.newMandate?.slice(0, 3)
    : mandatesData?.newMandate?.slice(0, 4);

  /*
   *For Opening Signup and Login Dialog
   */

  const handleSignupLogin = () => {
    setDialogOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month?.padStart(2, "0");
    const paddedDay = day?.padStart(2, "0");

    return `${paddedDay}/${paddedMonth}/${year}`;
  };

  const home = "homepage";

  const buttonColor = {
    background: (theme) => `${theme.palette.neutral.buttonBackground}`,
    color: "#fff",
    padding: "3px 8px",
    fontSize: "0.8rem",
    borderRadius: "5px",
    marginTop: "10px",
    "&:hover": {
      background: (theme) => `${theme.palette.neutral.buttonBackground}`,
    },
  };

  const heading = {
    color: (theme) => `${theme.palette.neutral.textColor}`,
    fontWeight: "600",
    fontSize: "1rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "320px !important",
  };

  const bodyColor = {
    color: (theme) => `${theme.palette.neutral.textColor}`,
    fontWeight: "600",
    fontSize: "1rem",
  };

  return (
    <>
      <Grid
        id="mandates"
        sx={{
          background: (theme) =>
            `linear-gradient(to right, ${theme.palette.neutral.primary} 0%,      
               
            ${theme.palette.neutral.tertiary} 150% )`,
          // minHeight: "calc(100vh - 85px)",
          padding: "0px 5px",
        }}
        // className={styles.mandateExternal}
      >
        <Typography
          sx={{
            paddingTop: "85px",
            paddingLeft: { xs: "20px", sm: "0" },
            textAlign: { xs: "left", sm: "center" },
            // textAlign: "center",
          }}
          className={styles.outerHeading}
        >
          {" "}
          <FormattedMessage id="homepage.recentMandates.title" defaultMessage="Recent Mandates" />
        </Typography>
        {mandatesData?.newMandate?.length >= 1 && (
          <Grid
            container
            justifyContent="flex-end"
            sx={{
              position: "relative",
              bottom: "35px",
              right: isRTL ? "none" : { xs: "10px", sm: "25px" },
              left: isRTL ? { xs: "10px", sm: "25px" } : "none",
              cursor: mandatesData?.newMandate?.length >= 1 && "pointer",
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
                  color: mandatesData?.newMandate?.length >= 1 ? "#fff" : "#E4E0E1",
                  fontWeight: "500",
                  marginLeft: isRTL ? "4px" : "0", // Add space between arrow and text in RTL
                  marginRight: !isRTL ? "4px" : "0", // Add space between arrow and text in LTR
                }}
                onClick={mandatesData?.newMandate?.length >= 1 ? handleSignupLogin : null}
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
          ) : slicedMandateArray?.length > 0 ? (
            slicedMandateArray?.map((mandate) => (
              <Grid
                item
                xs={12}
                sm={5}
                md={3.5}
                xl={2.5}
                sx={{
                  maxWidth: { xs: "295px !important", sm: "320px !important" },
                  pointer: "none",
                  margin: "10px",
                  background: "#fff",
                  borderRadius: "10px",
                }}
                key={mandate?.id}
              >
                <Box sx={{ borderRadius: "10px" }}>
                  <CardMedia
                    sx={{
                      margin: "20px",
                      borderRadius: "10px",
                      width: { xs: "255px", sm: "280px" },
                    }}
                    component="img"
                    height="160"
                    src={
                      mandate?.images?.imageName === "Image-1.png" ||
                      mandate?.images?.imageName === "Image-2.png" ||
                      mandate?.images?.imageName === "Image-3.png" ||
                      mandate?.images?.imageName === "Image-4.png"
                        ? `/Images/${mandate?.images?.imageName}`
                        : `data:image/PNG;base64,${mandate?.images?.imageContent}`
                    }
                    alt="Mandate Image"
                  />
                </Box>
                <CardContent sx={{ paddingTop: "10px", paddingBottom: "15px" }}>
                  <Typography sx={{ ...heading, width: "90%" }} component="div">
                    <Tooltip title={mandate?.title}>{mandate?.title}</Tooltip>
                  </Typography>

                  <Typography component="div">
                    <Tooltip title={mandate?.country.join(", ")}>
                      <Typography
                        className={styles.mandatePoints}
                        component="div"
                        sx={{
                          maxWidth: "300px",
                          height: "25px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {mandate?.country.join(", ")}
                      </Typography>
                    </Tooltip>
                    <Typography className={styles.mandateSubTitle} component="div">
                      <FormattedMessage
                        id="homepage.recentMandates.areasOfInterest"
                        defaultMessage=" Areas of interest"
                      />{" "}
                    </Typography>

                    <Grid container flexDirection="column">
                      <Tooltip title={mandate?.technologies?.map((tech) => tech.name).join(", ")}>
                        <Typography
                          className={styles.mandatePoints}
                          component="div"
                          style={{
                            maxWidth: "300px",
                            height: "25px",
                            fontWeight: "600 !important",
                            overflow: "auto",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {mandate?.technologies?.map((tech) => tech.name).join(", ")}
                        </Typography>
                      </Tooltip>
                      {/* </Button> */}
                      <Typography className={styles.mandateSubTitle} component="div">
                        {" "}
                        Organization Name
                      </Typography>
                      <Typography className={styles.mandatePoints} component="div">
                        <Typography className={styles.tech}>
                          {mandate?.investor?.organization}
                        </Typography>
                      </Typography>

                      <Grid
                        container
                        flexDirection="column"
                        sx={{
                          marginTop: "10px",
                          borderTop: "2px solid rgba(134, 134, 134, 1)",
                        }}
                      >
                        <Typography className={styles.mandateSubTitle} component="div">
                          <FormattedMessage
                            id="homepage.recentMandates.pitchClosingDate"
                            defaultMessage="Pitch Closing Date :"
                          />{" "}
                          <span className={styles.tech}> {formatDate(mandate?.endDate)}</span>
                        </Typography>
                        <Button
                          // sx={{
                          //   background: (theme) =>
                          //     `linear-gradient(to right,rgba(103, 26, 228, 1), rgba(183, 92, 255, 1)   )`,
                          // }}
                          sx={buttonColor}
                          // className={styles.mandatesButton}
                          onClick={handleSignupLogin}
                        >
                          <FormattedMessage
                            id="homepage.recentMandates.knowMore"
                            defaultMessage="Know More"
                          />{" "}
                          {/* <EastRoundedIcon sx={{ marginLeft: "10px" }} />{" "} */}
                        </Button>
                      </Grid>
                    </Grid>
                  </Typography>
                </CardContent>
                {/* </CardActionArea> */}
              </Grid>
            ))
          ) : (
            <NoDataMsg message={"There are no mandate to show"} home={home} />
          )}
        </Box>
        {/* <Box sx={{ display: { xs: "none", sm: "flex", md: "flex" } }}>
            <button
              onClick={() => scrollContainer(300)}
              style={scrollButtonStyle}
              className={styles.scrollButtonRight}
            >
              <KeyboardDoubleArrowRightSharpIcon sx={{ fontSize: "30px" }} />
            </button>
          </Box> */}
        {/* </Box> */}
      </Grid>
      {dialogOpen && (
        <SignupLoginModal
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          mandateId={12}
          tabValue={"ENTREPRENEUR"}
        />
      )}
    </>
  );
};

export default MandateSection;
