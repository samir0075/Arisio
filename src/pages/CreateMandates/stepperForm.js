import ExternalContainer from "src/components/ExternalContainer";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { mandateActions } from "src/store/createMandateSlice";
import Stepper from "./stepper";
import { navigateIncompleteMandate } from "src/action/createMandate";
import { useEffect, useState } from "react";

const StepperForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const otherData = localStorage.getItem("othersTech");
  const otherTechData = otherData ? JSON.parse(otherData) : null;
  const domainData = localStorage.getItem("othersDomain");
  const otherDomainData = domainData ? JSON.parse(domainData) : null;
  const selectedMandateData = useSelector((state) => state?.newMandate?.selectedMandate);
  const { id } = router.query;
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;
  const incompleteMandate = localStorage.getItem("incompleteMandate");

  const [tech, setTech] = useState("");
  const [application, setApplication] = useState("");

  useEffect(() => {
    if (incompleteMandate) {
      localStorage.removeItem("selectedTech");
      localStorage.removeItem("selectedExistingTech");
      localStorage.removeItem("othersTech");
      localStorage.removeItem("othersDomain");
      dispatch(navigateIncompleteMandate(investorId, id)).then((res) => {
        if (res) {
          dispatch(mandateActions.saveMandateId(res.id));
          const spacesAndTech = res?.spacesAndTech;
          setTech(spacesAndTech !== null ? Object?.keys(spacesAndTech)[0] : res.othersTech);
          setApplication(
            spacesAndTech !== null ? Object?.values(spacesAndTech)[0] : res.othersDomain
          );
        }
      });
    } else {
      dispatch(mandateActions.saveMandateId(""));
      dispatch(
        mandateActions.fetchIncompleteMandate({
          incompleteMandateData: {},
        })
      );
    }
  }, [dispatch, id, incompleteMandate, investorId]);

  // const tech = id ? Object?.keys(spacesAndTech)[0] : "";
  // const application = id ? Object?.values(spacesAndTech)[0] : "";

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
    <>
      <ExternalContainer>
        <Grid sx={{ backgroundColor: "#FFFFFF", p: 2 }}>
          <Grid
            sx={{
              width: { sm: "80vw", md: "50vw" },
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

              <Grid sx={{ marginTop: "15px" }}>
                {/* {!id
                  ? technologyNames.length > 0 &&
                    technologyNames.map((e) => (
                      <Grid container key={e}>
                        <Grid item xs={12} sm={6} md={6} xl={6}>
                          <Box
                            elevation={3}
                            sx={{
                              p: 2,
                              // backgroundColor: "#39c7f3",
                              minHeight: "56px",
                              textAlign: "center",
                              borderRadius: "10px",
                              color: "rgba(108, 25, 62, 1)",
                              fontWeight: "700",
                              maxWidth: "250px",
                            }}
                          >
                            {e}
                          </Box>
                        </Grid>

                        <Grid
                          sx={{ mt: 1.5, textAlign: { xs: "center", sm: "center", md: "left" } }}
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          xl={6}
                          key={e}
                        >
                          <Typography
                            sx={{
                              fontFamily: "Calibri",
                              fontWeight: 600,
                              fontSize: "16px",
                              color: "#000000",
                              opacity: 1,
                            }}
                          >
                            {domainNames?.join("|")}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))
                  : technologyNames.length > 0 &&
                    technologyNames.map((e) => (
                      <Grid container key={e}>
                        <Grid item xs={12} sm={6} md={6} xl={6}>
                          <Box
                            elevation={3}
                            sx={{
                              p: 2,
                              // backgroundColor: "#39c7f3",
                              minHeight: "56px",
                              textAlign: "center",
                              borderRadius: "10px",
                              color: "rgba(108, 25, 62, 1)",
                              fontWeight: "700",
                              maxWidth: "250px",
                            }}
                          >
                            {tech}
                          </Box>
                        </Grid>

                        <Grid sx={{ mt: 1.5 }} item xs={12} sm={6} md={6} xl={6} key={e}>
                          <Typography
                            sx={{
                              fontFamily: "Calibri",
                              fontWeight: 600,
                              fontSize: "16px",
                              color: "#000000",
                              opacity: 1,
                            }}
                          >
                            {application}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))} */}
                {/* {technologyNames.length > 0 &&
                  technologyNames.map(e => (
                    <Grid container key={e}>
                      <Grid item xs={12} sm={6} md={6} xl={6}>
                        <Box
                          elevation={3}
                          sx={{
                            p: 2,
                            // backgroundColor: "#39c7f3",
                            minHeight: "56px",
                            textAlign: "center",
                            borderRadius: "10px",
                            color: "rgba(108, 25, 62, 1)",
                            fontWeight: "700",
                            maxWidth: "250px"
                          }}
                        >
                          {!id ? e : otherTechData}
                        </Box>
                      </Grid>

                      <Grid
                        sx={{ mt: 1.5, textAlign: { xs: "center", sm: "center", md: "left" } }}
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        xl={6}
                        key={e}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Calibri",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#000000",
                            opacity: 1
                          }}
                        >
                          {!id ? domainNames?.join("|") : otherDomainData}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))} */}
                {otherTechData ? (
                  <Grid container>
                    <Grid item xs={12} sm={6} md={6} xl={6}>
                      <Box
                        elevation={3}
                        sx={{
                          p: 2,
                          // backgroundColor: "#39c7f3",
                          minHeight: "56px",
                          textAlign: "center",
                          borderRadius: "10px",
                          color: "rgba(108, 25, 62, 1)",
                          fontWeight: "700",
                          maxWidth: "250px",
                        }}
                      >
                        {otherTechData}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} xl={6}>
                      <Box
                        elevation={3}
                        sx={{
                          p: 2,
                          // backgroundColor: "#39c7f3",
                          minHeight: "56px",
                          textAlign: "center",
                          borderRadius: "10px",
                          color: "rgba(108, 25, 62, 1)",
                          fontWeight: "700",
                          maxWidth: "250px",
                        }}
                      >
                        {otherDomainData}
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  technologyNames.length > 0 &&
                  technologyNames.map((e) => (
                    <Grid container key={e}>
                      <Grid item xs={12} sm={6} md={6} xl={6}>
                        <Box
                          elevation={3}
                          sx={{
                            p: 2,
                            // backgroundColor: "#39c7f3",
                            minHeight: "56px",
                            textAlign: "center",
                            borderRadius: "10px",
                            color: "rgba(108, 25, 62, 1)",
                            fontWeight: "700",
                            maxWidth: "250px",
                          }}
                        >
                          {!id ? e : tech}
                        </Box>
                      </Grid>

                      <Grid
                        sx={{ mt: 1.5, textAlign: { xs: "center", sm: "center", md: "left" } }}
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        xl={6}
                        key={e}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Calibri",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#000000",
                            opacity: 1,
                          }}
                        >
                          {!id ? domainNames?.join("|") : application}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))
                )}
              </Grid>
              {/* <CardActions>
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
              </CardActions> */}
            </CardContent>
          </Grid>

          <Stepper />
        </Grid>
      </ExternalContainer>{" "}
    </>
  );
};
StepperForm.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default StepperForm;
