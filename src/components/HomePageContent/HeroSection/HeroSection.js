import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import { Box, Button, Container, Grid, Typography, useMediaQuery } from "@mui/material";
import Carousel from "../Carousel";
import { FormattedMessage } from "react-intl";
import SignupLoginModal from "../SignupLogin/SignupLoginModal";
import { useDispatch, useSelector } from "react-redux";
import { getDataCounts } from "src/action/homepage";
import CountUp from "react-countup";

const HeroSection = () => {
  const images = [
    {
      imgPath: "/Images/HomePage/BannerImage1.jpg",
    },
    {
      imgPath: "/Images/HomePage/BannerImage2.jpg",
    },
  ];

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSignupLogin = () => {
    setDialogOpen(true);
  };

  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDataCounts());
  }, [dispatch]);

  const dataCounts = useSelector((state) => state?.homepage?.dataCounts);

  return (
    <>
      <Box
        id="about"
        className={
          isSmallScreen ? styles.heroSectionExternalResponsive : styles.heroSectionExternal
        }
        sx={{
          background: (theme) =>
            `linear-gradient(to right, ${theme.palette.neutral.primary} 0%,      
               
            ${theme.palette.neutral.tertiary} 150% )`,
        }}
      >
        {/* Text */}
        <Box
          sx={{
            minHeight: isSmallScreen ? "100vh" : "",
          }}
          textExternal
          className={styles.textExternal}
        >
          <Container className={styles.textExternalContainer}>
            <Typography
              sx={{ marginTop: isSmallScreen ? "80px !important" : "" }}
              className={styles.heading}
            >
              <FormattedMessage
                id="homepage.heroSection.mainText"
                defaultMessage="MIDDLE EAST’S LEADING STARTUP COLLABORATION AND DATA PLATFORM"
              />
            </Typography>
            <Typography className={styles.subHeading}>
              <FormattedMessage
                id="homepage.heroSection.subText"
                defaultMessage="Get access to leading Investors and Startups"
              />{" "}
            </Typography>

            <Button
              sx={{
                background: (theme) => `${theme.palette.neutral.buttonBackground} `,
                "&:hover": {
                  background: (theme) => `${theme.palette.neutral.buttonBackground}`,
                },
              }}
              className={styles.Button}
              onClick={handleSignupLogin}
            >
              <FormattedMessage id="homepage.heroSection.explore" defaultMessage="Explore Now" />{" "}
            </Button>

            <Grid
              container
              justifyContent="space-between"
              className={styles.lowerContainer}
              sx={{ mt: 3 }}
            >
              <Grid>
                <Typography className={styles.bold}>
                  {dataCounts?.startups ? <CountUp end={dataCounts?.startups} duration={3} /> : "-"}
                </Typography>
                <Typography className={styles.lightText}>Funded Startups</Typography>
              </Grid>
              <Grid>
                <Typography className={styles.bold}>
                  {dataCounts?.investors ? (
                    <CountUp end={dataCounts?.investors} duration={3} />
                  ) : (
                    "-"
                  )}
                </Typography>
                <Typography className={styles.lightText}>Investors</Typography>
              </Grid>
              <Grid>
                <Typography className={styles.bold}>
                  {dataCounts?.mandates ? <CountUp end={dataCounts?.mandates} duration={3} /> : "-"}
                </Typography>
                <Typography className={styles.lightText}>Mandates</Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Images Stepper */}

        <Grid className={styles.stepperExternal}>
          <Grid container direction="row">
            <Grid
              item
              container
              alignItems="center"
              direction="column"
              justifyContent="center"
              sm={6}
              xs={6}
              md={4}
              xl={4}
            >
              <Grid item>
                <img
                  src="Images/HomePage/landing1.png"
                  alt="LANDING1"
                  className={styles.firstImage}
                  style={{
                    width: "187px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    // border: "1px solid white",
                  }}
                  loading="lazy"
                />
              </Grid>
              <Grid item>
                <img
                  src="Images/HomePage/landing2.png"
                  alt="LANDING2"
                  className={styles.secondImage}
                  style={{
                    marginTop: "5px",
                    width: "187px",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    // border: "1px solid white",
                  }}
                  loading="lazy"
                />
              </Grid>
              <Grid item>
                <img
                  src="Images/HomePage/landing3.png"
                  alt="LANDING3"
                  className={styles.thirdImage}
                  style={{
                    marginTop: "5px",
                    width: "187px",
                    height: "127px",
                    borderRadius: "10px",
                    // border: "1px solid white",

                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
              </Grid>
            </Grid>
            <Grid
              item
              container
              alignItems="center"
              direction="column"
              justifyContent="center"
              sm={6}
              xs={6}
              md={4}
              xl={4}
            >
              <Grid item>
                <img
                  src="Images/HomePage/landing4.png"
                  alt="LANDING4"
                  className={styles.fourthImage}
                  style={{
                    width: "187px",
                    height: "108px",
                    borderRadius: "10px",
                    // border: "1px solid white",
                  }}
                  loading="lazy"
                />
              </Grid>
              <Grid item>
                <img
                  src="Images/HomePage/landing5.png"
                  alt="LANDING5"
                  className={styles.fifthImage}
                  style={{
                    marginTop: "5px",
                    width: "187px",
                    height: "220px",
                    // objectFit: "cover",
                    borderRadius: "10px",
                    // border: "1px solid white",
                  }}
                  loading="lazy"
                />
              </Grid>
              <Grid item>
                <img
                  src="Images/HomePage/landing6.png"
                  alt="LANDING3"
                  className={styles.sixthImage}
                  style={{
                    marginTop: "5px",
                    width: "187px",
                    height: "159px",
                    borderRadius: "10px",
                    // border: "1px solid white",

                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
              </Grid>
            </Grid>
            <Grid
              item
              container
              alignItems="center"
              direction="column"
              justifyContent="center"
              sm={6}
              xs={6}
              md={4}
              xl={4}
            >
              <Grid item>
                <img
                  src="Images/HomePage/landing7.png"
                  alt="LANDING1"
                  className={styles.seventhImage}
                  style={{
                    width: "187px",
                    height: "412px",
                    borderRadius: "10px",
                    // border: "1px solid white",
                  }}
                  loading="lazy"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {dialogOpen && <SignupLoginModal dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />}
    </>
  );
};

export default HeroSection;
