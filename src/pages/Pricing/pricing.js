import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
  CardActions,
  CardContent,
  Card,
  Skeleton,
  Tooltip,
  Badge,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import { useDispatch, useSelector } from "react-redux";
import { getPricingDetails } from "src/action/globalApi";
import SignupLoginModal from "src/components/HomePageContent/SignupLogin/SignupLoginModal";
import { IntlProvider } from "react-intl";
import { useRouter } from "next/router";
import English from "../../locales/en-US";
import Arabic from "../../locales/ar-EG";
import NavBar from "src/components/NavBar/NavBar";
import ContactUsModal from "src/components/Footer/ContactUsModal";
import { sendRequest } from "src/utils/request";
import AfterPayment from "./AfterPayment";
import { PaymentTransactionDetails } from "src/action/payment";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import InfoIcon from "@mui/icons-material/Info";
import Footer from "src/components/Footer/Footer";
import Loader from "src/components/Loader";

const Payment = ({ login }) => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenContact, setDialogOpenContact] = useState(false);
  const { locale } = useRouter();
  const router = useRouter();
  const today = new Date();

  const purchase_date = dayjs(today).format("YYYY-MM-DD");
  const renewal_date = dayjs(today).add(29, "day").format("YYYY-MM-DD");
  const expiry_date = dayjs(today).add(30, "day").format("YYYY-MM-DD");

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const status = userDetails?.status;
  const role = userDetails?.role;

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

  useEffect(() => {
    dispatch(getPricingDetails());
    if (login) {
      if (role === "ENTREPRENEUR") {
        dispatch(PaymentTransactionDetails("startup"));
      } else {
        dispatch(PaymentTransactionDetails("investor"));
      }
    }
  }, [dispatch]);

  const profileOverviewData = useSelector((state) => {
    return state.seeNewMandate.profileOverview;
  });

  const userTransactionHistory = useSelector((state) => {
    return state.payment.skipCashTransaction;
  });

  const pricingTransactionStatus = useSelector((state) => {
    return state.payment.pricingLoading;
  });
  const handleSignupLogin = () => {
    setDialogOpen(true);
  };
  const handleContactUs = () => {
    setDialogOpenContact(true);
  };

  const pricingDetails = useSelector((state) => state.globalApi.pricingPoints);
  const loader = useSelector((state) => state?.globalApi?.pricingPointsLoading);

  const [tabValue, setTabValue] = useState(role ? role : "ENTREPRENEUR");

  const filterStartupsItem = pricingDetails?.data?.filter((data) => data?.usertype_id === 4);
  const filterInvestorItem = pricingDetails?.data?.filter((data) => data?.usertype_id === 3);

  const slicedStartupsItem = filterStartupsItem;
  const slicedInvestorItem = filterInvestorItem;

  const itemStartup = slicedStartupsItem?.map((data) => ({
    id: data.id,
    rate: data?.price,
    desc: data?.name,
    tagLine: data?.description,
    currency: data?.currency,
    frequency: data?.frequency,
    points: data?.features?.map((feature, index) => feature),
  }));

  const itemInvestor = slicedInvestorItem?.map((data) => ({
    id: data.id,
    rate: data?.price,
    desc: data?.name,
    tagLine: data?.description,
    currency: data?.currency,
    frequency: data?.frequency,
    points: data?.features?.map((feature, index) => feature),
  }));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log(login);
  const renderPlanItems = () => {
    const items = tabValue === "ENTREPRENEUR" ? itemStartup : itemInvestor;
    // console.log(items[3].id === 7);
    return (
      <>
        <Box
          sx={{
            display: "flex",
            backgroundColor: "white",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "0.5rem",
            borderRadius: "1rem",
            padding: "0.8rem",
          }}
        >
          {items?.map((item, ind) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                width:
                  login !== undefined ? { xs: "90%", sm: "45%", md: "33%", xl: "33%" } : "300px",
                marginBottom: "2rem",
                padding: "1.25rem",
                borderRadius: "10px",
                background: "#fff",
                boxShadow:
                  "0px 1px 15px 5px rgba(0, 0, 0, 0.12), 0px 1px 15px 5px rgba(0, 0, 0, 0.24)",
                transform: "scale(0.95)",
                transition: "transform 0.3s ease-in-out",
                height: "420px",
                // height: "100%",
                "&:hover": {
                  transform: "scale(1)",
                  background: (theme) =>
                    `linear-gradient(to top, ${theme.palette.neutral.primary} 0%,         
                     ${theme.palette.neutral.tertiary} 150% )`,
                  boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.4) 0px 10px 10px",
                  color: "inherit",
                  "& *": {
                    color: "#fff!important",
                  },
                  cursor: "pointer",
                  "& button": {
                    background: (theme) => `${theme.palette.neutral.buttonBackground} `,
                    color: "#fff !important",
                  },
                },
              }}
            >
              {(item?.id === 7 || item?.id === 8) && (
                <Badge
                  color="secondary"
                  sx={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    width: "100%",
                    transform: "translateX(-50%)",
                    justifyContent: "center",
                    color: "white",
                    // padding: "8px 12px",
                    fontWeight: "450",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    zIndex: 9999,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* <img src="/Images/Bannerbanner3-ezgif.com-crop (1).gif" width={"110%"} /> */}
                  <img src="/Images/WEBSUMMIT.gif" width={"100%"} />
                </Badge>
              )}

              <Box style={{ display: "flex", justifyContent: "space-between" }}>
                {/* {status !== 1 && role !== "ADMINISTRATOR" ? (
                  <Tooltip title="Admin need to approve to choose plan" placement="top">
                    <InfoIcon />
                  </Tooltip>
                ) : (
                  ""
                )} */}
              </Box>

              <Typography sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
                {item?.rate !== "0" ? (
                  <>
                    {" "}
                    {Math.round(item?.rate)} {item?.currency}
                  </>
                ) : (
                  ""
                )}{" "}
                {(item?.id === 7 || item?.id === 8) && (
                  <span
                    style={{
                      textDecoration: "line-through",
                      fontSize: "14px",
                      fontWeight: 450,
                      fontStyle: "italic",
                      color: "rgba(132, 129, 153, 1)",
                    }}
                  >
                    1200 USD
                  </span>
                )}
                {item?.frequency !== null && item?.frequency !== undefined ? (
                  <span style={{ fontSize: "12px", fontWeight: 500 }}> / {item?.frequency}</span>
                ) : (
                  ""
                )}
              </Typography>

              <Typography sx={{ marginTop: "0.2rem", fontSize: "1.2rem", fontWeight: 540 }}>
                {item.desc}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.87rem",
                  fontWeight: "450",
                  marginTop: "0.5rem",
                  color: "rgba(132, 129, 153, 1)",
                }}
              >
                {item.tagLine}
              </Typography>
              <Box
                sx={{
                  marginTop: "0.5rem",
                  marginBottom: "0.3rem",
                  height: "200px",
                  overflowY: "auto",
                }}
              >
                {item?.points?.map((point, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: "0.2rem",
                      alignItems: "center",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {point?.includes("Not included") ? (
                      <CancelOutlinedIcon
                        sx={{
                          marginRight: "0.1rem",
                          fontSize: "1.1rem",
                          color: "rgba(138, 21, 56, 1)",
                        }}
                      />
                    ) : (
                      <CheckCircleOutlinedIcon
                        sx={{
                          marginRight: "0.1rem",
                          fontSize: "1.1rem",
                          color: "rgba(132, 129, 153, 1)",
                        }}
                      />
                    )}
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: "400",
                        color: "rgba(132, 129, 153, 1)",
                      }}
                    >
                      {point}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                onClick={handleSignupLogin}
                variant="contained"
                sx={{
                  color: "#fffff",
                  background: (theme) => `${theme.palette.neutral.buttonBackground} `,
                  "&:hover": {
                    background: (theme) => `${theme.palette.neutral.buttonBackground}`,
                  },
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  // border: '1px solid grey'
                  position: "absolute",
                  bottom: "1rem",
                  left: "50%",
                  width: "90%",
                  transform: "translateX(-50%)",
                }}
              >
                Choose plan
              </Button>
            </Box>
          ))}
        </Box>
        {/* {items ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "20px",
            }}
          >
            <Card
              style={{
                padding: "0px, 5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "4px",
                borderRadius: "4px",
                border: "1px solid black",
              }}
            >
              <CardContent style={{ padding: "10px 10px", margin: "0px, 0px" }}>
                <Typography
                  style={{
                    fontSize: "16px",
                    // fontWeight: "600",
                    // color: "#fff",
                    padding: "0px, 5px",
                  }}
                >
                  The number one venture capital data platform for emerging venture markets
                </Typography>
              </CardContent>
              <CardActions style={{ padding: "0px, 5px" }}>
                <Button
                  onClick={handleContactUs}
                  size="small"
                  sx={{
                    background: (theme) => `${theme.palette.neutral.buttonBackground} `,
                    color: "#fff",
                  }}
                >
                  Contact Sales
                </Button>
              </CardActions>
            </Card>
          </Box>
        ) : (
          ""
        )} */}

        {dialogOpenContact && (
          <ContactUsModal dialogOpen={dialogOpenContact} setDialogOpen={setDialogOpenContact} />
        )}
      </>
    );
  };

  const pricingPage = "Pricing";

  const homepagePricing = true;

  return (
    <IntlProvider locale={shortLocale} messages={messages} onError={() => null}>
      <NavBar
        appState={appState}
        setAppState={setAppState}
        login={login}
        pricingPage={pricingPage}
      />

      <Box
        sx={{
          marginTop: "0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {!loader ? (
          <>
            <Typography
              sx={{
                textAlign: login ? "left !important" : "center !important",
                fontSize: "1.5rem",
                fontWeight: "700",
                marginTop: !login ? " 85px" : "",
              }}
            >
              {login ? "Choose Your Plan" : "Pricing"}
            </Typography>
            <Typography
              sx={{
                textAlign: login ? "left !important" : "center !important",
                fontSize: "0.9rem",
                fontWeight: "500",
                margin: "10px 0px",
                padding: "8px",
              }}
            >
              Take your desired plan to get access to our content easily, we to like to offer
              special license offer to our user.
            </Typography>

            {!login && (
              <Tabs
                value={tabValue}
                textColor="none"
                onChange={handleTabChange}
                indicatorColor="transparent"
                sx={{
                  background: "white",
                  marginTop: "1rem",
                  "& .MuiTabs-flexContainer": {
                    display: "flex",
                    justifyContent: "center !important",
                    "& .Mui-selected": {
                      background: (theme) =>
                        `linear-gradient(to right, ${theme.palette.neutral.primary} 0%,         
                     ${theme.palette.neutral.tertiary} 100% )`,
                      color: "white",
                    },
                    "&:hover": {
                      backgroundColor: "inherit", // Ensure no hover effect changes the background color
                    },
                  },
                }}
              >
                <Tab
                  label="STARTUP"
                  value="ENTREPRENEUR"
                  sx={{
                    fontSize: { xs: "0.6rem", md: "0.8rem" },
                    fontWeight: 600,
                    letterSpacing: "0.83px",
                    padding: { xs: "0.5rem 1rem", md: "1rem 2rem" },
                    borderRadius: "1.9rem",
                  }}
                />
                <Tab
                  label="INVESTOR/ ENTERPRISE "
                  value="INVESTOR"
                  sx={{
                    fontSize: { xs: "0.6rem", md: "0.8rem" },
                    fontWeight: 600,
                    letterSpacing: "0.83px",
                    padding: { xs: "0.5rem 1rem", md: "1rem 2rem" },
                    borderRadius: "1.9rem",
                  }}
                />
              </Tabs>
            )}
            {renderPlanItems()}
            {dialogOpen && (
              <SignupLoginModal
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                tabValue={tabValue}
              />
            )}
          </>
        ) : (
          <Box
            sx={{
              marginTop: !login ? "05%" : "",
              height: "100vh", // or any appropriate height
              gap: 2,
            }}
          >
            <Typography
              sx={{
                textAlign: login ? "left !important" : "center !important",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              {login ? "Choose Your Plan" : "Pricing"}
            </Typography>
            <Typography
              sx={{
                textAlign: login ? "left !important" : "center !important",
                fontSize: "0.9rem",
                fontWeight: "500",
                margin: "10px 0px",
                padding: "8px",
              }}
            >
              Take your desired plan to get access to our content easily, we to like to offer
              special license offer to our user.
            </Typography>
            <Box sx={{ gap: 2, display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={140}
                height={35}
                sx={{ borderRadius: "10px" }}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={180}
                height={35}
                sx={{ borderRadius: "10px" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                backgroundColor: "white",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "0.5rem",
                borderRadius: "1rem",
                padding: "0.8rem",
              }}
            >
              {Array.from(new Array(4)).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width:
                      login !== undefined
                        ? { xs: "90%", sm: "45%", md: "33%", xl: "33%" }
                        : "300px",
                    marginBottom: "2rem",
                    padding: "1.25rem",
                    borderRadius: "10px",
                    background: "#fff",
                    boxShadow:
                      "0px 1px 15px 5px rgba(0, 0, 0, 0.12), 0px 1px 15px 5px rgba(0, 0, 0, 0.24)",
                    transform: "scale(0.95)",
                    transition: "transform 0.3s ease-in-out",
                    height: "420px",
                    // height: "100%",
                    "&:hover": {
                      transform: "scale(1)",
                      background: (theme) =>
                        `linear-gradient(to top, ${theme.palette.neutral.primary} 0%,         
             ${theme.palette.neutral.tertiary} 150% )`,
                      boxShadow:
                        "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.4) 0px 10px 10px",
                      color: "inherit",
                      "& *": {
                        color: "#fff!important",
                      },
                      cursor: "pointer",
                      "& button": {
                        background: (theme) => `${theme.palette.neutral.buttonBackground} `,
                        color: "#fff !important",
                      },
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      paddingTop: 4, // Space above the card content
                    }}
                  >
                    <Skeleton variant="text" animation="wave" width="50%" height={60} />

                    <Skeleton
                      variant="text"
                      animation="wave"
                      width="40%"
                      height={40}
                      sx={{ marginBottom: "23px" }}
                    />

                    {Array.from(new Array(5)).map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="text"
                        animation="wave"
                        width={`${70 + i * 5}%`}
                        height={20}
                        sx={{ marginBottom: "03px" }}
                      />
                    ))}
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width="100%"
                      height={60}
                      sx={{ marginTop: "30%" }}
                    />
                  </CardContent>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Footer homepagePricing={homepagePricing} />
    </IntlProvider>
  );
};

export default Payment;
