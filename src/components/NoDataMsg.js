import { Grid, Typography } from "@mui/material";
import React from "react";

const NoDataMsg = ({ message, home, height }) => {
  return (
    <>
      {home ? (
        <Grid
          sx={{
            p: 2,
            background: (theme) =>
              `linear-gradient(to right, ${theme.palette.neutral.theme1} , ${theme.palette.neutral.theme2} )`,
            borderRadius: "8px",
          }}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <img src="/Images/no-application-recieved.png" alt="No Application" />
          <Typography sx={{ color: "#fff", fontWeight: "600", m: 1 }}>{message}</Typography>
        </Grid>
      ) : (
        <Grid
          sx={{
            p: 2,
            bgcolor: "#FFFFFF",
            borderRadius: "8px",
            marginTop: "15px",
            height: height ? height : "70vh",
          }}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <img src="/Images/no-application-recieved.png" alt="No Application" />
          {/* //for Commitment */}
          <Typography sx={{ color: "rgba(134, 134, 134, 1)", fontWeight: "500", m: 1 }}>
            {message}
          </Typography>
        </Grid>
      )}
    </>
  );
};

export default NoDataMsg;
