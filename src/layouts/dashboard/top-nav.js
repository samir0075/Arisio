import PropTypes from "prop-types";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePopover } from "src/hooks/use-popover";
import { AccountPopover } from "./account-popover";
import { useEffect, useState, MouseEvent } from "react";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getNewMessagesCount } from "src/action/messages";
import { getActivePlan, PaymentTransactionDetails } from "src/action/payment";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import dayjs from "dayjs";
import TranslateIcon from "@mui/icons-material/Translate";
import { isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";

export const TopNav = (props) => {
  const dispatch = useDispatch();
  const [buttonText, setButtonText] = useState("English");

  const { onNavOpen, appState, setAppState, collapse } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const accountPopover = usePopover();

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const userRole = userDetails?.role;
  const userId = userDetails?.id;
  const role = userDetails?.role;
  const startupId = userDetails?.startupId;
  const investorId = userDetails?.investorId;

  const messageRequestId = userId;

  const SIDE_NAV_WIDTH = collapse ? "75px" : "280px";
  const TOP_NAV_HEIGHT = 73;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (role !== "ADMINISTRATOR" && role !== "INDIVIDUAL")
      dispatch(getNewMessagesCount(messageRequestId, role, false));
  }, [dispatch, messageRequestId, role]);

  useEffect(() => {
    dispatch(getActivePlan(role));
  }, [dispatch, role]);

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

  const isRTL = appState?.language === "ar";

  const router = useRouter();

  const handleMessage = () => {
    if (role !== "ADMINISTRATOR" && role !== "INDIVIDUAL")
      dispatch(getNewMessagesCount(messageRequestId, role, true));
    router.push("/Messages");
  };

  useEffect(() => {
    if (!messageRequestId) return;

    // Set up the interval for polling every minute
    const intervalId = setInterval(() => {
      if (role !== "ADMINISTRATOR" && role !== "INDIVIDUAL")
        dispatch(getNewMessagesCount(messageRequestId, userRole, false));
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(intervalId);
  }, [dispatch, messageRequestId, role, userId, userRole]);

  const handleSubscription = () => {
    router.push("/PricingSubscription/pricing");
  };

  useEffect(() => {
    if (role && role !== "ADMINISTRATOR" && role !== "INDIVIDUAL") {
      if (role === "ENTREPRENEUR") {
        dispatch(PaymentTransactionDetails("startup"));
      } else {
        dispatch(PaymentTransactionDetails("investor"));
      }
    }
  }, [role]);

  const useActivePlan = useSelector((state) => {
    return state?.payment?.activePlan;
  });

  const userTransactionHistory = useSelector((state) => {
    return state?.payment?.skipCashTransaction;
  });
  const successTransaction =
    userTransactionHistory?.status !== false &&
    userTransactionHistory?.filter((ele) => ele.status_id === 2);

  const expiryDate =
    userTransactionHistory?.status !== false
      ? dayjs(successTransaction?.[0]?.expirydate).format("YYYY-MM-DD")
      : "";

  const isExpiringSoon = (expiryDateStr) => {
    const today = dayjs(); // Current date
    const expiryDate = dayjs(expiryDateStr); // Convert expiryDateStr to dayjs object

    // Calculate the difference in days between the expiry date and today
    const diffInDays = expiryDate.diff(today, "day");

    // Check if the difference is between 0 and 15 days inclusive
    return diffInDays >= 0 && diffInDays <= 15;
  };

  const expiringSoon = isExpiringSoon(expiryDate);

  const count = useSelector((state) => state?.messages.count.count);
  const storedUserDetails = localStorage.getItem("userDetails");
  let avatarName = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  avatarName = avatarName?.name;

  const addOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) return `${day}th`; // Special case for 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const formatDate = (dateString) => {
    let arrangingDate = new Date(dateString);
    // Add 30 days to the date for expiry
    const formattedDate = arrangingDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };

  const isMobileScreen = useMediaQuery("(max-width: 500px)");

  return (
    <>
      <Box
        component="header"
        sx={{
          // backdropFilter: "blur(6px)",
          backgroundColor: "#ffff",
          position: "sticky",
          left: isRTL
            ? ""
            : {
                lg: `${SIDE_NAV_WIDTH}px`,
              },

          right: isRTL
            ? {
                lg: `${SIDE_NAV_WIDTH}px`,
              }
            : "",
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="center"
            // sx={{ border: "1px solid", margin: "0px 20px" }}
          >
            {/* <Tooltip
              title={
                <FormattedMessage
                  id="top.nav.title.switchLanguage"
                  defaultMessage="Switch Language"
                />
              }
            >
              <Button
                sx={{
                  background: "rgba(138, 21, 56, 1)",
                  color: "#FFFFFF",
                  margin: "0px 15px",
                  "&:hover": {
                    backgroundColor: "rgba(138, 21, 56, 1)",
                  },
                }}
                variant="contained"
                onClick={changeLanguageHandler}
                className="buttonLanguageHandler"
              >
                {isMobileScreen ? <TranslateIcon /> : buttonText === "Arabic" ? "عربي" : "English"}
              </Button>
            </Tooltip> */}
            {userRole !== "ADMINISTRATOR" ? (
              <>
                {isPermitted(permissions.TOPNAVBAR_SUBSCRIPTION_BUTTON) && (
                  <Button
                    sx={{
                      background: "rgba(138, 21, 56, 1)",
                      color: "#FFFFFF",
                      margin: "0px 15px",
                      "&:hover": {
                        backgroundColor: "rgba(138, 21, 56, 1)",
                      },
                    }}
                    variant="contained"
                    onClick={handleSubscription}
                    className="buttonLanguageHandler"
                  >
                    {isMobileScreen ? <LocalAtmIcon /> : "Subscription"}
                  </Button>
                )}
                {isPermitted(permissions.TOPNAVBAR_NOTIFICATION_BUTTON) && (
                  <Tooltip
                    title={
                      <FormattedMessage
                        id="top.nav.title.notification"
                        defaultMessage="Notification"
                      />
                    }
                  >
                    <IconButton>
                      {successTransaction?.length === 0 ? (
                        <SvgIcon fontSize="large" onClick={handleClick}>
                          <NotificationsIcon />
                        </SvgIcon>
                      ) : (
                        <Badge
                          variant="dot"
                          invisible={!expiringSoon}
                          sx={{
                            ".MuiBadge-dot": {
                              backgroundColor: "rgba(138, 21, 56, 1)",
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              top: 8,
                              right: 9,
                            },
                          }}
                        >
                          <SvgIcon fontSize="large" onClick={handleClick}>
                            <NotificationsIcon />
                          </SvgIcon>
                        </Badge>
                      )}
                    </IconButton>
                  </Tooltip>
                )}
                {isPermitted(permissions.TOPNAVBAR_NOTIFICATION_BUTTON) && (
                  <Tooltip
                    title={
                      <FormattedMessage id="messageModal.card.heading2" defaultMessage="Message" />
                    }
                  >
                    <IconButton>
                      {count > 0 ? (
                        <Badge badgeContent={count} color="success">
                          <SvgIcon fontSize="large" onClick={handleMessage}>
                            <EmailIcon />
                          </SvgIcon>
                        </Badge>
                      ) : (
                        <SvgIcon fontSize="large" onClick={handleMessage}>
                          <EmailIcon />
                        </SvgIcon>
                      )}
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ) : null}
            &nbsp;&nbsp;&nbsp;
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: "pointer",
                height: 40,
                width: 40,
              }}
              // src="/assets/avatars/default_member_icon.png"
              src={`https://ui-avatars.com/api/?name=${avatarName}`}
            />
          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
      <Divider sx={{ borderColor: "#F5F5F5", borderWidth: "3px" }} />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          marginTop: "10px",
        }}
      >
        {userTransactionHistory?.status === false || successTransaction?.length == 0 ? (
          <Typography sx={{ p: 2, fontSize: "13px" }}>No notifications available.</Typography>
        ) : (
          <Typography sx={{ p: 2, fontSize: "13px" }}>
            Your plan will expiry on {formatDate(useActivePlan?.expiry_date)}
          </Typography>
        )}
      </Popover>
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func,
};
