import { Box, Container } from "@mui/material";

const ExternalContainer = ({ children }) => {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          background: "rgba(65, 148, 179,0.1) !important",
        }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </>
  );
};

export default ExternalContainer;
