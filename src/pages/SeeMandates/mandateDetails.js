import React, { useEffect } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { mandateDetails, proceedToPitch } from "../../action/seeNewMandate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./seeNewMandate.module.css";
import { useRouter } from "next/router";
import ExternalContainer from "src/components/ExternalContainer";
import { FormattedMessage } from "react-intl";
import { isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import LoadingButton from "@mui/lab/LoadingButton";

const MandateDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const storedUserDetails = localStorage.getItem("userDetails");
  let startupId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  startupId = startupId?.startupId;

  useEffect(() => {
    if (!startupId) return; // Exit early if startupId is undefined or falsy

    dispatch(mandateDetails(startupId));
  }, [dispatch, startupId]);

  let mandatesData = useSelector((state) => state?.seeNewMandate);
  let pitchLoading = useSelector((state) => state?.seeNewMandate?.pitchLoading);
  const selectedMandate = useSelector((state) => state?.seeNewMandate?.selectedMandate);

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

  const goBack = () => {
    router.back();
  };

  const onPitch = () => {
    dispatch(proceedToPitch(startupId))
      .then((res) => {
        console.log(res);
        if (res) {
          router.push("./Pitching");
        }
      })
      .catch((err) => {
        console.log(err, "errr");
      });
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const currentDate = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

  function parseDate(dateString) {
    return new Date(dateString);
  }

  const countries = selectedMandate?.country || [];
  const countryList = countries.join(", ");
  const city = selectedMandate?.location || [];
  const cityList = city.join(", ");

  return (
    <>
      <ExternalContainer>
        <Grid container>
          <Box sx={{ display: "flex" }} onClick={goBack}>
            <ArrowBackIcon style={{ fontSize: "20px" }} className={styles.backButtonColor} />
            <Typography
              style={{ fontSize: "0.8rem" }}
              className={`${styles.backButtonColor} ${styles.backButton}`}
            >
              <FormattedMessage
                id="newMandates.mandateDetails.backButton.title"
                defaultMessage="Back to mandates"
              />
            </Typography>
          </Box>
        </Grid>
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            my: 2,
          }}
          className={styles.mandateDetailsOuter}
        >
          {mandatesData?.loading === true ? (
            <Box className={styles.spinner}>
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <Grid container style={{ height: "80vh" }}>
              <Grid item xs={12} sm={9} md={9} xl={9} direction="row">
                <Typography
                  style={{ wordWrap: "break-word", whiteSpace: "normal", overflow: "hidden" }}
                  className={styles.mandateTitle}
                >
                  {selectedMandate?.title}
                </Typography>
                <Typography
                  style={{ wordWrap: "break-word", whiteSpace: "normal", overflow: "hidden" }}
                  className={styles.mandateTitle}
                >
                  <span style={{ color: "#868686" }}>
                    <FormattedMessage
                      id="newMandates.mandateDetails.organization.title"
                      defaultMessage="Organization :"
                    />
                  </span>{" "}
                  {selectedMandate?.investor?.organization}
                </Typography>
                {/* {selectedMandate?location?.map((data, index) => (
                  <Typography
                    key={index}
                    className={styles.mandatePoints}
                    sx={{ border: "1px solid" }}
                  >
                    {data},
                  </Typography>
                ))} */}
                <Typography className={styles.mandatePoints}>
                  <FormattedMessage
                    id="newMandates.mandateDetails.countries.title"
                    defaultMessage="Countries :"
                  />
                  {countryList}
                </Typography>
                <Typography className={styles.mandatePoints}>
                  <FormattedMessage
                    id="newMandates.mandateDetails.cities.title"
                    defaultMessage="Cities :"
                  />
                  {cityList}
                </Typography>

                <Divider sx={{ position: "relative", top: "10px", border: "1px solid #F5F5F5" }} />
                <Typography className={styles.heading}>
                  <FormattedMessage
                    id="newMandates.mandateDetails.pitchTimeline.title"
                    defaultMessage="Pitch Timeline"
                  />
                </Typography>
                <Grid container direction="row">
                  <Typography
                    className={`${styles.mandatePoints} ${styles.dateColor}`}
                    component="div"
                  >
                    <FormattedMessage
                      id="newMandates.mandateDetails.start.title"
                      defaultMessage="Start :"
                    />

                    <span className={`${styles.mandatePoints} ${styles.detailsDateColor}`}>
                      {formatDate(selectedMandate?.startDate)}
                    </span>
                  </Typography>
                  <Typography
                    sx={{ px: 1 }}
                    className={`${styles.mandatePoints} ${styles.dateColor}`}
                    component="div"
                  >
                    <FormattedMessage
                      id="newMandates.mandateDetails.end.title"
                      defaultMessage="End :"
                    />
                    <span className={`${styles.mandatePoints} ${styles.detailsDateColor}`}>
                      {" "}
                      {formatDate(selectedMandate?.endDate)}
                    </span>
                  </Typography>
                </Grid>
                {isPermitted(permissions.STARTUP_MANDATE_PITCH_PITCH) ? (
                  <LoadingButton
                    size="small"
                    loading={pitchLoading}
                    loadingPosition="end"
                    sx={{
                      fontSize: "14px",
                      margin: "10px 0px",
                      padding: "4px 35px",
                      background: "rgba(138, 21, 56, 0.15)",
                      "& .MuiLoadingButton-loadingIndicator": {
                        margin: "10px",
                      },
                    }}
                    onClick={() => {
                      onPitch();
                    }}
                    disabled={
                      selectedMandate.is_active === 0
                      // ||
                      // parseDate(selectedMandate?.startDate) > parseDate(currentDate)
                    }
                  >
                    <span style={{ marginLeft: pitchLoading ? "-10px" : "" }}>
                      {selectedMandate.is_active === 0 ? (
                        <FormattedMessage
                          id="newMandates.mandateDetails.closedPitchStatus.title"
                          defaultMessage="Pitch Closed"
                        />
                      ) : (
                        //  parseDate(selectedMandate?.startDate) > parseDate(currentDate) ? (
                        //   <FormattedMessage
                        //     id="newMandates.mandateDetails.notLaunchedStatus.title"
                        //     defaultMessage="Not Launched"
                        //   />
                        // ) :
                        <FormattedMessage
                          id="newMandates.mandateDetails.pitchStatus.title"
                          defaultMessage="Pitch"
                        />
                      )}
                    </span>
                  </LoadingButton>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={3} md={3} xl={3}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Box className={styles.mandateStatus}>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "#fff",
                        fontSize: "0.8rem",
                        margin: "0px 5px",
                        backgroundColor:
                          selectedMandate?.is_active === 0
                            ? "#8a1538 !important"
                            : "green !important",
                        padding: "0px 8px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {selectedMandate?.is_active === 0 ? (
                        <FormattedMessage
                          id="newMandates.mandateDetails.card.closeStatus.title"
                          defaultMessage="CLOSED"
                        />
                      ) : (
                        <FormattedMessage
                          id="newMandates.mandateDetails.card.openStatus.title"
                          defaultMessage="OPEN"
                        />
                      )}
                    </Typography>
                  </Box>
                </Box>

                <CardMedia
                  style={{ borderRadius: "4px" }}
                  component="img"
                  height="120"
                  src={
                    selectedMandate?.images?.imageName === "Image-1.png" ||
                    selectedMandate?.images?.imageName === "Image-2.png" ||
                    selectedMandate?.images?.imageName === "Image-3.png" ||
                    selectedMandate?.images?.imageName === "Image-4.png"
                      ? `/Images/${selectedMandate?.images?.imageName}`
                      : `data:image/PNG;base64,${selectedMandate?.images?.imageContent}`
                  }
                  alt="Mandate Image"
                />
              </Grid>

              <Grid sx={{ width: "100%" }}>
                <Divider sx={{ position: "relative", top: "10px", border: "1px solid #F5F5F5" }} />
                <Typography className={styles.heading}>
                  {" "}
                  <FormattedMessage
                    id="newMandates.mandateDetails.description.title"
                    defaultMessage="Description"
                  />
                </Typography>
                <Typography
                  style={{ wordWrap: "break-word", whiteSpace: "normal", overflow: "hidden" }}
                  className={`${styles.mandatePoints} ${styles.description}`}
                >
                  {selectedMandate?.description}
                </Typography>

                <Divider sx={{ position: "relative", top: "10px", border: "1px solid #F5F5F5" }} />
                <Typography className={styles.heading}>
                  <FormattedMessage
                    id="newMandates.mandateDetails.mandatePreferences.title"
                    defaultMessage="Mandate Preferences"
                  />
                </Typography>
                <Grid container sx={{ paddingTop: "0px" }}>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    {" "}
                    <Typography className={styles.detailsSubHeading}>
                      <FormattedMessage
                        id="newMandates.mandateDetails.revenueStatus.title"
                        defaultMessage="Revenue Status"
                      />
                    </Typography>
                    <Typography className={`${styles.mandatePoints} ${styles.description}`}>
                      {selectedMandate?.revenue_status}
                    </Typography>
                  </Grid>
                  {/* <Grid item xxs={12} xs={12} sm={6} md={4} lg={4}>
                    {" "}
                    <Typography className={styles.detailsSubHeading}>
                      <FormattedMessage
                        id="newMandates.mandateDetails.preferredLocation.title"
                        defaultMessage="Preferred location"
                      />
                    </Typography>
                    {selectedMandate?.location?.map((data, index) => (
                      <Typography
                        key={index}
                        className={`${styles.mandatePoints} ${styles.description}`}
                      >
                        {data}
                      </Typography>
                    ))}
                  </Grid> */}
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    {" "}
                    <Typography className={styles.detailsSubHeading}>
                      <FormattedMessage
                        id="newMandates.mandateDetails.startupStage.title"
                        defaultMessage="Startup Stage"
                      />
                    </Typography>
                    <Typography className={`${styles.mandatePoints} ${styles.description}`}>
                      {selectedMandate?.stage}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    {" "}
                    <Typography className={styles.detailsSubHeading}>
                      <FormattedMessage
                        id="newMandates.mandateDetails.investmentOffering.title"
                        defaultMessage="Investment Offering"
                      />{" "}
                    </Typography>
                    <Typography className={`${styles.mandatePoints} ${styles.description}`}>
                      {selectedMandate?.investmentOffering}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    {" "}
                    <Typography className={styles.detailsSubHeading}>
                      <FormattedMessage
                        id="newMandates.mandateDetails.investmentAmount.title"
                        defaultMessage="Investment Amount"
                      />{" "}
                    </Typography>
                    <Typography className={`${styles.mandatePoints} ${styles.description}`}>
                      {selectedMandate?.amount}
                    </Typography>
                  </Grid>{" "}
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    {" "}
                    <Typography className={styles.detailsSubHeading}>
                      <FormattedMessage
                        id="newMandates.mandateDetails.teamSize.title"
                        defaultMessage="Team Size"
                      />
                    </Typography>
                    <Typography className={`${styles.mandatePoints} ${styles.description}`}>
                      {selectedMandate?.teamSize}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    {" "}
                    <Typography className={styles.detailsSubHeading}>
                      <FormattedMessage
                        id="newMandates.mandateDetails.mandateType.title"
                        defaultMessage="Mandate Type"
                      />
                    </Typography>
                    <Typography className={`${styles.mandatePoints} ${styles.description}`}>
                      {selectedMandate?.mandateType}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ position: "relative", top: "10px", border: "1px solid #F5F5F5" }} />
                <Typography className={styles.heading}>
                  <FormattedMessage
                    id="newMandates.mandateDetails.interestArea.title"
                    defaultMessage="Technology and Application areas of interest"
                  />
                </Typography>
                <Grid container>
                  {selectedMandate?.othersTech !== null ? (
                    <>
                      <Grid item xs={12} sm={6} md={4} lg={4} className={styles.techOuter}>
                        <Typography style={{ fontSize: "0.7rem" }} className={styles.technologies}>
                          {selectedMandate?.othersTech}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={8} lg={8} className={styles.techOuter}>
                        <Typography
                          className={`${styles.mandatePoints} ${styles.detailsDateColor}`}
                        >
                          {selectedMandate?.othersDomain}
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    selectedMandate?.spacesAndTech &&
                    Object.entries(selectedMandate?.spacesAndTech).map(
                      ([key, value], index, array) => (
                        <React.Fragment key={key}>
                          <Grid item xs={12} sm={6} md={4} lg={4} className={styles.techOuter}>
                            <Typography
                              style={{ fontSize: "0.7rem" }}
                              className={styles.technologies}
                            >
                              {key}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={8} lg={8} className={styles.techOuter}>
                            <Typography
                              className={`${styles.mandatePoints} ${styles.detailsDateColor}`}
                            >
                              {value}
                            </Typography>
                          </Grid>
                          {index !== array.length - 1 && (
                            <Grid item xs={12} sx={{ paddingBottom: "10px" }}>
                              <Divider
                                sx={{
                                  position: "relative",
                                  top: "10px",
                                  border: "1px solid #F5F5F5",
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
            </Grid>
          )}
        </Box>
      </ExternalContainer>
    </>
  );
};
MandateDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MandateDetails;
