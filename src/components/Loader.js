import { Box, CircularProgress } from "@mui/material";
import React from "react";

const Loader = ({ color }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: color ? color : "rgba(108, 25, 62, 1)" }} />
      </Box>
    </>
  );
};

export default Loader;
