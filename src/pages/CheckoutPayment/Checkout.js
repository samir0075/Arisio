import { Box, Button, Divider, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import ExternalContainer from "src/components/ExternalContainer";
import { getButtonCss } from "src/utils/util";
import { width } from "@mui/system";
import { getInvestorProfileData } from "src/action/investorProfileStepper";
import { profileOverviewForMandate } from "src/action/seeNewMandate";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendRequest } from "src/utils/request";
import { useRouter } from "next/router";
import { applyCouponCode } from "src/action/payment";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";

const Checkout = () => {
  // importing thing from localstorage
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  const investorId = userDetails?.investorId;
  const profileId = userDetails?.id;
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountCodeLoader, setDiscountCodeLoader] = useState(false);
  const [paymentLoader, setPaymentLoader] = useState(false);

  const router = useRouter();

  const { id, desc, rate, currency, frequency } = router.query;

  const today = dayjs();
  const purchase_date = dayjs(today).format();
  const renewal_date =
    frequency === "Month"
      ? dayjs(today).add(29, "day").format()
      : dayjs(today).add(1, "year").format();

  const dispatch = useDispatch();

  const price = parseFloat(rate);
  const DiscountValue = (price * discountValue) / 100;

  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    setTotalValue(price - DiscountValue);
  }, [DiscountValue, price]);

  // Styling Components
  const ButtonCss = getButtonCss();
  const tableFormationStyling = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    fontWeight: 400,
  };
  const dividerStyling = {
    border: "1px solid rgb(230, 230, 230)",
    margin: "20px 0",
  };

  const infoBoxStyling = {
    display: "flex",
    margin: "18px",
    padding: "12px 10px",
    background: "rgba(65, 148, 179,0.1)!important",
    borderRadius: "10px",
    fontSize: "13px",
    width: "100%",
  };

  // api Fetching and other function

  useEffect(() => {
    if (role === "INVESTOR") {
      // api call for particular investor
      dispatch(getInvestorProfileData(investorId));
    } else if (role === "ENTREPRENEUR") {
      // api call for particular startup
      dispatch(profileOverviewForMandate(profileId));
    }
  }, [dispatch, investorId, profileId, role]);

  const profileOverviewData = useSelector((state) => {
    return state.seeNewMandate.profileOverview;
  });

  // fetch investor data from store
  const investorProfileData = useSelector(
    (state) => state?.investorProfileStepper?.investorProfileData
  );

  // handling whole payment section
  const handlePayment = (item) => {
    const price = Math.round(rate);
    setPaymentLoader(true);
    if (role === "ENTREPRENEUR") {
      sendRequest(`startup/${userDetails.id}/userPurchases`, "post", {
        plan_id: id,
        purchase_date,
        renewal_date,
        last_updated: purchase_date,
      })
        .then((resp) => {
          if (resp.status) {
            if (discountValue === "") {
              sendRequest("startup/makePayment", "post", {
                purchaseId: resp.purchase_id,
                planName: desc,
                firstName: userDetails?.name,
                LastName: "last Name",
                amount: String(price),
                startDate: purchase_date,
                phone: `${profileOverviewData?.dialingCode}-${profileOverviewData?.contactNo}`,
                email: userDetails?.userName,
                couponCode: discountCode,
              })
                .then((res) => {
                  if (res.success) {
                    setPaymentLoader(false);
                    window.location.href = res.payUrl;
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setPaymentLoader(false);
                  toast.error(err?.response?.data?.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                });
            } else {
              sendRequest("startup/makePayment", "post", {
                purchaseId: resp.purchase_id,
                planName: desc,
                firstName: userDetails.name,
                LastName: "last Name",
                amount: String(price),
                startDate: purchase_date,
                phone: `${profileOverviewData?.dialingCode}-${profileOverviewData?.contactNo}`,
                email: userDetails.userName,
                discount: totalValue,
                couponCode: discountCode,
              })
                .then((res) => {
                  if (res.success) {
                    setPaymentLoader(false);
                    window.location.href = res.payUrl;
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setPaymentLoader(false);
                  toast.error(err?.response?.data?.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else if (role === "INVESTOR") {
      sendRequest(`investor/${userDetails.id}/userPurchases`, "post", {
        plan_id: id,
        purchase_date,
        renewal_date,
        last_updated: purchase_date,
      })
        .then((resp) => {
          if (resp.status) {
            if (discountValue === "") {
              sendRequest("investor/makePayment", "post", {
                purchaseId: resp.purchase_id,
                planName: desc,
                firstName: userDetails.name,
                LastName: "last Name",
                amount: String(price),
                startDate: purchase_date,
                phone: `${investorProfileData?.dialingCode}-${investorProfileData?.contactNo}`,
                email: userDetails.userName,
                couponCode: discountCode,
              })
                .then((res) => {
                  if (res.success) {
                    setPaymentLoader(false);
                    window.location.href = res.payUrl;
                  }
                })
                .catch((err) => {
                  setPaymentLoader(false);
                  toast.error(err?.response?.data?.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                });
            } else {
              sendRequest("investor/makePayment", "post", {
                purchaseId: resp.purchase_id,
                planName: desc,
                firstName: userDetails.name,
                LastName: "last Name",
                amount: String(price),
                phone: `${investorProfileData?.dialingCode}-${investorProfileData?.contactNo}`,
                email: userDetails.userName,
                startDate: purchase_date,
                discount: totalValue,
                couponCode: discountCode,
              })
                .then((res) => {
                  if (res.success) {
                    setPaymentLoader(false);
                    window.location.href = res.payUrl;
                  }
                })
                .catch((err) => {
                  setPaymentLoader(false);
                  toast.error(err?.response?.data?.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                });
            }
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  // when apply button is hitted
  const applyCoupon = () => {
    setDiscountValue("");
    setDiscountCodeLoader(true);
    dispatch(applyCouponCode(role, discountCode, id)).then((res) => {
      if (res?.success) {
        toast.success(res?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setDiscountValue(res?.discount);
      }
      setDiscountCodeLoader(false);
    });
  };

  return (
    <Box>
      <ExternalContainer>
        <Grid container columnGap={2} rowGap={2}>
          <Grid
            item
            xs={12}
            sm={12}
            md={5.5}
            sx={{ background: "#ffffff", padding: "10px", borderRadius: "10px" }}
          >
            <Typography sx={{ fontSize: "16px", fontWeight: 500, padding: "10px 2px" }}>
              Subscription Details
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", padding: "10px 0", gap: "5px" }}>
              <Typography sx={{ fontSize: "30px" }}>$ {rate} </Typography>
              <Box>
                <Typography sx={{ fontSize: "11px" }}>per</Typography>
                <Typography sx={{ fontSize: "11px" }}>
                  {" "}
                  {frequency === "Annual" ? "Year" : frequency}
                </Typography>
              </Box>
            </Box>
            {/* <Box sx={{ fontSize: "9px", marginBottom: "8px" }}>
              * Arisio will automatically continue your membership and charge the membership fee to
              your payment method until you cancel. You may cancel at any time to avoid future
              charges.
            </Box> */}
            <Box sx={{ padding: "15px 0" }}>
              <Box sx={tableFormationStyling}>
                <Box>
                  {desc} Plan
                  {/* (Billing Monthly) */}
                </Box>
                <Box>$ {price?.toFixed(2)}</Box>
              </Box>
              <Divider sx={dividerStyling} />

              <Box sx={{ ...tableFormationStyling }}>
                <TextField
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                    setDiscountValue("");
                  }}
                  size="small"
                  fullWidth
                  placeholder="Coupon code"
                  variant="outlined"
                  sx={{
                    background: "#FFFFFF",
                    height: "45px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.8rem",
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                      paddingRight: "32%", // padding added for not to get text overlaping
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <LoadingButton
                          size="small"
                          onClick={applyCoupon}
                          loading={discountCodeLoader}
                          loadingPosition="end"
                          sx={{
                            ...ButtonCss,
                            position: "absolute",
                            right: "0px",
                            width: "30%",
                            height: "100%",
                            borderRadius: "8px",
                            // margin: "10px 0px",
                            // padding: "4px 35px",
                            background: "rgba(138, 21, 56, 0.15)",
                            "& .MuiLoadingButton-loadingIndicator": {
                              margin: "10px",
                            },
                          }}
                          disabled={
                            discountCode === ""
                            // ||
                            // parseDate(selectedMandate?.startDate) > parseDate(currentDate)
                          }
                        >
                          Apply
                        </LoadingButton>
                      </InputAdornment>
                    ),

                    sx: {
                      // for inner side like the input styling
                      height: "100%",
                      boxSizing: "border-box",
                    },
                  }}
                />
              </Box>
              <Divider sx={dividerStyling} />
              <Box sx={tableFormationStyling}>
                <Box>Discount </Box>
                <Box>{discountValue !== "" ? `${"$ " + DiscountValue?.toFixed(2)}` : "$0.00"}</Box>
              </Box>
              <Divider sx={dividerStyling} />
              <Box sx={tableFormationStyling}>
                <Box> Total </Box>
                <Box>${totalValue.toFixed(2)}</Box>
              </Box>
              <Divider sx={dividerStyling} />
            </Box>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={12}
            md={5.7}
            sx={{
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              padding: "10px",
              borderRadius: "10px",
              justifyContent: "space-between",
            }}
          >
            <Grid item width={"90%"}>
              <Typography sx={{ padding: "10px 15px", fontSize: "16px", fontWeight: 500 }}>
                Information
              </Typography>
              {role === "ENTREPRENEUR" ? (
                <>
                  <Box sx={infoBoxStyling}>
                    <Box sx={{ fontWeight: 500, width: "30%" }}>Full name</Box>
                    <Box
                      sx={{
                        width: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {" "}
                      {profileOverviewData?.user?.name ? profileOverviewData?.user?.name : ""}
                    </Box>
                  </Box>
                  <Box sx={infoBoxStyling}>
                    <Box sx={{ fontWeight: 500, width: "30%" }}>Email</Box>
                    <Box
                      sx={{
                        width: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {" "}
                      {profileOverviewData?.communicationEmail
                        ? profileOverviewData?.communicationEmail
                        : ""}
                    </Box>
                  </Box>
                  <Box sx={infoBoxStyling}>
                    <Box sx={{ fontWeight: 500, width: "30%" }}>Contact no.</Box>
                    <Box
                      sx={{
                        width: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {profileOverviewData?.contactNo
                        ? `${profileOverviewData?.dialingCode} - ${profileOverviewData?.contactNo}`
                        : "-"}
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={infoBoxStyling}>
                    <Box sx={{ fontWeight: 500, width: "30%" }}>Full name</Box>
                    <Box
                      sx={{
                        width: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {" "}
                      {investorProfileData?.fullName ? investorProfileData?.fullName : "-"}
                    </Box>
                  </Box>
                  <Box sx={infoBoxStyling}>
                    <Box sx={{ fontWeight: 500, width: "30%" }}>Email</Box>
                    <Box
                      sx={{
                        width: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {" "}
                      {investorProfileData?.communication_email
                        ? investorProfileData?.communication_email
                        : "-"}
                    </Box>
                  </Box>
                  <Box sx={infoBoxStyling}>
                    <Box sx={{ fontWeight: 500, width: "30%" }}>Contact no.</Box>
                    <Box
                      sx={{
                        width: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {investorProfileData?.contactNo
                        ? `${investorProfileData?.dialingCode} - ${investorProfileData?.contactNo}`
                        : "-"}
                    </Box>
                  </Box>
                </>
              )}
            </Grid>
            <Grid width={"100%"}>
              {/* <Button
                onClick={handlePayment}
                sx={{ ...ButtonCss, width: "100%", padding: "10px 8px" }}
              >
                Proceed for Payment
              </Button> */}
              <LoadingButton
                size="small"
                onClick={handlePayment}
                loading={paymentLoader}
                loadingPosition="end"
                sx={{
                  ...ButtonCss,
                  width: "100%",
                  padding: "10px 8px",
                  "& .MuiLoadingButton-loadingIndicator": {
                    margin: "10px",
                    color: "#8A1538",
                  },
                }}
              >
                Proceed to payment
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </ExternalContainer>
    </Box>
  );
};

Checkout.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Checkout;
