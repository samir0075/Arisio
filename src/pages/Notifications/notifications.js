import React, { useEffect } from "react";
import ExternalContainer from "src/components/ExternalContainer";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import style from "./notification.module.css";
import { notification } from "src/action/notification";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FormattedMessage } from "react-intl";

const Notifications = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(notification());
  }, [dispatch]);

  let notificationData = useSelector((state) => state.notificationSlice.notification);

  console.log("notificationData", notificationData);

  return (
    <>
      <ExternalContainer>
        <Box sx={{ bgcolor: "#ffff", width: "auto", height: "auto" }}>
          <Typography
            style={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "30px",
            }}
            level="h4"
          >
            <FormattedMessage
              id="pending.approvals.notifySection"
              defaultMessage="NOTIFY SECTION"
            />
          </Typography>

          <Container
            sx={{
              display: "flex",
              padding: "20px",
              gap: { xs: "1rem", sm: "1rem" },
              flexDirection: { xs: "column", sm: "column", md: "row" },
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Card
              onClick={() => {
                router.push("./SearchStartups");
              }}
              style={{ textAlign: "center" }}
              sx={{ width: { xs: "80%", sm: "60%", md: "26%" } }}
            >
              <Card className={style.card} style={{ color: "#ffff", backgroundColor: "#8a1538" }}>
                <Typography
                  style={{ textAlign: "center", paddingTop: "20px" }}
                  gutterBottom
                  variant="h3"
                  component="div"
                >
                  {notificationData?.startups_count ? (
                    notificationData?.startups_count
                  ) : (
                    <CircularProgress color="secondary" />
                  )}
                </Typography>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <FormattedMessage
                      id="pending.approvals.allStartups"
                      defaultMessage="All Startups"
                    />
                  </Typography>
                  <Typography variant="body2" color="text.secondary"></Typography>
                </CardContent>
              </Card>
            </Card>
            <Card
              onClick={() => {
                router.push("./SearchStartups");
              }}
              className="card"
              style={{ textAlign: "center" }}
              sx={{ width: { xs: "80%", sm: "60%", md: "26%" } }}
            >
              <Card className={style.card} style={{ color: "#ffff", backgroundColor: "#8a1538" }}>
                <Typography
                  style={{ textAlign: "center", paddingTop: "20px" }}
                  gutterBottom
                  variant="h3"
                  component="div"
                >
                  {notificationData?.startups_count_30days ? (
                    notificationData?.startups_count_30days
                  ) : (
                    <CircularProgress color="secondary" />
                  )}
                </Typography>
                <CardContent>
                  <Typography variant="h5" component="div">
                    <FormattedMessage
                      id="pending.approvals.allStartups"
                      defaultMessage="All Startups"
                    />
                  </Typography>
                  <Typography style={{ color: "#fff" }} variant="body2" color="text.secondary">
                    <FormattedMessage
                      id="pending.approvals.sinceLast30Days"
                      defaultMessage="(Since Last 30 days)"
                    />
                  </Typography>
                </CardContent>
              </Card>
            </Card>
          </Container>
        </Box>
      </ExternalContainer>
    </>
  );
};
Notifications.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Notifications;
