import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import styles from "./createMandate.module.css";
import { mandateActions } from "src/store/createMandateSlice";
import { FormattedMessage } from "react-intl";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Grid,
  Divider,
  CardMedia,
  CardActions,
} from "@mui/material";

const ReviewMandates = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const otherData = localStorage.getItem("othersTech");
  const otherTechData = otherData ? JSON.parse(otherData) : null;
  const domainData = localStorage.getItem("othersDomain");
  const otherDomainData = domainData ? JSON.parse(domainData) : null;
  const selectedMandateData = useSelector((state) => state?.newMandate?.selectedMandate);

  /** Making new Unique set of technology elements from mandatesData */
  const technologyNamesSet = new Set(
    selectedMandateData?.length > 0
      ? selectedMandateData?.map((e) => e?.excubatorDomainTechMappingEntity?.technologyEntity?.name)
      : [otherTechData]
  );

  const technologyNames = Array.from(technologyNamesSet);

  const domainNames =
    selectedMandateData?.length > 0
      ? selectedMandateData?.map(
          (e) => e?.excubatorDomainTechMappingEntity?.excubatorDomainEntity?.name
        )
      : [otherDomainData];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 2,
        background: "rgba(65, 148, 179,0.1) !important",
      }}
    >
      <Stack spacing={1} className={styles.stack}>
        <Typography className={styles.heading} style={{ fontSize: "26px" }}>
          <FormattedMessage
            id="reviewMandate.Page.heading"
            defaultMessage="Review your selection"
          />
        </Typography>
        <CardMedia
          component="img"
          image={`/Images/mandates.png`}
          alt="Mandate Image"
          sx={{ width: "8rem" }}
        />
        <Typography className={styles.subHeading} style={{ fontSize: "22px" }}>
          <FormattedMessage
            id="reviewMandate.Page.heading2"
            defaultMessage="Technology and Application area"
          />
        </Typography>
        <Typography
          className={styles.text}
          style={{ fontSize: "20px", fontFamily: "Calibri-lightItalic" }}
        >
          <FormattedMessage
            id="reviewMandate.Page.heading3"
            defaultMessage="This selection will be published for startups to view"
          />
        </Typography>
        <Card
          sx={{
            width: { xs: "90vw", sm: "70vw", lg: "50vw" },
            height: "auto",
            p: 1,
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              <FormattedMessage
                id="reviewMandate.card.content"
                defaultMessage="Technology and Application area you have selected"
              />
            </Typography>

            <Grid
              container
              spacing={2}
              columns={{ xs: 12, sm: 12, md: 16 }}
              sx={{ marginTop: "15px" }}
            >
              {technologyNames.length > 0 &&
                technologyNames.map((e) => (
                  <>
                    <Grid item xs={6}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 2,
                          backgroundColor: "#39c7f3",
                          minHeight: "56px",
                          textAlign: "center",
                          borderRadius: "10px",
                          color: "white",
                          maxWidth: "250px",
                        }}
                      >
                        {e}
                      </Paper>
                    </Grid>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{
                        display: "flex",
                        color: "black",
                        "& svg": {
                          m: 1,
                        },
                        "& hr": {
                          mx: 0.5,
                        },
                      }}
                    />
                    <Grid item xs={3} sm={8} lg={8} key={e}>
                      <Typography
                        sx={{
                          fontFamily: "Calibri",
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "#898989",
                          opacity: 1,
                        }}
                      >
                        {domainNames?.join("|")}
                      </Typography>
                    </Grid>
                  </>
                ))}
            </Grid>
            <CardActions>
              <Button
                href="#text-buttons"
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  color: "#1d4c9e",
                  fontFamily: "Calibri",
                  fontSize: "20px",
                  fontWeight: 600,
                  marginTop: "15px",
                }}
                onClick={() => {
                  router.back();
                  dispatch(
                    mandateActions.fetchSelectedMandate({
                      selectedMandate: [],
                    })
                  );
                  dispatch(
                    mandateActions.fetchMandateDetailsById({
                      singleMandate: [],
                    })
                  );
                }}
              >
                <FormattedMessage
                  id="reviewMandate.card.edit.button.text"
                  defaultMessage="Do you want to edit your selection above ?"
                />
              </Button>
            </CardActions>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          sx={{
            alignItems: "center",
            margin: " 20px auto",
          }}
          onClick={() => {
            router.push("./mandateForm");
            dispatch(
              mandateActions.fetchSelectedMandate({
                selectedMandate: [],
              })
            );
            dispatch(
              mandateActions.fetchMandateDetailsById({
                singleMandate: [],
              })
            );
            localStorage.setItem("selectedExistingTech", JSON.stringify(null));
          }}
        >
          <FormattedMessage id="reviewMandate.card.submit.button.text" defaultMessage="Next" />
        </Button>
      </Stack>
    </Box>
  );
};

ReviewMandates.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default ReviewMandates;
