import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Overview from "./Overview";
import Document from "../../../components/StartupPitch/Document";
import { FormattedMessage } from "react-intl";
import Subscription from "./Subscription";

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
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function InvestorTab({
  value,
  setValue,
  //   profileOverviewData,
  //   seniorTeamMember,
  documentList,
  //   questionsList,
  newProfile,
}) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function to switch to the next tab
  const switchToNextTab = () => {
    const nextTab = (value + 1) % 4;
    setValue(nextTab);
  };
  const switchToPreviousTab = () => {
    const previousTab = (value - 1) % 4;
    setValue(previousTab);
  };

  const flow = "investorFlow";

  return (
    <Box sx={{ width: "100%", background: "#FFFFFF", borderRadius: "8px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          textColor="secondary"
          indicatorColor="transparent"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            width: "100%",
            background: "white",
            padding: "10px 20px 0 20px",

            "& .MuiTabs-flexContainer": {
              display: "flex",
              gap: "10px",
              "& .Mui-selected": {
                background: "rgba(138, 21, 56, 0.15)",
                color: "rgba(108, 25, 62, 1)",
                padding: "10px",
                borderRadius: "10px",
              },
              "&:hover": {
                backgroundColor: "inherit",
              },
            },
          }}
        >
          <Tab
            label={
              <FormattedMessage id="startupDetails.overViewTab.header" defaultMessage="Overview" />
            }
            {...a11yProps(0)}
          />
          {/* <Tab
            label={<FormattedMessage id="startupDetails.teamTab.header" defaultMessage="Team" />}
            {...a11yProps(1)}
          /> */}
          <Tab
            label={
              <FormattedMessage id="startupDetails.documents.header" defaultMessage="Documents" />
            }
            {...a11yProps(1)}
          />

          {/* <Tab
            label={
              <FormattedMessage
                id="startupDetails.Subscription.header"
                defaultMessage="Manage Subscription"
              />
            }
            {...a11yProps(2)}
          /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Overview
          // profileOverviewData={profileOverviewData}
          setTab={setValue}
        />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={1}>
        <Team
          //   seniorTeamMember={seniorTeamMember}
          switchToNextTab={switchToNextTab}
          switchToPreviousTab={switchToPreviousTab}
        />
      </CustomTabPanel> */}
      <CustomTabPanel value={value} index={1}>
        <Document
          switchToNextTab={switchToNextTab}
          switchToPreviousTab={switchToPreviousTab}
          documentList={documentList}
          newProfile={newProfile}
          flow={flow}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <Subscription
          switchToPreviousTab={switchToPreviousTab}
          //    questionsList={questionsList}
        />
      </CustomTabPanel>
    </Box>
  );
}
