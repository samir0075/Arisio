/* eslint-disable react-hooks/rules-of-hooks */
import React, { use, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { getButtonCss, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";
import {
  Autocomplete,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
  Typography,
  FormHelperText,
  Tooltip,
  Divider,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { searchStartUpsActions } from "src/store/searchStartupsSlice";
import { useRouter } from "next/router";
import { getCategories, getCity, getCountries, getTechnologies } from "src/action/globalApi";
import {
  getSelectedStartUpsData,
  getStartUpsData,
  getStartUpsDataByName,
} from "src/action/searchStartups";
import { FormattedMessage, useIntl } from "react-intl";
import { shortListStartUpsActions } from "src/store/shortListStartUpsSlice";
import { getStartupStageType } from "src/action/investorProfileStepper";

// Custom styles to ensure responsive design
const customStyles = {
  mainContainer: {
    flexGrow: 1,
    p: 2,
    background: "rgba(65, 148, 179,0.1) !important",
  },
  paper: {
    padding: "4px",
  },
  title: {
    textAlign: "left",
    fontSize: "15px",
    margin: "2px 2px",
  },
};

const filters = ({ setPage }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  const [selected_Country, setSelected_Country] = useState();
  const [selectedTechnology, setSelectedTechnology] = useState();
  const [selectedStartupStage, setSelectedStartupStage] = useState();
  const [selectedData, setSelectedData] = useState();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;

  const customFiltersLabel = {
    fontSize: "14px",
    marginBottom: "7px",
    marginRight: "5px",
    marginTop: "7px",
  };

  /** Function for Search by By Companies Filter Card */
  const handleClickedByApplyFilters = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObj = Object.fromEntries(formData.entries());
    const modifiedData = {
      country:
        formDataObj?.country !== ""
          ? [
              {
                name: selectedData?.props?.value,
                fullName: selectedData?.props?.children,
              },
            ]
          : [],
      ...formDataObj,
    };
    dispatch(shortListStartUpsActions.setLoading(true));
    dispatch(
      shortListStartUpsActions.setFilters({
        filtersData: modifiedData,
      })
    );
    setSelectedData();
  };

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getTechnologies());
    dispatch(getStartupStageType());
  }, [dispatch]);

  const countryData = useSelector((state) => state.globalApi.countries);
  const technologiesData = useSelector((state) => state.globalApi.technologies);
  const startupStageType = useSelector((state) => state?.investorProfileStepper.startupStageType);

  const theme = useTheme();

  return (
    <>
      <Grid item xs={12} sx={customStyles.paper}>
        <Typography variant="h6" sx={customStyles.title}>
          <FormattedMessage
            id="addFilterModal.card.heading"
            defaultMessage="Search By companies's filter"
          />{" "}
        </Typography>
        <form onSubmit={handleClickedByApplyFilters}>
          <Grid container direction={"column"}>
            <Grid item>
              <Typography style={customFiltersLabel}>
                <FormattedMessage id="filterModal.card3.country.label" defaultMessage="Country" />
              </Typography>

              <Select
                name="country"
                value={selected_Country || ""}
                onChange={(r, selected) => {
                  setSelectedData(selected);
                  setSelected_Country(r?.target?.value);
                }}
                displayEmpty
                style={{
                  borderRadius: 5,
                  maxHeight: "41px",
                  border: " 1px solid grey",
                  width: "100%",
                  color: selected_Country === undefined ? "gray" : "black",
                  // marginRight: isRTL && !isSmallScreen ? "280px" : "0px",
                }}
              >
                <MenuItem value="">
                  <FormattedMessage
                    id="addFilterModal.card.select.country.placeholder"
                    defaultMessage="Select your country"
                  />
                </MenuItem>
                {countryData.map((option) => (
                  <MenuItem
                    style={{ width: "30px", top: "8px" }}
                    key={option.countryCode}
                    value={option.countryCode}
                  >
                    {option.country}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Typography style={customFiltersLabel}>
                <FormattedMessage
                  id="addFilterModal.card.technology.label"
                  defaultMessage="Technology"
                />
              </Typography>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Select
                name="spaceId"
                value={selectedTechnology || ""}
                onChange={(r) => setSelectedTechnology(r?.target?.value)}
                displayEmpty
                sx={{
                  width: "100%",
                  maxHeight: "37px",
                  borderRadius: "5px",
                  border: " 1px solid grey",
                  color: selectedTechnology === undefined ? "gray" : "black",
                }}
              >
                <MenuItem value="">
                  <FormattedMessage
                    id="addFilterModal.card.select.technology.placeholder"
                    defaultMessage="Select your technology"
                  />
                </MenuItem>
                {technologiesData?.map((option) => (
                  <MenuItem style={{ width: "30px", top: "8px" }} key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Typography style={customFiltersLabel}>
                <FormattedMessage
                  id="addFilterModal.card.startUp.label"
                  defaultMessage="StartUp Stage"
                />
              </Typography>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Select
                name="startupStage"
                value={selectedStartupStage || ""}
                onChange={(r) => setSelectedStartupStage(r?.target?.value)}
                displayEmpty
                sx={{
                  width: "100%",
                  maxHeight: "37px",
                  borderRadius: "5px",
                  border: " 1px solid grey",
                  color: selectedStartupStage === undefined ? "gray" : "black",
                }}
              >
                <MenuItem value="">
                  <FormattedMessage
                    id="addFilterModal.card.select.startUp.placeholder"
                    defaultMessage="Select startup stage"
                  />{" "}
                </MenuItem>
                {startupStageType?.map((option) => (
                  <MenuItem style={{ width: "30px", top: "8px" }} key={option.id} value={option.id}>
                    {option.stage_name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {isPermitted(permissions.INVESTOR_SHORTLIST_STARTUP_APPLY_FILTER) ? (
              <Grid item xs={2} sm={2} style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  size="small"
                  type="submit"
                  style={{
                    backgroundColor:
                      selectedStartupStage !== undefined ||
                      selectedTechnology !== undefined ||
                      selected_Country !== undefined
                        ? "rgba(138, 21, 56, 1)"
                        : "rgb(138 21 56 / 46%)",
                    color: "#ffffff",
                    verticalAlign: "center",
                    height: "35px",
                    borderRadius: "25px",
                    marginBottom: "15px",
                    marginTop: "15px",
                    cursor: "pointer",
                  }}
                  disabled={
                    selectedStartupStage !== undefined ||
                    selectedTechnology !== undefined ||
                    selected_Country !== undefined
                      ? false
                      : true
                  }
                >
                  <FormattedMessage
                    id="addFilterModal.card.submit.button.text"
                    defaultMessage=" Apply Filters"
                  />
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </form>
      </Grid>
    </>
  );
};

filters.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default filters;
