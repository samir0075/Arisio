import React, { useEffect } from "react";
import styles from "./createMandate.module.css";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useRouter } from "next/navigation";
import { Box, Typography, Card, CardMedia, Stack, Button, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { launchMandate } from "src/action/createMandate";
import { FormattedMessage } from "react-intl";

const FinalForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;
  const mandatesInfo = useSelector((state) => state?.newMandate?.displayMandate);

  return (
    <Box
      sx={{
        maxWidth: "100%",
        flexGrow: 1,
        background: "rgba(65, 148, 179,0.1) !important",
      }}
    >
      <Typography
        className={styles.finalPageHeading}
        style={{ fontWeight: 700, fontSize: "20px " }}
      >
        <FormattedMessage
          id="finalMandatesForm.main.heading"
          defaultMessage="Congratulations! Your mandate has been launched successfully. It will be live on Arisio once it
              gets approved by Admin within a day."
        />
      </Typography>
      <Card className={styles.finalPageCard}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Stack spacing={1} className={styles.stack}>
              <CardMedia
                component="img"
                image={`/Images/event.png`}
                alt="Mandate Form"
                sx={{ width: "10rem" }}
              />
              <Typography className={styles.manageText} style={{ fontSize: "20px" }}>
                <FormattedMessage
                  id="finalMandatesForm.card.heading1"
                  defaultMessage="Manage Your mandate"
                />
              </Typography>
              <Typography className={styles.manageDesc} style={{ fontSize: "15px" }}>
                <FormattedMessage
                  id="finalMandatesForm.card.heading2"
                  defaultMessage="Once you have created and launched your mandate, you can manage this mandate in your
                  mandate dashboard."
                />
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={4}>
            <Stack spacing={1} className={styles.stack}>
              <CardMedia
                component="img"
                image={`/Images/profile-2.png`}
                alt="Mandate Form"
                sx={{ width: "10rem" }}
              />
              <Typography className={styles.manageText} style={{ fontSize: "20px" }}>
                <FormattedMessage
                  id="finalMandatesForm.card.heading3"
                  defaultMessage="Visit startup profiles"
                />
              </Typography>
              <Typography className={styles.manageDesc} style={{ fontSize: "15px" }}>
                <FormattedMessage
                  id="finalMandatesForm.card.heading4"
                  defaultMessage="When startups apply for your mandate, you can see their profile and analysis inside
                  application section on dashboard."
                />
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={1} className={styles.stack}>
              <CardMedia
                component="img"
                image={`/Images/event-2.png`}
                alt="Mandate Form"
                sx={{ width: "10rem" }}
              />
              <Typography className={styles.manageText} style={{ fontSize: "20px" }}>
                <FormattedMessage
                  id="finalMandatesForm.card.heading5"
                  defaultMessage="Fund startups"
                />
              </Typography>
              <Typography className={styles.manageDesc} style={{ fontSize: "17px" }}>
                <FormattedMessage
                  id="finalMandatesForm.card.heading6"
                  defaultMessage="Once you have gone through startup profiles, you can either shortlist them to meet
                  now or you can watch them on Arisio for future engagements."
                />
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
      <div className={styles.btnStyle}>
        <Button
          variant="contained"
          onClick={() => {
            if (mandatesInfo?.id) {
              dispatch(launchMandate(investorId, mandatesInfo?.id));
              router.push("/InvestorMandate");
            }
          }}
        >
          <FormattedMessage id="finalMandatesForm.continue.button" defaultMessage="Continue" />
        </Button>
      </div>
    </Box>
  );
};

FinalForm.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default FinalForm;
