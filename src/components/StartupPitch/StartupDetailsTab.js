import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Overview from "./Overview";
import Team from "./Team";
import Question from "./Question";
import Document from "./Document";
import { FormattedMessage } from "react-intl";
import Subscription from "./Subscription";
import { getButtonCss, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

export default function StartupDetailsTab({
  value,
  setValue,
  profileOverviewData,
  seniorTeamMember,
  documentList,
  questionsList,
  newProfile,
  pitchingDisable
}) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function to switch to the next tab
  const switchToNextTab = () => {
    const nextTab = (value + 1) % 5;
    setValue(nextTab);
  };
  const switchToPreviousTab = () => {
    const previousTab = (value - 1) % 5;
    setValue(previousTab);
  };

  return (
    <Box sx={{ width: "100%", background: "#FFFFFF", borderRadius: "8px" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          overflowX: { xs: "auto", sm: "hidden" }, // Enable horizontal scrolling on xs
          width: "100%"
        }}
      >
        <Box sx={{ display: "flex", minWidth: "max-content" }}>
          <Tabs
            textColor="secondary"
            indicatorColor="transparent"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              width: "100%",
              background: "white",
              paddingTop: "10px",
              paddingRight: "20px",
              "& .MuiTabs-flexContainer": {
                "& .Mui-selected": {
                  background: "rgba(138, 21, 56, 0.15)",
                  color: "rgba(108, 25, 62, 1)",
                  padding: "10px",
                  borderRadius: "10px"
                },
                "&:hover": {
                  backgroundColor: "inherit"
                }
              }
            }}
          >
            {/* {isPermitted(permissions.STARTUP_MANDATE_PITCH_OVERVIEW_TAB) ? ( */}
            <Tab
              style={{ marginLeft: "20px" }}
              label={
                <FormattedMessage
                  id="startupDetails.overViewTab.header"
                  defaultMessage="Overview"
                />
              }
              {...a11yProps(0)}
            />
            {/* ) : null} */}
            {/* {isPermitted(permissions.STARTUP_MANDATE_PITCH_TEAM_TAB) ? ( */}
            <Tab
              label={<FormattedMessage id="startupDetails.teamTab.header" defaultMessage="Team" />}
              {...a11yProps(1)}
            />
            {/* ) : null} */}
            {/* {isPermitted(permissions.STARTUP_MANDATE_PITCH_DOCUMENTS_TAB) ? ( */}
            <Tab
              label={
                <FormattedMessage id="startupDetails.documents.header" defaultMessage="Documents" />
              }
              {...a11yProps(2)}
            />
            {/* ) : null} */}
            {!newProfile && (
              <Tab
                label={
                  <FormattedMessage
                    id="startupDetails.quickQuestion.header"
                    defaultMessage="Quick Question"
                  />
                }
                {...a11yProps(3)}
              />
            )}
            {/* {newProfile && (
            <Tab
              label={
                <FormattedMessage
                  id="startupDetails.Subscription.header"
                  defaultMessage="Manage Subscription"
                />
              }
              {...a11yProps(newProfile ? 3 : 4)}
            />
          )} */}
          </Tabs>
        </Box>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Overview
          profileOverviewData={profileOverviewData}
          setTab={setValue}
          pitchingDisable={pitchingDisable}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Team
          seniorTeamMember={seniorTeamMember}
          switchToNextTab={switchToNextTab}
          switchToPreviousTab={switchToPreviousTab}
          pitchingDisable={pitchingDisable}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <Document
          switchToNextTab={newProfile ? null : switchToNextTab}
          switchToPreviousTab={switchToPreviousTab}
          documentList={documentList}
          newProfile={newProfile}
          pitchingDisable={pitchingDisable}
        />
      </CustomTabPanel>
      {!newProfile && (
        <CustomTabPanel value={value} index={3}>
          <Question switchToPreviousTab={switchToPreviousTab} questionsList={questionsList} />
        </CustomTabPanel>
      )}

      {/* {newProfile && (
        <CustomTabPanel value={value} index={newProfile ? 3 : 4}>
          <Subscription
          // switchToPreviousTab={switchToPreviousTab}
          //    questionsList={questionsList}
          />
        </CustomTabPanel>
      )} */}
    </Box>
  );
}
