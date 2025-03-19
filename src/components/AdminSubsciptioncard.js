import { Box, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";
import CountUp from "react-countup";

const AdminSubsciptioncard = ({
  title,
  firstHeader,
  secondHeader,
  thirdHeader,
  fourthHeader,
  counts,
  loading,
}) => {
  const numberStyling = {
    fontSize: "21px",
    fontWeight: "500",
  };
  const SkeletonBody = () => {
    return <Skeleton variant="circular" width={40} height={40} />;
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: "#fff",
        mt: 2,
        p: 2.5,
        borderRadius: "10px",
        gap: "10px",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, paddingBottom: "6px" }}>
        {title}
      </Typography>

      {loading ? (
        <Grid container justifyContent="space-between">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "rgba(0, 182, 155, 1)",
            }}
          >
            <Typography sx={numberStyling}>
              <SkeletonBody />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{firstHeader} </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "rgb(211, 153, 28)",
            }}
          >
            <Typography sx={numberStyling}>
              <SkeletonBody />
            </Typography>

            <Typography sx={{ fontSize: "11px" }}>{secondHeader} </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "rgba(252, 38, 38, 0.88)",
            }}
          >
            <Typography sx={numberStyling}>
              <SkeletonBody />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{thirdHeader} </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              color: "rgba(138, 21, 56, 1)",
            }}
          >
            <Typography sx={numberStyling}>
              <SkeletonBody />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>Total </Typography>
          </Box>
        </Grid>
      ) : title === "Startup" ? (
        <Grid container justifyContent="space-between">
          <Box sx={{ textAlign: "center", color: "rgba(0, 182, 155, 1)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.freePlanStartup} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{firstHeader} </Typography>
          </Box>
          <Box sx={{ textAlign: "center", color: "rgb(229, 166, 29)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.basicPlanStartup} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{secondHeader} </Typography>
          </Box>
          <Box sx={{ textAlign: "center", color: "rgba(252, 38, 38, 0.88)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.expertPlanStartup} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{thirdHeader} </Typography>
          </Box>
          <Box sx={{ textAlign: "center", color: "rgba(63, 81, 181, 1)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.basicPlusPlanStartup} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{fourthHeader} </Typography>
          </Box>

          <Box sx={{ textAlign: "center", color: "rgba(138, 21, 56, 1)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.total} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>Total </Typography>
          </Box>
        </Grid>
      ) : (
        <Grid container justifyContent="space-between">
          <Box sx={{ textAlign: "center", color: "rgba(0, 182, 155, 1)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.freePlanInvestor} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{firstHeader} </Typography>
          </Box>
          <Box sx={{ textAlign: "center", color: "rgb(229, 166, 29)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.basicPlanInvestor} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{secondHeader} </Typography>
          </Box>
          <Box sx={{ textAlign: "center", color: "rgba(252, 38, 38, 0.88)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.enterprisePlanInvestor} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{thirdHeader} </Typography>
          </Box>
          <Box sx={{ textAlign: "center", color: "rgba(63, 81, 181, 1)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.basicPlusPlanInvestor} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>{fourthHeader} </Typography>
          </Box>
          <Box sx={{ textAlign: "center", color: "rgba(138, 21, 56, 1)" }}>
            <Typography sx={numberStyling}>
              <CountUp end={counts?.total} duration={3} />
            </Typography>
            <Typography sx={{ fontSize: "11px" }}>Total </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default AdminSubsciptioncard;
