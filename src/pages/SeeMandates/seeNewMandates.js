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
  Divider,
  Unstable_Grid2 as Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  mandateTypeDetails,
  newMandatesCount,
  seeNewMandate,
  startupStageTypeDetails,
  technologyDetails,
} from "src/action/seeNewMandate";
import styles from "./seeNewMandate.module.css";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import { useRouter } from "next/navigation";
import ExternalContainer from "src/components/ExternalContainer";
import { FormattedMessage } from "react-intl";
import NoDataMsg from "src/components/NoDataMsg";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import PlaceIcon from "@mui/icons-material/Place";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import { getCountries, startupSubscriptionLimitCheck } from "src/action/globalApi";
import { getButtonCss, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import { SWEETALERT } from "src/components/sweetalert2";

const SeeNewMandates = () => {
  const ButtonCss = getButtonCss();
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedMandateId, setSelectedMandateId] = useState({});
  const [page, setPage] = useState(1);
  // const [pageCount, setPageCount] = useState("");
  const [mandateType, setMandateType] = useState("");
  const [technologyType, setTechnologyType] = useState("");
  const [startupStageType, setStartupStageType] = useState("");
  const countryData = useSelector((state) => state.globalApi.countries);

  /*
   * API CALL
   */

  const storedUserDetails = localStorage.getItem("userDetails");
  let startupId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const userId = startupId?.id;
  startupId = startupId?.startupId;

  let location = useSelector((state) => state.globalApi.location);
  const countrys = location?.country_code3;

  const [country, setCountry] = useState("");

  const mandateModule = "pitches_limit";

  const [isAlertShown, setIsAlertShown] = useState(false);
  useEffect(() => {
    dispatch(getCountries());
    dispatch(mandateTypeDetails());
    dispatch(technologyDetails());
    dispatch(startupStageTypeDetails());
  }, []);

  useEffect(() => {
    let isMounted = true; // To check if the component is still mounted
    let requestCounter = 0; // Track the number of API requests

    const checkStartupSubscriptionLimit = async () => {
      const currentRequest = ++requestCounter; // Increment the request counter

      dispatch(startupSubscriptionLimitCheck(userId, mandateModule)).then((res) => {
        if (isMounted && currentRequest === requestCounter) {
          if (res?.status === false && !isAlertShown) {
            setIsAlertShown(true);
            SWEETALERT({
              text: "Your pitching limit has been reached. Please upgrade your plan to continue!",
            });
          }
        }
      });
    };

    checkStartupSubscriptionLimit();

    // Cleanup function to avoid memory leaks
    return () => {
      isMounted = false;
    };
  }, [dispatch, isAlertShown, userId, mandateModule]);

  useEffect(() => {
    if (countrys !== undefined) {
      setCountry(countrys); // Set the default country value
    }
  }, [countrys]);

  useEffect(() => {
    // dispatch(getCountries());
    // dispatch(mandateTypeDetails());
    // dispatch(technologyDetails());
    // dispatch(startupStageTypeDetails());
    // if (country)
    if (country !== undefined) {
      dispatch(
        seeNewMandate(startupId, page, technologyType, startupStageType, mandateType, country)
      );
    }

    // dispatch(newMandatesCount(startupId)).then((res) => {
    //   setPageCount(res?.pagesCount);
    // });
  }, [dispatch, startupId, page, country, mandateType, technologyType, startupStageType, userId]);

  const mandateTypeDetail = useSelector((state) => state?.seeNewMandate?.mandateType?.data);
  const technologyTypeDetail = useSelector((state) => state?.seeNewMandate?.technologyType);
  const startupStageTypeDetail = useSelector(
    (state) => state?.seeNewMandate?.startupStageType?.data
  );

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    console.log(event);
  };
  const handleMandateTypeChange = (event) => {
    setMandateType(event.target.value);
  };
  const handleTechnologyTypeChange = (event) => {
    setTechnologyType(event.target.value);
  };
  const handleStartupStageTypeChange = (event) => {
    setStartupStageType(event.target.value);
  };
  /*
   *UseSelector used to get data from redux store
   */
  let mandatesData = useSelector((state) => state?.seeNewMandate);

  const limit = mandatesData?.newMandate?.limit;
  const total = mandatesData?.newMandate?.total;

  const pageCount = Math.ceil(total / limit);

  const onEdit = (mandate) => {
    setSelectedMandateId(mandate?.id);
    router.push("./SeeMandates/mandateDetails");
  };

  /**
   * Used UseEffect Hooks to store the data of Selected MandateId in local Storage.
   */
  useEffect(() => {
    localStorage.setItem("selectedMandateId", JSON.stringify(selectedMandateId));
  }, [selectedMandateId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month.padStart(2, "0");
    const paddedDay = day.padStart(2, "0");

    return `${paddedDay}/${paddedMonth}/${year}`;
  };

  const handlePagination = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <ExternalContainer>
        <Grid container justifyContent="start" spacing={1}>
          <Grid item xs={6} sm={6} md={2} xl={2}>
            <InputLabel id="demo-simple-select-label">
              {/* <FormattedMessage id="allMandate.filter.label1" defaultMessage="Country" /> */}
            </InputLabel>
            <Select
              style={{ background: "#FFFFFF" }}
              size="small"
              fullWidth
              labelId="single-select-label"
              id="single-select"
              value={mandateType}
              onChange={handleMandateTypeChange}
              displayEmpty
            >
              <MenuItem style={{ fontSize: "0.8rem" }} value="">
                <FormattedMessage
                  id="newMandates.card.mandateType.title"
                  defaultMessage=" Mandate Type"
                />
              </MenuItem>
              {mandateTypeDetail?.map((option) => (
                <MenuItem style={{ fontSize: "0.8rem" }} key={option.id} value={option.id}>
                  {option?.mandate_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} sm={6} md={3} xl={3}>
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
                <FormattedMessage
                  id="newMandates.card.areaOfInterest.title"
                  defaultMessage="Area of Interest"
                />
              </MenuItem>
              {technologyTypeDetail?.map((option) => (
                <MenuItem style={{ fontSize: "0.8rem" }} key={option.id} value={option.id}>
                  {option?.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} sm={6} md={2} xl={2}>
            <InputLabel id="demo-simple-select-label">
              {/* <FormattedMessage id="allMandate.filter.label1" defaultMessage="Country" /> */}
            </InputLabel>
            <Select
              style={{ background: "#FFFFFF" }}
              size="small"
              fullWidth
              labelId="single-select-label"
              id="single-select"
              value={startupStageType}
              onChange={handleStartupStageTypeChange}
              displayEmpty
            >
              <MenuItem style={{ fontSize: "0.8rem" }} value="">
                <FormattedMessage
                  id="newMandates.card.startupStage.title"
                  defaultMessage=" Startup Stage"
                />
              </MenuItem>
              {startupStageTypeDetail?.map((option) => (
                <MenuItem style={{ fontSize: "0.8rem" }} key={option.id} value={option.stage_name}>
                  {option?.stage_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} sm={6} md={2} xl={2}>
            <InputLabel id="demo-simple-select-label">
              {/* <FormattedMessage id="allMandate.filter.label1" defaultMessage="Country" /> */}
            </InputLabel>
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
                <FormattedMessage
                  id="newMandates.card.country.title"
                  defaultMessage="All Country"
                />
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
        </Grid>
        {mandatesData?.newMandateloading ? (
          <Grid container spacing={2} padding={0} marginTop={1}>
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
        ) : mandatesData?.newMandate?.data?.length > 0 ? (
          <Grid container justifyContent="flex-start">
            {mandatesData?.newMandate?.data?.map((mandate) => (
              <Grid key={mandate?.id} xs={12} sm={6} md={3} xl={3}>
                <Card
                  style={{
                    margin: "14px 4px",
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
                          background:
                            mandate.is_active === 0 ? "#8a1538 !important" : "green !important",
                          padding: "0px 8px",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {mandate.is_active === 0 ? (
                          <FormattedMessage
                            id="newMandates.card.closeStatus"
                            defaultMessage=" CLOSED"
                          />
                        ) : (
                          <FormattedMessage
                            id="newMandates.card.openStatus"
                            defaultMessage="Application Open"
                          />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <CardMedia
                    component="img"
                    height="120"
                    src={
                      mandate?.images?.imageName === "Image-1.png" ||
                      mandate?.images?.imageName === "Image-2.png" ||
                      mandate?.images?.imageName === "Image-3.png" ||
                      mandate?.images?.imageName === "Image-4.png"
                        ? `/Images/${mandate?.images?.imageName}`
                        : `data:image/PNG;base64,${mandate?.images?.imageContent}`
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
                        height: "100px",
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
                            maxWidth: "90%",
                          }}
                          gutterBottom
                        >
                          <Tooltip placement="top" title={mandate?.title}>
                            {mandate?.title}
                          </Tooltip>
                        </Typography>
                      </Stack>
                      <Stack
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Tooltip title={` ${mandate?.country}`} placement="top">
                          <Typography
                            style={{
                              fontSize: "0.7rem",
                              color: "#6A6A6A",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "90%",

                              // marginLeft: "20px",
                            }}
                            variant="body2"
                          >
                            {mandate?.country?.map((data, index) => (
                              <span key={index}>
                                {data}
                                {index < mandate?.country?.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </Typography>
                        </Tooltip>
                      </Stack>

                      <Typography style={{ fontSize: "0.8rem", color: "#8A1538" }}>
                        <Tooltip placement="top" title="Organization Name">
                          {mandate?.investor?.organization}
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
                            // flexDirection: "column",
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
                            {/* <FormattedMessage
                                id="newMandates.card.launched.title"
                                defaultMessage="Launched"
                              /> */}
                            <Tooltip
                              placement="top"
                              title={
                                <FormattedMessage
                                  id="newMandates.card.launchedOn.title"
                                  defaultMessage="Launched On"
                                />
                              }
                            >
                              <span>{formatDate(mandate?.startDate)}</span>
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
                            {/* <FormattedMessage
                                id="newMandates.card.closing.title"
                                defaultMessage="Closing"
                              />{" "} */}
                            <Tooltip
                              placement="top"
                              title={
                                <FormattedMessage
                                  id="newMandates.card.closingOn.title"
                                  defaultMessage="Closing On"
                                />
                              }
                            >
                              <span> {formatDate(mandate?.endDate)}</span>
                            </Tooltip>
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* <Divider style={{ margin: "10px", borderWidth: "1.5px" }} variant="middle" /> */}
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: "0px",
                        alignItems: "center",
                      }}
                    >
                      <Stack>
                        <Typography
                          sx={{ fontSize: "0.7rem", color: "#8A1538", fontWeight: "600" }}
                          gutterBottom
                        >
                          <FormattedMessage
                            id="newMandates.card.areaOfInterest.title"
                            defaultMessage="Area of Interest"
                          />{" "}
                        </Typography>
                        <Tooltip
                          placement="top"
                          title={mandate?.technologies?.map((tech) => tech.name).join(", ")}
                        >
                          <Typography style={{ fontSize: "0.7rem", color: "#6A6A6A" }}>
                            {mandate?.othersTech !== null
                              ? mandate?.othersTech
                              : mandate?.technologies.length > 0
                              ? mandate?.technologies?.map((tech) => tech.name).join(", ")
                              : "-"}
                          </Typography>
                        </Tooltip>
                      </Stack>
                    </Box>
                    {isPermitted(permissions.STARTUP_MANDATE_VIEW_DETAILS) ? (
                      <Stack
                        style={{
                          marginTop: "10px",
                        }}
                      >
                        <Button
                          style={ButtonCss}
                          onClick={() => {
                            onEdit(mandate);
                          }}
                        >
                          <FormattedMessage
                            id="newMandates.card.mandateDetailsButton.title"
                            defaultMessage="Mandate Details"
                          />{" "}
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ArrowRightAltIcon />
                          </span>
                        </Button>
                      </Stack>
                    ) : null}
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ my: 2, bgcolor: "#FFFFFF", p: 2, width: "100%" }}
            >
              <Pagination
                page={page}
                count={pageCount}
                showFirstButton
                showLastButton
                onChange={handlePagination}
              />
            </Grid>
          </Grid>
        ) : (
          <NoDataMsg message={"There are no mandates to show."} />
        )}
      </ExternalContainer>
    </>
  );
};

SeeNewMandates.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SeeNewMandates;
