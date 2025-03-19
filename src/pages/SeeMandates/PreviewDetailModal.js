import { Box, Dialog, Divider, FormLabel, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./seeNewMandate.module.css";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import CancelIcon from "@mui/icons-material/Cancel";
import { formattedDate } from "src/utils/util";

const PreviewDetailModal = ({ previewDialogOpen, setPreviewDialogOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    setValue,
    formState: { errors }
  } = useForm();

  const handleClose = () => {
    setPreviewDialogOpen(false);
  };

  const profileOverviewData = useSelector(state => state?.seeNewMandate?.profileOverview);
  const seniorTeamMember = useSelector(state => state?.seeNewMandate?.teamMember);
  const documentList = useSelector(state => state.seeNewMandate?.documents);
  const questionsList = useSelector(state => state.seeNewMandate?.questions);

  useEffect(() => {
    setValue("answer", questionsList?.map(data => data?.eventAnswer?.answer) || "");
  });

  useEffect(() => {
    if (profileOverviewData?.logoUrl) {
      const decodeBase64 = async () => {
        const response = await fetch(`data:image/png;base64,${profileOverviewData?.logoUrl}`);
        const blob = await response.blob();
        const dataUrl = URL.createObjectURL(blob);
        setSelectedImage(dataUrl);
      };

      decodeBase64();
    }
  }, [profileOverviewData?.logoUrl]);

  // Function to get file extension
  const getFileExtension = fileName => {
    return fileName.split(".").pop();
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

  return (
    <>
      <Dialog
        open={previewDialogOpen}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid sx={{ p: 3 }}>
          {/* Overview  */}
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Typography className={styles.mandateTitle}>
              <FormattedMessage
                id="seeMandates.previewDetailModal.overview.heading"
                defaultMessage="Overview"
              />
            </Typography>
            <CancelIcon
              sx={{ fontSize: "1.2rem" }}
              color="red"
              style={{ cursor: "pointer" }}
              onClick={handleClose}
            />
          </Box>
          <Divider sx={{ position: "relative", top: "5px", border: "1px solid #F5F5F5" }} />
          <Grid container sx={{ py: 2, overflowX: "auto" }}>
            {/* <Grid  sx={{ py: 1 }} container justifyContent="space-between" alignItems="flex-end"> */}
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                <FormattedMessage
                  id="seeMandates.previewDetailModal.startupLogo.title"
                  defaultMessage="Startup Logo"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <img src={selectedImage} alt="Profile Img" height="70" width="70" />
            </Grid>
            {/* <Grid sx={{ py: 1 }} container justifyContent="space-between"> */}
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                <FormattedMessage
                  id="seeMandates.previewDetailModal.organizationName.title"
                  defaultMessage="Organization Name"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {profileOverviewData?.organizationName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                {" "}
                <FormattedMessage
                  id="seeMandates.previewDetailModal.location.title"
                  defaultMessage="Location"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {profileOverviewData?.city} , {profileOverviewData?.country}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                <FormattedMessage
                  id="seeMandates.previewDetailModal.description.title"
                  defaultMessage="Description"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {profileOverviewData?.description}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                {" "}
                <FormattedMessage
                  id="seeMandates.previewDetailModal.stage.title"
                  defaultMessage="Stage"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {/* {profileOverviewData?.stageName} */}
                {profileOverviewData?.stageName
                  ? profileOverviewData?.stageName.map(data => data.stage_name).join(", ")
                  : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                <FormattedMessage
                  id="seeMandates.previewDetailModal.website.title"
                  defaultMessage="Website"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {profileOverviewData?.website}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                <FormattedMessage
                  id="seeMandates.previewDetailModal.foundedYear.title"
                  defaultMessage="Founded Year"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {formattedDate(profileOverviewData?.foundedYear)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                <FormattedMessage
                  id="seeMandates.previewDetailModal.employees.title"
                  defaultMessage="Employees"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {profileOverviewData?.employeeCount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                <FormattedMessage
                  id="seeMandates.previewDetailModal.pastFunding.title"
                  defaultMessage="Past Funding"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {profileOverviewData?.pastFunding
                  ? formattedDate(profileOverviewData?.pastFunding)
                  : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                <FormattedMessage
                  id="seeMandates.previewDetailModal.communicationMail.title"
                  defaultMessage="Communication Mail"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {profileOverviewData?.communicationEmail}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.dateColor} style={{ fontSize: "0.8rem" }}>
                <FormattedMessage
                  id="seeMandates.previewDetailModal.contactNumber.title"
                  defaultMessage="Contact Number"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Typography className={styles.description} style={{ fontSize: "0.8rem" }}>
                {profileOverviewData?.contactNo}
              </Typography>
            </Grid>
          </Grid>

          {/* Team  */}

          <Divider sx={{ position: "relative", top: "5px", border: "1px solid #F5F5F5" }} />
          <Typography sx={{ py: 2 }} className={styles.mandateTitle}>
            <FormattedMessage
              id="seeMandates.previewDetailModal.team.heading"
              defaultMessage="Team"
            />
          </Typography>
          <Divider sx={{ border: "1px solid #F5F5F5" }} />

          <Grid>
            <Typography className={styles.heading}>
              <FormattedMessage
                id="seeMandates.previewDetailModal.founder&co-founder.heading"
                defaultMessage="Founder and Co-founders"
              />
            </Typography>
            <Grid container sx={{ maxHeight: "300px !important", overflowY: "auto" }}>
              {" "}
              {seniorTeamMember
                ?.filter(data =>
                  ["Founder", "Co-Founder", "C-Suite (CTO , CEO or etc)"].includes(data.designation)
                )
                ?.map(data => (
                  <Grid
                    container
                    item
                    sx={{
                      padding: "4px",
                      margin: "10px",
                      border: "2px solid #F5F5F5",
                      borderRadius: "8px"
                    }}
                    key={data?.id}
                  >
                    <Grid item xs={12} sm={6} md={6} xl={6}>
                      <img src="/Images/default_member_icon.png" alt="Founder Image" />
                    </Grid>
                    <Grid
                      item
                      container
                      justifyContent="space-between"
                      alignItems="center"
                      xs={12}
                      sm={6}
                      md={6}
                      xl={6}
                    >
                      <Grid>
                        <Typography
                          className={styles.mandateTitle}
                          style={{
                            wordWrap: "break-word", // Forces long words to break
                            whiteSpace: "normal", // Allows text to wrap
                            overflowWrap: "anywhere"
                          }}
                        >
                          {data?.memberName}
                        </Typography>
                        <Typography className={styles.inputField}>{data?.designation}</Typography>
                        <Typography
                          className={styles.inputField}
                          style={{
                            wordWrap: "break-word", // Forces long words to break
                            whiteSpace: "normal", // Allows text to wrap
                            overflowWrap: "anywhere"
                          }}
                        >
                          {data?.memberEmail}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </Grid>
          <Divider sx={{ border: "1px solid #F5F5F5" }} />

          <Grid>
            <Typography className={styles.heading}>
              {" "}
              <FormattedMessage
                id="seeMandates.previewDetailModal.teamMember.heading"
                defaultMessage="Key Team Members"
              />
            </Typography>
            <Grid container sx={{ maxHeight: "300px !important", overflowY: "auto" }}>
              {" "}
              {seniorTeamMember
                ?.filter(data =>
                  [
                    "Software Team Member",
                    "Sales Team Member",
                    "Marketing Team Members",
                    "Operations Team Members",
                    "Advisor",
                    "Other"
                  ].includes(data.designation)
                )
                ?.map(data => (
                  <Grid
                    container
                    item
                    sx={{
                      padding: "4px",
                      margin: "10px",
                      border: "2px solid #F5F5F5",
                      borderRadius: "8px"
                    }}
                    key={data?.id}
                  >
                    <Grid item xs={12} sm={6} md={6} xl={6}>
                      <img src="/Images/default_member_icon.png" alt="Founder Image" />
                    </Grid>
                    <Grid
                      item
                      container
                      justifyContent="space-between"
                      alignItems="center"
                      xs={12}
                      sm={6}
                      md={6}
                      xl={6}
                    >
                      <Grid>
                        <Typography
                          className={styles.mandateTitle}
                          style={{
                            wordWrap: "break-word", // Forces long words to break
                            whiteSpace: "normal", // Allows text to wrap
                            overflowWrap: "anywhere"
                          }}
                        >
                          {data?.memberName}
                        </Typography>
                        <Typography className={styles.inputField}>{data?.designation}</Typography>
                        <Typography
                          className={styles.inputField}
                          style={{
                            wordWrap: "break-word", // Forces long words to break
                            whiteSpace: "normal", // Allows text to wrap
                            overflowWrap: "anywhere"
                          }}
                        >
                          {data?.memberEmail}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </Grid>

          {/* Documents  */}
          <Divider sx={{ position: "relative", top: "5px", border: "1px solid #F5F5F5" }} />
          <Typography sx={{ py: 2 }} className={styles.mandateTitle}>
            <FormattedMessage
              id="seeMandates.previewDetailModal.document.heading"
              defaultMessage="Documents"
            />
          </Typography>
          <Divider sx={{ border: "1px solid #F5F5F5" }} />
          <Grid container sx={{ maxHeight: "300px !important", overflowY: "auto" }}>
            {documentList?.map(doc => {
              const extension = getFileExtension(doc?.documentUrl);
              let imgSrc = "/Images/doc.png"; // Default image source

              // Determine image source based on file extension
              if (extension === "pdf") {
                imgSrc = "/Images/Pdf.png";
              } else if (extension === "xlsx") {
                imgSrc = "/Images/Excel.png";
              } else {
                imgSrc = "/Images/doc.png";
              }
              return (
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  key={doc?.id}
                  sx={{
                    padding: "4px",
                    margin: "10px",
                    border: "2px solid #F5F5F5",
                    borderRadius: "8px"
                  }}
                >
                  <Grid item xs={12} sm={6} md={6} xl={6}>
                    <img src={imgSrc} alt="PDF" />
                  </Grid>
                  <Grid
                    xs={6}
                    sm={6}
                    md={6}
                    xl={6}
                    container
                    direction="column"
                    justifyContent="center"
                  >
                    <Typography className={styles.heading}>{doc?.documentType}</Typography>
                    <Typography className={styles.inputField}>
                      {" "}
                      <FormattedMessage
                        id="seeMandates.previewDetailModal.uploadedOn.title"
                        defaultMessage="Uploaded on"
                      />{" "}
                      {/* {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit"
                      }).format(new Date(doc?.entryDate))} */}
                      {formattedDate(doc?.entryDate)}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>

          {/* Questions */}
          <Divider sx={{ position: "relative", top: "5px", border: "1px solid #F5F5F5" }} />
          <Typography sx={{ py: 2 }} className={styles.mandateTitle}>
            <FormattedMessage
              id="seeMandates.previewDetailModal.questions.title"
              defaultMessage="Questions"
            />
          </Typography>
          <Divider sx={{ border: "1px solid #F5F5F5" }} />

          {questionsList?.map(data => (
            <Grid key={data?.eventQuestion?.id} sx={{ my: 2 }}>
              <Grid>
                <FormLabel className={styles.inputField}>{data?.eventQuestion?.question}</FormLabel>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  placeholder=""
                  fullWidth
                  disabled
                  {...register("answer")}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Dialog>
    </>
  );
};

export default PreviewDetailModal;
