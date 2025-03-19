import { Box, Link, Stack, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import Footer from "src/components/Footer/Footer";
import MainContent from "src/components/HomePageContent/MainContent";
import NavBar from "src/components/NavBar/NavBar";
import English from "../../src/locales/en-US";
import Arabic from "../../src/locales/ar-EG.js";
import { getLocation } from "src/action/globalApi";
import { useDispatch } from "react-redux";
import SubscribeModal from "src/components/SubscribeModal";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// TODO: Change subtitle text

const Homepage = () => {
  const lang = localStorage.getItem("lang");
  const dispatch = useDispatch();
  const { locale } = useRouter();
  const router = useRouter();
  const { login } = router?.query;

  const [appState, setAppState] = useState({ language: "en" });
  const [shortLocale] = locale ? locale.split("-") : [appState?.language];
  const [open, setOpen] = useState(false);

  const messages = useMemo(() => {
    switch (appState?.language) {
      case "ar":
        return Arabic;
      case "en":
        return English;
      default:
        return English;
    }
  }, [appState?.language]);

  useEffect(() => {
    dispatch(getLocation());
  }, [dispatch]);

  // This useEffect triggers the dialog after 30 seconds

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setOpen(true);
  //   }, 30000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <Stack>
      <IntlProvider locale={shortLocale} messages={messages} onError={() => null}>
        <NavBar appState={appState} setAppState={setAppState} pitch={login} />
        <MainContent />
        <Footer />
        {open && <SubscribeModal open={open} setOpen={setOpen} />}
        <Link
          href="https://wa.me/97452040434?text=Hello"
          target="_blank"
          rel="noopener noreferrer"
          color="#fff"
        >
          <Box
            sx={{
              display: "flex",
              position: "fixed",
              bottom: "20px",
              right: "20px",
              background: "white",
              borderRadius: "50%",
              padding: "8px",
              margin: "auto",
              zIndex: 100,
              boxShadow: 5,
              color: "green",
              transition: "transform 0.4s ease, background 0.4s ease", // Smooth transition for scale and background
              "&:hover": {
                background: "green",
                color: "white",
                transform: "scale(1.2)", // Box will grow to 1.2 times its size on hover
              },
            }}
          >
            <WhatsAppIcon
              sx={{
                fontSize: "30px",
              }}
            />
          </Box>
        </Link>
      </IntlProvider>
    </Stack>
  );
};
export default Homepage;
