import { Grid, Typography, Skeleton } from "@mui/material";
import React from "react";

const AdminDashboardCards = props => {
  const {
    title,
    approvedValue,
    pendingValue,
    rejectedValue,
    incompleteValue,
    image,
    backgroundColor,
    dashboardCountsLoading
  } = props;

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        sx={{
          backgroundColor: "#fff",
          mt: 2,
          p: 3,
          borderRadius: "10px",
          height: "190px"
        }}
      >
        <Grid>
          <Typography variant="h6">{title}</Typography>
          {dashboardCountsLoading ? (
            <>
              <Skeleton variant="text" width={120} height={"23%"} sx={{ pt: 1 }} />
              <Skeleton variant="text" width={100} height={"23%"} sx={{ pt: 0.5 }} />
              <Skeleton variant="text" width={100} height={"23%"} sx={{ pt: 0.5 }} />
              <Skeleton variant="text" width={130} height={"23%"} sx={{ pt: 0.5 }} />
            </>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ color: "rgba(0, 182, 155, 1)", pt: 1 }}>
                Approved -{" "}
                <span>
                  <b>{approvedValue}</b>
                </span>{" "}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "rgba(255, 182, 29, 1)", pt: 0.5 }}>
                {" "}
                Pending -{" "}
                <span>
                  <b>{pendingValue}</b>
                </span>
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "rgba(252, 38, 38, 0.88)", pt: 0.5 }}>
                Rejected -{" "}
                <span>
                  <b>{rejectedValue}</b>
                </span>
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "rgba(138, 21, 56, 1)", pt: 0.5 }}>
                Incomplete -{" "}
                <span>
                  <b>{incompleteValue}</b>
                </span>
              </Typography>
            </>
          )}
        </Grid>
        <Grid
          sx={{
            backgroundColor: `${backgroundColor}`,
            height: "50px",
            padding: "10px",
            borderRadius: "10px"
          }}
        >
          <img src={image} alt="Images" />
        </Grid>
      </Grid>
    </>
  );
};

export default AdminDashboardCards;
