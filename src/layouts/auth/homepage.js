import PropTypes from "prop-types";
import NextLink from "next/link";
import { Stack } from "@mui/material";
import NavBar from "src/components/NavBar/NavBar";
import MainContent from "src/components/HomePageContent/MainContent";
import Footer from "src/components/Footer/Footer";

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;

  return (
    <Stack>
      <NavBar />
      <MainContent />
      <Footer />
    </Stack>
  );
};

Layout.prototypes = {
  children: PropTypes.node,
};
