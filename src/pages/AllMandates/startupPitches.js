import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import styles from "./seeNewMandate.module.css";
import { useRouter } from "next/router";
import ExternalContainer from "src/components/ExternalContainer";
import {
  adminMandateDetail,
  adminMandateQuestion,
  allOpenMandates,
  allTableMandates,
} from "src/action/allMandates";
import { FormattedMessage } from "react-intl";
import { formattedDate, getButtonCss } from "src/utils/util";
import PreviewMandate from "../CreateMandates/previewMandate";

const columns = [
  {
    id: 1,
    label: <FormattedMessage id="admin.allMandate.StartupName" defaultMessage="Startup Name" />,
    minWidth: 170,
    align: "right",
  },
  {
    id: 2,
    label: <FormattedMessage id="admin.allMandate.Country" defaultMessage="Country" />,
    minWidth: 170,
    align: "right",
  },
  {
    id: 3,
    label: <FormattedMessage id="admin.allMandate.City" defaultMessage="City" />,
    minWidth: 170,
    align: "right",
  },
  {
    id: 4,
    label: <FormattedMessage id="admin.allMandate.PitchedDate" defaultMessage="Pitched Date" />,
    minWidth: 170,
    align: "right",
  },
];

const StartupPitches = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const selectedMandate = localStorage.getItem("selectedMandateId");
  const [startupPitchId, setStartupPitchId] = useState(1);
  const [selectedMandateId, setSelectedMandateId] = useState(selectedMandate);
  const [dialogOpen, setDialogOpen] = useState(false);
  const buttonCss = getButtonCss();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const router = useRouter();

  const storedUserDetails = localStorage.getItem("userDetails");
  let UserId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const adminUserId = UserId?.id;

  useEffect(() => {
    dispatch(allOpenMandates(adminUserId));
    setStartupPitchId(1);
    setSelectedMandateId(selectedMandate);
  }, [dispatch, adminUserId, selectedMandate]);

  let openMandatesData = useSelector((state) => state.allMandatesSlice.allOpenMandates.mandates);

  useEffect(() => {
    dispatch(allTableMandates(adminUserId, selectedMandateId, startupPitchId));
  }, [dispatch, adminUserId, startupPitchId, selectedMandateId]);

  useEffect(() => {
    dispatch(adminMandateDetail(adminUserId, selectedMandateId));
    dispatch(adminMandateQuestion(selectedMandateId));
  }, [adminUserId, dispatch, selectedMandateId]);

  let tableData = useSelector((state) => state.allMandatesSlice.allTableMandates);
  let mandateDetail = useSelector((state) => state.allMandatesSlice.adminMandateDetailData);
  let mandateQuestions = useSelector((state) => state.allMandatesSlice.mandateQuestion);

  let mandateDetailLoadingState = useSelector(
    (state) => state.allMandatesSlice.mandateDetailLoading
  );

  console.log(mandateQuestions);

  const goBack = () => {
    router.back();
  };

  const pitchStatus = [
    {
      value: 1,
      label: <FormattedMessage id="admin.allMandate.Applied" defaultMessage="Applied" />,
    },
    {
      value: 4,
      label: <FormattedMessage id="admin.allMandate.WatchListed" defaultMessage="WatchListed" />,
    },
    {
      value: 2,
      label: <FormattedMessage id="admin.allMandate.ShortListed" defaultMessage="ShortListed" />,
    },
    {
      value: 3,
      label: <FormattedMessage id="admin.allMandate.notAGoodFit" defaultMessage="Not a good fit" />,
    },
    // {
    //   value: 6,
    //   label: <FormattedMessage id="admin.allMandate.Contacted" defaultMessage="Contacted " />,
    // },
    // {
    //   value: 5,
    //   label: <FormattedMessage id="admin.allMandate.Invited" defaultMessage="Invited" />,
    // },
  ];

  const handleChangePitchStatus = (e) => {
    setStartupPitchId(e.target.value);
  };

  const selectedMandateIdChange = (e) => {
    setSelectedMandateId(e.target.value);
  };

  const detailPointStyling = {
    color: "rgba(108, 25, 62, 1) ",
    fontWeight: 500,
    px: "5px",
    fontSize: "15px",
  };

  const detailHeading = {
    fontSize: "16px",
    fontWeight: 500,
  };

  const mandateStatus = {
    0: "Closed",
    1: "Open",
    2: "Incomplete",
    3: "Pending approval",
    4: "Rejected",
  };
  return (
    <>
      <ExternalContainer>
        <Grid container onClick={goBack} md={4} xl={4} sx={{ cursor: "pointer" }}>
          <ArrowBackIcon />
          <Typography>
            {" "}
            <FormattedMessage
              id="admin.allMandate.BackToMandates"
              defaultMessage="Back to mandates"
            />
          </Typography>
        </Grid>
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            my: 2,
            backgroundColor: "#fff",
            borderRadius: "10px",
          }}
        >
          <Grid container>
            <Grid item xs={12} sm={4} md={8} xl={8} alignContent={"center"}>
              <Typography
                style={{
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                <FormattedMessage
                  id="admin.allMandate.startupPitches"
                  defaultMessage="Startup Pitches"
                />{" "}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={4} xl={4} style={{ margin: "0px 0px" }}>
              <Box>
                <Typography
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    paddingBottom: "5px",
                    color: "#808080",
                  }}
                >
                  <FormattedMessage
                    id="admin.allMandate.FilterByPitchStatus"
                    defaultMessage=" Filter by pitch status"
                  />{" "}
                </Typography>
                <Select
                  defaultValue={startupPitchId}
                  onChange={handleChangePitchStatus}
                  style={{ backgroundColor: "#ffff", borderRadius: "8px" }}
                  size="small"
                  fullWidth
                  id="outlined-select"
                  select
                >
                  {pitchStatus.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              my: 2,
              background: "rgba(65, 148, 179,0.1) !important",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* <Grid container spacing={2}>
              <Grid item xs={12} sm={8} md={8} xl={8} style={{ margin: "15px 0px" }}>
                <Box>
                  <Typography style={{ fontSize: "16px", fontWeight: 500, color: "#808080" }}>
                    <FormattedMessage
                      id="admin.allMandate.SelectAMandate"
                      defaultMessage="Select a mandate"
                    />
                  </Typography>
                  <Select
                    defaultValue={selectedMandateId}
                    onChange={selectedMandateIdChange}
                    style={{ backgroundColor: "#ffff", borderRadius: "8px" }}
                    size="small"
                    fullWidth
                    id="outlined-select"
                    select
                  >
                    {openMandatesData?.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.title}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} md={4} xl={4} style={{ margin: "15px 0px" }}>
                <Box>
                  <Typography style={{ fontSize: "16px", fontWeight: 500, color: "#808080" }}>
                    <FormattedMessage
                      id="admin.allMandate.FilterByPitchStatus"
                      defaultMessage=" Filter by pitch status"
                    />{" "}
                  </Typography>
                  <Select
                    defaultValue={startupPitchId}
                    onChange={handleChangePitchStatus}
                    style={{ backgroundColor: "#ffff", borderRadius: "8px" }}
                    size="small"
                    fullWidth
                    id="outlined-select"
                    select
                  >
                    {pitchStatus.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
            </Grid> */}
            <Grid container>
              <Grid container>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                    Mandate Details :
                  </Typography>
                  <Button
                    sx={{ ...buttonCss, padding: "6px 10px" }}
                    onClick={() => setDialogOpen(true)}
                  >
                    Know more
                  </Button>
                </Box>
              </Grid>
              {mandateDetailLoadingState ? (
                <>
                  <Skeleton variant="rounded" width={"100%"} height={40} sx={{ margin: "5px" }} />
                  <Skeleton variant="rounded" width={"100%"} height={40} sx={{ margin: "5px" }} />
                </>
              ) : (
                <>
                  <Grid container>
                    <Grid container item xs={12} sm={8} md={6} xl={6} sx={{ p: "5px" }}>
                      <Typography sx={detailHeading}>Name:</Typography>

                      <Typography sx={detailPointStyling}>{mandateDetail?.title}</Typography>
                    </Grid>
                    <Grid container item xs={12} sm={8} md={6} xl={6} sx={{ p: "5px" }}>
                      <Typography sx={detailHeading}>Status:</Typography>
                      <Tooltip title={mandateDetail?.investor?.reason}>
                        <Typography
                          sx={{
                            ...detailPointStyling,
                            width: "75%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {mandateStatus[mandateDetail?.is_active]}{" "}
                          {mandateDetail?.investor?.reason &&
                            `(${mandateDetail?.investor?.reason})`}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid container item xs={12} sm={8} md={6} xl={6} sx={{ p: "5px" }}>
                      <Typography sx={detailHeading}>Start Date:</Typography>
                      <Typography sx={detailPointStyling}>
                        {formattedDate(mandateDetail?.startDate)}
                      </Typography>
                    </Grid>

                    <Grid container item xs={12} sm={8} md={6} xl={6} sx={{ p: "5px" }}>
                      <Typography sx={detailHeading}>End Date:</Typography>
                      <Typography sx={detailPointStyling}>
                        {formattedDate(mandateDetail?.endDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell key={column.id}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData?.length !== 0 ? (
                    tableData?.map((row, index) => {
                      return (
                        <TableRow hover key={index}>
                          <TableCell>{row.organizationName}</TableCell>
                          <TableCell>{row.country}</TableCell>
                          <TableCell>{row.city}</TableCell>
                          <TableCell>{row.date}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{ textAlign: "center", color: "rgba(108, 25, 62, 1)", marginTop: 4 }}
                    >
                      {startupPitchId === 1 ? (
                        <FormattedMessage
                          id="noDataMessageForPitches1"
                          defaultMessage="No pitches applied"
                        />
                      ) : startupPitchId === 2 ? (
                        <FormattedMessage
                          id="noDataMessageForPitches2"
                          defaultMessage="No pitches shortListed"
                        />
                      ) : startupPitchId === 3 ? (
                        <FormattedMessage
                          id="noDataMessageForPitches3"
                          defaultMessage="No pitches not a good fit selected"
                        />
                      ) : startupPitchId === 4 ? (
                        <FormattedMessage
                          id="noDataMessageForPitches4"
                          defaultMessage="No pitches watchListed"
                        />
                      ) : startupPitchId === 5 ? (
                        <FormattedMessage
                          id="noDataMessageForPitches5"
                          defaultMessage="No pitches invited"
                        />
                      ) : (
                        <FormattedMessage
                          id="noDataMessageForPitches6"
                          defaultMessage="No pitches contacted"
                        />
                      )}
                    </Typography>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </ExternalContainer>
      {dialogOpen && (
        <PreviewMandate
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          previewDetails={mandateDetail}
          eventQuestionList={mandateQuestions}
        />
      )}
    </>
  );
};
StartupPitches.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default StartupPitches;
