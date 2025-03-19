import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { dataset, valueFormatter } from "./BarChartsData";

const chartSetting = {
  yAxis: [
    {
      label: "Amount ($)",
    },
  ],
  series: [{ dataKey: "seoul", valueFormatter, color: "rgba(108, 25, 62, 1)" }],
  height: 250,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

const BarCharts = () => {
  return (
    <div style={{ width: "100%" }}>
      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: "band", dataKey: "month" }]}
        {...chartSetting}
      />
    </div>
  );
};
export default BarCharts;
