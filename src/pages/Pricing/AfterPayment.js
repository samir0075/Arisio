import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { getButtonCss } from "src/utils/util";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

import ContactSalesTeam from "src/components/ContactSalesTeam";
import { cancelSubscription } from "src/action/payment";
import { sendRequest } from "src/utils/request";
import { toast } from "react-toastify";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import ExternalContainer from "src/components/ExternalContainer";
import { REST_API } from "../../utils/request";
import axios from "axios";
import { useRouter } from "next/router";

const AfterPayment = ({ pricingDetails }) => {
  const ButtonCss = getButtonCss();
  const [dailogContactTeam, setdailogContactTeam] = useState(false);
  const userDetail = localStorage.getItem("userDetails");
  const userDetails = userDetail ? JSON.parse(userDetail) : null;
  const token = userDetails?.token;
  const transactionHistory = useSelector((state) => {
    return state?.payment?.skipCashTransaction;
  });

  const router = useRouter();
  const tablestyling = {
    fontSize: "12px",
  };
  const tableHeaderstyling = {
    fontSize: "12px",
  };

  const tooltipTitles = {
    1: "Payment failed",
    2: "Download",
    3: "Payment failed",
    4: "Rejected",
  };

  const statusTexts = {
    1: "Failed",
    2: "Paid",
    3: "Failed",
    4: "Rejected",
  };

  const ExpiryFormate = (date) => {
    let arrangingDate = new Date(date);
    // Add 30 days to the date for expiry
    arrangingDate.setDate(arrangingDate.getDate() + 30);
    const formattedDate = arrangingDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };

  const formatedate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };

  const findingPlanName = (plan_id) => {
    const planName = pricingDetails?.find((plan) => plan.id === plan_id);

    return planName?.name;
  };

  const successTransaction = transactionHistory?.filter((ele) => ele.status_id === 2);
  console.log(successTransaction);
  const planName = findingPlanName(successTransaction[0]?.plan_id);
  const handleContactUs = () => {
    setdailogContactTeam(true);
  };

  const subscriptionCancel = () => {
    if (userDetails?.role === "INVESTOR") {
      sendRequest(`investor/cancelSubscription`, "post", {
        Id: transactionHistory[0]?.transaction_id,
      })
        .then((resp) => {
          console.log(resp);
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
    } else {
      sendRequest(`startup/cancelSubscription`, "post", {
        Id: transactionHistory[0]?.transaction_id,
      })
        .then((resp) => {
          console.log(resp);
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

  const handleDownload = (ele) => {
    const planName = findingPlanName(ele.plan_id);
    const planDate = formatedate(ele.transaction_date);
    if (userDetails?.role === "INVESTOR") {
      axios
        .post(
          `${REST_API}/investor/generateInvoice`,
          {
            transaction_id: ele.transaction_id,
            transaction_date: planDate,
            transaction_amount: ele.amount,
            userName: userDetails.name,
            planname: planName,
            purchaseId: ele.purchase_id,
          },
          {
            responseType: "blob",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}), // Adjust headers if necessary
            }, // Important for handling binary data
          }
        )
        .then((resp) => {
          console.log(resp);
          const blob = resp.data; // Axios stores the Blob in resp.data

          // Create a Blob URL for the PDF
          const url = window.URL.createObjectURL(blob);

          // Create an anchor element to trigger the download
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url; // Use the Blob URL here
          a.download = `Invoice No ${ele.purchase_id}.pdf`; // The name of the file to be downloaded

          // Append the anchor to the document and trigger the click event
          document.body.appendChild(a);
          a.click();

          // Clean up: remove the anchor element and revoke the Blob URL
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url); // Clean up the Blob URL
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(
          `${REST_API}/startup/generateInvoice`,
          {
            transaction_id: ele.transaction_id,
            transaction_date: planDate,
            transaction_amount: ele.amount,
            userName: userDetails.name,
            planname: planName,
            purchaseId: ele.purchase_id,
          },
          {
            responseType: "blob",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}), // Adjust headers if necessary
            }, // Important for handling binary data
          }
        )
        .then((resp) => {
          console.log(resp);
          const blob = resp.data; // Axios stores the Blob in resp.data

          // Create a Blob URL for the PDF
          const url = window.URL.createObjectURL(blob);

          // Create an anchor element to trigger the download
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url; // Use the Blob URL here
          a.download = `Invoice No ${ele.purchase_id}.pdf`; // The name of the file to be downloaded

          // Append the anchor to the document and trigger the click event
          document.body.appendChild(a);
          a.click();

          // Clean up: remove the anchor element and revoke the Blob URL
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url); // Clean up the Blob URL
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <ExternalContainer>
        <Box
          sx={{
            alignItems: { xs: "center", sm: "center", md: "start", lg: "start" },
            gap: "1.4rem",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            width: "100%",
            // height: { sm: "100%", md: `calc(100vh - 220px)` },
          }}
        >
          <Box
            sx={{
              boxShadow: 4,
              width: { sm: "80%", md: "70%", lg: "70%" },
              padding: "1rem 1.2rem",
              borderRadius: "10px",
            }}
          >
            <Typography
              sx={{ fontSize: "1.1rem", color: "#0d4261", fontWeight: 600, marginBottom: "1rem" }}
            >
              <FormattedMessage id="payment.heading1" defaultMessage="Existing Plan Billing" />
            </Typography>
            <Typography sx={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.6rem" }}>
              <FormattedMessage
                id="payment.heading2"
                defaultMessage="Your application is currently on the {planName} plan  "
                values={{ planName }}
              />
            </Typography>
            <Typography sx={{ fontSize: "14px", marginBottom: "0.9rem" }}>
              <FormattedMessage
                id="payment.heading3"
                defaultMessage="Higher plans offer higher message request limit, additional features, and much more. "
              />
            </Typography>
            {successTransaction.length > 0 ? (
              <Typography sx={{ textAlign: "right", fontSize: "0.8rem" }}>
                Expires on {ExpiryFormate(successTransaction[0]?.transaction_date)}
              </Typography>
            ) : (
              ""
            )}

            <Box
              sx={{
                marginTop: "2rem",
                display: "flex",
                gap: "4rem",
                flexDirection: { xs: "column", sm: "row", md: "row" },
              }}
            >
              <Button
                disabled
                onClick={subscriptionCancel}
                style={{
                  ...ButtonCss,
                  padding: "10px 25px",
                  backgroundColor: "white",
                  border: "1px solid lightgrey",
                }}
              >
                <FormattedMessage id="payment.button.cancel" defaultMessage="Cancel Subscription" />
              </Button>
              <Button
                sx={{
                  ...ButtonCss,
                  padding: "10px 25px",
                  background:
                    "linear-gradient(to right,rgba(103, 26, 228, 1) ,rgba(183, 92, 255, 1) )",
                  color: "#ffffff",
                }}
                onClick={() => {
                  // setdailogContactTeam(true);
                  router.push("/PricingSubscription/pricing");
                }}
              >
                <FormattedMessage
                  id="payment.button.upgrade"
                  defaultMessage="  Upgrade Subscription"
                />
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "100%" },
              boxShadow: 4,
              padding: "0.9rem",
              borderRadius: "10px",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.9rem",
                marginBottom: "1rem",
                padding: "10px",
                fontWeight: 600,
                color: "#0d4261",
              }}
            >
              <FormattedMessage id="payment.billing.header" defaultMessage="Billing Summary" />
            </Typography>
            <TableContainer style={{ height: 200 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell style={tableHeaderstyling}>
                      <FormattedMessage
                        id="payment.billing.tableheader1"
                        defaultMessage="Payment .Id"
                      />
                    </TableCell>
                    <TableCell style={tableHeaderstyling}>
                      <FormattedMessage
                        id="payment.billing.tableheader2"
                        defaultMessage="Billing Date"
                      />
                    </TableCell>
                    <TableCell style={tableHeaderstyling}>
                      <FormattedMessage
                        id="payment.billing.tableheader3"
                        defaultMessage="  Plan Name"
                      />
                    </TableCell>
                    <TableCell style={tableHeaderstyling}>
                      <FormattedMessage id="payment.billing.tableheader4" defaultMessage="Amount" />
                    </TableCell>
                    <TableCell style={tableHeaderstyling}>
                      <FormattedMessage id="payment.billing.tableheader5" defaultMessage="Status" />
                    </TableCell>
                    <TableCell style={tableHeaderstyling}>
                      <FormattedMessage id="payment.billing.tableheader6" defaultMessage="Action" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionHistory?.map((ele, ind) => {
                    return (
                      <TableRow
                        key={ind}
                        sx={{
                          borderTop: "1px solid lightgrey",
                          backgroundColor: ind % 2 !== 0 ? "#f5f5f5" : "white",
                        }}
                      >
                        <TableCell style={tablestyling}>#{ele.id}</TableCell>
                        <TableCell style={tablestyling}>
                          {formatedate(ele.transaction_date)}
                        </TableCell>
                        <TableCell style={tablestyling}>{findingPlanName(ele.plan_id)}</TableCell>
                        <TableCell style={tablestyling}>${ele.amount}</TableCell>
                        <TableCell style={tablestyling}>
                          {statusTexts[ele.status_id] || "Unknown status"}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={tooltipTitles[ele.status_id] || "Unknown status"}>
                            <FileDownloadOutlinedIcon
                              disabled={ele.status_id === 1}
                              sx={{
                                color: ele.status_id === 2 ? "gray" : "lightgray",
                                cursor: ele.status_id === 2 ? "pointer" : "not-allowed",
                              }}
                              onClick={() => {
                                if (ele.status_id === 2) {
                                  handleDownload(ele);
                                }
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        {dailogContactTeam && (
          <ContactSalesTeam dialogOpen={dailogContactTeam} setDialogOpen={setdailogContactTeam} />
        )}
      </ExternalContainer>
    </>
  );
};
AfterPayment.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default AfterPayment;
