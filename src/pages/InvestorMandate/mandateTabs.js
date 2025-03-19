import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ReviewNewPitches from "./reviewNewPitches";
import ManageOldPitches from "./manageOldPitches";
import { Divider, FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import styles from "./allMandate.module.css";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedMandateStatus } from "src/action/investorMandates";

const MandateTabs = ({ mandateShortDetails }) => {
  const [selectedTabs, setSelectedTabs] = useState(1);
  const [selectedValue, setSelectedValue] = useState(0);
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const dispatch = useDispatch();

  const mandateId = localStorage.getItem("selectedMandateId");
  // useEffect(() => {
  //   dispatch(getSelectedMandateStatus(investorId, mandateId));
  // }, []);

  const pitchStatus = useSelector((state) => state.investorMandates.mandateAction);
  const handleCardClick = (cardId) => {
    setSelectedTabs(cardId);
  };
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

  const mandateDetails = useSelector((state) => state?.investorMandates?.shortDetails);

  return (
    <>
      <Grid
        container
        className={styles.cardOuter}
        sx={{
          boxShadow: "0 0 6px rgba(23,29,48,.4)",
        }}
      >
        <Grid>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "500",
              fontFamily: "Inter",
              color: "#0d4261",
              padding: "10px 0",
              paddingLeft: "20px",
            }}
          >
            {mandateShortDetails?.title}
          </Typography>
        </Grid>
        <Grid container alignItems="center" justifyContent={"space-between"} paddingLeft={"20px"}>
          <Grid item xs={12} sm={12} md={5} xl={5}>
            <Typography
              className={`${styles.points}  ${styles.dateColor}`}
              fontSize={"15px"}
              component="div"
            >
              <FormattedMessage
                id="mandateStatus.card.content.heading1"
                defaultMessage="Mandate Starting Date :"
              />
              <span className={styles.points} style={{ fontSize: "15px" }}>
                {" "}
                {formatDate(mandateShortDetails?.startDate)}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} xl={5}>
            <Typography
              className={`${styles.points} ${styles.dateColor}`}
              fontSize={"15px"}
              component="div"
            >
              <FormattedMessage
                id="mandateStatus.card.content.heading2"
                defaultMessage="Mandate Closing Date :"
              />
              <span className={styles.points} style={{ fontSize: "15px" }}>
                {" "}
                {formatDate(mandateShortDetails?.endDate)}
              </span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-around">
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
              // boxShadow: "0 0 6px #dd094194",
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
            <Typography style={{ fontSize: "1.8rem", color: "#344955" }}>
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
              // boxShadow: "0 0 6px #dd094194",
            }}
            xs={12}
            sm={5}
            md={2.5}
            xl={2.5}
          >
            <Typography className={`${styles.points} ${styles.dateColor}`}>
              <FormattedMessage
                id="mandateStatus.card2.sub.heading2"
                defaultMessage="Investor watching"
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
              // boxShadow: "0 0 6px #dd094194",
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
              // boxShadow: "0 0 6px #dd094194",
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
            <Typography style={{ fontSize: "1.8rem", color: "#720D5D" }}>
              {pitchStatus?.Contacted}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ my: 3 }}>
        <Grid
          container
          sx={{
            gap: "1rem",
            justifyContent: { xs: "center", sm: "center", md: "flex-start" },
          }}
        >
          <Grid
            item
            className={selectedTabs === 1 ? styles.active : styles.individualTabs}
            onClick={() => handleCardClick(1)}
          >
            <FormattedMessage id="mandatesTabs.tab1.text" defaultMessage="REVIEW NEW PITCHES" />
          </Grid>

          <Grid
            // sx={{ marginLeft: "20px" }}
            item
            className={selectedTabs === 2 ? styles.active : styles.individualTabs}
            onClick={() => handleCardClick(2)}
          >
            <FormattedMessage id="mandatesTabs.tab2.text" defaultMessage="MANAGE PITCHES" />
          </Grid>
        </Grid>

        <Grid sx={{ p: 2, my: 2, borderRadius: "10px" }}>
          {selectedTabs === 1 && <ReviewNewPitches mandateDetails={mandateDetails} />}
          {selectedTabs === 2 && <ManageOldPitches mandateDetails={mandateDetails} />}
        </Grid>
      </Box>
    </>
  );
};

export default MandateTabs;
