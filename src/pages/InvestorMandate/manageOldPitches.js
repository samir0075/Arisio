import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./allMandate.module.css";
import Shortlisted from "./Tabs/shortlisted";
import Watching from "./Tabs/watching";
import Meeting from "./Tabs/meeting";
import Contacted from "./Tabs/contacted";
import { applicationsCount } from "src/action/investorMandates";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import Rejected from "./Tabs/rejected";

const ManageOldPitches = ({ mandateDetails }) => {
  const [selectedCard, setSelectedCard] = useState(1);
  const [rejectCount, setRejectCount] = useState(1);

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
  };

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;
  const mandateId = localStorage.getItem("selectedMandateId");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(applicationsCount(investorId, mandateId)).then((res) => {
      setRejectCount(res);
    });
  }, [dispatch, investorId, mandateId]);

  return (
    <>
      <Box>
        {/* <Grid container justifyContent="flex-end">
          <Typography
            sx={{
              color: "rgba(108, 25, 62, 1)",
              fontWeight: "600 !important",
              marginBottom: "20px",
              marginRight: "10px",
            }}
          > 
            <FormattedMessage
              id="manageOldPitches.table.side.heading.text"
              defaultMessage="Not a good fit"
            />{" "}
            ({rejectCount?.Rejected})
          </Typography>
        </Grid> */}
        <Grid container spacing={2} gap={"5px"}>
          <Grid
            item
            xs={12}
            sm={2.4}
            md={2.4}
            xl={2.4}
            className={selectedCard === 1 ? styles.active : styles.individualTabs}
            onClick={() => handleCardClick(1)}
          >
            <FormattedMessage id="manageOldPitches.tab1.text" defaultMessage="SHORTLISTED" />
          </Grid>

          <Grid
            xs={12}
            sm={2.3}
            md={2.3}
            xl={2.3}
            item
            className={selectedCard === 2 ? styles.active : styles.individualTabs}
            onClick={() => handleCardClick(2)}
          >
            <FormattedMessage id="manageOldPitches.tab2.text" defaultMessage="WATCHING" />
          </Grid>

          <Grid
            xs={12}
            sm={2.3}
            md={2.3}
            xl={2.3}
            item
            className={selectedCard === 3 ? styles.active : styles.individualTabs}
            onClick={() => handleCardClick(3)}
          >
            <FormattedMessage id="manageOldPitches.tab3.text" defaultMessage="MEETING" />
          </Grid>

          <Grid
            xs={12}
            sm={2.3}
            md={2.3}
            xl={2.3}
            item
            className={selectedCard === 4 ? styles.active : styles.individualTabs}
            onClick={() => handleCardClick(4)}
          >
            <FormattedMessage id="manageOldPitches.tab4.text" defaultMessage="CONTACTED" />
          </Grid>
          <Grid
            xs={12}
            sm={2.3}
            md={2.3}
            xl={2.3}
            item
            className={selectedCard === 5 ? styles.active : styles.individualTabs}
            onClick={() => handleCardClick(5)}
          >
            <FormattedMessage id="manageOldPitches.tab5.text" defaultMessage="NOT A GOOD FIT" />
          </Grid>
        </Grid>

        <Grid sx={{ p: 2, my: 4, backgroundColor: "#FFFFFF", borderRadius: "10px" }}>
          {selectedCard === 1 && <Shortlisted mandateDetails={mandateDetails} />}
          {selectedCard === 2 && <Watching mandateDetails={mandateDetails} />}
          {selectedCard === 3 && <Meeting mandateDetails={mandateDetails} />}
          {selectedCard === 4 && <Contacted mandateDetails={mandateDetails} />}
          {selectedCard === 5 && <Rejected mandateDetails={mandateDetails} />}
        </Grid>
      </Box>
    </>
  );
};

export default ManageOldPitches;
