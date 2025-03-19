import { Grid, Typography } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Statcard from "./statcard";

const Card = () => {
  return (
    <>
      <Grid>
        <Grid container alignItems="center">
          <img
            src="/Images/upload-company's-logo.png"
            alt="Profile"
            style={{ height: "100px", width: "100px" }}
          />

          <Grid>
            <Typography
              sx={{ color: "rgba(108, 25, 62, 1)", fontSize: "1.2rem", fontWeight: "700", ml: 2 }}
            >
              Hello , Samir Singh{" "}
              <span>
                <img
                  src="/Images/Blue-tick.png"
                  alt="Blue-Tick"
                  style={{ height: "20px", width: "25px" }}
                />
              </span>
            </Typography>
            <Typography sx={{ color: "grey", ml: 2 }}>
              Check your activities in this dashboard.
            </Typography>
          </Grid>
        </Grid>

        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: "600",
            mt: 2,
          }}
        >
          Quick Stats
        </Typography>
        <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
          <Statcard
            title={"Total Appointments"}
            numbers={"100"}
            images={"/Images/appointment-stat.png"}
          />
          <Statcard
            title={"Pending Approval"}
            numbers={"100"}
            images={"/Images/approval-stat.png"}
          />
          <Statcard
            title={"Completed Sessions"}
            numbers={"100"}
            images={"/Images/completed-stat.png"}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Card;
