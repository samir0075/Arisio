import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Drawer,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { investorItems, adminItems, startupItems, mentorItems } from "./config";
import { SideNavItem } from "./side-nav-item";
import { useEffect, useState } from "react";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import { display } from "@mui/system";
import { isPermitted } from "src/utils/util";
import { FormattedMessage } from "react-intl";
import { getActivePlan } from "src/action/payment";
import { useDispatch, useSelector } from "react-redux";

export const SideNav = (props) => {
  const { open, onClose, collapse, handleCollapse, activeData } = props;

  const pathname = usePathname();
  const dispatch = useDispatch();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const lang = typeof window !== "undefined" ? localStorage.getItem("lang") : "en";
  const [disable, setDisable] = useState(false);

  const isRTL = lang === "ar";
  const anchor = isRTL ? "right" : "left";

  const userData = typeof window !== "undefined" ? localStorage.getItem("userDetails") : null;
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  const role_id = userDetails?.role_id;
  const status = userDetails?.status;

  let profileUpdated = localStorage.getItem("isProfileUpdated");
  let isProfileUpdated = profileUpdated ? JSON.parse(profileUpdated) : null;

  useEffect(() => {
    dispatch(getActivePlan(role));
  }, [dispatch, role]);

  useEffect(() => {
    if (role === "ENTREPRENEUR" && isProfileUpdated?.isProfileUpdated === 0 && status !== 1) {
      setDisable(true);
    } else if (
      role === "ENTREPRENEUR" &&
      isProfileUpdated?.isProfileUpdated === 1 &&
      status === 1
    ) {
      setDisable(false);
    } else if (
      role === "ENTREPRENEUR" &&
      isProfileUpdated?.isProfileUpdated === 1 &&
      status !== 1
    ) {
      setDisable(true);
    } else if (role === "INVESTOR" && userDetails?.investorId !== "" && status !== 1) {
      setDisable(true);
    }
  }, [isProfileUpdated?.isProfileUpdated, role, setDisable, status, userDetails?.investorId]);

  const startupRoutes = startupItems.filter((item) => isPermitted(item.permission));
  const investorRoutes = investorItems.filter((item) => isPermitted(item.permission));
  const adminRoutes = adminItems.filter((item) => isPermitted(item.permission));
  const mentorRoutes = mentorItems.filter((item) => item);

  const userActivePlan = useSelector((state) => {
    return state?.payment?.activePlan;
  });

  const items =
    role === "INVESTOR"
      ? investorRoutes
      : role === "ADMINISTRATOR"
      ? adminRoutes
      : role === "MENTOR"
      ? mentorRoutes
      : startupRoutes;

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        overflowX: "hidden",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ px: 3, py: 1 }}>
          <Box
            sx={{
              height: "56px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* <Typography
              sx={(theme) => ({
                fontSize: "1.5rem !important",
                background: `linear-gradient(to right, ${theme.palette.neutral.theme1}, ${theme.palette.neutral.theme2})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                fontFamily: "Inter !important",
                fontWeight: "600 !important",
              })}
            >
              {!collapse ? "HYPERTHINGS  Arisio" : "HTS"}
            </Typography> */}

            {!collapse ? (
              <img src="/Images/HomePage/Logo1.png" alt="ARISIO_LOGO" height="35px" width="180px" />
            ) : (
              <img src="/favicon.png" alt="Logo" height="35px" width="40px" />
            )}
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#F5F5F5", borderWidth: "3px" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 2,
            // paddingLeft: { xs: "", md: "30px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar-track": {
              background: "transparent", // Background of the scrollbar track
            },
            // background: (theme) =>
            //   `linear-gradient(to top, ${theme.palette.neutral.theme1} , ${theme.palette.neutral.theme2} )`,
            background: "linear-gradient(161deg, rgba(35,33,86,1) 0%, rgba(101,37,72,1) 100%)",
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              const active = item.path ? pathname === item.path : false;

              return (
                <SideNavItem
                  key={item.title}
                  active={active}
                  disabled={disable}
                  external={item.external}
                  icon={item.icon}
                  path={item.path}
                  title={item.title}
                  // eslint-disable-next-line react/no-children-prop
                  children={item.children}
                />
              );
            })}
          </Stack>

          {collapse ? (
            <Tooltip placement="top" title="Expand">
              <FormatIndentIncreaseIcon
                onClick={handleCollapse}
                sx={{
                  color: "#fff",
                  fontWeight: "600",
                  marginTop: "25px",
                  cursor: "pointer",
                  margin: "10px !important",
                }}
              />
            </Tooltip>
          ) : (
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              sx={{ margin: "20px 10px !important" }}
            >
              <Tooltip placement="top-end" title="Collapse">
                <FormatIndentDecreaseIcon
                  onClick={lgUp ? handleCollapse : onClose}
                  sx={{
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
              <Grid container justifyContent="center">
                <Typography sx={{ mt: 2, fontWeight: "400", fontSize: "0.7rem" }}>
                  {" "}
                  <FormattedMessage id="side.nav.login.header" defaultMessage="Login" /> -
                  <span style={{ fontWeight: "700", margin: "5px" }}>
                    {role_id === 4 ? (
                      <FormattedMessage id="side.nav.login.text.startup" defaultMessage="STARTUP" />
                    ) : role_id === 3 ? (
                      <FormattedMessage
                        id="side.nav.login.text.investor"
                        defaultMessage="INVESTOR"
                      />
                    ) : role_id === 11 ? (
                      <FormattedMessage id="side.nav.login.text.admin" defaultMessage="ADMIN" />
                    ) : role_id === 12 ? (
                      <FormattedMessage
                        id="side.nav.login.text.contentWriter"
                        defaultMessage="CONTENT WRITER"
                      />
                    ) : role_id === 13 ? (
                      <FormattedMessage
                        id="side.nav.login.text.individual"
                        defaultMessage="INDIVIDUAL"
                      />
                    ) : (
                      <FormattedMessage id="side.nav.login.text.mentor" defaultMessage="MENTOR" />
                    )}
                  </span>
                </Typography>
              </Grid>
              <Grid container justifyContent="center">
                {userActivePlan?.status ? (
                  <Typography sx={{ mt: 1, fontWeight: "400", fontSize: "0.7rem" }}>
                    {" "}
                    Active Plan -
                    <span style={{ fontWeight: "700", margin: "5px" }}>
                      {(userActivePlan?.planName).toUpperCase()}
                    </span>
                  </Typography>
                ) : (
                  role !== "ADMINISTRATOR" && (
                    <Typography sx={{ mt: 1, fontWeight: "400", fontSize: "0.7rem" }}>
                      {" "}
                      Active Plan -<span style={{ fontWeight: "700", margin: "5px" }}>Free</span>
                    </Typography>
                  )
                )}
              </Grid>
              {/* <Typography sx={{ color: "#fff", fontSize: "0.9rem", px: 3 }}>Collapse</Typography> */}
            </Grid>
          )}
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor={anchor}
        open={open}
        // onClose={onClose}
        PaperProps={{
          sx: {
            backgroundColor: "#FFFFFF",
            borderRight: "none",
            color: "common.white",
            width: collapse ? "75px" : "280px",
          },
        }}
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#FFFFFF",
          color: "common.white",
          width: 260,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
