import React, { useState } from "react";
import styles from "./CardSection.module.css";
import {
  Box,
  Card,
  Typography,
  Button,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Grid,
} from "@mui/material";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import SignupLoginModal from "../SignupLogin/SignupLoginModal";
import { FormattedMessage } from "react-intl";

const CardSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCardTitle, setSelectedCardTitle] = useState("");

  /*
   *For Opening Signup and Login Dialog
   */

  const handleSignupLogin = (value) => {
    setSelectedCardTitle(value);
    setDialogOpen(true);
  };

  const cardDetails = [
    {
      id: 1,
      img: "/Images/HomePage/Companies(2).png",
      title: <FormattedMessage id="homepage.card.Companies" defaultMessage="Companies" />,
      subTitle: (
        <FormattedMessage
          id="homepage.card.Companies.subTitle"
          defaultMessage="Drive innovation and programs to"
        />
      ),
      pt1: (
        <FormattedMessage
          id="homepage.card.Companies.pt1"
          defaultMessage="Build startup engagement"
        />
      ),
      pt2: (
        <FormattedMessage
          id="homepage.card.Companies.pt2"
          defaultMessage="Identify top-notch startups"
        />
      ),
      pt3: (
        <FormattedMessage
          id="homepage.card.Companies.pt3"
          defaultMessage="Run accelerator programs"
        />
      ),
      pt4: (
        <FormattedMessage id="homepage.card.Companies.pt4" defaultMessage="Solve critical issues" />
      ),
    },
    {
      id: 2,
      img: "/Images/HomePage/Investor(2).png",
      title: <FormattedMessage id="homepage.card.Investors" defaultMessage="Investors" />,
      subTitle: (
        <FormattedMessage
          id="homepage.card.Investor.subTitle"
          defaultMessage="Build an ongoing deal flow"
        />
      ),
      pt1: (
        <FormattedMessage
          id="homepage.card.Investor.pt1"
          defaultMessage="Identify great startups"
        />
      ),
      pt2: (
        <FormattedMessage id="homepage.card.Investor.pt2" defaultMessage="Watch their progress" />
      ),
      pt3: (
        <FormattedMessage
          id="homepage.card.Investor.pt3"
          defaultMessage="Engage with them online"
        />
      ),
      pt4: (
        <FormattedMessage id="homepage.card.Investor.pt4" defaultMessage="Invest with confidence" />
      ),
    },
    {
      id: 3,
      img: "/Images/HomePage/Startup(2).png",
      title: <FormattedMessage id="homepage.card.Startups" defaultMessage="Startups" />,
      subTitle: (
        <FormattedMessage
          id="homepage.card.Startups.subTitle"
          defaultMessage="Get access to money and markets"
        />
      ),
      pt1: <FormattedMessage id="homepage.card.Startups.pt1" defaultMessage="Research your idea" />,
      pt2: (
        <FormattedMessage
          id="homepage.card.Startups.pt2"
          defaultMessage="Pitch to top-notch investors"
        />
      ),
      pt3: (
        <FormattedMessage id="homepage.card.Startups.pt3" defaultMessage="Attract large deals" />
      ),
      pt4: (
        <FormattedMessage id="homepage.card.Startups.pt4" defaultMessage="Scale with confidence" />
      ),
    },
  ];
  return (
    <>
      <Box id="companies" className={styles.cardExternal}>
        <Typography className={styles.outerHeading}>
          <FormattedMessage id="homepage.card.title" defaultMessage=" We Can Help You" />
        </Typography>
        <Box className={styles.cardOuter}>
          {cardDetails.map((card) => (
            <Card
              sx={{
                maxWidth: "375vw",
                margin: "10px",
                boxShadow: "none !important",
                backgroundColor: "rgba(230, 183, 197, 0.15)",
              }}
              key={card.id}
            >
              <CardActionArea style={{ cursor: "default", padding: "20px" }}>
                <CardMedia
                  style={{ borderRadius: "8px", width: "300px" }}
                  component="img"
                  height="200"
                  image={card.img}
                  alt="green iguana"
                />
                <CardContent sx={{ paddingTop: "10px", paddingBottom: "15px" }}>
                  <Typography className={styles.cardTitle} component="div">
                    {card.title}
                  </Typography>
                  <Typography className={styles.cartSubTitle} component="div">
                    {card.subTitle}
                    <Typography className={styles.cardPoints} component="div">
                      <TaskAltRoundedIcon /> {card.pt1}
                    </Typography>
                    <Typography className={styles.cardPoints} component="div">
                      <TaskAltRoundedIcon /> {card.pt2}
                    </Typography>
                    <Typography className={styles.cardPoints} component="div">
                      <TaskAltRoundedIcon /> {card.pt3}
                    </Typography>
                    <Typography className={styles.cardPoints} component="div">
                      <TaskAltRoundedIcon /> {card.pt4}
                    </Typography>
                  </Typography>
                  <Grid container justifyContent="center">
                    <Button
                      className={styles.cardsButton}
                      onClick={() => handleSignupLogin(card?.id)}
                    >
                      <FormattedMessage id="homepage.card.SignUp.Button" defaultMessage="Sign Up" />{" "}
                      <EastRoundedIcon sx={{ marginLeft: "10px" }} />{" "}
                    </Button>
                  </Grid>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
      {dialogOpen && (
        <SignupLoginModal
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          selectedCardTitle={selectedCardTitle}
        />
      )}
    </>
  );
};

export default CardSection;
