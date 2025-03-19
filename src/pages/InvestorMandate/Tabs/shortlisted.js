import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shortlistedCount, shortlistedStartupList } from "src/action/investorMandates";
import NoDataMsg from "src/components/NoDataMsg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../allMandate.module.css";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationModal from "../confirmationModal";
// import ScheduleMeeting from "src/components/scheduleMeeting";
import MessageModal from "src/components/MessageModal";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import { formattedDate } from "src/utils/util";

// Dynamically import the component and disable server-side rendering
const ScheduleMeeting = dynamic(() => import("../../../components/scheduleMeeting"), {
  ssr: false,
});

const Shortlisted = ({ mandateDetails }) => {
  const [pageCount, setPageCount] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState({});
  const dispatch = useDispatch();
  const [meetingDialog, setMeetingDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [startupProfile, setStartupProfile] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

  const router = useRouter();

  const handleAction = (msg, data) => {
    setMessage({ msg, data });
    setDialogOpen(true);
  };
  const handleScheduleMeeting = (data) => {
    setStartupProfile(data);
    setMeetingDialog(true);
  };
  const handleMessaging = (data) => {
    setStartupProfile(data);
    setMessageDialog(true);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
  };
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const mandateId = localStorage.getItem("selectedMandateId");

  useEffect(() => {
    dispatch(shortlistedCount(investorId, mandateId)).then((res) => {
      setPageCount(res?.pagesCount);
      dispatch(shortlistedStartupList(investorId, mandateId, page));
    });
  }, [dispatch, investorId, mandateId, page]);

  const shortlistedStartupLists = useSelector(
    (state) => state.investorMandates.shortlistedStartups
  );

  const handlePagination = (event, value) => {
    setPage(value);
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
    // dispatch(startupTabOverallView(investorId, startupId));
  };

  return (
    <>
      {shortlistedStartupLists?.length > 0 ? (
        <Box style={{ width: "100%", overflowX: "auto" }}>
          <Grid sx={{ minWidth: "1300px" }}>
            {/* Header */}

            <Grid sx={{ backgroundColor: "#FFFFFF", p: 2, borderRadius: "8px" }} container>
              <Grid xs={1} sm={1} md={1} xl={1}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage id="shortListed.table.header.column1" defaultMessage="Logo" />
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
              <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage
                    id="reviewNewPitches.table.header.column8"
                    defaultMessage="Team Background"
                  />
                </Typography>
              </Grid>
              {/* <Grid xs={3} sm={2} md={2} xl={2}>
                <Typography className={styles.tableHeader}>
                  <FormattedMessage id="shortListed.table.header.column3" defaultMessage="City" />
                </Typography>
              </Grid> */}
              {/* <Grid xs={3} sm={2} md={2} xl={2}>
                <Typography className={styles.tableHeader}> Shortlisted On</Typography>
              </Grid> */}
              {/* <Grid xs={3} sm={3} md={3} xl={3}>
                <Typography className={styles.tableHeader}>
                  {" "}
                  <FormattedMessage
                    id="shortListed.table.header.column4"
                    defaultMessage="Country"
                  />
                </Typography>
              </Grid> */}
            </Grid>

            {/* Data  */}

            {shortlistedStartupLists?.map((data) => (
              <Grid className={styles.cardOuter} key={data?.startup?.id}>
                <Grid
                  container
                  style={{ cursor: "pointer" }}
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
                    <Tooltip title={data?.startup?.organizationName} placement="top">
                      <Typography
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        className={styles.dateColor}
                      >
                        {data?.startup?.organizationName}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                    <Typography className={styles.dateColor}>{data?.startupStage}</Typography>
                  </Grid>
                  <Grid xs={1.5} sm={1.5} md={1.5} xl={1.5}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.fundingAmount || "- "}
                    </Typography>
                  </Grid>
                  <Grid xs={1.7} sm={1.7} md={1.7} xl={1.7}>
                    <Typography className={styles.dateColor}>
                      {data?.current_tranction || "-"}
                    </Typography>
                  </Grid>
                  <Grid xs={1.7} sm={1.7} md={1.7} xl={1.7}>
                    <Typography className={styles.dateColor}>
                      {data?.startup?.market_opportunity || "-"}
                    </Typography>
                  </Grid>
                  <Grid xs={2} sm={2} md={2} xl={2}>
                    <Typography className={styles.dateColor}>
                      {data?.team_background || "-"}
                    </Typography>
                  </Grid>
                  {/* <Grid xs={3} sm={2} md={2} xl={2}>
                    <Typography className={styles.dateColor}>{data?.startup?.city}</Typography>
                  </Grid> */}
                  {/* <Grid xs={3} sm={2} md={2} xl={2}>
                    <Typography className={styles.dateColor}>
                      <span className={styles.primary}>{formatDate(data?.acceptedDate)}</span>
                    </Typography>
                  </Grid> */}
                  {/* <Grid xs={3} sm={2} md={2} xl={2}>
                    <Typography className={styles.dateColor}>{data?.startup?.foundedOn}</Typography>

                    <FormControl size="small">
                      <InputLabel id="select-label">Select Option</InputLabel>
                      <Select
                        sx={{ width: "120px" }}
                        labelId="select-label"
                        value={selectedValue}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Select Option" }} // This line is correct for accessibility
                        renderValue={(selected) => {
                          if (selected === "") {
                            return <Typography sx={{ fontSize: "15px" }}>Decision</Typography>; // Placeholder text when no option is selected
                          }
                          return selected;
                        }}
                      >
                        <MenuItem value={10}>Shortlist</MenuItem>
                        <MenuItem value={20}>Watchlist</MenuItem>
                        <MenuItem value={30}>Not a good fit</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                </Grid>

                <Box>
                  <Divider
                    sx={{
                      marginTop: "15px",
                      border: "1px solid #F5F5F5",
                    }}
                  />
                  <Grid
                    container
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Grid item>
                      <Typography className={styles.dateColor}>
                        <FormattedMessage
                          id="shortListed.table.data"
                          defaultMessage="Shortlisted on :"
                        />{" "}
                        <span className={styles.primary}>
                          {/* {formatDate(data?.acceptedDate)} */}

                          {formattedDate(data?.acceptedDate)}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item>
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
                        />
                        <FormattedMessage
                          id="shortListed.table.action.button2"
                          defaultMessage="Schedule Meeting"
                        />
                      </Button>
                      <Button
                        className={styles.Button}
                        disabled={mandateDetails?.is_active === 0}
                        type="submit"
                        onClick={() => {
                          handleAction(
                            <FormattedMessage
                              id="shortListed.table.action.button2.text"
                              defaultMessage="Are you sure you want to watch this startup?"
                            />,
                            data
                          );
                        }}
                      >
                        {" "}
                        <VisibilityIcon
                          sx={{ position: "relative", right: "5px", fontSize: "17px" }}
                        />
                        <FormattedMessage
                          id="shortListed.table.action.button3"
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
                              id="shortListed.table.action.button3.text"
                              defaultMessage="Are you sure you want to reject this startup?"
                            />,
                            data
                          );
                        }}
                      >
                        {" "}
                        <CloseIcon sx={{ position: "relative", right: "5px", fontSize: "17px" }} />
                        <FormattedMessage
                          id="shortListed.table.action.button4"
                          defaultMessage="Not a good fit"
                        />
                      </Button>
                    </Grid>
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
              id="shortListed.table.text"
              defaultMessage="You haven't shortlisted any startups."
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

export default Shortlisted;
