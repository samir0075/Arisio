import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";
import ExternalContainer from "src/components/ExternalContainer";

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
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import AdminDashboardCards from "src/components/AdminDashboardCards";
import AdminTable from "src/components/AdminTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashboardCounts,
  getPendingStartups,
  getPendingUserDetails,
  getUserCsvDownload,
} from "src/action/pendingApprovals";
import { useRouter } from "next/router";
import { getCountries } from "src/action/globalApi";
import { DatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import { formattedDate, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import SearchIcon from "@mui/icons-material/Search";

import dayjs from "dayjs";
import { pendingApprovalsActions } from "src/store/pendingApprovalsSlice";
import { NoDataComponent } from "src/components/NotFound/notfound";
import SkeletonTable from "src/components/SkeletonTable/SkeleteonTable";

const Startups = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState("");
  const [country, setCountry] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startupSearch, setstartupSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const countryData = useSelector((state) => state.globalApi.countries);
  const today = dayjs().startOf("day");

  const handlePagination = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(startupSearch);
    }, 500); // Delay in milliseconds

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or query change
    };
  }, [startupSearch]);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getDashboardCounts());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [country, selectedDate, debouncedQuery]);
  useEffect(() => {
    dispatch(pendingApprovalsActions.setSearchLoading(true));
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    dispatch(getPendingStartups(page, country, selectedDate, debouncedQuery));
  }, [country, debouncedQuery, dispatch, page, selectedDate]);

  const startupDetails = useSelector((state) => state?.pendingApprovals?.startups);
  const searchLoader = useSelector((state) => state?.pendingApprovals?.searchLoading);
  const dashboardCounts = useSelector((state) => state?.pendingApprovals?.dashboardCounts);
  const loading = useSelector((state) => state?.pendingApprovals.loading);
  const dashboardCountsLoading = useSelector(
    (state) => state?.pendingApprovals?.dashboardCountsLoading
  );
  console.log(dashboardCountsLoading);

  useEffect(() => {
    setPageCount(Math.ceil(startupDetails.count / 10));
  }, [pageCount, startupDetails.count]);

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleDateChange = (newValue) => {
    if (!newValue || isNaN(new Date(newValue))) {
      setSelectedDate(""); // Clear date or reset to a default value
    } else {
      const formattedDate = format(new Date(newValue), "yyyy-MM-dd");
      setSelectedDate(formattedDate);
    }
  };

  const renderStatusChip = (status) => {
    if (status === 1) {
      return <Chip label="Approved" color="success" />;
    } else if (status === 3) {
      return <Chip label="Pending" color="warning" />;
    } else if (status === 4) {
      return <Chip label="Incomplete" color="primary" />;
    } else {
      return <Chip label="Rejected" color="error" />;
    }
  };

  const rows = startupDetails?.rows?.map((startup) => ({
    id: startup.id,
    name: startup.name,
    location: startup?.startup_detail?.country ? startup?.startup_detail?.country : "-",
    username: startup.username,
    register_time: formattedDate(startup.register_time),
    profile_creation_date: formattedDate(startup?.startup_detail?.profile_creation_date),
    status: startup.admin_approved_user.status,
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "NAME", width: 250 },
    { field: "location", headerName: "LOCATION", width: 250 },
    { field: "username", headerName: "EMAIL", width: 300 },
    { field: "register_time", headerName: "CREATION DATE", width: 200 },
    { field: "profile_creation_date", headerName: "UPDATED DATE", width: 200 },
    {
      field: "status",
      headerName: "STATUS",
      width: 150,
      renderCell: (params) => renderStatusChip(params.value),
    },
    {
      field: "col6",
      headerName: "ACTIONS",
      width: 100,
      renderCell: (params) => (
        <div
          style={{
            cursor: isPermitted(permissions.ADMIN_PENDING_APPROVAL_STARTUPS_ACTION)
              ? "pointer"
              : "not-allowed",
            opacity: isPermitted(permissions.ADMIN_PENDING_APPROVAL_STARTUPS_ACTION) ? 1 : 0.5,
          }}
          onClick={() => {
            if (isPermitted(permissions.ADMIN_PENDING_APPROVAL_STARTUPS_ACTION)) {
              handleUserDetails(params.row);
            }
          }}
          // style={{ cursor: "pointer" }}
          // onClick={() => handleUserDetails(params.row)}
        >
          <VisibilityIcon />
        </div>
      ),
    },
    ,
  ];

  const router = useRouter();

  const handleUserDetails = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    dispatch(getPendingUserDetails(data?.id)).then((result) => {
      if (result) {
        router.push("/PendingApprovals/Startups/startupDetails");
      }
    });
  };

  const userType = "startup";

  const handleCsvDownload = () => {
    dispatch(getUserCsvDownload(userType, country, selectedDate)).then((res) => {
      if (res?.success === true) {
        window.open(res?.downloadUrl, "_blank", "noreferrer");
      }
    });
  };

  return (
    <>
      <ExternalContainer>
        <Grid>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} sm={5.5} md={3.2} xl={3.5}>
              <AdminDashboardCards
                title={"Startups"}
                approvedValue={dashboardCounts?.startups?.approved || 0}
                pendingValue={dashboardCounts?.startups?.pending || 0}
                rejectedValue={dashboardCounts?.startups?.rejected || 0}
                incompleteValue={dashboardCounts?.startups?.incomplete || 0}
                image={"/Images/StartupCard.png"}
                backgroundColor={"rgba(130, 128, 255, 38%)"}
                dashboardCountsLoading={dashboardCountsLoading}
              />
            </Grid>

            <Grid item xs={12} sm={5.5} md={3.2} xl={3.5}>
              <AdminDashboardCards
                title={"Investors"}
                approvedValue={dashboardCounts?.investors?.approved || 0}
                pendingValue={dashboardCounts?.investors?.pending || 0}
                rejectedValue={dashboardCounts?.investors?.rejected || 0}
                incompleteValue={dashboardCounts?.investors?.incomplete || 0}
                image={"/Images/InvestorCard.png"}
                backgroundColor={"rgba(74, 217, 145, 1)"}
                dashboardCountsLoading={dashboardCountsLoading}
              />
            </Grid>

            <Grid item xs={12} sm={5.5} md={3.2} xl={3.5}>
              <AdminDashboardCards
                title={"Mandates"}
                approvedValue={dashboardCounts?.mandates?.approved || 0}
                pendingValue={dashboardCounts?.mandates?.pending || 0}
                rejectedValue={dashboardCounts?.mandates?.rejected || 0}
                incompleteValue={dashboardCounts?.mandates?.incomplete || 0}
                image={"/Images/MandateCard.png"}
                backgroundColor={"rgba(254, 197, 61, 38%)"}
                dashboardCountsLoading={dashboardCountsLoading}
              />
            </Grid>
          </Grid>

          <Grid sx={{ background: "#fff", my: 2, borderRadius: "10px" }}>
            <Grid container sx={{ padding: "10px 10px 5px 10px" }}>
              <Grid item xs={12} sm={6} md={7} xl={7}>
                <Typography style={{ padding: "10px" }} variant="h6">
                  {" "}
                  Startups - Approval Status
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={5} xl={5}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search by startup name or email"
                  variant="outlined"
                  value={startupSearch}
                  onChange={(e) => {
                    setstartupSearch(e.target.value);
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
                        {searchLoader && (
                          <CircularProgress size={20} sx={{ marginRight: 1 }} />
                        )}{" "}
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
            </Grid>

            <Grid container sx={{ marginTop: "5px", padding: "5px 10px", gap: "10px" }}>
              <Grid item xs={12} sm={6} md={5.3} xl={5.3}>
                <Select
                  style={{ background: "#FFFFFF" }}
                  size="small"
                  fullWidth
                  labelId="single-select-label"
                  id="single-select"
                  value={country}
                  onChange={handleCountryChange}
                  displayEmpty
                >
                  <MenuItem style={{ fontSize: "0.8rem" }} value="">
                    All Country
                  </MenuItem>
                  {countryData.map((option) => (
                    <MenuItem
                      style={{ fontSize: "0.8rem" }}
                      key={option.countryCode}
                      value={option.country}
                    >
                      {option.country}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={5} xl={5}>
                <DatePicker
                  label="Select a date"
                  value={selectedDate}
                  maxDate={today}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      fullWidth
                      error={false}
                      helperText={""}
                      sx={{ backgroundColor: "#FFFFFF", height: "90%" }}
                      // inputProps={{
                      //   style: {
                      //     // Adjust line height and padding for vertical alignment
                      //     padding: "12px 12px", // Adjust padding to center the text
                      //     lineHeight: "normal" // Ensures normal line height for the input text
                      //   }
                      // }}
                      InputLabelProps={{
                        shrink: true, // Ensures the label remains above the field when the date is selected
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1} xl={1}>
                <Button
                  disabled={!isPermitted(permissions.ADMIN_PENDING_APPROVAL_STARTUPS_CSV)}
                  onClick={handleCsvDownload}
                  sx={{ background: "rgba(138, 21, 56, 0.15)", marginLeft: "10px" }}
                >
                  <img src="/Images/download.png" /> <span style={{ marginLeft: "10px" }}>CSV</span>
                </Button>
              </Grid>
            </Grid>
            {loading ? (
              // Show Skeleton while loading
              <SkeletonTable columns={columns} />
            ) : rows && rows.length > 0 ? (
              // Show Table if there is data
              <AdminTable
                rows={rows}
                columns={columns}
                page={page}
                pageCount={pageCount}
                handlePagination={handlePagination}
                loading={loading}
              />
            ) : (
              <NoDataComponent />
            )}
          </Grid>
        </Grid>
      </ExternalContainer>
    </>
  );
};
Startups.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Startups;
