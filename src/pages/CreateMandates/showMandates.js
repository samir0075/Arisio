/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./createMandate.module.css";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  displayMandateDetails,
  getEventsQuestions,
  navigateIncompleteMandate,
  saveEventsQuestion,
  showMandateDetails
} from "src/action/createMandate";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Stack,
  Button,
  Grid,
  Divider,
  Dialog,
  Paper
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";

const ShowMandates = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;
  const incompleteMandate = localStorage.getItem("incompleteMandate");
  const { id } = router.query;

  useEffect(() => {
    if (incompleteMandate) {
      dispatch(navigateIncompleteMandate(investorId, id));
    }
  }, [dispatch]);

  const incompleteMandateData = useSelector(state => state.newMandate.incompleteMandateData);
  const formDetail = JSON.parse(searchParams.get("details"));

  const formDetails = formDetail ? formDetail : incompleteMandateData;
  // const {
  //   name,
  //   desc,
  //   picture,
  //   startupStage,
  //   productStage,
  //   city,
  //   country,
  //   teamSize,
  //   investmentOffering,
  //   investmentAmount,
  //   otherTechData,
  //   otherDomainData,
  // } = formDetails;
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const selectedTechnology = localStorage.getItem("selectedTech");

  const parsedSelectedTechnology = selectedTechnology ? JSON.parse(selectedTechnology) : null;

  const selectedTechId = parsedSelectedTechnology?.id;

  /**
   * Formatting the data for api call
   */
  const sendFormData = {
    title: formDetails.name || formDetails?.title,
    description: formDetails.desc || formDetails?.description,
    imageId: formDetails.picture || formDetails?.images?.id,
    startDate: formDetails?.date?.[0] || formDetails?.startDate,
    endDate: formDetails?.date?.[1] || formDetails?.endDate,
    stage: formDetails.startupStage || formDetails?.stage,
    productStage: formDetails.productStage || formDetails?.productStage,
    location: formDetails?.location
      ? formDetails?.location
          ?.map(cityArray => {
            return cityArray;
          })
          .join(", ")
      : formDetails?.city?.join(","),
    country:
      formDetails?.is_active === 2 ? formDetails?.countryList : formDetails?.country?.join(","),
    teamSize: formDetails?.teamSize || formDetails?.teamSize,
    investmentOffering: formDetails?.investmentOffering || formDetails?.investmentOffering,
    amount: formDetails?.investmentAmount || formDetails?.amount,
    othersTech: formDetails?.otherTechData?.length ? formDetails.otherTechData : null,
    othersDomain: formDetails?.otherDomainData?.length ? formDetails.otherDomainData : null,
    technology: formDetails?.is_active === 2 ? formDetails?.technology[0] : selectedTechId
  };

  const formatDate = dateString => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month?.padStart(2, "0");
    const paddedDay = day?.padStart(2, "0");

    return `${paddedDay}/${paddedMonth}/${year}`;
  };

  /**
   * Api call
   */
  useEffect(() => {
    if (!incompleteMandate) {
      dispatch(displayMandateDetails(investorId, sendFormData));
    }
  }, [dispatch]);

  const mandatesInfo = useSelector(state => state?.newMandate?.displayMandate);

  useEffect(() => {
    if (mandatesInfo?.id && !incompleteMandate) {
      const questionsList =
        formDetails?.modifiedStoreQuestion !== null ? formDetails?.modifiedStoreQuestion : [];
      dispatch(saveEventsQuestion(investorId, questionsList, mandatesInfo?.id));
    }
  }, [dispatch, investorId, mandatesInfo]);

  useEffect(() => {
    if (mandatesInfo?.id) {
      dispatch(showMandateDetails(investorId, mandatesInfo?.id));
    }
  }, [dispatch, mandatesInfo]);

  useEffect(() => {
    if (mandatesInfo?.id) {
      setTimeout(() => {
        dispatch(getEventsQuestions(mandatesInfo?.id));
      }, 1000);
    }
  }, [dispatch, mandatesInfo]);

  const previewDetails = useSelector(state => state?.newMandate?.showMandate);
  const eventQuestionList = useSelector(state => state?.newMandate?.eventQuestions);

  const {
    title,
    description,
    startDate,
    endDate,
    stage,
    location,
    amount,
    othersTech,
    othersDomain,
    spacesAndTech
  } = previewDetails;
  /** Making new Unique set of technology elements from mandatesData */
  const technologyNamesSet =
    othersTech !== null ? new Set(othersTech?.map(r => r)) : Object.keys(spacesAndTech).map(r => r);
  const technologyNames = Array.from(technologyNamesSet);
  const domainNames =
    othersDomain !== null ? othersDomain?.map(r => r?.domain) : Object.values(spacesAndTech);

  return (
    <>
      <Box
        sx={{
          maxWidth: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        <Stack sx={{ margin: "0 20px" }}>
          <Typography className={styles.formtext} sx={{ fontSize: "24px" }}>
            {formDetails?.name ? formDetails?.name : formDetails?.title}
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#808080" }}>
            <FormattedMessage
              id="showMandatesForm.startingDate.label"
              defaultMessage="Mandate Starting Date:"
            />{" "}
            <span className={styles.value}>
              {formDetails?.date?.[0] ? formDetails?.date?.[0] : formatDate(formDetails?.startDate)}
            </span>
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#808080" }}>
            <FormattedMessage
              id="showMandatesForm.closingDate.label"
              defaultMessage="Mandate Closing Date:"
            />{" "}
            <span className={styles.value}>
              {formDetails?.date?.[1] ? formDetails?.date?.[1] : formatDate(formDetails?.endDate)}
            </span>
          </Typography>
        </Stack>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "5px",
            marginRight: "10px",
            backgroundColor: "#f0f5f5"
          }}
        >
          <Button
            sx={{ marginTop: "10px", marginRight: "10px" }}
            variant="outlined"
            startIcon={<RemoveRedEyeIcon style={{ marginLeft: "10px" }} />}
            onClick={() => setDialogOpen(true)}
          >
            <FormattedMessage
              id="showMandatesForm.previewMandate.button.text"
              defaultMessage="Preview Mandate"
            />
          </Button>
        </div>
        <Stack sx={{ background: "rgba(65, 148, 179,0.1) !important" }}>
          <Typography className={styles.stackTitle}>
            <FormattedMessage
              id="showMandatesForm.previewMandate.mandate.main.heading"
              defaultMessage="Mandate"
            />
          </Typography>
          <Card className={styles.showCard}>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <CardMedia
                  component="img"
                  image={`/Images/circle.png`}
                  alt="Mandate Form"
                  sx={{ width: "4rem" }}
                />
              </Grid>
              <Grid item xs={11}>
                <Stack>
                  <Typography className={styles.cardHeader}>
                    <FormattedMessage
                      id="showMandatesForm.card.heading1"
                      defaultMessage="Mandate Details"
                    />
                  </Typography>
                  <Typography className={styles.cardText}>
                    <FormattedMessage
                      id="showMandatesForm.card.heading2"
                      defaultMessage="Add your mandate name, mandate description and upload mandate thumbnail"
                    />
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>

          <Card className={styles.showCard}>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <CardMedia
                  component="img"
                  image={`/Images/circle.png`}
                  alt="Mandate Form"
                  sx={{ width: "4rem" }}
                />
              </Grid>
              <Grid item xs={11}>
                <Stack>
                  <Typography className={styles.cardHeader}>
                    <FormattedMessage
                      id="showMandatesForm.card2.heading1"
                      defaultMessage="Mandate Preferences"
                    />
                  </Typography>
                  <Typography className={styles.cardText}>
                    <FormattedMessage
                      id="showMandatesForm.card2.heading2"
                      defaultMessage="Choose mandate preferences and set timeline for your online mandate"
                    />
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>

          <Typography className={styles.stackTitle}>
            {" "}
            <FormattedMessage
              id="showMandatesForm.previewMandate.account.main.heading"
              defaultMessage="Account"
            />
          </Typography>

          <Card className={styles.showCard}>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <CardMedia
                  component="img"
                  image={`/Images/circle.png`}
                  alt="Mandate Form"
                  sx={{ width: "4rem" }}
                />
              </Grid>
              <Grid item xs={11}>
                <Stack>
                  <Typography className={styles.cardHeader}>
                    {" "}
                    <FormattedMessage
                      id="showMandatesForm.card3.heading1"
                      defaultMessage="User Profile"
                    />
                  </Typography>
                  <Typography className={styles.cardText}>
                    <FormattedMessage
                      id="showMandatesForm.card3.heading2"
                      defaultMessage="Add your mandate name, mandate description and upload mandate thumbnail"
                    />
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
          <div className={styles.showBtn}>
            <Button
              variant="contained"
              onClick={() => {
                router.push(`./mandateForm?details=${JSON.stringify(formDetails)}`);
              }}
            >
              <FormattedMessage id="showMandatesForm.back.button.text" defaultMessage="Back" />
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                router.push("./finalForm");
              }}
            >
              <FormattedMessage
                id="showMandatesForm.lunchMandate.button.text"
                defaultMessage="Launch Mandate"
              />
            </Button>
          </div>
        </Stack>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"md"}
        fullWidth={true}
      >
        <Card sx={{ p: 4, height: "400px", overflowY: "auto" }}>
          <Grid container spacing={2}>
            <Box style={{ float: "left", marginLeft: "-11px" }} onClick={() => handleClose()}>
              <CancelIcon
                sx={{ fontSize: "1.2rem" }}
                color="disabled"
                style={{ cursor: "pointer", width: "40px" }}
              />
            </Box>
            <Grid item xs={4}>
              {/* <CardMedia
                component="img"
                image={`/Images/${previewDetails?.images?.imageName}`}
                alt="Mandate Form"
                
              /> */}
              <CardMedia
                style={{ borderRadius: "4px" }}
                component="img"
                height="200"
                sx={{ width: "15rem" }}
                src={
                  previewDetails?.images?.imageName === "Image-1.png" ||
                  previewDetails?.images?.imageName === "Image-2.png" ||
                  previewDetails?.images?.imageName === "Image-3.png" ||
                  previewDetails?.images?.imageName === "Image-4.png"
                    ? `/Images/${previewDetails?.images?.imageName}`
                    : `data:image/PNG;base64,${previewDetails?.images?.imageContent}`
                }
                alt="Mandate Image"
              />
            </Grid>
            <Grid item xs={4}>
              <Stack style={{ float: "right" }}>
                <Typography
                  className={styles.cardHeader}
                  style={{ fontWeight: 700, fontSize: "17px", color: "#393939" }}
                >
                  {title}
                </Typography>
                <Typography className={styles.cardText}>{description}</Typography>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ position: "relative", top: "10px", border: "1px solid #F5F5F5" }} />
          <Grid container spacing={2} sx={{ margin: "10px" }}>
            <Grid item xs={6}>
              <Typography className={styles.modalHeader}>
                <FormattedMessage
                  id="showMandatesForm.previewMandate.mandateDetails.main.heading"
                  defaultMessage="Mandate Name"
                />
              </Typography>
              <Stack sx={{ marginTop: "10px" }}>
                <Typography sx={{ p: 1 }} className={styles.key}>
                  <FormattedMessage
                    id="showMandatesForm.dialogue.mandateDetails.text1"
                    defaultMessage="Revenue Status :"
                  />{" "}
                  <span className={styles.value}>{stage}</span>
                </Typography>
                <Typography sx={{ p: 1 }} className={styles.key}>
                  <FormattedMessage
                    id="showMandatesForm.dialogue.mandateDetails.text2"
                    defaultMessage="Product Stage :"
                  />{" "}
                  <span className={styles.value}>{previewDetails?.productStage}</span>
                </Typography>
                <Typography sx={{ p: 1 }} className={styles.key}>
                  <FormattedMessage
                    id="showMandatesForm.dialogue.mandateDetails.text3"
                    defaultMessage="Investment Offering :"
                  />{" "}
                  <span className={styles.value}>{previewDetails?.investmentOffering}</span>
                </Typography>
                <Typography sx={{ p: 1 }} className={styles.key}>
                  <FormattedMessage
                    id="showMandatesForm.dialogue.mandateDetails.text4"
                    defaultMessage="Team size :"
                  />{" "}
                  <span className={styles.value}>{previewDetails?.teamSize}</span>
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} sx={{ marginTop: "25px" }}>
              <Stack>
                <Typography sx={{ p: 1 }} className={styles.key}>
                  <FormattedMessage
                    id="showMandatesForm.dialogue.mandateDetails.text5"
                    defaultMessage="Preferred Location :"
                  />{" "}
                  <span className={styles.value}>{location}</span>
                </Typography>
                <Typography sx={{ p: 1 }} className={styles.key}>
                  <FormattedMessage
                    id="showMandatesForm.dialogue.mandateDetails.text6"
                    defaultMessage="Startup Country :"
                  />{" "}
                  <span className={styles.value}>
                    {previewDetails?.country?.map((data, index) =>
                      data.length > 1
                        ? `${data}${index !== previewDetails.country.length - 1 ? ", " : ""}`
                        : data
                    )}
                  </span>
                </Typography>
                <Typography sx={{ p: 1 }} className={styles.key}>
                  <FormattedMessage
                    id="showMandatesForm.dialogue.mandateDetails.text7"
                    defaultMessage="Investment Amount :"
                  />{" "}
                  <span className={styles.value}>{previewDetails?.amount}</span>
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ position: "relative", top: "10px", border: "1px solid #F5F5F5" }} />
          <Grid container spacing={2} sx={{ margin: "10px" }}>
            <Grid item xs={6}>
              <Typography className={styles.modalHeader}>
                <FormattedMessage
                  id="showMandatesForm.dialogue.mandateTimelines.heading"
                  defaultMessage="Mandate Timeline"
                />
              </Typography>
              <Stack sx={{ marginTop: "10px" }}>
                <Typography sx={{ p: 1 }} className={styles.key}>
                  <FormattedMessage
                    id="showMandatesForm.dialogue.mandateTimelines.text1"
                    defaultMessage="Mandate Starting Date :"
                  />{" "}
                  <span className={styles.value}>{startDate?.split(" ")[0]}</span>
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} sx={{ marginTop: "25px" }}>
              <Stack>
                <Typography sx={{ p: 1 }} className={styles.key} style={{ marginTop: "7px" }}>
                  <FormattedMessage
                    id="showMandatesForm.dialogue.mandateTimelines.text2"
                    defaultMessage="Mandate Closing Date :"
                  />{" "}
                  <span className={styles.value}>{endDate?.split(" ")[0]}</span>
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ position: "relative", top: "10px", border: "1px solid #F5F5F5" }} />
          <Typography className={styles.modalHeader} style={{ margin: "10px 28px 0px" }}>
            <FormattedMessage
              id="showMandatesForm.dialogue.mandateSpaces.heading"
              defaultMessage="Mandate in the Spaces"
            />
          </Typography>
          <Grid container spacing={2} sx={{ margin: "10px", display: "flex" }}>
            {technologyNames?.length > 0 &&
              technologyNames.map(e => (
                <>
                  <Grid item xs={6}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        backgroundColor: "#39c7f3",
                        minHeight: "56px",
                        textAlign: "center",
                        borderRadius: "10px",
                        color: "white",
                        maxWidth: "250px"
                      }}
                    >
                      {e}
                    </Paper>
                  </Grid>
                  <Grid item xs={8} key={e} display="contents">
                    <Typography
                      sx={{
                        fontFamily: "Calibri",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#898989",
                        opacity: 1,
                        marginTop: "30px"
                      }}
                    >
                      {domainNames?.length >= 2 ? domainNames : domainNames?.join("|")}
                    </Typography>
                  </Grid>
                </>
              ))}
          </Grid>
          <Divider sx={{ position: "relative", top: "10px", border: "1px solid #F5F5F5" }} />
          <Typography className={styles.modalHeader} style={{ margin: "10px 28px 0px" }}>
            <FormattedMessage
              id="showMandatesForm.dialogue.quickQuestions.heading"
              defaultMessage="Quick Question(s)"
            />
          </Typography>
          <Grid container spacing={2} sx={{ margin: "10px", display: "flex" }}>
            {eventQuestionList?.length &&
              eventQuestionList?.map((r, index) => (
                <Grid item xs={6} key={r}>
                  <Grid item xs={8} key={r} display="contents">
                    <Typography
                      sx={{
                        fontFamily: "Calibri",
                        fontWeight: 400,
                        fontSize: "18px",
                        color: "#898989",
                        opacity: 1,
                        marginTop: "10px",
                        marginLeft: "4px",
                        wordBreak: "break-word" // Ensure text breaks within the box
                      }}
                    >
                      {`${index + 1}.${r?.question}`}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Card>
      </Dialog>
    </>
  );
};

ShowMandates.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default ShowMandates;
