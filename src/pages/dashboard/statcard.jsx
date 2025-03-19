import { Grid, Typography } from "@mui/material";
import React from "react";

const Statcard = (props) => {
  const { title, numbers, images } = props;
  return (
    <>
      <Grid
        xs={12}
        sm={5.5}
        md={5.5}
        lg={3.5}
        sx={{
          background: "#FFF",
          p: 1,
          border: "2px solid #9C9C9C1A",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Added box shadow
        }}
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={8} sm={8} md={8} lg={8}>
          <Typography sx={{ fontSize: "1rem", fontWeight: "400", color: "grey" }}>
            {title}
          </Typography>
          <Typography
            sx={{ fontSize: "1.2rem", fontWeight: "700", color: "rgba(108, 25, 62, 1)", mt: 1 }}
          >
            {numbers}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <img src={images} alt="Stat-card" style={{ height: "60px", width: "60px" }} />
        </Grid>
      </Grid>
    </>
  );
};

export default Statcard;
