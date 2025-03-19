import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  useTheme,
  Divider,
  Grid,
  Typography
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { styled } from "@mui/material/styles";
import Filters from "./filters";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import NewTableMainComponent from "./newMainTableComponent";
import { getShortListedStartUpsData } from "src/action/shortListStartUps";
import { shortListStartUpsActions } from "src/store/shortListStartUpsSlice";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
import ConfirmInvitePitchModal from "../SearchStartups/confirmInvitePitchModal";
import { FormattedMessage } from "react-intl";
import { searchStartUpsActions } from "src/store/searchStartupsSlice";
import ScheduleMeeting from "src/components/scheduleMeeting";

const HorizontalAccordion = styled(Accordion)(({ theme }) => ({
  "& .MuiAccordionDetails-root": {
    flexDirection: "row", // Ensures content is displayed horizontally
    transition: "width 0.3s ease-in-out", // Add transition for width change
    overflow: "hidden", // Hide overflow to prevent content from appearing during animation
    width: 0 // Initially hide details
  },
  "&.Mui-expanded": {
    "& .MuiAccordionDetails-root": {
      width: "100%",
      padding: "8px" // Expand details to full width when accordion is expanded
    },
    "& .MuiButtonBase-root": {
      minHeight: "0px"
    }
  },
  "& .MuiAccordionSummary-root": {
    transition: "transform 0.3s ease-in-out",
    transformOrigin: "top right",
    flexDirection: "row-reverse", // Reverses the icon position to the right
    padding: "0px 0px 0px 16px",
    height: "44px"
  }
}));

const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    order: 2 // Content (header text) comes second
  },
  "& .MuiAccordionSummary-expandIcon": {
    order: 1, // Expand icon comes first
    marginRight: 0 // Adjust icon spacing if needed
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    marginRight: "17px" // Adjust the marginLeft as needed
  }
}));

const ShortListStartUps = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStartUpId, setSelectedStartUpId] = useState(0);
  const [page, setPage] = useState(0);
  const [mandatesList, setMandatesList] = useState([]);
  const [checkedMandates, setCheckedMandates] = useState([]);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedStartUp, setSelectedStartUp] = useState({});

  const [expanded, setExpanded] = useState(false);
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;

  const filtersData = useSelector(state => state?.shortListStartUps?.filtersData);

  /** for handling Invite Pitch Card Function */
  useEffect(() => {
    setOpen(false);
    if (Object.keys(filtersData).length) {
      dispatch(getShortListedStartUpsData(filtersData, page + 1, investorId));
    } else {
      dispatch(getShortListedStartUpsData({}, page + 1, investorId));
    }
  }, [filtersData.length, dispatch, investorId, page, filtersData]);

  const filterCollapseValue = useSelector(state => state?.searchStartUps?.collapseValue);
  const shortListStartUpsData = useSelector(
    state => state?.shortListStartUps?.shortListStartUpsData?.data?.startups
  );
  console.log(shortListStartUpsData);
  const shortListStartUpsCount = useSelector(
    state => state?.shortListStartUps?.shortListStartUpsData?.count
  );
  const pageCount = useSelector(
    state => state?.shortListStartUps?.shortListStartUpsData?.pageCount
  );

  const columns = [
    {
      id: 1,
      name: (
        <FormattedMessage
          id="shortListStartUp.table.header.column1"
          defaultMessage="Startup Name"
        />
      ),
      value: "organizationName"
    },
    {
      id: 2,
      name: (
        <FormattedMessage
          id="shortListStartUp.table.header.column2"
          defaultMessage="Mandate Name"
        />
      ),
      value: "eventName"
    },
    {
      id: 3,
      name: (
        <FormattedMessage id="shortListStartUp.table.header.column3" defaultMessage="Country" />
      ),
      value: "country"
    },
    {
      id: 4,
      name: <FormattedMessage id="shortListStartUp.table.header.column4" defaultMessage="City" />,
      value: "city"
    },
    {
      id: 5,
      name: (
        <FormattedMessage
          id="shortListStartUp.table.header.column5"
          defaultMessage="Employee Count"
        />
      ),
      value: "employeeCount"
    },
    {
      id: 6,
      name: (
        <FormattedMessage
          id="shortListStartUp.table.header.column6"
          defaultMessage="Last Funding"
        />
      ),
      value: "pastFunding"
    },
    {
      id: 7,
      name: (
        <FormattedMessage id="shortListStartUp.table.header.column7" defaultMessage="Website" />
      ),
      value: "domain"
    },
    {
      id: 8,
      name: (
        <FormattedMessage id="shortListStartUp.table.header.column8" defaultMessage="Technology" />
      ),
      value: "technologyName"
    },
    {
      id: 9,
      name: (
        <FormattedMessage
          id="shortListStartUp.table.header.column9"
          defaultMessage="StartUp Stage"
        />
      ),
      value: "startupStageName"
    }
  ];

  const handelSubmit = (checkedMandatesList, startUpsId) => {
    setOpenModal(true);
    setSelectedStartUpId(startUpsId);
    setMandatesList(checkedMandatesList);
  };

  const handelScheduleMeeting = startUpData => {
    setScheduleModal(true);
    dispatch(
      shortListStartUpsActions.scheduleMeeting({
        scheduleMeetingResponse: {}
      })
    );
    setSelectedStartUp(startUpData);
  };

  const handleChange = () => {
    setExpanded(!expanded);
  };
  const theme = useTheme();

  /**
   * updating the  redux store filterCollapse value on local value change
   * */
  // useEffect(() => {
  //   if (expanded === false && filterCollapseValue === false) {
  //     dispatch(
  //       searchStartUpsActions.fetchSideCollapseValue({
  //         collapseValue: true,
  //       })
  //     );
  //   }
  // }, [dispatch, expanded]);

  /**
   * updating the local state value of filters on redux store value change
   * */
  // useEffect(() => {
  //   if (filterCollapseValue === true) {
  //     setExpanded(false);
  //   }
  // }, [filterCollapseValue]);
  console.log("selectedStartUp", selectedStartUp);

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: "rgba(65, 148, 179,0.1) !important"
        }}
      >
        <Container maxWidth="xl" style={{ paddingRight: "0px", paddingLeft: "0px" }}>
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
                height: "88vh"
              }}
            >
              <Grid
                item
                md={2}
                style={{
                  width: expanded === true ? "300px" : "30px",
                  borderRadius: "0px"
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
                            padding: "10px"
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
                          height: "82vh"
                        }}
                      >
                        <Filters setPage={setPage} />
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
                          fontSize: "20px"
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
                  width: expanded === true ? "calc(100% - 300px)" : "96%",
                  height: "88%"
                  // overflowY: "scroll"
                }}
              >
                <NewTableMainComponent
                  columns={columns}
                  expanded={expanded}
                  data={shortListStartUpsData?.length > 0 ? shortListStartUpsData : []}
                  count={shortListStartUpsCount}
                  page={page}
                  setPage={setPage}
                  setOpen={setOpen}
                  open={open}
                  handelSubmit={handelSubmit}
                  checkedMandates={checkedMandates}
                  setCheckedMandates={setCheckedMandates}
                  handelScheduleMeeting={handelScheduleMeeting}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* <ScheduleMeetingModal
            scheduleModal={scheduleModal}
            setScheduleModal={setScheduleModal}
            selectedStartUp={selectedStartUp}
          /> */}
          <ScheduleMeeting
            meetingDialog={scheduleModal}
            setMeetingDialog={setScheduleModal}
            startupProfile={selectedStartUp}
          />
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
    </>
  );
};
ShortListStartUps.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default ShortListStartUps;
