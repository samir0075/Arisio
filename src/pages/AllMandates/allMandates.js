import React, { useState, useEffect } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";
import styles from "./allMandates.module.css";
import { useDispatch, useSelector } from "react-redux";
import { allMandates, allMandatesCounts } from "src/action/allMandates";
import { useRouter } from "next/navigation";
import ExternalContainer from "src/components/ExternalContainer";
import { FormattedMessage } from "react-intl";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import { formattedDate, getButtonCss, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import { getCountries } from "src/action/globalApi";
import { getTechnology, newMandate } from "src/action/createMandate";

const AllMandates = () => {
  const ButtonCss = getButtonCss();
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedMandateId, setSelectedMandateId] = useState({});
  const [pageCount, setPageCount] = useState("");
  const [page, setPage] = useState(1);
  const [eventStatus, setEventStatus] = useState("");
  const [country, setCountry] = useState("");
  const [technology, setTechnology] = useState("");

  /*
   * API CALL
   */

  const storedUserDetails = localStorage.getItem("userDetails");
  let startupId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  startupId = startupId?.startupId;

  const handlePagination = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    dispatch(allMandatesCounts(country, eventStatus, technology)).then((res) => {
      setPageCount(res?.pagesCount);
    });
  }, [country, eventStatus, dispatch, technology]);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getTechnology());
  }, [dispatch]);

  useEffect(() => {
    dispatch(allMandates(page, country, eventStatus, technology));
    window.scrollTo(0, 0);
  }, [page, country, eventStatus, dispatch, technology]);

  /*
   *UseSelector used to get data from redux store
   */
  let allMandatesData = useSelector((state) => state?.allMandatesSlice.allMandates);
  let mandateLoadingState = useSelector((state) => state?.allMandatesSlice.loading);
  const countryData = useSelector((state) => state.globalApi.countries);
  const technologyDetails = useSelector((state) => state.newMandate.domain);

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "numeric", day: "numeric" };
  //   const date = new Date(dateString);

  //   const formattedDate = date.toLocaleDateString(undefined, options);

  //   // Pad day and month with leading zeros if less than 10
  //   const [month, day, year] = formattedDate?.split("/");
  //   const paddedMonth = month?.padStart(2, "0");
  //   const paddedDay = day?.padStart(2, "0");
  //   return `${paddedDay}/${paddedMonth}/${year}`;
  // };

  const onMandateClick = (allMandates) => {
    setSelectedMandateId(allMandates);
    router.push("./AllMandates/startupPitches");
  };

  const handleStatusChange = (event) => {
    setEventStatus(event.target.value);
    setPage(1);
  };
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    setPage(1);
  };
  const handleTechnologyChange = (event) => {
    setTechnology(event.target.value);
    setPage(1);
  };

  /**
   * Used UseEffect Hooks to store the data of Selected MandateId in local Storage.
   */
  useEffect(() => {
    localStorage.setItem("selectedMandateId", JSON.stringify(selectedMandateId));
  }, [selectedMandateId]);

  return (
    <>
      <ExternalContainer>
        <Container maxWidth="xl">
          {/* {allMandatesData.length > 0 ? (
            <Grid container>
              {allMandatesData?.map((allMandates) => (
                <Grid key={allMandates?.id} xs={12} sm={6} md={3} xl={3}>
                  <Card
                    style={{
                      margin: "4px",
                      borderRadius: "4px",
                      boxShadow:
                        "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Box className={styles.mandateStatus}>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            color: "#fff",
                            fontSize: "0.8rem",
                            margin: "0px 5px",
                            padding: "0px 8px",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            backgroundColor:
                              allMandates?.is_active === 4
                                ? "#8a1538"
                                : allMandates?.is_active === 0
                                ? "#d32f2f"
                                : allMandates?.is_active === 1
                                ? "green"
                                : "grey",
                          }}
                        >
                          {allMandates?.is_active === 4 ? (
                            <FormattedMessage
                              id="admin.allMandate.Rejected"
                              defaultMessage="REJECTED"
                            />
                          ) : allMandates?.is_active === 1 ? (
                            <FormattedMessage id="admin.allMandate.OPEN" defaultMessage="OPEN" />
                          ) : allMandates?.is_active === 0 ? (
                            <FormattedMessage
                              id="admin.allMandate.CLOSED"
                              defaultMessage="CLOSED"
                            />
                          ) : (
                            ""
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    <CardMedia
                      component="img"
                      height="120"
                      src={
                        allMandates?.images?.imageName === "Image-1.png" ||
                        allMandates?.images?.imageName === "Image-2.png" ||
                        allMandates?.images?.imageName === "Image-3.png" ||
                        allMandates?.images?.imageName === "Image-4.png"
                          ? `/Images/${allMandates?.images?.imageName}`
                          : `data:image/PNG;base64,${allMandates?.images?.imageContent}`
                      }
                      alt="Mandate Image"
                    />

                    <CardContent style={{ padding: "10px" }}>
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: "0px",
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
                            maxWidth: "100%",
                          }}
                          gutterBottom
                        >
                          <Tooltip placement="top" title={allMandates?.title}>
                            {allMandates?.title}
                          </Tooltip>
                        </Typography>
                        <Typography
                          sx={{
                            color: "#6A6A6A",
                            fontSize: "0.8rem",

                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                          gutterBottom
                        >
                          <Tooltip placement="top" title={allMandates?.investor?.organization}>
                            {allMandates?.investor?.organization}
                          </Tooltip>
                        </Typography>

                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <EventAvailableIcon
                              style={{ color: "green", fontSize: "16px", marginRight: "2px" }}
                            />

                            <Typography
                              sx={{
                                color: "#6A6A6A",
                                fontSize: "0.7rem",
                                margin: "4px 0px",
                              }}
                            >
                              <Tooltip
                                placement="top"
                                title={
                                  <FormattedMessage
                                    id="admin.allMandate.mandateStartingDate"
                                    defaultMessage="Mandate Starting Date"
                                  />
                                }
                              >
                                <span> {formatDate(allMandates?.startDate)}</span>
                              </Tooltip>
                            </Typography>
                          </Box>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              // flexDirection: "row",
                            }}
                          >
                            {" "}
                            <EventBusyIcon
                              style={{ color: "#8A1538", fontSize: "16px", marginRight: "2px" }}
                            />
                            <Typography
                              sx={{
                                color: "#6A6A6A",
                                margin: "4px 0px",
                                fontSize: "0.7rem",
                              }}
                            >
                              <Tooltip
                                placement="top"
                                title={
                                  <FormattedMessage
                                    id="admin.allMandate.mandateClosingDate"
                                    defaultMessage="Mandate Closing Date"
                                  />
                                }
                              >
                                <span> {formatDate(allMandates?.endDate)}</span>
                              </Tooltip>
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Typography
                        sx={{
                          color: "#6A6A6A",
                          margin: "4px 0px",
                          fontSize: "0.7rem",
                        }}
                      >
                        <FormattedMessage
                          id="admin.allMandate.mandateApprovedOn"
                          defaultMessage="Approved On"
                        />{" "}
                        <span style={{ color: "#6A6A6A", fontWeight: "bold" }}>
                          {formatDate(allMandates?.adminApprovedMandates?.actionTakenOn)}
                        </span>
                      </Typography>
                      <Stack
                        style={{
                          marginTop: "10px",
                        }}
                      >
                        <Button
                          disabled={!isPermitted(permissions.ADMIN_ALLMANDATES_MANDATE_DETAILS)}
                          style={ButtonCss}
                          onClick={() => {
                            onMandateClick(allMandates?.id);
                          }}
                        >
                          <FormattedMessage
                            id="admin.allMandate.mandateDetailsButton.title"
                            defaultMessage="Mandate Details"
                          />
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: "rgba(108, 25, 62, 1)", marginTop: 4 }}
            >
              <FormattedMessage id="noDataMessage" defaultMessage="No data available" />
            </Typography>
          )} */}
          <Grid container justifyContent="flex-end" spacing={1} my={"10px"}>
            <Grid item xs={12} sm={6} md={3} xl={3}>
              <Select
                style={{ background: "#FFFFFF" }}
                size="small"
                fullWidth
                labelId="single-select-label"
                id="single-select"
                value={technology}
                onChange={handleTechnologyChange}
                displayEmpty
              >
                <MenuItem style={{ fontSize: "0.8rem" }} value="">
                  All Technology
                </MenuItem>
                {technologyDetails?.map((option) => (
                  <MenuItem style={{ fontSize: "0.8rem" }} key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={2} xl={2}>
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
                    value={option.countryCode}
                  >
                    {option.country}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={2} xl={2}>
              <Select
                style={{ background: "#FFFFFF", fontSize: "0.8rem" }}
                size="small"
                fullWidth
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={eventStatus}
                onChange={handleStatusChange}
                displayEmpty
              >
                <MenuItem style={{ fontSize: "0.8rem" }} value="">
                  All Status
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value={1}>
                  Open
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value={0}>
                  Closed
                </MenuItem>
                <MenuItem style={{ fontSize: "0.8rem" }} value={4}>
                  Rejected
                </MenuItem>
                {/* <MenuItem style={{ fontSize: "0.8rem" }} value={2}>
                  Incomplete
                </MenuItem> */}
                {/* <MenuItem style={{ fontSize: "0.8rem" }} value={3}>
                  Pending
                </MenuItem> */}
              </Select>
            </Grid>
          </Grid>
          {mandateLoadingState ? (
            <Grid container spacing={2}>
              {Array.from(new Array(12)).map((_, index) => (
                <Grid key={index} item xs={12} sm={6} md={3} xl={3}>
                  <Card
                    style={{
                      margin: "4px",
                      borderRadius: "4px",
                      boxShadow:
                        "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                    }}
                  >
                    <Skeleton variant="rectangular" height={120} />
                    <CardContent>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton
                        variant="rectangular"
                        height={25}
                        width="100%"
                        style={{ marginTop: "10px", borderRadius: "8px" }} // Add border radius here
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : allMandatesData.length === 0 ? (
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "rgba(108, 25, 62, 1)",
                marginTop: 5,
                height: "60vh",
              }}
            >
              <FormattedMessage id="noDataMessage" defaultMessage="No data available" />
            </Typography>
          ) : (
            <Grid container>
              {allMandatesData?.map((allMandates) => (
                <Grid key={allMandates?.id} xs={12} sm={6} md={3} xl={3}>
                  <Card
                    style={{
                      margin: "4px",
                      borderRadius: "4px",
                      boxShadow:
                        "2px 4px 1px rgba(0, 0, 0, 0.04), 4px 2px 3px 2px rgba(0, 0, 0, 0.03)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Box className={styles.mandateStatus}>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            color: "#fff",
                            fontSize: "0.8rem",
                            margin: "0px 5px",
                            padding: "0px 8px",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor:
                              allMandates?.is_active === 1
                                ? "green"
                                : allMandates?.is_active === 2
                                ? "grey"
                                : allMandates?.is_active === 3
                                ? "#68D2E8 !important"
                                : allMandates?.is_active === 4
                                ? "#8a1538"
                                : "#d32f2f !important",
                          }}
                        >
                          {allMandates?.is_active === 4 ? (
                            <FormattedMessage
                              id="allMandate.mandate.status.label1"
                              defaultMessage="REJECTED"
                            />
                          ) : allMandates?.is_active === 1 ? (
                            <FormattedMessage
                              id="allMandate.mandate.status.label2"
                              defaultMessage="OPEN"
                            />
                          ) : allMandates?.is_active === 2 ? (
                            <FormattedMessage
                              id="allMandate.mandate.status.label5"
                              defaultMessage="INCOMPLETE"
                            />
                          ) : allMandates?.is_active === 3 ? (
                            <FormattedMessage
                              id="allMandate.mandate.status.label4"
                              defaultMessage="PENDING APPROVAL"
                            />
                          ) : (
                            <FormattedMessage
                              id="allMandate.mandate.status.label3"
                              defaultMessage="CLOSED"
                            />
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    <CardMedia
                      component="img"
                      height="120"
                      src={
                        allMandates?.images?.imageName === "Image-1.png" ||
                        allMandates?.images?.imageName === "Image-2.png" ||
                        allMandates?.images?.imageName === "Image-3.png" ||
                        allMandates?.images?.imageName === "Image-4.png"
                          ? `/Images/${allMandates?.images?.imageName}`
                          : `data:image/PNG;base64,${allMandates?.images?.imageContent}`
                      }
                      alt="Mandate Image"
                    />

                    <CardContent style={{ padding: "10px" }}>
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: "0px",
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
                            maxWidth: "100%",
                          }}
                          gutterBottom
                        >
                          <Tooltip placement="top" title={allMandates?.title}>
                            {allMandates?.title}
                          </Tooltip>
                        </Typography>
                        <Typography
                          sx={{
                            color: "#6A6A6A",
                            fontSize: "0.8rem",

                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                          gutterBottom
                        >
                          <Tooltip placement="top" title={allMandates?.investor?.organization}>
                            {allMandates?.investor?.organization}
                          </Tooltip>
                        </Typography>

                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <EventAvailableIcon
                              style={{ color: "green", fontSize: "16px", marginRight: "2px" }}
                            />

                            <Typography
                              sx={{
                                color: "#6A6A6A",
                                fontSize: "0.7rem",
                                margin: "4px 0px",
                              }}
                            >
                              <Tooltip
                                placement="top"
                                title={
                                  <FormattedMessage
                                    id="admin.allMandate.mandateStartingDate"
                                    defaultMessage="Mandate Starting Date"
                                  />
                                }
                              >
                                <span> {formattedDate(allMandates?.startDate)}</span>
                              </Tooltip>
                            </Typography>
                          </Box>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              // flexDirection: "row",
                            }}
                          >
                            {" "}
                            <EventBusyIcon
                              style={{ color: "#8A1538", fontSize: "16px", marginRight: "2px" }}
                            />
                            <Typography
                              sx={{
                                color: "#6A6A6A",
                                margin: "4px 0px",
                                fontSize: "0.7rem",
                              }}
                            >
                              <Tooltip
                                placement="top"
                                title={
                                  <FormattedMessage
                                    id="admin.allMandate.mandateClosingDate"
                                    defaultMessage="Mandate Closing Date"
                                  />
                                }
                              >
                                <span> {formattedDate(allMandates?.endDate)}</span>
                              </Tooltip>
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Typography
                        sx={{
                          color: "#6A6A6A",
                          margin: "4px 0px",
                          fontSize: "0.7rem",
                        }}
                      >
                        {allMandates?.adminApprovedMandates?.actionTakenOn !== null &&
                        Object.keys(allMandates?.adminApprovedMandates).length !== 0 ? (
                          <>
                            <FormattedMessage
                              id="admin.allMandate.mandateApprovedOn"
                              defaultMessage="Approved On"
                            />{" "}
                            <span style={{ color: "#6A6A6A", fontWeight: "bold" }}>
                              {formattedDate(allMandates?.adminApprovedMandates?.actionTakenOn)}
                            </span>
                          </>
                        ) : (
                          <span style={{ color: "#6A6A6A", fontWeight: "bold" }}>
                            This mandate is not yet launched.
                          </span>
                        )}
                      </Typography>
                      <Stack
                        style={{
                          marginTop: "10px",
                        }}
                      >
                        <Button
                          disabled={!isPermitted(permissions.ADMIN_ALLMANDATES_MANDATE_DETAILS)}
                          style={ButtonCss}
                          onClick={() => {
                            onMandateClick(allMandates?.id);
                          }}
                        >
                          <FormattedMessage
                            id="admin.allMandate.mandateDetailsButton.title"
                            defaultMessage="Mandate Details"
                          />
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
        {pageCount !== "" || pageCount === 1 ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ my: 2, bgcolor: "#FFFFFF", p: 2 }}
          >
            <Pagination
              count={pageCount}
              showFirstButton
              showLastButton
              page={page}
              onChange={handlePagination}
            />
          </Grid>
        ) : (
          ""
        )}
      </ExternalContainer>
    </>
  );
};
AllMandates.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default AllMandates;
