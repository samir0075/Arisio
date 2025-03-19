/* eslint-disable react/no-unescaped-entities */
import React from "react";
import styles from "./AboutSection.module.css";
import { Box, Typography } from "@mui/material";
import Carousel from "../Carousel";
import { FormattedMessage } from "react-intl";

const images = [
  {
    imgPath: "/Images/HomePage/About1.png"
  },
  {
    imgPath: "/Images/HomePage/About2.png"
  },
  {
    imgPath: "/Images/HomePage/About3.png"
  }
];

const AboutSection = () => {
  const About = "About";
  return (
    <>
      <Box
        sx={{
          background: theme =>
            `linear-gradient(to right, ${theme.palette.neutral.primary} 0%,      
               
            ${theme.palette.neutral.tertiary} 55% )`
        }}
        id="about"
        className={styles.aboutExternal}
      >
        <Box className={styles.aboutFirstSection}>
          <Box className={`${styles.aboutSubExternal} ${styles.aboutCarousel}`}>
            {" "}
            <Carousel images={images} />
          </Box>
          <Box className={styles.aboutSubExternal}>
            <Box>
              <Typography className={styles.aboutText}>
                {" "}
                <FormattedMessage id="homepage.about.About" defaultMessage="About" />
              </Typography>
              <Typography className={styles.aboutSubText}>
                <FormattedMessage
                  id="homepage.about.AboutMainText"
                  defaultMessage=" HTS BY  Arisio is the technology platform by the Digital Incubation Center to support
                Startups and Investors. HTS BY  Arisio platform aims to use technology to seamlessly solve
                the requirements of 'Access to markets' and 'Access to Funding'. HTS BY  Arisio offers
                access to global markets and relevant mandates for startups and an access to a pool
                of startups for potential investment for enterprises and investors."
                />
              </Typography>
            </Box>

            <Box>
              <Typography className={styles.aboutText}>
                <FormattedMessage id="homepage.about.ourVision" defaultMessage="Our Vision" />
              </Typography>
              <Typography className={styles.aboutSubText}>
                <FormattedMessage
                  id="homepage.about.ourVisionText"
                  defaultMessage="To make HTS BY  Arisio platform emerge as the preferred online platform in Qatar for
                startups by providing the most relevant information and business matchmaking
                opportunities to support and nurture start-up entrepreneurship the ecosystem in the
                country."
                />
              </Typography>
            </Box>
            <Box>
              {" "}
              <Typography className={styles.aboutText}>
                {" "}
                <FormattedMessage id="homepage.about.ourMission" defaultMessage="Our Mission" />
              </Typography>
              <Typography className={styles.aboutSubText}>
                <FormattedMessage
                  id="homepage.about.ourMissionText"
                  defaultMessage=" HTS BY  Arisio's mission is to provide the right technology platform to ensure
                collaboration between all stakeholders of the startup ecosystem."
                />{" "}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AboutSection;
