import React from "react";
import styles from "./PartnerSection.module.css";
import { Box, Button, MobileStepper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "@mui/material/styles";

const PartnerSection = () => {
  const itemData = [
    {
      id: "1",
      img: "/Images/HomePage/P0.png",
      alt: "P0",
    },
    {
      id: "2",
      img: "/Images/HomePage/P1.png",
      alt: "P1",
    },
    {
      id: "3",
      img: "/Images/HomePage/P2.png",
      alt: "P2",
    },
    {
      id: "4",
      img: "/Images/HomePage/P3.png",
      alt: "P3",
    },
    {
      id: "5",
      img: "/Images/HomePage/P4.png",
      alt: "P4",
    },
    {
      id: "6",
      img: "/Images/HomePage/P5.png",
      alt: "P5",
    },
    {
      id: "6",
      img: "/Images/HomePage/P8.png",
      alt: "P8",
    },
    {
      id: "8",
      img: "/Images/HomePage/P9.png",
      alt: "P9",
    },
    {
      id: "9",
      img: "/Images/HomePage/P10.png",
      alt: "P10",
    },
    {
      id: "10",
      img: "/Images/HomePage/P11.png",
      alt: "P11",
    },
    {
      id: "11",
      img: "/Images/HomePage/P12.png",
      alt: "P12",
    },
    {
      id: "12",
      img: "/Images/HomePage/P13.png",
      alt: "P13",
    },
    {
      id: "13",
      img: "/Images/HomePage/P14.png",
      alt: "P14",
    },
    {
      id: "14",
      img: "/Images/HomePage/P15.png",
      alt: "P15",
    },
    {
      id: "15",
      img: "/Images/HomePage/P16.png",
      alt: "P16",
    },
  ];

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <Box className={styles.partnerExternal}>
        <Typography className={styles.partnerOuterHeading}>
          <FormattedMessage id="homepage.heroSection.OurPartners" defaultMessage="Our Partners" />
        </Typography>

        <Box className={styles.partnerOuter}>
          {itemData.slice(activeStep * 5, (activeStep + 1) * 5).map((item, index) => (
            <Box key={index} className={styles.partnerImageContainer}>
              <img src={item.img} alt={item.alt} width="200px" height="100px" />
            </Box>
          ))}
        </Box>

        <MobileStepper
          variant="dots"
          steps={Math.ceil(itemData.length / 5)} // Calculate the number of slides based on imageSets
          position="static"
          activeStep={activeStep}
          sx={{ backgroundColor: "#f5f5f5" }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === Math.ceil(itemData.length / 5) - 1}
            >
              Next
              {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </Box>
    </>
  );
};

export default PartnerSection;
