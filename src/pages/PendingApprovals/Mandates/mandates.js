import React, { useEffect, useState } from "react";
import ExternalContainer from "src/components/ExternalContainer";
import { Layout as DashboardLayout } from "../../../layouts/dashboard/layout";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Chip,
  TextField,
  MenuItem,
  CardMedia,
  CardContent,
  Select,
  InputLabel,
  Skeleton
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashboardCounts,
  getUserCsvDownload,
  getUserCsvDownloadMandate,
  pendingApprovalCount,
  previewMandate,
  previewMandateQuestion,
  seeMandates
} from "src/action/pendingApprovals";
import styles from "./mandates.module.css";
import MandatesApprovalModal from "./mandatesApprovalModal";
import { FormattedMessage } from "react-intl";
import NoDataMsg from "src/components/NoDataMsg";
import { getButtonCss } from "src/utils/util";
import AdminTable from "src/components/AdminTable";
import AdminDashboardCards from "src/components/AdminDashboardCards";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DatePicker } from "@mui/x-date-pickers";
import { getCountries } from "src/action/globalApi";
import { technologyDetails } from "src/action/seeNewMandate";
import { format } from "date-fns";
import { isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import dayjs from "dayjs";
import { formattedDate } from "src/utils/util";
import { NoDataComponent } from "src/components/NotFound/notfound";
import SkeletonTable from "src/components/SkeletonTable/SkeleteonTable";

const Mandates = () => {
  const ButtonCss = getButtonCss();
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMandateId, setSelectedMandateId] = useState({});

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState("");
  const [country, setCountry] = useState("");
  const [technologyType, setTechnologyType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const countryData = useSelector(state => state.globalApi.countries);

  const today = dayjs().startOf("day");

  /*
   * API CALL
   */

  const storedUserDetails = localStorage.getItem("userDetails");
  let adminId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  adminId = adminId?.id;

  const handlePagination = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    dispatch(getDashboardCounts());
    dispatch(getCountries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(technologyDetails());
    // dispatch(pendingApprovalCount(adminId));
    // .then((res) => {
    //   setPageCount(res?.pagesCount);
    // });

    dispatch(seeMandates(adminId, page, technologyType, country, selectedDate));
  }, [dispatch, adminId, page, technologyType, selectedDate, country]);

  /*
   *UseSelector used to get data from redux store
   */
  let mandatesData = useSelector(state => state?.pendingApprovals.mandates);

  const dashboardCounts = useSelector(state => state?.pendingApprovals?.dashboardCounts);
  const loading = useSelector(state => state?.pendingApprovals?.loading);
  const dashboardCountsLoading = useSelector(
    state => state?.pendingApprovals?.dashboardCountsLoading
  );

  const mandateDetails = mandate => {
    setSelectedMandateId(mandate?.id);
    setDialogOpen(true);
    dispatch(previewMandate(adminId, mandate?.id));
    dispatch(previewMandateQuestion(mandate?.id));
  };

  const renderStatusChip = status => {
    if (status === 1) {
      return <Chip label="Approved" color="success" />;
    } else if (status === 3) {
      return <Chip label="Pending" color="warning" />;
    } else {
      return <Chip label="Rejected" color="error" />;
    }
  };

  const technologyTypeDetail = useSelector(state => state?.seeNewMandate?.technologyType);

  const rows = mandatesData?.data?.map(mandate => ({
    id: mandate.id,
    name: mandate.title,
    investor_name: mandate?.investor?.name,
    investor_org: mandate?.investor?.organization,
    tech_name:
      mandate?.othersTech !== null
        ? mandate?.othersTech
        : mandate?.technologies?.map(tech => tech.name).join(", "),
    location: `${mandate?.startup_location}, ${mandate?.startup_country}`,
    // register_time: new Date(mandate?.start_date).toLocaleDateString(),
    register_time: formattedDate(mandate?.start_date),
    status: mandate.is_active
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "MANDATE NAME", width: 250 },
    { field: "investor_name", headerName: "INVESTOR NAME", width: 250 },
    { field: "investor_org", headerName: "INVESTOR ORGANIZATION", width: 250 },
    { field: "tech_name", headerName: "TECHNOLOGY", width: 250 },
    { field: "location", headerName: "LOCATION", width: 250 },
    { field: "register_time", headerName: "CREATION DATE", width: 150 },
    {
      field: "status",
      headerName: "STATUS",
      width: 150,
      renderCell: params => renderStatusChip(params.value)
    },
    {
      field: "col6",
      headerName: "ACTIONS",
      width: 100,
      renderCell: params => (
        <div
          // style={{ cursor: "pointer" }}
          // onClick={() => mandateDetails(params.row)}
          style={{
            cursor: isPermitted(permissions.ADMIN_PENDING_APPROVAL_MANDATES_ACTION)
              ? "pointer"
              : "not-allowed",
            opacity: isPermitted(permissions.ADMIN_PENDING_APPROVAL_MANDATES_ACTION) ? 1 : 0.5
          }}
          onClick={() => {
            if (isPermitted(permissions.ADMIN_PENDING_APPROVAL_MANDATES_ACTION)) {
              mandateDetails(params.row);
            }
          }}
        >
          <VisibilityIcon />
        </div>
      )
    },
    ,
  ];
  const userType = "mandate";
  const handleCsvDownload = () => {
    dispatch(getUserCsvDownloadMandate(country, technologyType, selectedDate)).then(res => {
      if (res?.success === true) {
        window.open(res?.downloadUrl, "_blank", "noreferrer");
      }
    });
  };
  const handleCountryChange = event => {
    setCountry(event.target.value);
  };
  const handleTechnologyTypeChange = event => {
    setTechnologyType(event.target.value);
  };
  const handleDateChange = newValue => {
    if (!newValue || isNaN(new Date(newValue))) {
      setSelectedDate(""); // Clear date or reset to a default value
    } else {
      const formattedDate = format(new Date(newValue), "yyyy-MM-dd");
      setSelectedDate(formattedDate);
    }
  };
  useEffect(() => {
    setPageCount(Math.ceil(mandatesData.totalCount / 12));
  }, [pageCount, mandatesData.totalCount]);

  return (
    <>
      {/* {mandatesData?.loading === true ? (
        <Box className={styles.spinner}>
          <CircularProgress color="secondary" />
        </Box>
      ) : ( */}
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

          <Grid sx={{ background: "#fff", my: 1, borderRadius: "10px" }}>
            <Typography style={{ padding: "10px" }} variant="h6">
              {" "}
              Mandates - Approval Status
            </Typography>
            <Grid container spacing={1} style={{ marginTop: "5px", gap: "10px", padding: "5px" }}>
              <Grid item xs={6} sm={6} md={3} xl={3}>
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
                  {countryData.map(option => (
                    <MenuItem
                      style={{ fontSize: "0.8rem" }}
                      key={option.countryCode}
                      value={option.countryCode}
                    >
                      {option.country}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6} sm={6} md={3.2} xl={3.2}>
                <InputLabel id="demo-simple-select-label">
                  {/* <FormattedMessage id="allMandate.filter.label1" defaultMessage="Country" /> */}
                </InputLabel>
                <Select
                  style={{ background: "#FFFFFF" }}
                  size="small"
                  fullWidth
                  labelId="single-select-label"
                  id="single-select"
                  value={technologyType}
                  onChange={handleTechnologyTypeChange}
                  displayEmpty
                >
                  <MenuItem style={{ fontSize: "0.8rem" }} value="">
                    Technology
                  </MenuItem>
                  {technologyTypeDetail?.map(option => (
                    <MenuItem style={{ fontSize: "0.8rem" }} key={option.id} value={option.id}>
                      {option?.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6} sm={6} md={3.5} xl={3.5}>
                <DatePicker
                  label="Select a date"
                  value={selectedDate}
                  maxDate={today}
                  onChange={handleDateChange}
                  renderInput={params => (
                    <TextField
                      {...params}
                      size="small"
                      fullWidth
                      error={false}
                      helperText={""}
                      sx={{ height: "90%" }}
                      InputLabelProps={{
                        shrink: true // Ensures the label remains above the field when the date is selected
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={1} xl={1}>
                <Button
                  disabled={!isPermitted(permissions.ADMIN_PENDING_APPROVAL_MANDATES_CSV)}
                  onClick={handleCsvDownload}
                  sx={{ background: "rgba(138, 21, 56, 0.15)" }}
                >
                  <img src="/Images/download.png" /> <span style={{ marginLeft: "10px" }}>CSV</span>
                </Button>
              </Grid>
            </Grid>
            {loading ? (
              <SkeletonTable columns={columns} />
            ) : rows && rows.length > 0 ? (
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
        </Grid>
      </ExternalContainer>
      {/* )} */}
      {dialogOpen && (
        <MandatesApprovalModal
          page={page}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          adminId={adminId}
          selectedMandateId={selectedMandateId}
        />
      )}
    </>
  );
};

Mandates.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default Mandates;
