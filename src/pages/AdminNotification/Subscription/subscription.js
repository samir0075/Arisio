import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";
import ExternalContainer from "src/components/ExternalContainer";

import SearchIcon from "@mui/icons-material/Search";
import AdminTable from "src/components/AdminTable";
import { useDispatch } from "react-redux";
import {
  getAuditLogs,
  getSubscriptionCounts,
  getSubscriptionData,
} from "src/action/pendingApprovals";
import { useSelector } from "react-redux";
import { formattedDate, formattedEventDate } from "src/utils/util";
import { pendingApprovalsActions } from "src/store/pendingApprovalsSlice";
import SkeletonTable from "src/components/SkeletonTable/SkeleteonTable";
import { NoDataComponent } from "src/components/NotFound/notfound";
import AdminDashboardCards from "src/components/AdminDashboardCards";
import AdminSubsciptioncard from "src/components/AdminSubsciptioncard";

const Subscription = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState("");

  const [userName, setuserName] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [planType, setPlanType] = useState("");
  const [userType, setUserType] = useState("");

  const subscriptionData = useSelector((state) => state.pendingApprovals?.subscriptionData);

  const searchLoader = useSelector((state) => state?.pendingApprovals?.searchLoading);
  const subscriptionDataLoading = useSelector((state) => state.pendingApprovals?.loading);

  const subscriptionCountsLoading = useSelector(
    (state) => state?.pendingApprovals?.subscriptionPlanCountLoading
  );
  const subscriptionCounts = useSelector((state) => state?.pendingApprovals?.subscriptionPlanCount);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(userName);
    }, 500); // Delay in milliseconds

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or query change
    };
  }, [userName]);

  const handlePagination = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    dispatch(pendingApprovalsActions.setSearchLoading(true));
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  /**
   * intially calling api for subscription data
   * that will work for all filter & pagination also.
   */
  useEffect(() => {
    dispatch(getSubscriptionData(page, debouncedQuery, planType, userType));
  }, [debouncedQuery, dispatch, page, planType, userType]);

  useEffect(() => {
    setPageCount(Math.ceil(subscriptionData?.count / 10));
  }, [subscriptionData?.count]);

  useEffect(() => {
    dispatch(getSubscriptionCounts());
  }, [dispatch]);

  const rednerStatus = (status) => {
    if (status === 1) {
      return <Chip label="ACTIVE" color="primary" />;
    } else {
      return <Chip label="DEACTIVE" color="warning" />;
    }
  };

  const rows = subscriptionData?.data?.map((logs) => ({
    id: logs?.user_purchase?.user_id,
    id: logs?.user_purchase?.user_id,
    usertype_id: logs?.userdetail?.usertype_id === 4 ? "STARTUP" : "INVESTOR",
    amount: `${logs?.amountUSD} USD`,
    plan: logs?.user_purchase?.plan?.name,
    username: logs?.userdetail?.username,
    name: logs?.userdetail?.name,
    purchase_date: formattedDate(logs?.user_purchase?.purchase_date),
    expiry_date: formattedDate(logs?.user_purchase?.expiry_date),
    status: logs?.user_purchase?.plan_active,
  }));

  const columns = [
    // { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "NAME", width: 240 },
    { field: "username", headerName: "USER MAIL ID", width: 260 },
    { field: "plan", headerName: "PLAN TYPE", width: 130 },
    { field: "amount", headerName: "PLAN AMOUNT", width: 180 },
    { field: "usertype_id", headerName: "USER TYPE", width: 120 },
    { field: "purchase_date", headerName: "PURCHASE DATE", width: 150 },
    { field: "expiry_date", headerName: "EXPIRY DATE", width: 150 },
    {
      field: "status",
      headerName: "STATUS",
      width: 150,
      renderCell: (params) => rednerStatus(params.value),
    },
  ];

  return (
    <div>
      <ExternalContainer>
        <Grid container justifyContent="space-around">
          <Grid item xs={12} sm={5.5} md={5.8} xl={5.8}>
            <AdminSubsciptioncard
              title={"Startup"}
              firstHeader={"Free Plan"}
              secondHeader={"Basic Plan"}
              thirdHeader={"Expert Plan"}
              fourthHeader={"Basic Plus Plan"}
              image={"/Images/StartupCard.png"}
              counts={subscriptionCounts?.startup}
              loading={subscriptionCountsLoading}
            />
          </Grid>

          <Grid item xs={12} sm={5.5} md={5.8} xl={5.8}>
            <AdminSubsciptioncard
              title={"Investor"}
              firstHeader={"Free Plan"}
              secondHeader={"Basic Plan"}
              thirdHeader={"Expert Plan"}
              fourthHeader={"Basic Plus Plan"}
              image={"/Images/InvestorCard.png"}
              counts={subscriptionCounts?.investor}
              loading={subscriptionCountsLoading}
            />
          </Grid>
        </Grid>

        <Grid sx={{ background: "#fff", my: 2, borderRadius: "10px" }}>
          <Grid container item xs={12} sm={6} md={7} xl={7} sx={{ padding: "10px 10px 5px 10px" }}>
            <Typography style={{ padding: "6px" }} variant="h6">
              {" "}
              User Subscription Plans
            </Typography>
          </Grid>

          <Grid container spacing={1} sx={{ marginTop: "5px", padding: "5px 10px", gap: "8px" }}>
            <Grid item xs={12} sm={6} md={4.5} xl={4.5}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search by username or email"
                variant="outlined"
                value={userName}
                onChange={(e) => {
                  setuserName(e.target.value);
                }}
                sx={{
                  background: "#FFFFFF",
                  height: "90%",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.8rem",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* for search loader */}
                      {searchLoader && <CircularProgress size={20} sx={{ marginRight: 1 }} />}{" "}
                    </InputAdornment>
                  ),
                  sx: {
                    // for inner side like the input styling
                    height: "100%",
                    boxSizing: "border-box",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} xl={3}>
              <Select
                placeholder="Plan Type"
                sx={{ background: "#FFFFFF", height: "90%" }}
                size="small"
                fullWidth
                labelId="single-select-label"
                id="single-select"
                value={userType}
                onChange={(e) => {
                  setPage(1);
                  setUserType(e.target.value);
                }}
                displayEmpty
              >
                <MenuItem value="">All User Type</MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value="4">
                  Startup
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value="3">
                  Investor
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={3} xl={3}>
              <Select
                sx={{ background: "#FFFFFF", height: "90%" }}
                size="small"
                fullWidth
                labelId="single-select-label"
                id="single-select"
                value={planType}
                onChange={(e) => {
                  setPage(1);
                  setPlanType(e.target.value);
                }}
                displayEmpty
              >
                {/* <MenuItem disabled sx={{ display: "none" }}>
                  Plan Type
                </MenuItem> */}
                <MenuItem value="">All Plans</MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value="Basic">
                  Basic
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value="Expert">
                  Expert
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value="Basic plus">
                  Basic plus
                </MenuItem>
              </Select>
            </Grid>
            {/* <Grid item xs={12} sm={6} md={5} xl={5}>
              <DatePicker
                label="Select a date"
                // value={selectedDate}
                // maxDate={today}
                // onChange={handleDateChange}
                renderInput={params => (
                  <TextField {...params} size="small" fullWidth error={false} helperText={""} />
                )}
              />
            </Grid> */}
            <Grid item xs={12} sm={6} md={1} xl={1}>
              <Button
                // disabled={!isPermitted(permissions.ADMIN_PENDING_APPROVAL_INVESTORS_CSV)}
                // onClick={handleCsvDownload}
                sx={{ background: "rgba(138, 21, 56, 0.15)", height: "90%" }}
              >
                <img src="/Images/download.png" /> <span style={{ marginLeft: "10px" }}>CSV</span>
              </Button>
            </Grid>
          </Grid>
          {subscriptionDataLoading ? (
            <SkeletonTable columns={columns} />
          ) : rows?.length > 0 ? (
            <AdminTable
              rows={rows}
              columns={columns}
              page={page}
              pageCount={pageCount}
              handlePagination={handlePagination}
            />
          ) : (
            <NoDataComponent />
          )}
        </Grid>
      </ExternalContainer>
    </div>
  );
};

Subscription.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Subscription;
