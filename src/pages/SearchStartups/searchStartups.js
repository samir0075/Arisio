import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { getCountries, investorSubscriptionLimitCheck } from "src/action/globalApi";
import { searchStartUpsActions } from "src/store/searchStartupsSlice";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Divider,
  Grid,
  useTheme,
  Typography,
  Button,
  Skeleton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/router";

import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useDispatch, useSelector } from "react-redux";
import Filters from "./filters";
import NewTableMainComponent from "./newTableMainComponent";
import ConfirmInvitePitchModal from "./confirmInvitePitchModal";
import {
  getDataByCompaniesFilter,
  getUserCsvDownloadReportwithKeywords,
} from "src/action/searchStartups";
import { FormattedMessage, useIntl } from "react-intl";
import DownloadIcon from "@mui/icons-material/Download";
import { getUserCsvDownloadReport } from "src/action/searchStartups";
import { toast } from "react-toastify";
import { isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import { SWEETALERT } from "src/components/sweetalert2";
import SkeletonTableNew from "src/components/SkeletonTable/SkeltonTableNew";

const HorizontalAccordion = styled(Accordion)(({ theme }) => ({
  "& .MuiAccordionDetails-root": {
    flexDirection: "row", // Ensures content is displayed horizontally
    transition: "width 0.3s ease-in-out", // Add transition for width change
    overflow: "hidden", // Hide overflow to prevent content from appearing during animation
    width: 0, // Initially hide details
  },
  "&.Mui-expanded": {
    "& .MuiAccordionDetails-root": {
      width: "100%",
      padding: "8px", // Expand details to full width when accordion is expanded
    },
    "& .MuiButtonBase-root": {
      minHeight: "0px",
    },
  },
  "& .MuiAccordionSummary-root": {
    transition: "transform 0.3s ease-in-out",
    transformOrigin: "top right",
    flexDirection: "row-reverse", // Reverses the icon position to the right
    padding: "0px 0px 0px 16px",
    height: "44px",
  },
}));

const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    order: 2, // Content (header text) comes second
  },
  "& .MuiAccordionSummary-expandIcon": {
    order: 1, // Expand icon comes first
    marginRight: 0, // Adjust icon spacing if needed
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    marginRight: "17px", // Adjust the marginLeft as needed
  },
}));

const SearchStartups = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStartUpId, setSelectedStartUpId] = useState(0);
  const [mandatesList, setMandatesList] = useState([]);
  const [checkedMandates, setCheckedMandates] = useState([]);
  const [filters, setFilter] = useState({});
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [backdropLoading, setBackdropLoading] = useState(false);

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;

  const userId = userDetails?.id;
  const investorId = userDetails?.investorId;
  const role = userDetails?.role;

  const searchMandate = "search_limit";
  const { filter } = router?.query;
  const [expanded, setExpanded] = useState(filter === "true" ? true : false);

  useEffect(() => {
    let isMounted = true; // To check if the component is still mounted
    let requestCounter = 0; // Track the number of API requests

    const checkInvestorSubscriptionLimit = async () => {
      const currentRequest = ++requestCounter; // Increment the request counter
      if (role === "INVESTOR") {
        dispatch(investorSubscriptionLimitCheck(userId, searchMandate)).then((res) => {
          // console.log(isMounted, currentRequest, requestCounter, res, !isAlertShown);

          // Only process the response if it's from the latest API call
          if (isMounted && currentRequest === requestCounter) {
            if (res?.status === false && !isAlertShown) {
              setIsAlertShown(true);
              SWEETALERT({
                text: "Your Search Startups limit has been reached. Please upgrade your plan to continue!",
              });
            }
          }
        });
      }
    };

    // Call the function
    checkInvestorSubscriptionLimit();

    // Cleanup function to avoid memory leaks
    return () => {
      isMounted = false;
    };
  }, [dispatch, isAlertShown, userId, searchMandate]);

  /** for handling Invite Pitch Card Function */
  useEffect(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  const columns = [
    {
      id: 1,
      name: <FormattedMessage id="filterModal.table.startupName" defaultMessage="Startup Name" />,
      value: "companyName",
    },
    {
      id: 2,
      name: <FormattedMessage id="filterModal.table.description" defaultMessage="Description" />,
      value: "description",
    },
    {
      id: 3,
      name: (
        <FormattedMessage id="filterModal.table.primaryind" defaultMessage="Primary Industry" />
      ),
      value: "",
    },
    {
      id: 4,
      name: <FormattedMessage id="filterModal.table.foundedDate" defaultMessage="Founded Date" />,
      value: "foundedOn",
    },
    {
      id: 5,
      name: (
        <FormattedMessage
          id="filterModal.table.fundinground"
          defaultMessage="Number of Funding Rounds"
        />
      ),

      value: "fundingRounds",
    },
    {
      id: 6,
      name: (
        <FormattedMessage
          id="filterModal.table.totalamount"
          defaultMessage="Total Amount Raised (in USD)"
        />
      ),
      value: "funding_total_usd",
    },
    {
      id: 7,
      name: <FormattedMessage id="filterModal.table.country" defaultMessage="Country" />,
      value: "countryName",
    },

    // {
    //   id: 8,
    //   name: "Investors",
    //   value: "Investors",
    // },
  ];

  const startsUPData = useSelector((state) => state?.searchStartUps?.startUpsData);
  const startsUPDataByName = useSelector((state) => state?.searchStartUps?.selectedStartUpsByName);
  const startsUPDataByFilters = useSelector((state) => state?.searchStartUps?.companiesByFilter);
  const filtersData = useSelector((state) => state.searchStartUps.filtersData);
  const filterCollapseValue = useSelector((state) => state?.searchStartUps?.collapseValue);
  const loading = useSelector((state) => state?.searchStartUps.loading);

  // useEffect(() => {
  //   if (filtersData !== undefined) {
  //     if (Object.keys(filtersData).length !== 0) {
  //       dispatch(getDataByCompaniesFilter(filtersData, page + 1, investorId));
  //     }
  //   }
  // }, [filtersData, dispatch, investorId, page]);

  useEffect(() => {
    if (role === "ADMINISTRATOR") {
      dispatch(
        getDataByCompaniesFilter(
          {
            category: [],
            city: [],
            country: [{ name: "QAT", fullName: "Qatar" }],
            yearIndicator: "after",
            year: "",
            fundIndicator: "greater",
            fund: "",
          },
          1
        )
      );
      dispatch(
        searchStartUpsActions.setFiltersData({
          filtersData: {
            category: [],
            city: [],
            country: [{ name: "QAT", fullName: "Qatar" }],
            yearIndicator: "after",
            year: "",
            fundIndicator: "greater",
            fund: "",
          },
        })
      );
    }
  }, [role, dispatch]);

  useEffect(() => {
    if (Object.keys(filtersData).length !== 0) {
      dispatch(getDataByCompaniesFilter(filtersData, page + 1, investorId));
    }
  }, [page]);

  const handelSubmit = (checkedMandatesList, startUpsId) => {
    setOpenModal(true);
    setSelectedStartUpId(startUpsId);
    setMandatesList(checkedMandatesList);
  };

  const handleChange = () => {
    setExpanded(!expanded);
  };
  const theme = useTheme();

  const csvDownloadLimit = "csv_limit";

  const handleCsvDownload = () => {
    if (role === "ADMINISTRATOR") {
      if (startsUPDataByFilters?.data?.length > 0) {
        dispatch(getUserCsvDownloadReport(filtersData, "admin")).then((res) => {
          if (res?.success) {
            window.open(res?.downloadUrl, " _blank", "noreferrer");
            toast.success(res?.message?.toString(), {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            toast.warning(res?.response?.data?.message?.toString(), {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      } else {
        dispatch(getUserCsvDownloadReportwithKeywords(filters, "admin")).then((res) => {
          if (res?.success) {
            window.open(res?.downloadUrl, " _blank", "noreferrer");
            toast.success(res?.message?.toString(), {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            toast.warning(res?.response?.data?.message?.toString(), {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      }
    } else {
      dispatch(investorSubscriptionLimitCheck(userId, csvDownloadLimit)).then((res) => {
        if (res?.status === false && isAlertShown) {
          setIsAlertShown(true);
          SWEETALERT({
            text: "Your CSV Download limit has been reached. Please upgrade your plan to continue!",
          });
        } else if (res?.status === true) {
          if (startsUPDataByFilters?.data?.length > 0) {
            dispatch(getUserCsvDownloadReport(filtersData, "investor")).then((res) => {
              if (res?.success) {
                window.open(res?.downloadUrl, " _blank", "noreferrer");
                toast.success(res?.message?.toString(), {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              } else {
                toast.warning(res?.response?.data?.message?.toString(), {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }
            });
          } else {
            dispatch(getUserCsvDownloadReportwithKeywords(filters, "investor")).then((res) => {
              if (res?.success) {
                window.open(res?.downloadUrl, " _blank", "noreferrer");
                toast.success(res?.message?.toString(), {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              } else {
                toast.warning(res?.response?.data?.message?.toString(), {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }
            });
          }
        }
      });
    }
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: "rgba(65, 148, 179,0.1) !important",
        }}
      >
        <Container maxWidth="xl" style={{ paddingRight: "0px", paddingLeft: "0px" }}>
          <Grid container justifyContent="flex-end">
            <Button
              disabled={
                !isPermitted(permissions.SEARCH_STARTUP_START_CSV) ||
                (startsUPData.length === 0 &&
                  startsUPDataByName.length === 0 &&
                  Object.keys(startsUPDataByFilters).length === 0)
              }
              // disabled={true}
              onClick={handleCsvDownload}
              sx={{ background: "rgba(138, 21, 56, 0.15)", margin: "10px", cursor: "pointer" }}
            >
              CSV <DownloadIcon sx={{ marginLeft: "10px" }} />
            </Button>
          </Grid>

          <Grid>
            <Grid
              item
              md={8}
              direction="row"
              style={{
                marginLeft: "10px",
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#ffffff",
                overflow: "hidden",
                // width: "100%",
                // height: "90vh",
              }}
            >
              <Grid
                item
                md={2}
                style={{
                  width: expanded === true ? "300px" : "30px",
                  borderRadius: "0px",
                }}
              >
                <Box>
                  <HorizontalAccordion expanded={true} onChange={() => handleChange()}>
                    <CustomAccordionSummary
                      expandIcon={expanded === true ? <ChevronLeftIcon /> : <ExpandLessIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{ justifyContent: "center" }}
                    >
                      {expanded === true && (
                        <Typography
                          style={{
                            fontFamily: "Calibri",
                            fontWeight: 600,
                            fontSize: "20px",
                            padding: "10px",
                          }}
                        >
                          <FormattedMessage
                            id="filterModal.heading.filter"
                            defaultMessage="Filters"
                          />
                        </Typography>
                      )}
                    </CustomAccordionSummary>
                    {expanded === true ? (
                      <AccordionDetails
                        style={{
                          visibility: expanded === true ? "visible" : "hidden",
                          overflowY: "scroll",
                          height: "66vh",
                        }}
                      >
                        <Filters
                          page={page}
                          setPage={setPage}
                          setFilter={setFilter}
                          filtersData={filtersData}
                          fitlers={filters}
                        />
                      </AccordionDetails>
                    ) : (
                      <Typography
                        style={{
                          display: "block",
                          width: "100%",
                          margin: "auto",
                          whiteSpace: "nowrap",
                          transform: "rotate(-180deg)",
                          writingMode: "tb-rl",
                          fontFamily: "Calibri",
                          fontWeight: 600,
                          fontSize: "20px",
                        }}
                      >
                        <FormattedMessage
                          id="filterModal.heading.filter"
                          defaultMessage="Filters"
                        />
                      </Typography>
                    )}
                  </HorizontalAccordion>
                </Box>
              </Grid>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ borderRightWidth: 4, marginTop: "0px", marginBottom: "0px" }}
              />
              <Grid
                item
                md={12}
                direction="column"
                style={{
                  marginLeft: "10px",

                  width: expanded === true ? "calc(100% - 300px)" : "96%",
                  // overflowY: "scroll",
                }}
              >
                {!loading ? (
                  <NewTableMainComponent
                    columns={columns}
                    data={
                      startsUPData?.length > 0
                        ? startsUPData
                        : startsUPDataByName?.length > 0
                        ? startsUPDataByName
                        : startsUPDataByFilters?.data
                    }
                    open={open}
                    page={page}
                    expanded={expanded}
                    setPage={setPage}
                    setOpen={setOpen}
                    handelSubmit={handelSubmit}
                    checkedMandates={checkedMandates}
                    setCheckedMandates={setCheckedMandates}
                    setBackdropLoading={setBackdropLoading}
                  />
                ) : (
                  <SkeletonTableNew columns={columns} />
                )}
              </Grid>
            </Grid>
          </Grid>

          {openModal === true && (
            <ConfirmInvitePitchModal
              openModal={openModal}
              setMandatesList={setMandatesList}
              setSelectedStartUpId={setSelectedStartUpId}
              setOpenModal={setOpenModal}
              selectedStartUpId={selectedStartUpId}
              mandatesList={mandatesList}
              setCheckedMandates={setCheckedMandates}
            />
          )}
        </Container>
      </Box>
      {backdropLoading && (
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={backdropLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};
SearchStartups.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default SearchStartups;
