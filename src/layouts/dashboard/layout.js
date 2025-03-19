import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { searchStartUpsActions } from "src/store/searchStartupsSlice";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { useRouter } from "next/router";
import { IntlProvider } from "react-intl";
import English from "../../locales/en-US.js";
import Arabic from "../../locales/ar-EG.js";
import { getLocation } from "src/action/globalApi";
import { useDispatch, useSelector } from "react-redux";
import { getActivePlan } from "src/action/payment";

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  const dispatch = useDispatch();

  const filterCollapseValue = useSelector((state) => state?.searchStartUps?.collapseValue);

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );
  const { locale } = useRouter();
  const [collapse, setCollapse] = useState(false);
  const [appState, setAppState] = useState({ language: "en" });
  const [shortLocale] = locale ? locale.split("-") : [appState?.language];

  useEffect(() => {
    dispatch(getLocation());
  }, [dispatch]);

  /** Make side bar collapse on SearchFilters Expand position with the use of redux filterCollapse value */
  useEffect(() => {
    if (filterCollapseValue === true) {
      setCollapse(true);
    }
  }, [filterCollapseValue]);

  const handleCollapse = () => {
    setCollapse(!collapse);
    if (collapse == true) {
      dispatch(
        searchStartUpsActions.fetchSideCollapseValue({
          collapseValue: false,
        })
      );
    }
  };

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

  const SIDE_NAV_WIDTH = collapse ? "75px" : "280px";

  const LayoutRoot = styled("div")(({ theme }) => ({
    display: "flex",
    flex: "1 1 auto",
    maxWidth: "100%",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: isRTL ? 0 : SIDE_NAV_WIDTH,
      paddingRight: isRTL ? SIDE_NAV_WIDTH : 0,
    },
  }));

  const LayoutContainer = styled("div")({
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    width: "100%",
  });

  return (
    <>
      <IntlProvider locale={shortLocale} messages={messages} onError={() => null}>
        <TopNav
          collapse={collapse}
          onNavOpen={() => setOpenNav(true)}
          appState={appState}
          setAppState={setAppState}
        />
        <SideNav
          collapse={collapse}
          handleCollapse={handleCollapse}
          onClose={() => setOpenNav(false)}
          open={openNav}
        />
        <LayoutRoot>
          <LayoutContainer>{children}</LayoutContainer>
        </LayoutRoot>
      </IntlProvider>
    </>
  );
});
