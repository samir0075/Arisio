import { Box, CardContent, CardMedia, Typography } from "@mui/material";

export const NoDataComponent = () => {
  return (
    <Box
      sx={{
        py: 12,
        px: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: { sm: "left", md: "center" },
      }}
    >
      <CardMedia
        component="img"
        height="auto"
        image="/Images/no-application-recieved.png"
        alt="No Data"
        style={{ width: "60px" }}
      />
      <CardContent style={{ padding: 0 }}>
        <Typography
          gutterBottom
          style={{
            fontFamily: "Calibri",
            fontWeight: 600,
            fontSize: "16px",
            color: "#b2acac",
          }}
          component="div"
        >
          No Data found!
        </Typography>
      </CardContent>
    </Box>
  );
};
