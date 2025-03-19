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
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useDispatch, useSelector } from "react-redux";
import { getPricingDetails } from "src/action/globalApi";
import SignupLoginModal from "src/components/HomePageContent/SignupLogin/SignupLoginModal";
import ContactUsModal from "src/components/Footer/ContactUsModal";
import { sendRequest } from "src/utils/request";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import InfoIcon from "@mui/icons-material/Info";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { getInvestorProfileData } from "src/action/investorProfileStepper";
import { profileOverviewForMandate } from "src/action/seeNewMandate";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";
import { getActivePlan } from "src/action/payment";

const Payment = ({ login }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogOpenContact, setDialogOpenContact] = useState(false);

  const today = new Date();

  const purchase_date = dayjs(today).format("YYYY-MM-DD");
  const renewal_date = dayjs(today).add(29, "day").format("YYYY-MM-DD");
  const expiry_date = dayjs(today).add(30, "day").format("YYYY-MM-DD");

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const status = userDetails?.status;
  const role = userDetails?.role;
  const investorId = userDetails?.investorId;
  const profileId = userDetails?.id;
  const lang = localStorage.getItem("lang");
  const rtl = lang === "ar";

  useEffect(() => {
    dispatch(getActivePlan(role));
  }, [dispatch, role]);

  useEffect(() => {
    dispatch(getPricingDetails());
    // if (login) {
    //   if (role === "ENTREPRENEUR") {
    //     dispatch(PaymentTransactionDetails("startup"));
    //   } else {
    //     dispatch(PaymentTransactionDetails("investor"));
    //   }
    // }
  }, [dispatch]);

  useEffect(() => {
    if (role === "INVESTOR") {
      dispatch(getInvestorProfileData(investorId));
    } else if (role === "ENTREPRENEUR") {
      dispatch(profileOverviewForMandate(profileId));
    }
  }, [dispatch, investorId, profileId, role]);

  const profileOverviewData = useSelector((state) => {
    return state.seeNewMandate.profileOverview;
  });

  const investorProfileData = useSelector(
    (state) => state?.investorProfileStepper?.investorProfileData
  );

  // const userTransactionHistory = useSelector((state) => {
  //   return state.payment.skipCashTransaction;
  // });

  // const handleSignupLogin = () => {
  //   setDialogOpen(true);
  // };

  const handleContactUs = () => {
    setDialogOpenContact(true);
  };

  // const userTransactionHistory = useSelector((state) => {
  //   return state?.payment?.skipCashTransaction;
  // });

  const useActivePlan = useSelector((state) => {
    return state?.payment?.activePlan;
  });

  // const successTransaction =
  //   userTransactionHistory?.status !== false &&
  //   userTransactionHistory?.filter((ele) => ele.status_id === 2);

  // const handlePayment = (item) => {
  //   const price = Math.round(item.rate);

  //   if (role === "ENTREPRENEUR") {
  //     sendRequest(`startup/${userDetails.id}/userPurchases`, "post", {
  //       plan_id: item.id,
  //       purchase_date,
  //       renewal_date,
  //       last_updated: purchase_date,
  //     })
  //       .then((resp) => {
  //         if (resp.status) {
  //           sendRequest("startup/makePayment", "post", {
  //             purchaseId: resp.purchase_id,
  //             planName: item.desc,
  //             firstName: userDetails.name,
  //             LastName: "last Name",
  //             amount: String(price),
  //             phone: profileOverviewData?.contactNo || "9507720554",
  //             email: userDetails.userName,
  //           })
  //             .then((res) => {
  //               if (res.success) {
  //                 window.location.href = res.payUrl;
  //               }
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //               toast.error(err?.response?.data?.message, {
  //                 position: "top-right",
  //                 autoClose: 3000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined,
  //               });
  //             });
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         toast.error(err?.response?.data?.message, {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //         });
  //       });
  //   } else if (role === "INVESTOR") {
  //     sendRequest(`investor/${userDetails.id}/userPurchases`, "post", {
  //       plan_id: item.id,
  //       purchase_date,
  //       renewal_date,
  //       last_updated: purchase_date,
  //       // expiry_date
  //     })
  //       .then((resp) => {
  //         if (resp.status) {
  //           sendRequest("investor/makePayment", "post", {
  //             purchaseId: resp.purchase_id,
  //             planName: item.desc,
  //             firstName: userDetails.name,
  //             LastName: "last Name",
  //             amount: String(price),
  //             phone: investorProfileData?.contactNo || "9507720554",
  //             email: userDetails.userName,
  //           })
  //             .then((res) => {
  //               if (res.success) {
  //                 window.location.href = res.payUrl;
  //               }
  //             })
  //             .catch((err) => {
  //               toast.error(err?.response?.data?.message, {
  //                 position: "top-right",
  //                 autoClose: 3000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined,
  //               });
  //             });
  //         }
  //       })
  //       .catch((err) => {
  //         toast.error(err?.response?.data?.message, {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //         });
  //       });
  //   }
  // };

  const pricingDetails = useSelector((state) => state.globalApi.pricingPoints);
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

  const checkoutPage = (item) => {
    router.push({
      pathname: "/CheckoutPayment",
      query: {
        id: item.id,
        desc: item.desc,
        rate: item.rate,
        currency: item.currency,
        frequency: item?.frequency,
      }, // Replace with your dynamic prop value
    });
  };

  const renderPlanItems = () => {
    const items = tabValue === "ENTREPRENEUR" ? itemStartup : itemInvestor;

    // console.log(useActivePlan?.planId);
    // console.log(items);
    // console.log(items[4]?.id);
    console.log(items);

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
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                width: login !== undefined ? { xs: "90%", sm: "45%", md: "33%", xl: "33%" } : "25%",
                marginBottom: "2rem",
                minWidth: "240px",
                maxWidth: "300px",
                padding: "1.2rem",
                borderRadius: "10px",
                background: "#fff",
                boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.12), 0px 1px 10px rgba(0, 0, 0, 0.24)",
                transform: "scale(0.95)",
                transition: "transform 0.3s ease-in-out",
                height: "410px",
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

                  // "& button": {
                  //   background: (theme) => `${theme.palette.neutral.buttonBackground} `,
                  //   color: "#fff !important",
                  //   zIndex: 1000000,
                  // },
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
                  <img src="/Images/WEBSUMMIT.gif" width={"105%"} />
                </Badge>
              )}
              {useActivePlan?.planId === item.id && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "8%",
                    left: rtl ? "-38px" : "none",
                    right: rtl ? "none" : "-40px",
                    color: "white",
                    padding: rtl ? "5px 48px" : "5px 41px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "14px",
                    transform: rtl ? "rotate(-45deg)" : "rotate(45deg)",
                    boxShadow: 3,
                    boxShadow: "rgba(0.15, 0, 0, 0.15) 4px 4px 15px",
                    // transformOrigin: "top right",
                    zIndex: 10,

                    background: (theme) => theme.palette.neutral.buttonBackground,
                  }}
                >
                  <FormattedMessage id="pricing.status.currentplan" defaultMessage="Current plan" />
                </Box>
              )}

              <Box style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 700, fontSize: "1.15rem" }}>
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

                {status !== 1 ? (
                  item.rate !== "0.00" ? (
                    <Tooltip
                      title="Admin needs to approve your profile to choose plan"
                      placement="top"
                    >
                      <InfoIcon />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Automatically this plan wil get activated once admin approve your profile"
                      placement="top"
                    >
                      <InfoIcon />
                    </Tooltip>
                  )
                ) : null}
              </Box>
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
              <Typography sx={{ marginTop: "0.2rem", fontSize: "1.2rem", fontWeight: 540 }}>
                {item.desc}
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
              {/* {item.rate !== "0"  && (
                <Button
                  onClick={() => {
                    handlePayment(item);
                  }}
                  variant="contained"
                  disabled={status !== 1 || successTransaction[0]?.plan_id === item.id}
                  sx={{
                    background: theme =>
                      successTransaction[0]?.plan_id !== item.id
                        ? theme.palette.neutral.buttonBackground
                        : theme.palette.neutral.buttonBackground,
                    "&:hover": {
                      background: theme =>
                        successTransaction[0]?.plan_id !== item.id
                          ? theme.palette.neutral.buttonBackground
                          : "red" // Change to Grey when condition matches
                    },
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    border: successTransaction[0]?.plan_id === item.id ? "1px solid grey" : "",
                    position: "absolute",
                    bottom: "1rem",
                    left: "50%",
                    width: "90%",
                    transform: "translateX(-50%)",
                    fontWeight: "800"
                    // color: "#f3f3f3ab !important",
                  }}
                >
                  {successTransaction[0]?.plan_id === item.id ? "Current Plan" : "Choose plan"}
                </Button>
              )} */}
              {item.rate !== "0" && (
                <Button
                  onClick={() => {
                    checkoutPage(item);
                  }}
                  variant="contained"
                  disabled={
                    status !== 1 || (useActivePlan?.status && useActivePlan?.planId === item.id)
                  }
                  sx={{
                    background: (theme) => theme.palette.neutral.buttonBackground,
                    "&:hover": {
                      background: (theme) => theme.palette.neutral.buttonBackground,
                    },
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    position: "absolute",
                    bottom: "1rem",
                    left: "50%",
                    width: "90%",
                    transform: "translateX(-50%)",
                    fontWeight: "800",
                    // color: "#f3f3f3ab !important",
                  }}
                >
                  <FormattedMessage id="pricing.button.chooseplan" defaultMessage="Choose plan" />
                </Button>
              )}
            </Box>
          ))}
        </Box>
        {items ? (
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
                    fontSize: "13px",
                    // fontWeight: "600",
                    // color: "#fff",
                    padding: "0px, 5px",
                  }}
                >
                  {/* The number one venture capital data platform for emerging venture markets */}
                  For a custom plan, please contact our sales team.
                </Typography>
              </CardContent>
              <CardActions style={{ padding: "0px, 5px" }}>
                <Button
                  onClick={handleContactUs}
                  size="small"
                  sx={{
                    background: (theme) => `${theme.palette.neutral.buttonBackground} `,
                    color: "#fff",

                    "&:hover": {
                      background: (theme) => theme.palette.neutral.buttonBackground,
                    },
                  }}
                >
                  Contact Sales
                </Button>
              </CardActions>
            </Card>
          </Box>
        ) : (
          ""
        )}

        {dialogOpenContact && (
          <ContactUsModal dialogOpen={dialogOpenContact} setDialogOpen={setDialogOpenContact} />
        )}
      </>
    );
  };

  // const pricingPage = "Pricing";

  return (
    <>
      {/* {userTransactionHistory.length === 0 ? ( */}
      <Box
        sx={{
          marginTop: "0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {pricingDetails.length !== 0 ? (
          <>
            <Typography
              sx={{
                textAlign: login ? "left !important" : "center !important",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              {login ? (
                <FormattedMessage id="pricing.header" defaultMessage="Choose Your Plan" />
              ) : (
                <FormattedMessage id="pricing.chooseplan.header" defaultMessage="Pricing" />
              )}
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
              <FormattedMessage
                id="pricing.tagline"
                defaultMessage="Choose your desired plan to access our content easily. We also offer special licensing options for our users."
              />
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
                {" "}
                {role === "ENTREPRENEUR" && (
                  <Tab
                    label={<FormattedMessage id="pricing.label.startup" defaultMessage="STARTUP" />}
                    value="ENTREPRENEUR"
                    sx={{
                      fontSize: { xs: "0.6rem", md: "0.8rem" },
                      fontWeight: 600,
                      letterSpacing: "0.83px",
                      padding: { xs: "0.5rem 1rem", md: "1rem 2rem" },
                      borderRadius: "1.9rem",
                    }}
                  />
                )}
                {role === "INVESTOR" && (
                  <Tab
                    label={
                      <FormattedMessage
                        id="pricing.label.investor"
                        defaultMessage="INVESTOR/ENTERPRISE"
                      />
                    }
                    value="INVESTOR"
                    sx={{
                      fontSize: { xs: "0.6rem", md: "0.8rem" },
                      fontWeight: 600,
                      letterSpacing: "0.83px",
                      padding: { xs: "0.5rem 1rem", md: "1rem 2rem" },
                      borderRadius: "1.9rem",
                    }}
                  />
                )}
              </Tabs>
            )}
            {renderPlanItems()}
            {dialogOpen && (
              <SignupLoginModal dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
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
                      login !== undefined ? { xs: "90%", sm: "45%", md: "33%", xl: "33%" } : "25%",
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
      {/* ) : (
        <AfterPayment pricingDetails={pricingDetails.data} /> */}
      {/* )} */}
    </>
  );
};

Payment.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Payment;
