import React, { useState } from "react";
import styles from "./Footer.module.css";
import { Link, Box, Typography, Grid } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
// import PlaceIcon from "@mui/icons-material/Place";
// import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/router";
import ContactUsModal from "./ContactUsModal";
import TermsModal from "./TermsModal";
import { FormattedMessage } from "react-intl";
import SignupLoginModal from "../HomePageContent/SignupLogin/SignupLoginModal";

const Footer = (props) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);

  const { newsEventPage, homepagePricing } = props;

  const [signupDialogOpen, setSignupDialogOpen] = useState(false);

  const handleSignupLogin = () => {
    setSignupDialogOpen(true);
  };

  const handleContactUs = () => {
    setDialogOpen(true);
  };
  const handleTerms = () => {
    setTermsDialogOpen(true);
  };
  /*
   *For Scrolling to respected sections after click
   */

  const handleScrollToSection = (sectionId) => {
    // Scroll to the specified section
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Box
        sx={{
          background: (theme) =>
            `linear-gradient(to right, ${theme.palette.neutral.primary} 0%,      
               
            ${theme.palette.neutral.tertiary} 150% )`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: newsEventPage || homepagePricing ? "0px" : "20px",
        }}
      >
        <Box className={styles.footerExternal}>
          <Box>
            <img
              src="/Images/HomePage/whitelogo.png"
              alt="ARISIO_LOGO"
              height="40px"
              width="180px"
              style={{ marginTop: "10px" }}
            />
          </Box>

          <Box>
            <Typography
              className={styles.footerSubHeading}
              sx={{ maxWidth: "500px", paddingBottom: "10px", textAlign: "justify" }}
            >
              {/* <PlaceIcon sx={{ position: "relative", top: "5px" }} /> */}
              {/* <FormattedMessage
                id="homepage.footer.aboutUs"
                defaultMessage=" */}
              {/* Arisio, powered by Risin Ventures, is a cutting-edge platform
              designed to bridge the gaps in collaboration, funding access, and networking for
              startups and investors. By fostering a vibrant innovation ecosystem, Arisio empowers
              startups to thrive and investors to seamlessly discover new opportunities. Together,
              we&apos;re driving the future of growth and success in the startups landscape. */}
              <b>
                {" "}
                <FormattedMessage id="homepage.footer.aboutus" defaultMessage="About us" />
              </b>{" "}
              -{" "}
              <FormattedMessage
                id="homepage.footer.aboutus.tagline"
                defaultMessage=" Arisio, powered by Risin Ventures, is a cutting-edge platform
              designed to bridge the gaps in collaboration, funding access, and networking for
              startups and investors. By fostering a vibrant innovation ecosystem, Arisio empowers
              startups to thrive and investors to seamlessly discover new opportunities. Together,
              we're driving the future of growth and success in the startups landscape"
              />
            </Typography>

            <Typography
              sx={{ marginTop: "5px", marginBottom: "10px" }}
              className={styles.footerHeading}
            >
              <MailIcon sx={{ position: "relative", top: "7px", right: "5px" }} /> contact@arisio.io
            </Typography>

            {/* <Typography
              sx={{ marginLeft: "10px", lineHeight: "25px" }}
              className={styles.footerSubHeading}
            >
              <FormattedMessage
                id="homepage.footer.address.al-nasser"
                defaultMessage="Al Reem Tower,"
              />
              <br />{" "}
              <FormattedMessage
                id="homepage.footer.address.postOffice."
                defaultMessage="Office No 12,"
              />
              <br />
              <FormattedMessage
                id="homepage.footer.address.street"
                defaultMessage="3rd Floor, West Bay,"
              />
              <br />
              <FormattedMessage
                id="homepage.footer.address.qatar"
                defaultMessage="Doha, Qatar PO Box- 10161"
              />{" "}
            </Typography> */}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Link
              href="/homepage_news"
              sx={{ marginTop: "12px", fontSize: "1rem !important", textDecoration: "none" }}
              className={styles.footerHeading}
            >
              <FormattedMessage id="homepage.nav.News" defaultMessage="News" />{" "}
            </Link>
            <Typography
              onClick={handleSignupLogin}
              sx={{
                marginTop: "12px",
                fontSize: "1rem !important",
                textDecoration: "none",
                cursor: "pointer",
              }}
              className={styles.footerHeading}
            >
              <FormattedMessage id="homepage.nav.Mandates" defaultMessage="Mandates" />{" "}
            </Typography>
            <Link
              href="/homepage_events"
              sx={{ marginTop: "12px", fontSize: "1rem !important", textDecoration: "none" }}
              className={styles.footerHeading}
            >
              <FormattedMessage id="homepage.nav.Events" defaultMessage="Events" />{" "}
            </Link>

            <Link
              href="https://discord.gg/zZeS3Rh5uh"
              sx={{ marginTop: "12px", fontSize: "1rem !important", textDecoration: "none" }}
              className={styles.footerHeading}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FormattedMessage id="homepage.nav.community" defaultMessage="Community" />
            </Link>
            <Link
              href="/Pricing"
              sx={{ marginTop: "12px", fontSize: "1rem !important", textDecoration: "none" }}
              className={styles.footerHeading}
            >
              <FormattedMessage id="homepage.nav.Pricing" defaultMessage="Pricing" />{" "}
            </Link>
          </Box>

          <Box>
            <Typography className={styles.footerHeading} sx={{ position: "relative", top: "8px" }}>
              {" "}
              <FormattedMessage id="homepage.footer.Links" defaultMessage="Useful Links" />
            </Typography>
            {/* <Typography className={styles.footerSubHeading}>
              <ChevronRightIcon sx={{ position: "relative", top: "5px", right: "5px" }} />
              <a
                // href="/#about"
                className={`${styles.Link} ${router.asPath === "/#about" ? styles.ActiveLink : ""}`}
                onClick={() => handleScrollToSection("about")}
              >
                <FormattedMessage id="homepage.footer.About" defaultMessage="About" />{" "}
              </a>
            </Typography> */}
            <Typography className={styles.footerSubHeading} onClick={handleTerms}>
              {" "}
              <ChevronRightIcon sx={{ position: "relative", top: "5px", right: "5px" }} />
              <FormattedMessage id="homepage.footer.terms" defaultMessage=" Terms and Conditions" />
            </Typography>
            <Typography className={styles.footerSubHeading} onClick={handleContactUs}>
              <ChevronRightIcon sx={{ position: "relative", top: "5px", right: "5px" }} />
              <FormattedMessage id="homepage.footer.contactUs" defaultMessage="Contact Us" />{" "}
            </Typography>

            {/* <Typography className={styles.footerSubHeading} onClick={handleContactUs}>
              <ChevronRightIcon sx={{ position: "relative", top: "5px", right: "5px" }} />
              <FormattedMessage
                id="homepage.footer.partnerEnquire"
                defaultMessage="Partner Enquire"
              />{" "}
            </Typography> */}
          </Box>
          {/* <Box>
          <img src="/Images/HomePage/New-Mcit-logo.png" alt="MCIT" width="200px" height="40px" />
        </Box> */}
        </Box>
        <Grid
          container
          justifyContent="center"
          sx={{
            backgroundColor: "#ffffff2b",
            width: "98.9vw",
          }}
        >
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: { xs: "100vw", md: "90vw !important" },
              borderTop: "2px solid #FFFFFF",
              padding: "10px 20px",
            }}
          >
            <Grid item>
              <Typography className={styles.footerSubHeading}>
                <FormattedMessage
                  id="homepage.footer.copyrights"
                  defaultMessage="Copyright © 2024 Risin Ventures."
                />
                <FormattedMessage
                  id="homepage.footer.rightReserved"
                  defaultMessage="All Rights Reserved."
                />{" "}
              </Typography>
            </Grid>

            <Grid
              item
              sx={{
                marginTop: { xs: "10px", sm: "0px" },
              }}
            >
              <Link
                href="https://x.com/ArisioPlatform"
                color="#fff"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon sx={{ marginLeft: { xs: "0px", sm: "15px" } }} />
              </Link>
              <Link
                href="https://www.linkedin.com/showcase/arisio-platform/"
                target="_blank"
                rel="noopener noreferrer"
                color="#fff"
              >
                <LinkedInIcon sx={{ marginLeft: "15px" }} />
              </Link>
              <Link
                href="https://www.facebook.com/profile.php?id=61566929604050"
                target="_blank"
                rel="noopener noreferrer"
                color="#fff"
              >
                <FacebookIcon sx={{ marginLeft: "15px" }} />
              </Link>
              <Link
                href="https://www.instagram.com/arisioconnect/"
                target="_blank"
                rel="noopener noreferrer"
                color="#fff"
              >
                <InstagramIcon sx={{ marginLeft: "15px" }} />
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {dialogOpen && <ContactUsModal dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />}
      {termsDialogOpen && (
        <TermsModal dialogOpen={termsDialogOpen} setDialogOpen={setTermsDialogOpen} />
      )}
      {signupDialogOpen && (
        <SignupLoginModal dialogOpen={signupDialogOpen} setDialogOpen={setSignupDialogOpen} />
      )}
    </>
  );
};

export default Footer;
