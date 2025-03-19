import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Skeleton,
  Toolbar,
  Typography
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { promoteMandate } from "src/action/investorMandates";
import styles from "./eventDetails.module.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Footer from "src/components/Footer/Footer";
import { IntlProvider } from "react-intl";
import { formattedDate } from "src/utils/util";

const EventDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { event_details, id } = router.query;

  useEffect(() => {
    if (id && event_details !== undefined) dispatch(promoteMandate(event_details, id));
  }, [event_details, id, dispatch]);

  const mandateDetails = useSelector(state => state.investorMandates.eventDetails);

  const handleUrlRedirection = () => {
    // router.push("/");
    router.push({
      pathname: "/",
      query: { login: true } // Replace with your dynamic prop value
    });
  };

  const newsEventPage = true;

  return (
    <>
      <IntlProvider>
        <Grid>
          <AppBar position="fixed" sx={{ bgcolor: "#FFFFFF" }}>
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                height: "85px"
              }}
            >
              {/* <img src="/Images/ Arisio_Logo.png" alt="Logo" loading="lazy" /> */}
              <Typography
                sx={theme => ({
                  fontSize: "1.5rem !important",
                  background: `linear-gradient(to right, ${theme.palette.neutral.theme1}, ${theme.palette.neutral.theme2})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  fontFamily: "Inter !important",
                  fontWeight: "600 !important"
                })}
                onClick={handleUrlRedirection}
              >
                <img
                  src="/Images/HomePage/Logo1.png"
                  alt="ARISIO_LOGO"
                  height="35px"
                  width="160px"
                />
              </Typography>
              <Box>
                <Button
                  sx={{
                    background: theme => `${theme.palette.neutral.buttonBackground} `,
                    color: "#FFF",
                    "&:hover": {
                      background: theme => `${theme.palette.neutral.buttonBackground}`
                    }
                  }}
                  onClick={handleUrlRedirection}
                >
                  Login
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          {mandateDetails.length !== 0 ? (
            <>
              <Grid container sx={{ marginTop: "85px" }} className={styles.imgBackground}>
                <Grid
                  container
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  xl={6}
                  sx={{ padding: "0px 30px", marginTop: "15px" }}
                  justifyContent={{ xs: "flex-start", sm: "flex-start", md: "center" }}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      flexDirection: "column"
                    }}
                  >
                    <Typography
                      variant="h1"
                      className={`${styles.mandateHeader} ${styles.mandateTitles}`}
                    >
                      {mandateDetails?.title}
                    </Typography>
                    <Typography className={styles.mandateHeader}>
                      Organization - {mandateDetails?.investor?.organization}
                    </Typography>
                    <Typography className={styles.mandateHeader}>
                      Mandate By - {mandateDetails?.investor?.name}
                    </Typography>

                    <Divider sx={{ width: "50%", marginTop: "10px", margin: "20px 0px" }} />
                    <Box sx={{ color: "#FFFFFF", display: "flex" }}>
                      <CalendarMonthIcon />
                      <Typography className={styles.points}>
                        {formattedDate(mandateDetails?.startDate)} -{" "}
                        {formattedDate(mandateDetails?.endDate)}
                      </Typography>
                    </Box>
                    <Box>
                      <Button
                        sx={{ color: "#FFFFFF", border: "1px solid #FFFFFF", marginTop: "30px" }}
                        onClick={handleUrlRedirection}
                      >
                        Pitch
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  xl={6}
                  container
                  justifyContent={{ xs: "flex-start", md: "center" }}
                  alignItems="center"
                  sx={{ padding: "0px 30px", marginTop: "15px" }}
                >
                  <Card className={styles.cardInternal}>
                    <CardActionArea>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Box className={styles.mandateStatus}>
                          <Typography
                            sx={{
                              fontWeight: "500",
                              backgroundColor:
                                mandateDetails?.isExpired === 1
                                  ? "#8a1538 !important"
                                  : "green !important",
                              padding: "5px 10px !important",
                              borderRadius: "8px"
                            }}
                          >
                            {mandateDetails.isExpired === 1 ? "CLOSED" : "OPEN"}
                          </Typography>
                        </Box>
                      </Box>
                      <CardMedia
                        style={{ borderRadius: "4px" }}
                        component="img"
                        height="150"
                        src={
                          mandateDetails?.images?.imageName === "Image-1.png" ||
                          mandateDetails?.images?.imageName === "Image-2.png" ||
                          mandateDetails?.images?.imageName === "Image-3.png" ||
                          mandateDetails?.images?.imageName === "Image-4.png"
                            ? `/Images/${mandateDetails?.images?.imageName}`
                            : `data:image/PNG;base64,${mandateDetails?.images?.imageContent}`
                        }
                        alt="Mandate Image"
                      />

                      <CardContent>
                        <Typography
                          className={`${styles.mandatePoints} ${styles.dateColor}`}
                          component="div"
                        >
                          Launched on :{" "}
                          <span className={styles.mandatePoints}>
                            {" "}
                            {formattedDate(mandateDetails?.startDate)}
                          </span>
                        </Typography>
                        <Typography
                          className={`${styles.mandatePoints} ${styles.dateColor}`}
                          component="div"
                        >
                          Closing on :{" "}
                          <span className={styles.mandatePoints}>
                            {" "}
                            {formattedDate(mandateDetails?.endDate)}
                          </span>
                        </Typography>

                        <Grid container justifyContent="center">
                          <Button
                            sx={{
                              background: theme =>
                                `${theme.palette.neutral.buttonBackground} !important `,
                              color: "#FFF !important",
                              "&:hover": {
                                background: theme =>
                                  `${theme.palette.neutral.buttonBackground}!important`
                              }
                            }}
                            className={styles.mandatesButton}
                            onClick={handleUrlRedirection}
                          >
                            Pitch
                          </Button>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>

              <Grid
                sx={{
                  backgroundColor: "rgba(65, 148, 179, 0.1) !important"
                }}
              >
                <Grid className={styles.formOuter} xs={12} sm={12} md={12} xl={12}>
                  <Typography className={styles.mandateSubTitleDesc}>Description </Typography>
                  <Typography className={styles.mandatePointsDesc}>
                    {" "}
                    {mandateDetails?.description}
                  </Typography>
                </Grid>

                {/* <div style={{ display: "flex", justifyContent: "center" }}> */}
                {/* <Divider
                  style={{
                    padding: "0.8px",
                    background: "grey",
                    width: "50%",
                    // textAlign: "center",
                  }}
                /> */}
                {/* </div> */}

                <Grid
                  container
                  spacing={2}
                  style={{
                    marginTop: "10px",
                    padding: "0px 30px"
                  }}
                >
                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography className={styles.mandateSubTitle}>Revenue Status : </Typography>
                  </Grid>

                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography style={{ paddingLeft: "5px" }} className={styles.mandatePoints}>
                      {mandateDetails?.revenue_status}
                    </Typography>
                  </Grid>

                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography className={styles.mandateSubTitle}>
                      Preferred Location :{" "}
                    </Typography>
                  </Grid>
                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    {mandateDetails?.location?.map((data, index) => (
                      <Typography
                        style={{ paddingLeft: "5px" }}
                        key={index}
                        className={styles.mandatePoints}
                      >
                        {data}
                        {index < mandateDetails?.location?.length - 1 ? ", " : ""}
                      </Typography>
                    ))}
                  </Grid>

                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography className={styles.mandateSubTitle}>Startup Stage :</Typography>
                  </Grid>
                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography style={{ paddingLeft: "5px" }} className={styles.mandatePoints}>
                      {mandateDetails?.stage}
                    </Typography>
                  </Grid>

                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography className={styles.mandateSubTitle}>Startup Country :</Typography>
                  </Grid>
                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography style={{ paddingLeft: "5px" }} className={styles.mandatePoints}>
                      {mandateDetails?.country?.map((data, index) => (
                        <span key={index}>
                          {data}
                          {index < mandateDetails?.country?.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </Typography>
                  </Grid>

                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography className={styles.mandateSubTitle}>
                      Investment Offering :
                    </Typography>
                  </Grid>
                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography style={{ paddingLeft: "5px" }} className={styles.mandatePoints}>
                      {mandateDetails?.investmentOffering}
                    </Typography>
                  </Grid>

                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography className={styles.mandateSubTitle}>Investment Amount :</Typography>
                  </Grid>
                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography style={{ paddingLeft: "5px" }} className={styles.mandatePoints}>
                      {mandateDetails?.amount}
                    </Typography>
                  </Grid>
                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography className={styles.mandateSubTitle}>Team size :</Typography>
                  </Grid>
                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography style={{ paddingLeft: "5px" }} className={styles.mandatePoints}>
                      {mandateDetails?.teamSize}
                    </Typography>
                  </Grid>

                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography className={styles.mandateSubTitle}>Mandate Type :</Typography>
                  </Grid>
                  <Grid className={styles.formOuter} container xs={6} sm={3} md={3} xl={3}>
                    <Typography style={{ paddingLeft: "5px" }} className={styles.mandatePoints}>
                      {mandateDetails?.mandateType}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid sx={{ padding: "10px 12px" }}>
                  <Typography
                    sx={{ color: "#000000" }}
                    className={`${styles.mandateTitle} ${styles.formOuter}`}
                  >
                    Technology and Application areas of interest
                  </Typography>

                  <Grid className={styles.formOuter} container sx={{ paddingTop: "10px" }}>
                    {mandateDetails?.othersTech !== null ? (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          className={styles.techOuter}
                          sx={{ padding: "10px" }}
                        >
                          <Typography className={styles.technologies}>
                            {mandateDetails?.othersTech}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={styles.techOuter}>
                          <Typography className={`${styles.mandatePoints} `}>
                            {mandateDetails?.othersDomain}
                          </Typography>
                        </Grid>
                      </>
                    ) : (
                      mandateDetails?.spacesAndTech &&
                      Object.entries(mandateDetails?.spacesAndTech).map(
                        ([key, value], index, array) => (
                          <React.Fragment key={key}>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={styles.techOuter}>
                              <Typography className={styles.technologies}>{key}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} className={styles.techOuter}>
                              <Typography className={`${styles.mandatePoints} `}>
                                {value}
                              </Typography>
                            </Grid>
                            {index !== array.length - 1 && (
                              <Grid item xs={12} sx={{ paddingBottom: "10px" }}>
                                <Divider
                                  sx={{
                                    position: "relative",
                                    top: "10px",
                                    border: "1px solid #F5F5F5"
                                  }}
                                />
                              </Grid>
                            )}
                          </React.Fragment>
                        )
                      )
                    )}

                    <Divider
                      sx={{ position: "relative", top: "10px", border: "1px solid #F5F5F5" }}
                    />
                  </Grid>
                </Grid>

                <Footer newsEventPage={newsEventPage} />
              </Grid>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                // marginTop: "10px",
                padding: "15px 30px"
              }}
            >
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={"100%"}
                height={350}
                sx={{ borderRadius: "10px" }}
              />
              <Box sx={{ display: "flex", width: "100%", gap: "1rem" }}>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"50%"}
                  height={100}
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton variant="text" animation="wave" width={"50%"} sx={{ fontSize: "1rem" }} />
              </Box>
            </Box>
          )}
        </Grid>
      </IntlProvider>
    </>
  );
};

export default EventDetails;
