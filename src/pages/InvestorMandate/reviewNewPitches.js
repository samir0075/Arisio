import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./allMandate.module.css";
import DoneIcon from "@mui/icons-material/Done";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationModal from "./confirmationModal";
import NoDataMsg from "src/components/NoDataMsg";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import { formattedDate } from "src/utils/util";

const ReviewNewPitches = ({ mandateDetails }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [message, setMessage] = useState({});
  const newPitchesData = useSelector((state) => state.investorMandates.newPitches);

  const router = useRouter();

  const handleAction = (msg, data) => {
    setMessage({ msg, data });
    setDialogOpen(true);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
  };

  // const formatDate = dateString => {
  //   const options = { year: "numeric", month: "numeric", day: "numeric" };
  //   const date = new Date(dateString);

  //   const formattedDate = date.toLocaleDateString(undefined, options);

  //   // Pad day and month with leading zeros if less than 10
  //   const [month, day, year] = formattedDate.split("/");
  //   const paddedMonth = month?.padStart(2, "0");
  //   const paddedDay = day?.padStart(2, "0");

  //   return `${paddedDay}-${paddedMonth}-${year}`;
  // };

  const landingPageNav = (data) => {
    const startupId = data?.startup?.id;
    localStorage.setItem("selectedStartupId", startupId);
    router.push("./StartupTabs/landingPage");
  };

  const filterApplied = newPitchesData.filter((data) => data.currentStatus === "applied");
  return (
    <>
      {filterApplied.length > 0 ? (
        <Box style={{ width: "100%", overflowX: "auto" }}>
          <Grid sx={{ minWidth: "1300px" }}>
            {/* Header */}

            <Grid sx={{ backgroundColor: "#FFFFFF", p: 2, borderRadius: "8px" }} container>
              <Grid xs={1} sm={1} md={1} xl={1}>
                <Typography className={styles.tableHeader}>
                  {" "}
                  <FormattedMessage
                    id="reviewNewPitches.table.header.column1"
                    defaultMessage="Logo"
                  />
                </Typography>
              </Grid>

              <Grid xs={1.8} sm={1.8} md={1.8} xl={1.8}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage
                    id="reviewNewPitches.table.header.column2"
                    defaultMessage="Startup Name"
                  />
                </Typography>
              </Grid>
              <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                <Typography className={styles.tableHeader}>Stage</Typography>
              </Grid>
              <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                <Typography className={styles.tableHeader}>Funding Raised</Typography>
              </Grid>
              <Grid xs={1.7} sm={1.7} md={1.7} xl={1.7}>
                <Typography className={styles.tableHeader}>Current Traction</Typography>
              </Grid>
              <Grid xs={1.7} sm={1.7} md={1.7} xl={1.7}>
                <Typography className={styles.tableHeader}>Market Opportunity</Typography>
              </Grid>
              <Grid xs={2} sm={2} md={2} xl={2}>
                <Typography className={styles.tableHeader}>Team Background </Typography>
              </Grid>

              {/* <Grid xs={3} sm={3} md={2} xl={2}>
                <Typography className={styles.tableHeader}>
                  {" "}
                  <FormattedMessage
                    id="reviewNewPitches.table.header.column3"
                    defaultMessage="Country/Location"
                  />
                </Typography>
              </Grid> */}

              {/* <Grid xs={3} sm={2} md={2} xl={2}>
                <Typography className={styles.tableHeader}> Applied Date</Typography>
              </Grid> */}
              {/* <Grid xs={3} sm={1} md={1} xl={1}>
                <Typography className={styles.tableHeader}> Decision</Typography>
              </Grid> */}
            </Grid>

            {/* Data  */}

            {filterApplied?.map((data) => (
              <Grid
                // sx={{
                //   alignItems: "center",
                // }}
                className={styles.cardOuter}
                key={data?.startup?.id}
              >
                <Grid
                  container
                  sx={{ cursor: "pointer", paddingTop: "10px", alignItems: "center" }}
                  onClick={() => {
                    landingPageNav(data);
                  }}
                >
                  <Grid xs={1} sm={1} md={1} xl={1}>
                    <img
                      src={
                        data?.startup?.logUrl === null
                          ? "/Images/company_default.png"
                          : `data:image/PNG;base64,${data?.startup?.logUrl}`
                      }
                      height="35"
                      width="55"
                      alt="Logo"
                    />
                  </Grid>

                  <Grid xs={1.8} sm={1.8} md={1.8} xl={1.8}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.organizationName}
                    </Typography>
                  </Grid>

                  <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.startupstage?.name || "-"}
                    </Typography>
                  </Grid>
                  <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.fundingAmount || "-"}
                    </Typography>
                  </Grid>
                  <Grid xs={1.7} sm={1.7} md={1.7} xl={1.7}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.current_tranction || "-"}
                    </Typography>
                  </Grid>
                  <Grid xs={1.7} sm={1.7} md={1.7} xl={1.7}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.market_opportunity || "-"}
                    </Typography>
                  </Grid>
                  <Grid xs={2} sm={2} md={2} xl={2}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.team_background || "-"}
                    </Typography>
                  </Grid>

                  {/* <Grid xs={3} sm={3} md={2} xl={2}>
                    <Typography className={styles.dateColor}>{data?.startup?.city}</Typography>
                  </Grid> */}
                  {/* <Grid xs={3} sm={2} md={2} xl={2}>
                    <Typography className={styles.dateColor}>
                      {formatDate(data?.appliedDate)}
                    </Typography>
                  </Grid> */}
                </Grid>

                {data?.currentStatus === "applied" && (
                  <Box>
                    <Divider sx={{ marginTop: "10px", border: "1px solid #F5F5F5" }} />

                    <Grid
                      sx={{
                        marginTop: "10px",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      container
                    >
                      <Grid item>
                        <Typography className={styles.dateColor}>
                          <FormattedMessage
                            id="reviewNewPitches.table.data.text"
                            defaultMessage="Applied on :"
                          />{" "}
                          <span className={styles.primary}>
                            {/* {formatDate(data?.appliedDate)} */}

                            {formattedDate(data?.appliedDate)}
                          </span>
                        </Typography>
                      </Grid>

                      <Grid item>
                        <Button
                          disabled={mandateDetails?.is_active === 0}
                          className={styles.Button}
                          type="submit"
                          onClick={() => {
                            handleAction(
                              <FormattedMessage
                                id="reviewNewPitches.table.action.button.text"
                                defaultMessage="Are you sure you want to shortlist this startup?"
                              />,
                              data
                            );
                          }}
                        >
                          <DoneIcon sx={{ position: "relative", right: "5px", fontSize: "17px" }} />{" "}
                          <FormattedMessage
                            id="reviewNewPitches.table.action.button.label"
                            defaultMessage="Shortlist"
                          />
                        </Button>

                        <Button
                          disabled={mandateDetails?.is_active === 0}
                          className={styles.Button}
                          type="submit"
                          onClick={() => {
                            handleAction(
                              <FormattedMessage
                                id="reviewNewPitches.table.action.button2.text"
                                defaultMessage="Are you sure you want to watch this startup?"
                              />,
                              data
                            );
                          }}
                        >
                          <VisibilityIcon
                            sx={{ position: "relative", right: "5px", fontSize: "17px" }}
                          />{" "}
                          <FormattedMessage
                            id="reviewNewPitches.table.action.button2.label"
                            defaultMessage="Watchlist"
                          />
                        </Button>

                        <Button
                          disabled={mandateDetails?.is_active === 0}
                          className={styles.Button}
                          type="submit"
                          onClick={() => {
                            handleAction(
                              <FormattedMessage
                                id="reviewNewPitches.table.action.button3.text"
                                defaultMessage="Are you sure you want to reject this startup?"
                              />,
                              data
                            );
                          }}
                        >
                          {" "}
                          <CloseIcon
                            sx={{ position: "relative", right: "5px", fontSize: "17px" }}
                          />
                          <FormattedMessage
                            id="reviewNewPitches.table.action.button3.label"
                            defaultMessage="Not a good fit"
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <NoDataMsg
          message={
            <FormattedMessage
              id="reviewNewPitches.table.data.text.noNew.pitches"
              defaultMessage="You have not received any new pitch yet."
            />
          }
        />
      )}

      {dialogOpen && (
        <ConfirmationModal
          message={message}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      )}
    </>
  );
};

export default ReviewNewPitches;
