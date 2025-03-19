import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Skeleton,
  Typography,
} from "@mui/material";

import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";
import ExternalContainer from "src/components/ExternalContainer";

import SearchIcon from "@mui/icons-material/Search";
import AdminTable from "src/components/AdminTable";
import { useDispatch } from "react-redux";
import { getAuditLogs } from "src/action/pendingApprovals";
import { useSelector } from "react-redux";
import { formattedEventDate } from "src/utils/util";
import { pendingApprovalsActions } from "src/store/pendingApprovalsSlice";
import { NoDataComponent } from "src/components/NotFound/notfound";
import SkeletonTable from "src/components/SkeletonTable/SkeleteonTable";

const UserActivities = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [userName, setuserName] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const auditLogData = useSelector((state) => state.pendingApprovals?.auditLogs);
  const searchLoader = useSelector((state) => state.pendingApprovals?.searchLoading);
  const auditLogsDataLoading = useSelector((state) => state.pendingApprovals?.loading);

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

  useEffect(() => {
    dispatch(getAuditLogs(page, debouncedQuery));
  }, [debouncedQuery, dispatch, page]);

  const rows = auditLogData?.data?.map((logs) => ({
    id: logs?.id,
    Operation_id: logs?.Operation_id,
    user_id: logs?.user_id,
    data: logs?.data,
    description: logs?.description,
    created_at: formattedEventDate(logs?.created_at),
    user_name: logs?.user_name,
    operationName: logs?.operationName,
    operation: logs?.operation,
    status: logs?.status,
  }));

  const columns = [
    // { field: "id", headerName: "ID", width: 80 },
    { field: "user_name", headerName: "USER NAME", width: 200 },
    { field: "operationName", headerName: "OPEARATION NAME", width: 200 },
    { field: "operation", headerName: "OPEARATION", width: 280 },
    { field: "description", headerName: "DESCRIPTION", width: 180 },
    { field: "data", headerName: "DATA", width: 300 },
    { field: "created_at", headerName: "DATE & TIME", width: 200 },
  ];

  return (
    <div>
      <ExternalContainer>
        <Grid sx={{ background: "#fff", my: 2, borderRadius: "10px" }}>
          <Grid container sx={{ padding: "10px 10px 20px 10px" }}>
            <Grid item xs={12} sm={6} md={7} xl={7}>
              <Typography style={{ padding: "10px" }} variant="h6">
                {" "}
                User Activities
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={5} xl={5}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search by username"
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
          </Grid>

          {/* <Grid container spacing={1} sx={{ marginTop: "5px", padding: "5px 10px", gap: "10px" }}>
              <Grid item xs={12} sm={6} md={5.6} xl={5.6}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search by user name or email"
                  variant="outlined"
                  value={userName}
                  onChange={e => {
                    setuserName(e.target.value);
                  }}
                  sx={{
                    background: "#FFFFFF",
                    height: "90%",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.8rem"
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {searchLoader && <CircularProgress size={20} sx={{ marginRight: 1 }} />}{" "}
                      </InputAdornment>
                    ),
                    sx: {
                      // for inner side like the input styling
                      height: "100%",
                      boxSizing: "border-box"
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={5.3} xl={5.3}>
                <Select
                  style={{ background: "#FFFFFF" }}
                  size="small"
                  fullWidth
                  labelId="single-select-label"
                  id="single-select"
                  // value={country}
                  // onChange={handleCountryChange}
                  displayEmpty
                >
                  {countryData.map(option => (
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
                  // value={selectedDate}
                  // maxDate={today}
                  // onChange={handleDateChange}
                  renderInput={params => (
                    <TextField {...params} size="small" fullWidth error={false} helperText={""} />
                  )}
                />
              </Grid>
              <Grid container item xs={12} sm={6} md={6} xl={6} justifyContent={"flex-end"}>
                <Button
                  // disabled={!isPermitted(permissions.ADMIN_PENDING_APPROVAL_INVESTORS_CSV)}
                  // onClick={handleCsvDownload}
                  sx={{ background: "rgba(138, 21, 56, 0.15)" }}
                >
                  <img src="/Images/download.png" /> <span style={{ marginLeft: "10px" }}>CSV</span>
                </Button>
              </Grid>
            </Grid> */}
          {auditLogsDataLoading ? (
            <SkeletonTable columns={columns} />
          ) : rows?.length > 0 ? (
            <AdminTable
              rows={rows}
              columns={columns}
              page={page}
              pageCount={auditLogData?.pagination?.totalPages}
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

UserActivities.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default UserActivities;
