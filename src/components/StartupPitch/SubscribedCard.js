import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";
import { getButtonCss } from "src/utils/util";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

const SubscribedCard = () => {
  const ButtonCss = getButtonCss();
  return (
    <Box style={{ display: "flex", justifyContent: "flex-start" }}>
      <Card
        style={{
          width: "280px",
          margin: "4px",
          borderRadius: "4px",
          boxShadow: "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography style={{ fontSize: "0.8rem", fontWeight: "600", padding: "5px" }}>
            Subscription
          </Typography>
          <Typography
            style={{
              fontSize: "0.7rem",
              fontWeight: "600",
              padding: "5px",
              cursor: "pointer",
              color: "#8a1538",
            }}
          >
            Upgrade Now
          </Typography>
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CardMedia
            sx={{
              height: "60px",
              width: "60px",
              margin: 0,
            }}
            image="/Images/premiumImage1.png"
          />
          <Typography style={{ fontWeight: "bold", fontSize: "0.8rem", marginTop: "5px" }}>
            HTS
          </Typography>
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography style={{ fontSize: "0.75rem" }}>Plan</Typography>
          <Typography style={{ fontSize: "0.75rem", color: "#8a1538" }}>Premium Plan</Typography>
        </Box>
        <Divider sx={{ border: "1px solid #F5F5F5", width: "95%", margin: "auto" }} />
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography style={{ fontSize: "0.75rem" }}>Plan Type</Typography>
          <Typography style={{ fontSize: "0.75rem", color: "#8a1538" }}>Monthly</Typography>
        </Box>
        <Divider sx={{ border: "1px solid #F5F5F5", width: "95%", margin: "auto" }} />
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography style={{ fontSize: "0.75rem" }}>Next Payment</Typography>
          <Typography style={{ fontSize: "0.75rem", color: "#8a1538" }}>
            20th February 2024
          </Typography>
        </Box>
        <Divider sx={{ border: "1px solid #F5F5F5", width: "95%", margin: "auto" }} />
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography style={{ fontSize: "0.75rem" }}>Amount</Typography>
          <Typography style={{ fontSize: "0.75rem", color: "#8a1538" }}>Rs 799</Typography>
        </Box>
        <Divider sx={{ border: "1px solid #F5F5F5", width: "95%", margin: "auto" }} />
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography style={{ fontSize: "0.75rem" }}>Status</Typography>
          <Typography style={{ fontSize: "0.75rem", color: "#8a1538" }}>Active</Typography>
        </Box>
        <Divider sx={{ border: "1px solid #F5F5F5", width: "95%", margin: "auto" }} />
        <CardContent style={{ padding: "10px" }}>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "0px",
            }}
          >
            <Stack
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#8A1538",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "40%",
                }}
                gutterBottom
              ></Typography>

              <Stack
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  style={{ fontSize: "0.7rem", color: "#6A6A6A" }}
                  variant="body2"
                ></Typography>
              </Stack>
            </Stack>

            <Typography style={{ fontSize: "0.8rem", color: "#8A1538" }}></Typography>
            <Stack
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            ></Stack>
          </Box>

          {/* <Divider style={{ margin: "10px", borderWidth: "1.5px" }} variant="middle" /> */}

          <Stack
            style={{
              marginTop: "10px",
            }}
          >
            <Button style={ButtonCss}>
              <FormattedMessage
                id="newMandates.card.cancelSubscriptionButton.title"
                defaultMessage="Cancel Subscription"
              />{" "}
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></span>
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card
        style={{
          width: "280px",
          margin: "4px",
          borderRadius: "4px",
          boxShadow: "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography style={{ fontSize: "0.8rem", fontWeight: "600", padding: "5px" }}>
            Subscription
          </Typography>
          <Typography
            style={{
              fontSize: "0.7rem",
              fontWeight: "600",
              padding: "5px",
              cursor: "pointer",
              color: "#8a1538",
            }}
          >
            Change Plan
          </Typography>
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CardMedia
            sx={{
              height: "60px",
              width: "60px",
              margin: 0,
            }}
            image="/Images/premiumImage1.png"
          />
          <Typography style={{ fontWeight: "bold", fontSize: "0.8rem", marginTop: "5px" }}>
            ARISIO
          </Typography>
        </Box>
        <Divider sx={{ border: "1px solid #F5F5F5", width: "95%", margin: "auto" }} />

        <CardContent style={{ padding: "10px" }}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Card
                style={{
                  margin: "4px",
                  borderRadius: "4px",
                  boxShadow: "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                }}
              >
                <Box>
                  <AssignmentOutlinedIcon style={{ fontSize: "14px" }} />
                  <Typography style={{ fontSize: "0.7rem" }}>Plan Type</Typography>
                  <Typography style={{ fontSize: "0.75rem", color: "#8a1538", fontWeight: "bold" }}>
                    Basic Plan
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Card
                style={{
                  margin: "4px",
                  borderRadius: "4px",
                  boxShadow: "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                }}
              >
                <Box>
                  <AccessTimeIcon style={{ fontSize: "14px" }} />
                  <Typography style={{ fontSize: "0.7rem" }}>Duration</Typography>
                  <Typography style={{ fontSize: "0.75rem", color: "#8a1538", fontWeight: "bold" }}>
                    Monthly
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Card
                style={{
                  margin: "4px",
                  borderRadius: "4px",
                  boxShadow: "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                }}
              >
                <Box>
                  <AssessmentOutlinedIcon style={{ fontSize: "14px" }} />
                  <Typography style={{ fontSize: "0.7rem" }}>Status</Typography>
                  <Typography style={{ fontSize: "0.75rem", color: "#8a1538", fontWeight: "bold" }}>
                    Active
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Card
                style={{
                  margin: "4px",
                  borderRadius: "4px",
                  boxShadow: "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                }}
              >
                <Box>
                  <CalendarMonthOutlinedIcon style={{ fontSize: "14px" }} />
                  <Typography style={{ fontSize: "0.7rem" }}>Renewal Date</Typography>
                  <Typography style={{ fontSize: "0.75rem", color: "#8a1538", fontWeight: "bold" }}>
                    20th Jul 2024
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
              <Card
                style={{
                  margin: "4px",
                  borderRadius: "4px",
                  boxShadow: "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                }}
              >
                <Box>
                  <CurrencyRupeeOutlinedIcon style={{ fontSize: "14px" }} />
                  <Typography style={{ fontSize: "0.7rem" }}>Amount</Typography>
                  <Typography style={{ fontSize: "0.75rem", color: "#8a1538", fontWeight: "bold" }}>
                    Rs 799
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
          <Stack
            style={{
              marginTop: "10px",
            }}
          >
            <Button style={ButtonCss}>
              <FormattedMessage
                id="newMandates.card.cancelSubscriptionButton.title"
                defaultMessage="Cancel Subscription"
              />{" "}
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></span>
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubscribedCard;
