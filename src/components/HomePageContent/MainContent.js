import React from "react";
import HeroSection from "./HeroSection/HeroSection";
import AboutSection from "./About/AboutSection";
import { Box } from "@mui/material";
import CardSection from "./CardSection/CardSection";
import MandateSection from "./MandateSection/MandateSection";
import PartnerSection from "./PartnerSection/PartnerSection";
import EventSection from "./EventSection/EventSection";
import NewsSection from "./NewsSection/NewsSection";
import Subscribe from "./Subscribe/subscribe";
import Ticker from "../Ticker";

const MainContent = () => {
  return (
    <>
      <Box>
        {/* <Ticker /> */}
        <HeroSection />
        {/* <AboutSection /> */}
        <NewsSection />
        {/* <PartnerSection /> */}

        {/* <CardSection /> */}
        <MandateSection />
        <EventSection />
        <Subscribe />
      </Box>
    </>
  );
};

export default MainContent;
