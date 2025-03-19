// import * as React from "react";
// import PropTypes from "prop-types";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import { Divider, useMediaQuery, useTheme } from "@mui/material";
// import CancelIcon from "@mui/icons-material/Cancel";
// import Startup from "./Startup";
// import Investor from "./Investor";
// import { useEffect } from "react";
// import { getCountryNumberCode } from "src/action/globalApi";
// import { useDispatch } from "react-redux";
// import Individual from "./individual";
// import { FormattedMessage } from "react-intl";

// function CustomTabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ padding: "0px 15px" }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// CustomTabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// export default function BasicTabs({ value, setValue, setDialogOpen, onClose, selectedCardTitle }) {
//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (selectedCardTitle !== undefined) {
//       if (selectedCardTitle === 2) {
//         setValue(1);
//       } else {
//         setValue(0);
//       }
//     }
//     dispatch(getCountryNumberCode());
//   }, [dispatch, selectedCardTitle, setValue]);

//   const tabStyles = (isActive) => ({
//     background: isActive ? "#8A1538" : "",
//     color: isActive ? "#fff" : "#8A1538",
//     padding: isActive ? "4px 20px" : "4px 20px",
//     fontSize: "0.7rem",
//     borderRadius: "0px",
//     margin: "0px",
//     minHeight: "0px",
//   });

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Box style={{ display: "flex", justifyContent: "flex-end" }} onClick={() => onClose()}>
//         <CancelIcon
//           sx={{ fontSize: "1.2rem" }}
//           color="disabled"
//           style={{ cursor: "pointer", width: "40px", marginTop: "10px" }}
//         />
//       </Box>
//       <Box
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <h2 style={{ margin: "3px 0px", fontSize: isSmallScreen ? "18px" : "24px" }}>
//           <FormattedMessage id="homepage.welcome.tag" defaultMessage="Welcome" />
//         </h2>
//         {/* <h5 style={{ margin: "3px 0px 20px 0px", fontSize: "0.6rem" }}>
//           Please Login to your account
//         </h5> */}
//       </Box>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           padding: "0px",
//           height: "100%",
//         }}
//       >
//         <Tabs
//           textColor="secondary"
//           value={value}
//           onChange={handleChange}
//           aria-label="basic tabs example"
//           indicatorColor="none"
//           orientation={isSmallScreen ? "vertical" : "horizontal"}
//           sx={{
//             border: "1px solid #8A1538",
//             // background: "#8A1538",
//             minHeight: "0px",
//             borderRadius: "5px",
//             "& .MuiTabs-indicator": {
//               display: "none",
//             },
//             padding: "0px",
//           }}
//         >
//           <Tab
//             style={tabStyles(value === 0)}
//             sx={{
//               borderRight: isSmallScreen ? "" : "1px solid #8A1538",
//               borderBottom: isSmallScreen ? "1px solid #8A1538" : "",
//             }}
//             label={
//               <FormattedMessage id="dailogbox.homepage.individual" defaultMessage="Invdividual" />
//             }
//             {...a11yProps(0)}
//           />
//           <Tab
//             style={tabStyles(value === 1)}
//             sx={{
//               borderRight: isSmallScreen ? "" : "1px solid #8A1538",
//               borderBottom: isSmallScreen ? "1px solid #8A1538" : "",
//             }}
//             label={<FormattedMessage id="dailogbox.homepage.startup" defaultMessage="Startup" />}
//             {...a11yProps(1)}
//           />
//           <Tab
//             style={tabStyles(value === 2)}
//             label={
//               <FormattedMessage
//                 id="dailogbox.homepage.investor"
//                 defaultMessage="Investor/ Enterprise"
//               />
//             }
//             {...a11yProps(2)}
//           />
//         </Tabs>
//       </Box>
//       <CustomTabPanel style={{ padding: "0px" }} value={value} index={0}>
//         <Individual setDialogOpen={setDialogOpen} />
//       </CustomTabPanel>
//       <CustomTabPanel style={{ padding: "0px" }} value={value} index={1}>
//         <Startup setDialogOpen={setDialogOpen} />
//       </CustomTabPanel>
//       <CustomTabPanel value={value} index={2}>
//         <Investor setDialogOpen={setDialogOpen} />
//       </CustomTabPanel>
//     </Box>
//   );
// }

// import { useTheme } from "@emotion/react";
// import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
// import React from "react";
// import { FormattedMessage } from "react-intl";
// import Registration from "../Registration";
// import Login from "../Login";
// import PropTypes from "prop-types";

// function CustomTabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ padding: "0px 15px" }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// CustomTabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// const BasicTabs = ({ value, setValue, setDialogOpen }) => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const tabStyles = (isActive) => ({
//     background: isActive ? "#8A1538" : "",
//     color: isActive ? "#fff" : "#8A1538",
//     padding: isActive ? "4px 20px" : "4px 20px",
//     fontSize: "1rem",
//     borderRadius: "0px",
//     margin: "0px",
//     minHeight: "0px",
//   });
//   return (
//     <Box sx={{ p: 2 }}>
//       <Tabs
//         textColor="secondary"
//         value={value}
//         onChange={handleChange}
//         aria-label="basic tabs example"
//         indicatorColor="none"
//         orientation="horizontal"
//         sx={{
//           border: "1px solid #8A1538",
//           minHeight: "0px",
//           borderRadius: "5px",
//           "& .MuiTabs-indicator": {
//             display: "none",
//           },
//           padding: "0px",
//         }}
//       >
//         <Tab
//           style={tabStyles(value === 0)}
//           sx={{
//             borderRight: isSmallScreen ? "" : "1px solid #8A1538",
//             borderBottom: isSmallScreen ? "1px solid #8A1538" : "",
//           }}
//           label={<FormattedMessage id="dailogbox.homepage.login" defaultMessage="LOGIN" />}
//           {...a11yProps(0)}
//         />
//         <Tab
//           style={tabStyles(value === 1)}
//           sx={{
//             borderRight: isSmallScreen ? "" : "1px solid #8A1538",
//             borderBottom: isSmallScreen ? "1px solid #8A1538" : "",
//           }}
//           label={<FormattedMessage id="dailogbox.homepage.register" defaultMessage="REGISTER" />}
//           {...a11yProps(1)}
//         />
//       </Tabs>
//       <CustomTabPanel style={{ padding: "0px" }} value={value} index={0}>
//         <Login setDialogOpen={setDialogOpen} />
//       </CustomTabPanel>

//       <CustomTabPanel style={{ padding: "0px" }} value={value} index={1}>
//         <Registration setDialogOpen={setDialogOpen} />
//       </CustomTabPanel>
//     </Box>
//   );
// };

// export default BasicTabs;

import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import StartupLogin from "./Login/StartupLogin";
import StartupSignup from "./Signup/StartupSignup";
import Grid2 from "@mui/material/Unstable_Grid2";
import CancelIcon from "@mui/icons-material/Cancel";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getCountryNumberCode } from "src/action/globalApi";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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

export default function BasicTabs({ onClose, setDialogOpen }) {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  useEffect(() => {
    dispatch(getCountryNumberCode());
  }, [dispatch]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabStyles = (isActive) => ({
    background: isActive ? "#8A1538" : "",
    color: isActive ? "#fff" : "#8A1538",
    padding: "4px 20px",
    fontSize: "1rem",
    fontWeight: "700",
    borderRadius: "0px",
    margin: "0px",
    minHeight: "0px",
    border: "1px solid #8A1538",
    borderRadius: "5px",
    marginLeft: "10px",
  });
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          pt: 2,
          pr: 1,
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
        }}
      >
        <Grid2 container justifyContent="space-between">
          <Typography sx={{ px: 1, fontWeight: "700", color: "grey" }}>Welcome Back !</Typography>{" "}
          <CancelIcon
            sx={{
              cursor: "pointer",
              marginLeft: "20px",
              color: "grey",
              marginBottom: "15px",
            }}
            onClick={onClose}
          />
        </Grid2>

        <Tabs
          indicatorColor="none"
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab style={tabStyles(value === 0)} label="LOGIN" {...a11yProps(0)} />
          <Tab style={tabStyles(value === 1)} label="SIGNUP" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <StartupLogin />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <StartupSignup setDialogOpen={setDialogOpen} />
      </CustomTabPanel>
    </Box>
  );
}
