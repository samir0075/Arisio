import { Box, Button, Divider, Grid, Pagination, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { meetingScheduledCount, meetingScheduledStartupList } from "src/action/investorMandates";
import NoDataMsg from "src/components/NoDataMsg";
import styles from "../allMandate.module.css";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleMeeting from "src/components/scheduleMeeting";
import MessageModal from "src/components/MessageModal";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

const Meeting = ({ mandateDetails }) => {
  const [pageCount, setPageCount] = useState("");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [meetingDialog, setMeetingDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [startupProfile, setStartupProfile] = useState("");
  const router = useRouter();

  const handleScheduleMeeting = (data) => {
    setStartupProfile(data);
    setMeetingDialog(true);
  };
  const handleMessaging = (data) => {
    setStartupProfile(data);
    setMessageDialog(true);
  };

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const mandateId = localStorage.getItem("selectedMandateId");

  useEffect(() => {
    dispatch(meetingScheduledCount(investorId, mandateId)).then((res) => {
      setPageCount(res?.pagesCount);
      dispatch(meetingScheduledStartupList(investorId, mandateId, page));
    });
  }, [dispatch, investorId, mandateId, page]);

  const meetingScheduledStartupLists = useSelector(
    (state) => state.investorMandates.meetingScheduledStartups
  );

  const handlePagination = (event, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month?.padStart(2, "0");
    const paddedDay = day?.padStart(2, "0");

    return `${paddedDay}-${paddedMonth}-${year}`;
  };

  const landingPageNav = (data) => {
    const startupId = data?.startup?.id;
    localStorage.setItem("selectedStartupId", startupId);
    router.push("./StartupTabs/landingPage");
    // dispatch(startupTabOverallView(investorId, startupId));
  };

  return (
    <>
      {meetingScheduledStartupLists?.length > 0 ? (
        <Box style={{ width: "100%", overflowX: "auto" }}>
          <Grid sx={{ minWidth: "1000px" }}>
            {/* Header */}

            <Grid sx={{ backgroundColor: "#FFFFFF", p: 2, borderRadius: "8px" }} container>
              <Grid xs={1} sm={1} md={1} xl={1}>
                <Typography className={styles.tableHeader}>
                  {" "}
                  <FormattedMessage id="shortListed.table.header.column1" defaultMessage="Logo" />
                </Typography>
              </Grid>

              <Grid xs={1.8} sm={1.8} md={1.8} xl={1.8}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage
                    id="shortListed.table.header.column2"
                    defaultMessage="Startup Name"
                  />
                </Typography>
              </Grid>
              <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage
                    id="reviewNewPitches.table.header.column4"
                    defaultMessage="Stage"
                  />
                </Typography>
              </Grid>
              <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage
                    id="reviewNewPitches.table.header.column5"
                    defaultMessage="Funding Raised"
                  />
                </Typography>
              </Grid>
              <Grid xs={1.7} sm={1.7} md={1.7} xl={1.7}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage
                    id="reviewNewPitches.table.header.column6"
                    defaultMessage="Current Traction"
                  />
                </Typography>
              </Grid>
              <Grid xs={1.7} sm={1.7} md={1.7} xl={1.7}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage
                    id="reviewNewPitches.table.header.column7"
                    defaultMessage="Market Opportunity"
                  />
                </Typography>
              </Grid>
              <Grid xs={2} sm={2} md={2} xl={2}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage
                    id="reviewNewPitches.table.header.column8"
                    defaultMessage="Team Background"
                  />
                </Typography>
              </Grid>

              {/* <Grid xs={3} sm={3} md={3} xl={3}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage id="shortListed.table.header.column3" defaultMessage="City" />
                </Typography>
              </Grid> */}
              {/* <Grid xs={3} sm={3} md={3} xl={3}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage
                    id="shortListed.table.header.column4"
                    defaultMessage="Country"
                  />
                </Typography>
              </Grid> */}
            </Grid>

            {/* Data  */}

            {meetingScheduledStartupLists?.map((data) => (
              <Grid className={styles.cardOuter} key={data?.startup?.id}>
                <Grid
                  container
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    landingPageNav(data);
                  }}
                >
                  <Grid xs={2} sm={1} md={1} xl={1}>
                    <img
                      src={
                        data?.startup?.logUrl === null
                          ? "/Images/company_default.png"
                          : `data:image/PNG;base64,${data?.startup?.logUrl}`
                      }
                      height="35"
                      width="50"
                      alt="Logo"
                      style={{ borderRadius: "100%" }}
                    />
                  </Grid>

                  <Grid xs={1.8} sm={1.8} md={1.8} xl={1.8}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.organizationName}
                    </Typography>
                  </Grid>

                  <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.startupStage || "-"}
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
                  {/* 
                  <Grid xs={3} sm={3} md={3} xl={3}>
                    <Typography className={styles.dateColor}>{data?.startup?.city}</Typography>
                  </Grid>
                  <Grid xs={3} sm={3} md={3} xl={3}>
                    <Typography className={styles.dateColor}>{data?.startup?.country}</Typography>
                  </Grid> */}
                </Grid>

                <Box>
                  <Divider sx={{ marginTop: "15px", border: "1px solid #F5F5F5" }} />
                  <Grid sx={{ marginTop: "10px" }} container justifyContent="flex-end">
                    <Button
                      disabled={mandateDetails?.is_active === 0}
                      className={styles.Button}
                      type="submit"
                      onClick={() => {
                        handleMessaging(data);
                      }}
                    >
                      <EmailIcon sx={{ position: "relative", right: "5px", fontSize: "17px" }} />{" "}
                      <FormattedMessage
                        id="shortListed.table.action.button"
                        defaultMessage="Message"
                      />
                    </Button>

                    <Button
                      disabled={mandateDetails?.is_active === 0}
                      className={styles.Button}
                      type="submit"
                      onClick={() => {
                        handleScheduleMeeting(data);
                      }}
                    >
                      <CalendarMonthIcon
                        sx={{ position: "relative", right: "5px", fontSize: "17px" }}
                      />{" "}
                      <FormattedMessage
                        id="meeting.table.action.button"
                        defaultMessage="Re-Schedule
                        Meeting"
                      />
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ my: 2, bgcolor: "#FFFFFF", p: 2 }}
          >
            <Pagination
              count={pageCount}
              showFirstButton
              showLastButton
              page={page}
              onChange={handlePagination}
            />
          </Grid>
        </Box>
      ) : (
        <NoDataMsg
          message={
            <FormattedMessage
              id="meeting.table.data.empty.text"
              defaultMessage="You haven't scheduled a meeting with any startups."
            />
          }
        />
      )}

      {meetingDialog && (
        <ScheduleMeeting
          meetingDialog={meetingDialog}
          setMeetingDialog={setMeetingDialog}
          startupProfile={startupProfile}
        />
      )}
      {messageDialog && (
        <MessageModal
          messageDialog={messageDialog}
          setMessageDialog={setMessageDialog}
          startupProfile={startupProfile}
        />
      )}
    </>
  );
};

export default Meeting;
