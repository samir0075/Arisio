import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExternalContainer from "src/components/ExternalContainer";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationDialog from "./confirmationModal";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { formattedDate, getButtonCss } from "src/utils/util";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";
import styles from "../../../components/StartupPitch/StartupPitch.module.css";
import { documentsDownloadForStartup, getPendingUserDetails } from "src/action/pendingApprovals";

const TypoStyle = { fontSize: "0.8rem" };
const SubHeadingStyle = { width: "33%", flexShrink: 0, fontSize: "1rem", fontWeight: "600" };
const StartupDetails = () => {
  const [expanded, setExpanded] = React.useState("panel1");
  const dispatch = useDispatch();
  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const startupDetailsFromLocal = JSON.parse(localStorage.getItem("userData"));
  const userStatus = startupDetailsFromLocal?.status;
  const userId = startupDetailsFromLocal?.id;

  const startupDetails = useSelector(state => state.pendingApprovals.userDetails);

  useEffect(() => {
    if (Object.keys(startupDetails).length === 0) {
      dispatch(getPendingUserDetails(userId));
    }
  }, []);

  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const ButtonCss = getButtonCss();
  const [action, setAction] = useState("");
  const [inputTextShow, setInputTextShow] = useState(1);

  const handleApproval = () => {
    setDialogOpen(true);

    setAction("Do you want to approve this Startup?");
    setInputTextShow(0);
  };
  const handleRejection = () => {
    setDialogOpen(true);
    setInputTextShow(1);
    setAction("Do you want to reject this Startup?");
  };

  const goBack = () => {
    router.push("/PendingApprovals/Startups");
  };

  const getFileExtension = fileName => {
    return fileName?.split(".")?.pop();
  };

  // const handlePdfToOpen = (pdf) => {
  //   if (pdf) {
  //     console.log(pdf);
  //     window.open(pdf, "_blank", "noreferrer");
  //   }
  // };

  const handlePdfToOpen = pdf => {
    dispatch(documentsDownloadForStartup(startupDetails?.id, pdf)).then(res => {
      window.open(res, "_blank", "noreferrer");
    });
  };

  return (
    <>
      <ExternalContainer>
        <Box
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <ArrowBackOutlinedIcon
            onClick={goBack}
            style={{ marginRight: "10px", cursor: "pointer" }}
          />
          <Typography style={{ fontSize: "1rem", fontWeight: "600", marginRight: "10px" }}>
            Startup Details
          </Typography>
          <Typography style={{ fontSize: "0.8rem" }}>
            {userStatus === 1 ? (
              <Chip label="Approved" color="success" />
            ) : userStatus === 2 ? (
              <Chip label="Rejected" color="error" />
            ) : userStatus === 3 ? (
              <Chip label="Pending" color="warning" />
            ) : (
              <Chip label="Incomplete" color="primary" />
            )}
          </Typography>
        </Box>
        <Box>
          <Accordion
            // style={{ border: "1px solid red" }}
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={SubHeadingStyle}>Basic Information</Typography>
              {/* <Typography sx={{ color: "#68D2E8" }}>PENDING</Typography> */}
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={10} md={8} xl={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Startup Name</Typography>
                    </Grid>
                    <Grid item xs={7} sm={8} md={8} xl={8}>
                      <Typography
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap"
                        }}
                      >
                        {startupDetails?.organization_name}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Country/City</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.country} / {startupDetails?.city}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Sector</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.excubatorDomains?.map(domain => domain?.excubator_domain)}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Technology</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.technology?.map(tech => tech?.name)}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Website</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.website}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Founded Date</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {/* {new Date(startupDetails?.founded_year).toLocaleDateString()} */}
                        {formattedDate(startupDetails?.founded_year)}
                      </Typography>
                    </Grid>

                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Startup Description</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap"
                        }}
                      >
                        {startupDetails?.description}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Last Funding on</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.past_funding}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Funding Amount</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {`${startupDetails?.funding_total_usd}$ `}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Funding Round</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.funding_round}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Startup Stage</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {/* {startupDetails?.starup_stage?.stage_name} */}
                        {startupDetails?.startupStages?.length > 0
                          ? startupDetails?.startupStages?.map(data => data.stage_name).join(", ")
                          : "-"}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>No of Employees</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.employee_count}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Communication Email</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.communication_email}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Contact Number</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.contact_no}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Facebook</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.fb_link ? startupDetails?.fb_link : "-"}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>X</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.google_link ? startupDetails?.google_link : "-"}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Instagram</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.insta_link ? startupDetails?.insta_link : "-"}
                      </Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={5} sm={4} md={4} xl={4}>
                      <Typography style={TypoStyle}>Youtube</Typography>
                    </Grid>
                    <Grid style={{ paddingTop: "5px" }} item xs={7} sm={8} md={8} xl={8}>
                      <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                        {startupDetails?.youtube_link ? startupDetails?.youtube_link : "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <CardMedia
                    component="img"
                    style={{ width: "280px", margin: "0px", objectFit: "contain" }}
                    sx={{ height: "180px" }}
                    src={`data:image/PNG;base64,${startupDetails?.encodedImgUrl}`}
                    alt="Profile Image"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            // style={{ border: "1px solid red" }}
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography sx={SubHeadingStyle}>Document Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap" }}>
                {startupDetails?.docDetails?.length === 0 ? (
                  <Grid>No document found!</Grid>
                ) : (
                  startupDetails?.docDetails?.map(doc => {
                    const extension = getFileExtension(doc?.document_url);
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
                        xs={12}
                        sm={5.5}
                        md={3.5}
                        xl={3.5}
                        sx={{
                          padding: "4px",
                          margin: "10px",
                          border: "2px solid #F5F5F5",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          handlePdfToOpen(doc.document_url);
                        }}
                      >
                        <Grid item>
                          <img src={imgSrc} width="100" height="100" alt="format" />

                          <Grid container direction="column" justifyContent="center">
                            <Typography className={styles.heading}>{doc?.dcoument_type}</Typography>
                            <Typography className={styles.inputField}>
                              {" "}
                              {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit"
                              }).format(new Date(doc?.entry_date))}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            // style={{ border: "1px solid red" }}
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography sx={SubHeadingStyle}>Team Details</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap" }}>
                {startupDetails?.startupTeamDetails?.map(team => (
                  <Box
                    key={team?.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      margin: "10px 20px"
                    }}
                  >
                    <CardMedia
                      style={{ width: "50px", margin: "0px", height: "50px" }}
                      image="/Images/default_member_icon.png"
                    />
                    <Typography style={{ fontSize: "0.7rem" }}>{team?.member_name}</Typography>
                    <Typography style={{ fontSize: "0.7rem" }}>{team?.designation}</Typography>
                    <Typography style={{ fontSize: "0.7rem" }}>{team?.member_email}</Typography>
                    <Typography style={{ fontSize: "0.7rem" }}>
                      {team?.linkedin_profile_url}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        {userStatus === 3 ? (
          <Box style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleRejection}
              style={{ ...ButtonCss, margin: "10px", background: "#d32f2f", color: "white" }}
            >
              Reject
            </Button>
            <Stack>
              <Button
                onClick={handleApproval}
                style={{ ...ButtonCss, margin: "10px", backgroundColor: "green", color: "white" }}
              >
                Approve
              </Button>
            </Stack>
          </Box>
        ) : (
          ""
        )}
      </ExternalContainer>
      {dialogOpen && (
        <ConfirmationDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          action={action}
          inputTextShow={inputTextShow}
        />
      )}
    </>
  );
};
StartupDetails.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;

export default StartupDetails;
