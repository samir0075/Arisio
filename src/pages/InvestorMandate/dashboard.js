import React from "react";
import styles from "./allMandate.module.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormattedMessage } from "react-intl";

const Dashboard = ({ formatDateTime, pitchStatus, meetingDetails, handleView }) => {
  return (
    <Grid>
      <Grid sx={{ border: "1px solid" }}>
        <Grid
          className={styles.cardOuter}
          sx={{
            boxShadow: "0 0 6px #dd094194",
            marginTop: "15px"
          }}
        >
          <Typography className={styles.mandateHeader}>
            {" "}
            <FormattedMessage
              id="mandateStatus.card1.heading"
              defaultMessage="Overall Pitch status"
            />
          </Typography>
        </Grid>
        <Grid container justifyContent="space-between">
          <Grid
            onClick={handleView}
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={styles.cardOuter}
            sx={{
              my: 2,
              p: 1,
              border: "1px solid #8A1538",
              borderRadius: "8px",
              boxShadow: "0 0 6px #dd094194",
              cursor: "pointer"
            }}
            xs={12}
            sm={5.5}
            md={5.5}
            xl={5.5}
          >
            <Typography className={`${styles.points} ${styles.dateColor}`}>
              <FormattedMessage
                id="mandateStatus.card1.sub.heading1"
                defaultMessage="Total Pitches"
              />
            </Typography>
            <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
            <Typography style={{ fontSize: "1.8rem", color: "#8A1538" }}>
              {pitchStatus?.TotalApplication}
            </Typography>
          </Grid>
          <Grid
            onClick={handleView}
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={styles.cardOuter}
            sx={{
              my: 2,
              p: 1,
              border: "1px solid #8A1538",
              borderRadius: "8px",
              boxShadow: "0 0 6px #dd094194",
              cursor: "pointer"
            }}
            xs={12}
            sm={5.5}
            md={5.5}
            xl={5.5}
          >
            <Typography className={`${styles.points} ${styles.dateColor}`}>
              <FormattedMessage
                id="mandateStatus.card1.sub.heading2"
                defaultMessage="New Pitches"
              />
            </Typography>
            <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
            <Typography style={{ fontSize: "1.8rem", color: "#8A1538" }}>
              {pitchStatus?.NewApplication}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          className={styles.cardOuter}
          sx={{
            boxShadow: "0 0 6px #dd094194"
          }}
        >
          <Typography className={styles.mandateHeader}>
            <FormattedMessage
              id="mandateStatus.card2.heading"
              defaultMessage="Pitch Action status"
            />
          </Typography>
        </Grid>
        <Grid container justifyContent="space-between">
          <Grid
            // onClick={handleShortlisted}
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={styles.cardOuter}
            sx={{
              my: 2,
              p: 1,
              border: "1px solid #8A1538",
              borderRadius: "8px",
              boxShadow: "0 0 6px #dd094194"
            }}
            xs={12}
            sm={5}
            md={2.5}
            xl={2.5}
          >
            <Typography className={`${styles.points} ${styles.dateColor}`}>
              <FormattedMessage
                id="mandateStatus.card2.sub.heading1"
                defaultMessage="Shortlisted"
              />
            </Typography>
            <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
            <Typography style={{ fontSize: "1.8rem", color: "#8A1538" }}>
              {pitchStatus?.Accepted}
            </Typography>
          </Grid>
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={styles.cardOuter}
            sx={{
              my: 2,
              p: 1,
              border: "1px solid #8A1538",
              borderRadius: "8px",
              boxShadow: "0 0 6px #dd094194"
            }}
            xs={12}
            sm={5}
            md={2.5}
            xl={2.5}
          >
            <Typography className={`${styles.points} ${styles.dateColor}`}>
              <FormattedMessage
                id="mandateStatus.card2.sub.heading2"
                defaultMessage="nvestor watching"
              />
            </Typography>
            <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
            <Typography style={{ fontSize: "1.8rem", color: "#8A1538" }}>
              {pitchStatus?.Watchlist}
            </Typography>
          </Grid>
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={styles.cardOuter}
            sx={{
              my: 2,
              p: 1,
              border: "1px solid #8A1538",
              borderRadius: "8px",
              boxShadow: "0 0 6px #dd094194"
            }}
            xs={12}
            sm={5}
            md={2.5}
            xl={2.5}
          >
            <Typography className={`${styles.points} ${styles.dateColor}`}>
              <FormattedMessage
                id="mandateStatus.card2.sub.heading3"
                defaultMessage="Not a good fit"
              />
            </Typography>
            <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
            <Typography style={{ fontSize: "1.8rem", color: "red" }}>
              {pitchStatus?.Rejected}
            </Typography>
          </Grid>
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={styles.cardOuter}
            sx={{
              my: 2,
              p: 1,
              border: "1px solid #8A1538",
              borderRadius: "8px",
              boxShadow: "0 0 6px #dd094194"
            }}
            xs={12}
            sm={5}
            md={2.5}
            xl={2.5}
          >
            <Typography className={`${styles.points} ${styles.dateColor}`}>
              <FormattedMessage id="mandateStatus.card2.sub.heading4" defaultMessage="Contacted" />
            </Typography>
            <Divider sx={{ border: "1px solid #cbaeb7", width: "100%", my: 1 }} />
            <Typography style={{ fontSize: "1.8rem", color: "#8A1538" }}>
              {pitchStatus?.Contacted}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        className={styles.cardOuter}
        sx={{
          boxShadow: "0 0 6px #dd094194"
        }}
      >
        <Grid>
          <Typography className={styles.mandateTitle}>
            <FormattedMessage
              id="mandateStatus.card3.heading"
              defaultMessage="Upcoming Scheduled meeting"
            />
          </Typography>
        </Grid>
      </Grid>

      {meetingDetails?.map(data => (
        <Accordion sx={{ my: 2 }} key={data.meetingId}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Grid container>
              <Grid xs={12} sm={3} md={2} xl={2}>
                <img
                  loading="lazy"
                  height="30"
                  width="30"
                  style={{ borderRadius: "100%" }}
                  src={
                    data?.logo
                      ? `data:image/PNG;base64,${data?.logo}`
                      : "/Images/company_default.png"
                  }
                  alt="Logo"
                />
              </Grid>
              <Grid xs={12} sm={3} md={2} xl={2}>
                <Typography className={styles.dateColor}>
                  {" "}
                  <FormattedMessage
                    id="mandateStatus.card3.sub.heading1"
                    defaultMessage="Meeting with"
                  />
                </Typography>
              </Grid>
              <Grid xs={12} sm={3} md={4} xl={4}>
                <Typography className={styles.mandateTitle}>{data?.Startup}</Typography>
              </Grid>
              <Grid xs={12} sm={3} md={4} xl={4}>
                <Typography className={styles.backButtonColor}>
                  {formatDateTime(data?.start_time, data?.end_time)}
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container justifyContent="center" sx={{ bgcolor: "#F5F5F5", p: 2 }}>
              <Typography className={styles.dateColor}>
                <FormattedMessage id="mandateStatus.card3.sub.heading2" defaultMessage="Venue :" />{" "}
                <span className={styles.primary}>
                  {data?.location ? data?.location : "Online Meeting Scheduled "}
                </span>
              </Typography>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Grid>
  );
};

export default Dashboard;
