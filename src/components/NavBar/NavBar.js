import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import styles from "./NavBar.module.css";
import SignupLoginModal from "../HomePageContent/SignupLogin/SignupLoginModal";
import { FormattedMessage } from "react-intl";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

const NavBar = ({ appState, setAppState, login, pricingPage, pitch }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [buttonText, setButtonText] = useState("English");

  const router = useRouter();
  useEffect(() => {
    if (pitch) {
      setDialogOpen(true);
    }
  }, [pitch]);

  const handleSignupLogin = () => {
    setDialogOpen(true);
  };

  const handleScrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (appState?.language === "ar") {
      setButtonText("English");
    } else if (appState?.language === "en") {
      setButtonText("Arabic");
    }
    document.body.dir = appState?.language === "ar" ? "rtl" : "ltr";
  }, [appState?.language]);

  const changeLanguageHandler = () => {
    const selectedLanguage = appState?.language === "ar" ? "en" : "ar";

    if (selectedLanguage !== appState?.language) {
      localStorage.setItem("lang", selectedLanguage);
      window.location.reload();
    }
  };

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    if (lang === null) {
      localStorage.setItem("lang", "en");
    } else {
      setAppState({ language: localStorage.getItem("lang") });
    }
  }, []);

  // HEMBURGER

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleBackToHome = () => {
    if (pricingPage) {
      router.push("/");
    }
  };

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        background: (theme) =>
          `linear-gradient(to right, ${theme.palette.neutral.theme1} , ${theme.palette.neutral.theme2} )`,
        height: "100%",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List onClick={handleBackToHome}>
        <img
          src="/Images/HomePage/Logo1.png"
          alt="Logo"
          height="30px"
          width="160px"
          style={{ margin: "auto" }}
        />
      </List>
      <Divider sx={{ border: "2px solid #F5F5F5" }} />
      <Box sx={{ marginLeft: "15px" }}>
        {!pricingPage ? (
          <>
            <List>
              <a
                // href="/#about"
                className={`${styles.Link} ${router.asPath === "/#news" ? styles.ActiveLink : ""}`}
                onClick={() => handleScrollToSection("news")}
              >
                <FormattedMessage id="homepage.nav.News" defaultMessage="News" />
              </a>
            </List>
            <List>
              <a
                // href="#startups"
                className={`${styles.Link} ${
                  router.asPath === "/#mandates" ? styles.ActiveLink : ""
                }`}
                onClick={() => handleScrollToSection("mandates")}
              >
                <FormattedMessage id="homepage.nav.Mandates" defaultMessage="Mandates" />
              </a>
            </List>
            <List>
              <a
                // href="#events"
                className={`${styles.Link} ${
                  router.asPath === "/#events" ? styles.ActiveLink : ""
                }`}
                onClick={() => handleScrollToSection("events")}
              >
                <FormattedMessage id="homepage.nav.Events" defaultMessage="Events" />
              </a>
            </List>
            <List>
              <Link
                href="https://discord.gg/zZeS3Rh5uh"
                className={styles.Link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="homepage.nav.community" defaultMessage="Community" />
              </Link>
            </List>
            <List>
              <Link href="/Pricing" className={styles.Link}>
                <FormattedMessage id="homepage.nav.Pricing" defaultMessage="Pricing" />
              </Link>
            </List>
          </>
        ) : (
          <>
            <List>
              <Link href="/homepage_news" className={`${styles.Link} }`}>
                <FormattedMessage id="homepage.nav.News" defaultMessage="News" />
              </Link>
            </List>
            <List>
              <a
                // href="#startups"
                className={`${styles.Link} ${
                  router.asPath === "/#mandates" ? styles.ActiveLink : ""
                }`}
                onClick={handleSignupLogin}
              >
                <FormattedMessage id="homepage.nav.Mandates" defaultMessage="Mandates" />
              </a>
            </List>
            <List>
              <Link href="/homepage_events" className={`${styles.Link} }`}>
                <FormattedMessage id="homepage.nav.Events" defaultMessage="Events" />
              </Link>
            </List>
            <List>
              <Link
                href="https://discord.gg/zZeS3Rh5uh"
                className={styles.Link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="homepage.nav.community" defaultMessage="Community" />
              </Link>
            </List>
            <List>
              <Link href="/Pricing" className={styles.Link}>
                <FormattedMessage id="homepage.nav.pricing" defaultMessage="Pricing" />
              </Link>
            </List>
          </>
        )}
      </Box>
    </Box>
  );
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  return (
    <>
      {login ? (
        ""
      ) : !isSmallScreen ? (
        <Box>
          <AppBar
            className={styles.NavExternal}
            sx={{
              background: "#fff",
            }}
          >
            <Box className={styles.NavInternal}>
              <Box sx={{ cursor: "pointer" }} onClick={handleBackToHome}>
                <img
                  src="/Images/HomePage/Logo1.png"
                  alt="ARISIO_LOGO"
                  height="35px"
                  width="180px"
                />
              </Box>

              <Box
                sx={{
                  width: "70vw",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className={styles.NavSubInternal}
              >
                {!pricingPage ? (
                  <>
                    <a
                      // href="/#about"
                      className={`${styles.Link} ${
                        router.asPath === "/#news" ? styles.ActiveLink : ""
                      }`}
                      onClick={() => handleScrollToSection("news")}
                    >
                      <FormattedMessage id="homepage.nav.News" defaultMessage="News" />
                    </a>
                    <a
                      // href="#startups"
                      className={`${styles.Link} ${
                        router.asPath === "/#mandates" ? styles.ActiveLink : ""
                      }`}
                      onClick={() => handleScrollToSection("mandates")}
                    >
                      <FormattedMessage id="homepage.nav.Mandates" defaultMessage="Mandates" />
                    </a>
                    <a
                      // href="#events"
                      className={`${styles.Link} ${
                        router.asPath === "/#events" ? styles.ActiveLink : ""
                      }`}
                      onClick={() => handleScrollToSection("events")}
                    >
                      <FormattedMessage id="homepage.nav.Events" defaultMessage="Events" />
                    </a>
                    <Link
                      href="https://discord.gg/zZeS3Rh5uh"
                      className={styles.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FormattedMessage id="homepage.nav.community" defaultMessage="Community" />
                    </Link>
                    <Link href="/Pricing" className={styles.Link}>
                      <FormattedMessage id="homepage.nav.Pricing" defaultMessage="Pricing" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/homepage_news" className={`${styles.Link} }`}>
                      <FormattedMessage id="homepage.nav.News" defaultMessage="News" />
                    </Link>
                    <a
                      // href="#startups"
                      className={`${styles.Link} ${
                        router.asPath === "/#mandates" ? styles.ActiveLink : ""
                      }`}
                      onClick={handleSignupLogin}
                    >
                      <FormattedMessage id="homepage.nav.Mandates" defaultMessage="Mandates" />
                    </a>
                    <Link href="/homepage_events" className={`${styles.Link} }`}>
                      <FormattedMessage id="homepage.nav.Events" defaultMessage="Events" />
                    </Link>
                    <Link
                      href="https://discord.gg/zZeS3Rh5uh"
                      className={styles.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FormattedMessage id="homepage.nav.community" defaultMessage="Community" />
                    </Link>
                    <Link href="/Pricing" className={styles.Link}>
                      <FormattedMessage id="homepage.nav.pricing" defaultMessage="Pricing" />
                    </Link>
                  </>
                )}
                {/* <Button className={styles.Button} onClick={changeLanguageHandler}>
                  {" "}
                  {buttonText === "Arabic" ? "عربي" : "English"}
                </Button> */}
                <Button
                  sx={{
                    marginLeft: pricingPage ? "20px" : "",
                    fontSize: "16px",
                    padding: "8px 20px",
                  }}
                  className={styles.Button}
                  onClick={handleSignupLogin}
                >
                  <FormattedMessage
                    id="homepage.nav.SignUpLogin"
                    defaultMessage="Sign Up / Log In"
                  />
                </Button>
              </Box>
            </Box>
          </AppBar>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "10vh",
            width: "100%",
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            zIndex: "2",
          }}
          position="fixed"
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ marginBottom: "5px" }}>
              <Button onClick={toggleDrawer(true)}>
                <MenuIcon />
              </Button>
              <Drawer
                sx={{
                  marginLeft: "20px !important",
                }}
                open={open}
                onClose={toggleDrawer(false)}
              >
                {DrawerList}
              </Drawer>
            </Box>
            <Box onClick={handleBackToHome}>
              <img
                src="/Images/HomePage/Logo1.png"
                alt="Logo"
                height="25px"
                width="120px"
                style={{ position: "relative", right: "10px" }}
              />
            </Box>
          </Box>

          <Box>
            {/* <Button
              disabled
              sx={{ marginRight: "10px" }}
              className={styles.Button}
              onClick={changeLanguageHandler}
            >
              {" "}
              {buttonText === "Arabic" ? "عربي" : "English"}
            </Button> */}

            <Button
              className={styles.Button}
              onClick={handleSignupLogin}
              sx={{ fontSize: "12px", padding: "8px 12px" }}
            >
              <FormattedMessage id="homepage.nav.SignUpLogin" defaultMessage="Sign Up / Log In" />
            </Button>
          </Box>
        </Box>
      )}
      {dialogOpen && <SignupLoginModal dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />}
    </>
  );
};

export default NavBar;
