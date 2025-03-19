import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { startupTabUpdates } from "src/action/investorMandates";

const Updates = () => {
  const dispatch = useDispatch();
  const startupId = localStorage.getItem("selectedStartupId");
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;

  const startUpUpdateTabData = useSelector((state) => state?.investorMandates?.startupTabUpdates);

  useEffect(() => {
    dispatch(startupTabUpdates(investorId, startupId));
  }, [investorId, startupId, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month.padStart(2, "0");
    const paddedDay = day.padStart(2, "0");

    return `${paddedDay}/${paddedMonth}/${year}`;
  };

  return (
    <>
      <Typography style={{ fontSize: "16px", fontWeight: "bold", color: "#8a1538" }}>
        <FormattedMessage id="startUpTabs.landingPage.tab5.label" defaultMessage="UPDATES" />
      </Typography>

      {startUpUpdateTabData.length > 0 ? (
        <Grid
          style={{
            backgroundColor: " #ffffff",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "10px",
          }}
          sx={{
            boxShadow: "0 0 6px rgba(23,29,48,.4)",
          }}
        >
          {startUpUpdateTabData?.map((myUpdate) => (
            <Container
              key={myUpdate.id}
              style={{
                display: "flex",
                padding: "10px",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Accordion size="sm" style={{ width: "100%" }}>
                <AccordionSummary style={{ fontWeight: 600, color: "#8a1538", fontSize: 14 }}>
                  {myUpdate.name} / {myUpdate.type}
                </AccordionSummary>
                <AccordionDetails style={{ fontSize: "14px" }}>
                  <Typography style={{ fontSize: "14px" }}>
                    {formatDate(myUpdate?.milestoneDate)}
                  </Typography>
                  {myUpdate.description}
                </AccordionDetails>
              </Accordion>
            </Container>
          ))}
        </Grid>
      ) : (
        <h4 style={{ textAlign: "center", color: "#8a1538" }}>
          {" "}
          <FormattedMessage
            id="startUpTabs.landingPage.myUpdates.noData.text"
            defaultMessage="No data found"
          />
        </h4>
      )}
    </>
  );
};
export default Updates;
