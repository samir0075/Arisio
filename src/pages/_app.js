import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline, Stack } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";
import { Provider } from "react-redux";
import store from "src/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IntlProvider } from "react-intl";
import { useMemo, useState } from "react";
import English from "../../src/locales/en-US";
import Arabic from "../../src/locales/ar-EG.js";
import { useRouter } from "next/router";
import Hotjar from "@hotjar/browser";

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  const { locale } = useRouter();

  const [appState, setAppState] = useState({ language: "en" });
  const [shortLocale] = locale ? locale.split("-") : [appState?.language];
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

  const handleContextMenu = (event) => {
    event.preventDefault();
  };
  //For Checking the traffic on the app.

  // const hotjarSiteId = process.env.NEXT_PUBLIC_HOTJAR_ID;

  const siteId = 5161222;

  const hotjarVersion = 6;

  Hotjar.init(siteId, hotjarVersion);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Arisio</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Stack onContextMenu={handleContextMenu}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <IntlProvider locale={shortLocale} messages={messages} onError={() => null}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Provider store={store}>
                  <AuthConsumer>
                    {(auth) =>
                      auth.isLoading ? <SplashScreen /> : getLayout(<Component {...pageProps} />)
                    }
                  </AuthConsumer>
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </Provider>
              </ThemeProvider>
            </IntlProvider>
          </AuthProvider>
        </LocalizationProvider>
      </Stack>
    </CacheProvider>
  );
};

export default App;
