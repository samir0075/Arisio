import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./createMandate.module.css";
import dayjs from "dayjs";
import { formattedDate } from "src/utils/util";

const PreviewMandate = ({ dialogOpen, setDialogOpen, previewDetails, eventQuestionList }) => {
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
    spacesAndTech,
  } = previewDetails;

  const technologyNamesSet =
    spacesAndTech !== null && spacesAndTech !== undefined
      ? Object.keys(spacesAndTech).map((r) => r)
      : null;
  const technologyNames =
    spacesAndTech !== null && spacesAndTech !== undefined ? Array.from(technologyNamesSet) : "";
  const domainNames =
    spacesAndTech !== null && spacesAndTech !== undefined ? Object.values(spacesAndTech) : null;

  const handleClose = () => {
    setDialogOpen(false);
  };

  console.log(Object.keys(previewDetails).length === 0);

  return (
    <>
      <Dialog
        sx={{
          "& .css-1tn5wjm-MuiPaper-root-MuiCard-root": {
            height: "80% !important",
          },
        }}
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"md"}
        fullWidth={true}
      >
        {Object.keys(previewDetails).length !== 0 ? (
          <Card sx={{ p: 4, overflowY: "auto" }}>
            <Grid container spacing={1}>
              <Box style={{}} onClick={() => handleClose()}>
                <CancelIcon
                  sx={{ fontSize: "1.2rem" }}
                  color="disabled"
                  style={{ cursor: "pointer", width: "40px" }}
                />
              </Box>
              <Grid item xs={12} sm={12} md={4} xl={4}>
                {/* <CardMedia
                component="img"
                image={`/Images/${previewDetails?.images?.imageName}`}
                alt="Mandate Form"
                
              /> */}
                <CardMedia
                  sx={{ borderRadius: "4px", objectFit: "contain" }}
                  component="img"
                  height="200"
                  // sx={{ width: "15rem" }}
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
              <Grid item xs={12} sm={12} md={6} xl={6} marginLeft={"5px"}>
                <Typography
                  // className={styles.cardHeader}
                  style={{
                    fontWeight: 700,
                    fontSize: "17px",
                    color: "#393939",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    overflow: "hidden",
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  className={styles.cardText}
                  style={{
                    wordWrap: "break-word", // Allows long words to break and wrap to the next line
                    whiteSpace: "normal", // Ensures text wraps to the next line
                    overflow: "hidden",
                  }}
                >
                  {description}
                </Typography>
              </Grid>
            </Grid>
            {previewDetails.is_active === 4 && (
              <>
                <Divider sx={{ my: "10px", border: "1px solid #F5F5F5" }} />
                <Grid container>
                  <Grid item sm={12} md={6}>
                    <Typography
                      className={styles.modalHeader}
                      sx={{ color: "red", marginLeft: { xs: 0, sm: 0, md: "8px" } }}
                    >
                      <FormattedMessage
                        id="showMandatesForm.previewMandate.mandateDetails.reject.heading"
                        defaultMessage="Rejection Reason"
                      />{" "}
                    </Typography>
                  </Grid>
                  <Grid item sm={12} md={6}>
                    <span
                      className={styles.value}
                      style={{
                        textOverflow: "ellipsis",
                        wordWrap: "break-word", // Allows long words to break and wrap to the next line
                        whiteSpace: "normal",
                        wordWrap: "break-word", // Break long words onto the next line
                        wordBreak: "break-word",
                      }}
                    >
                      {previewDetails?.investor?.reason}
                    </span>
                  </Grid>
                </Grid>
              </>
            )}

            {/* <Typography className={styles.modalHeader} marginLeft={"8px"}>
            <FormattedMessage
              id="showMandatesForm.previewMandate.mandateDetails.reject.heading"
              defaultMessage="Rejection Reason"
            />{" "}
            : &nbsp;{" "}
          </Typography> */}
            <Divider sx={{ my: "10px", border: "1px solid #F5F5F5" }} />

            <Typography className={styles.modalHeader} marginLeft={"8px"}>
              <FormattedMessage
                id="showMandatesForm.previewMandate.mandateDetails.main.heading"
                defaultMessage="Mandate Preferences"
              />
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Stack>
                  <Typography sx={{ p: 1 }} className={styles.key}>
                    <FormattedMessage
                      id="showMandatesForm.dialogue.mandateDetails.text1"
                      defaultMessage="Revenue Status :"
                    />{" "}
                    <span className={styles.value}>{previewDetails?.revenue_status}</span>
                  </Typography>
                  <Typography sx={{ p: 1 }} className={styles.key}>
                    <FormattedMessage
                      id="showMandatesForm.dialogue.mandateDetails.text2"
                      defaultMessage="Startup Stage :"
                    />{" "}
                    <span className={styles.value}>{previewDetails?.stage}</span>
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
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Stack>
                  <Typography sx={{ p: 1 }} className={styles.key}>
                    <FormattedMessage
                      id="showMandatesForm.dialogue.mandateDetails.text5"
                      defaultMessage="Preferred Location :"
                    />{" "}
                    <span className={styles.value}>{location?.join(", ")}</span>
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
                  <Typography sx={{ p: 1 }} className={styles.key}>
                    <FormattedMessage
                      id="showMandatesForm.dialogue.mandateDetails.mandateName"
                      defaultMessage="Mandate type :"
                    />{" "}
                    <span className={styles.value}>{previewDetails?.mandateType}</span>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ my: "10px", border: "1px solid #F5F5F5" }} />
            <Typography className={styles.modalHeader} marginLeft={"8px"}>
              <FormattedMessage
                id="showMandatesForm.dialogue.mandateTimelines.heading"
                defaultMessage="Mandate Timeline"
              />
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Stack>
                  <Typography sx={{ p: 1 }} className={styles.key}>
                    <FormattedMessage
                      id="showMandatesForm.dialogue.mandateTimelines.text1"
                      defaultMessage="Mandate Starting Date :"
                    />{" "}
                    <span className={styles.value}>
                      {/* {startDate?.split(" ")[0]} */}
                      {formattedDate(startDate)}
                    </span>
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Stack>
                  <Typography sx={{ p: 1 }} className={styles.key}>
                    <FormattedMessage
                      id="showMandatesForm.dialogue.mandateTimelines.text2"
                      defaultMessage="Mandate Closing Date :"
                    />{" "}
                    <span className={styles.value}>
                      {/* {endDate?.split(" ")[0]} */}
                      {formattedDate(endDate)}
                    </span>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ my: "10px", border: "1px solid #F5F5F5" }} />
            <Typography className={styles.modalHeader} sx={{ my: "15px" }}>
              <FormattedMessage
                id="showMandatesForm.dialogue.mandateSpaces.heading"
                defaultMessage="Mandate in the Spaces"
              />
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {othersTech !== null ? (
                <>
                  <Grid item xs={12} sm={12} md={12} xl={12}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 1,
                        // backgroundColor: "#39c7f3",
                        minHeight: "20px",
                        textAlign: "center",
                        borderRadius: "4px",
                        color: "#000000",

                        // maxWidth: "200px",
                      }}
                    >
                      {othersTech}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} xl={12} display="contents">
                    <Typography
                      sx={{
                        fontFamily: "Calibri",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#898989",
                        opacity: 1,
                        marginTop: "30px",
                      }}
                    >
                      {/* {domainNames?.length >= 2 ? domainNames : domainNames?.join("|")} */}
                      {othersDomain}
                    </Typography>
                  </Grid>
                </>
              ) : (
                technologyNames?.length > 0 &&
                technologyNames.map((e) => (
                  <>
                    <Grid item xs={12} sm={12} md={12} xl={12}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 1,
                          // backgroundColor: "#39c7f3",
                          minHeight: "20px",
                          textAlign: "center",
                          borderRadius: "4px",
                          color: "#000000",

                          // maxWidth: "200px",
                        }}
                      >
                        {e}
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} xl={12} key={e} display="contents">
                      <Typography
                        sx={{
                          fontFamily: "Calibri",
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "#898989",
                          opacity: 1,
                          marginTop: "30px",
                        }}
                      >
                        {domainNames?.length >= 2 ? domainNames : domainNames?.join("|")}
                      </Typography>
                    </Grid>
                  </>
                ))
              )}
            </Grid>
            <Divider sx={{ my: "10px", border: "1px solid #F5F5F5" }} />
            <Typography className={styles.modalHeader} sx={{ my: "15px" }}>
              <FormattedMessage
                id="showMandatesForm.dialogue.quickQuestions.heading"
                defaultMessage="Quick Question(s)"
              />
            </Typography>
            <Grid container spacing={1} sx={{ display: "flex" }}>
              {eventQuestionList?.length === 0 ? (
                <Grid sx={{ px: 2, py: 1 }}>No quick question!</Grid>
              ) : (
                eventQuestionList?.map((r, index) => (
                  <Grid item xs={12} key={r}>
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
                          wordBreak: "break-word", // Ensure text breaks within the box
                        }}
                      >
                        {`${index + 1}.${r?.question}`}
                      </Typography>
                    </Grid>
                  </Grid>
                ))
              )}
            </Grid>
          </Card>
        ) : (
          <Box
            sx={{
              // width: "80vh",
              height: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default PreviewMandate;
