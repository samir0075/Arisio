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
import ConfirmationDialog from "./confirmationModal";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { getButtonCss } from "src/utils/util";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../components/StartupPitch/StartupPitch.module.css";
import { documentsDownloadForInvestor, getPendingUserDetails } from "src/action/pendingApprovals";
import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";

const typoStyle = {
  fontSize: "0.75rem"
};
const SubHeadingStyle = { width: "33%", flexShrink: 0, fontSize: "0.8rem", fontWeight: "600" };
const InvestorDetails = () => {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const ButtonCss = getButtonCss();
  const [action, setAction] = useState("");
  const [inputTextShow, setInputTextShow] = useState(1);
  const dispatch = useDispatch();

  const startupDetailsFromLocal = JSON.parse(localStorage.getItem("userData"));
  const userStatus = startupDetailsFromLocal?.status;

  const investorDetails = useSelector(state => state.pendingApprovals.userDetails);
  console.log("investorDetails", investorDetails);

  useEffect(() => {
    if (Object.keys(investorDetails).length === 0) {
      dispatch(getPendingUserDetails(startupDetailsFromLocal?.id));
    }
  }, []);

  useEffect(() => {
    if (investorDetails.hasOwnProperty("profileImageUrl") === true) {
      const decodeBase64 = async () => {
        const response = await fetch(`data:image/png;base64,${investorDetails?.profileImageUrl}`);
        const blob = await response.blob();
        const dataUrl = URL.createObjectURL(blob);
        setSelectedImage(dataUrl);
        // setValue("imageUrl", investorDetails?.profileImageUrl);
      };
      decodeBase64();
    } else {
      setSelectedImage(null);
    }
  }, [investorDetails, investorDetails?.profileImageUrl]);

  const handleApproval = () => {
    setDialogOpen(true);

    setAction("Do you want to approve this Investor?");
    setInputTextShow(0);
  };
  const handleRejection = () => {
    setDialogOpen(true);
    setInputTextShow(1);
    setAction("Do you want to reject this Investor?");
  };

  const goBack = () => {
    router.push("/PendingApprovals/Investor");
  };

  const getFileExtension = fileName => {
    return fileName?.split(".")?.pop();
  };

  const handlePdfToOpen = pdf => {
    toast.success(<div>{"Please Wait A Moment"} </div>, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
    dispatch(documentsDownloadForInvestor(investorDetails?.id, pdf)).then(res => {
      window.open(res, "_blank", "noreferrer");
    });
  };

  const investorDetailStyle = {
    fontSize: "0.75rem",
    fontWeight: "600",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap"
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
            Investor Details
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
            //   style={{ border: "1px solid red" }}
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
                  <Grid container spacing={2} paddingLeft={"20px"} gap={"10px"}>
                    {/* Investor name */}
                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}>Investor Name</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={investorDetailStyle}>
                          {investorDetails?.userdetail?.name
                            ? investorDetails?.userdetail?.name
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* Organization name */}
                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}>Organization Name</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={investorDetailStyle}>
                          {investorDetails?.organization}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* Country and City */}
                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}>Country/City</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                          {investorDetails?.country},{investorDetails?.city}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* Contact No */}
                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}>Contact Number</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                          {investorDetails?.contactNo ? investorDetails?.contactNo : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* Email id */}
                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}>Communication Email</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                          {investorDetails?.communication_email
                            ? investorDetails?.communication_email
                            : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* Investor  */}

                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}>Investor type</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                          {investorDetails?.investor_type ? investorDetails?.investor_type : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* Fund Type  */}

                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}>Fund Type</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                          {investorDetails?.fundTypes
                            ? investorDetails?.fundTypes?.map(data => data.fund_name).join(", ")
                            : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}>Fund Website</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={investorDetailStyle}>
                          {investorDetails?.additionalInfo?.FundWebsite
                            ? investorDetails?.additionalInfo?.FundWebsite
                            : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* Fund Ticket Size  */}

                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}>Fund Average Ticket Size</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                          {investorDetails?.fund_ticket?.ticket_name
                            ? investorDetails?.fund_ticket?.ticket_name
                            : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* investment_sector  */}

                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}> Startup Type</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                          {investorDetails?.startupStages
                            ? investorDetails?.startupStages
                                ?.map(data => data.stage_name)
                                .join(", ")
                            : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}> Investment Sector</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                          {investorDetails?.investmentSectors
                            ? investorDetails?.investmentSectors
                                ?.map(data => data.sector_name)
                                .join(", ")
                            : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* JobTitle  */}

                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}> Job Title </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={investorDetailStyle}>
                          {investorDetails?.additionalInfo?.JobTitle
                            ? investorDetails?.additionalInfo?.JobTitle
                            : "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* investedBefore  */}

                    <Grid container xs={12} sm={12} md={12} xl={12}>
                      <Grid item xs={12} sm={4} md={4} xl={4}>
                        <Typography style={typoStyle}> Invested Before </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} md={8} xl={8}>
                        <Typography style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                          {investorDetails?.additionalInfo?.investedBefore ? "Yes" : "No"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/*if yes Invested before   */}
                    {investorDetails?.additionalInfo?.investedBefore ? (
                      <Grid container xs={12} sm={12} md={12} xl={12}>
                        <Grid item xs={12} sm={4} md={4} xl={4}>
                          <Typography style={typoStyle}> Most notable investments </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} xl={8}>
                          <Typography style={investorDetailStyle}>
                            {investorDetails?.additionalInfo?.notableInvestments
                              ? investorDetails?.additionalInfo?.notableInvestments
                              : ""}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <CardMedia
                    style={{ width: "280px", margin: "0px", objectFit: "contain" }}
                    sx={{ height: "180px" }}
                    image={selectedImage}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            //   style={{ border: "1px solid red" }}
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
                {investorDetails?.investorDocDetails?.length === 0 ? (
                  <Grid>No document found!</Grid>
                ) : (
                  investorDetails?.investorDocDetails?.map(doc => {
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
                            <Typography className={styles.heading}>{doc?.document_type}</Typography>
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
InvestorDetails.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;

export default InvestorDetails;
