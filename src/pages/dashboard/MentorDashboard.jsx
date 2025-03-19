import React, { useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import Card from "./card";
import ExternalContainer from "src/components/ExternalContainer";
import GaugeChart from "src/components/GaugeChart";
import LineCharts from "src/components/LineChart";
import BarCharts from "src/components/BarChart";

const MentorDashboard = () => {
  const [barChartTimePeriod, setBarChartTimePeriod] = useState("daily");
  const [lineChartTimePeriod, setLineChartTimePeriod] = useState("daily");

  // Handles Bar Chart Time Period Change

  const handleBarChartPeriodChange = (event) => {
    setBarChartTimePeriod(event.target.value);
  };

  // Handles Line Chart Time Period Change

  const handleLineChartPeriodChange = (event) => {
    setLineChartTimePeriod(event.target.value);
  };

  return (
    <>
      <ExternalContainer>
        {/* 1st Row  */}
        <Grid container justifyContent="space-between">
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={7.75}
            sx={{
              background: "#FFF",
              p: 2,
              border: "2px solid #9C9C9C1A",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={4}
            sx={{
              background: "#FFF",
              p: 2,
              border: "2px solid #9C9C9C1A",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography sx={{ fontWeight: "700" }}>Earnings</Typography>
            <Typography sx={{ fontWeight: "400", color: "rgba(135, 136, 140, 1)" }}>
              Total earned
            </Typography>
            <Typography sx={{ fontWeight: "700", color: "rgba(108, 25, 62, 1)" }}>
              $6078.76
            </Typography>
            <Typography sx={{ fontWeight: "400", color: "rgba(135, 136, 140, 1)" }}>
              Profit is 48% More than last Month
            </Typography>
            <Grid container alignItems="center" direction="column">
              <GaugeChart value={"80"} />
              <Typography
                sx={{ fontSize: "1rem", fontWeight: "700", color: "rgba(108, 25, 62, 1)" }}
              >
                80%
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* 2nd Row  */}

        <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
          <Grid
            item
            xs={12}
            sm={5.75}
            md={5.75}
            lg={3.75}
            sx={{
              background: "#FFF",
              p: 2,
              border: "2px solid #9C9C9C1A",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container justifyContent="space-between">
              <Typography
                sx={{ fontWeight: "700", fontSize: "1.2rem", color: "rgba(108, 25, 62, 1)" }}
              >
                Monthly Earning
              </Typography>
              <Grid>
                <FormControl fullWidth>
                  <Select
                    size="small"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={barChartTimePeriod}
                    onChange={handleBarChartPeriodChange}
                  >
                    <MenuItem value={"daily"}>Daily</MenuItem>
                    <MenuItem value={"weekly"}>Weekly</MenuItem>
                    <MenuItem value={"monthly"}>Monthly</MenuItem>
                    <MenuItem value={"yearly"}>Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <BarCharts />
          </Grid>
          <Grid
            item
            xs={12}
            sm={5.75}
            md={5.75}
            lg={3.75}
            sx={{
              background: "#FFF",
              p: 2,
              border: "2px solid #9C9C9C1A",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container justifyContent="space-between">
              <Typography
                sx={{ fontWeight: "700", fontSize: "1.2rem", color: "rgba(108, 25, 62, 1)" }}
              >
                Total Bookings
              </Typography>
              <Grid>
                <FormControl fullWidth>
                  <Select
                    size="small"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={lineChartTimePeriod}
                    onChange={handleLineChartPeriodChange}
                  >
                    <MenuItem value={"daily"}>Daily</MenuItem>
                    <MenuItem value={"weekly"}>Weekly</MenuItem>
                    <MenuItem value={"monthly"}>Monthly</MenuItem>
                    <MenuItem value={"yearly"}>Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <LineCharts />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={4}
            sx={{
              background: "#FFF",
              p: 2,
              border: "2px solid #9C9C9C1A",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container>
              <Typography
                sx={{ fontWeight: "700", fontSize: "1.2rem", color: "rgba(108, 25, 62, 1)" }}
              >
                Upcoming Appointments
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </ExternalContainer>
    </>
  );
};
MentorDashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MentorDashboard;
