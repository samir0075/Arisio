/* eslint-disable react-hooks/rules-of-hooks */
import React, { use, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
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
import { getCategories, getCity, getCountries } from "src/action/globalApi";
import {
  getDataByCompaniesFilter,
  getSelectedStartUpsData,
  getStartUpsData,
  getStartUpsDataByName,
} from "src/action/searchStartups";
import { FormattedMessage, useIntl } from "react-intl";
import { getButtonCss, isPermitted } from "src/utils/util";
import permissions from "src/utils/permission";

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
  inputField: {
    border: "1px solid gray",
    borderRadius: 5,
  },
  select: {
    maxHeight: "41px",
    border: "1px solid grey",
    borderRadius: 5,
  },
  button: {
    color: "#ffffff",
    width: "110px",
    verticalAlign: "middle",
    height: "39px",
    borderRadius: "25px",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: "4px",
    display: "flex",
    alignItems: "left",
    border: "0px",
    height: "20px",
  },
};

const filters = ({ page, setPage, setFilter, filtersData, fitlers }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  const router = useRouter();
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [searchKeyWordsList, setSearchKeyWordsList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Qatar");

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const [fundValue, setFundValue] = useState("");
  const [yearIndicator, setYearIndicator] = useState("after");
  const [selectedYear, setSelectedYear] = useState();
  const [fundIndicator, setFundIndicator] = useState("greater");
  const [selectedCompanyByName, setSelectedCompanyByName] = useState("");
  const [numberInputError, setNumberInputError] = useState(false);
  const [selectedData, setSelectedData] = useState({
    props: {
      value: "QAT",
      children: "Qatar",
    },
  });
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const [displayMinError, setDisplayMinError] = useState(false);
  const investorId = userDetails?.investorId;

  const countryData = useSelector((state) => state?.globalApi?.countries);
  const cityData = useSelector((state) => state?.globalApi?.cities);
  const categoriesData = useSelector((state) => state?.globalApi?.categories);
  const searchByNameCompaniesData = useSelector(
    (state) => state?.searchStartUps?.startUpsByNameData
  );
  const compnayNameFilterName = useSelector(
    (state) => state?.searchStartUps?.companyNameFilterName
  );
  const startsUPDataByName = useSelector((state) => state?.searchStartUps?.selectedStartUpsByName);
  const keyworkdFilterKey = useSelector((state) => state?.searchStartUps?.keywordFilterKeys);
  const companyFilterfeild = useSelector((state) => state?.searchStartUps?.companyFilterfeild);

  const [selected_Country, setSelected_Country] = useState(
    companyFilterfeild?.country?.length > 0
      ? companyFilterfeild?.country?.map((ele) => ele.name)
      : "QAT"
  );

  const customFiltersLabel = {
    fontSize: "14px",
    marginBottom: "7px",
    marginTop: "7px",
    marginRight: "5px",
  };

  const listOfYear = Array.from({ length: 40 }, (_, i) => (1985 + i).toString());

  /** function to handel Enter key press  */
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchKeyWords.trim() !== "") {
      setSearchKeyWordsList((prevKeywords) => [...prevKeywords, searchKeyWords.trim()]);
      // setFilter(searchKeyWordsList);
      /** resetting the redux store for removing the data */
      setSearchKeyWords("");
      setSelected_Country();
      setFundIndicator();
      setYearIndicator();
      setSelectedCompanyByName();
      setSelectedCategory();
      event.preventDefault();
      /** resetting the redux store for removing the data */
      dispatch(
        searchStartUpsActions.setFiltersData({
          filtersData: {},
        })
      );
      dispatch(
        searchStartUpsActions.fetchSelectedStartUpsData({
          selectedStartUpsByName: [],
        })
      );
      dispatch(
        searchStartUpsActions.fetchDataByCompaniesFilter({
          companiesByFilter: {},
        })
      );
    }
  };

  /** function for handling cross button functionality in Chips  */
  const handleRemoveChip = (index) => {
    setSearchKeyWordsList((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
    // if there is no keyword apply removed all keywords from store and in data
    if (index === 0) {
      dispatch(
        searchStartUpsActions.setKeyowordFilterKeys({
          keywordFilterKeys: {},
        })
      );
      dispatch(
        searchStartUpsActions.fetchDataByCompaniesFilter({
          companiesByFilter: {},
        })
      );

      // dispatch(
      //   searchStartUpsActions.fetchSearchStartups({
      //     startUpsData: [],
      //   })
      // );
      // dispatch(
      //   getDataByCompaniesFilter(
      //     {
      //       category: [],
      //       city: [],
      //       country: [{ name: "QAT", fullName: "Qatar" }],
      //       yearIndicator: "after",
      //       year: "",
      //       fundIndicator: "greater",
      //       fund: "",
      //     },
      //     1,
      //     investorId
      //   )
      // );
      setDisplayMinError(true);
    }
  };

  /** Function for Search by keyWord Card */
  const handleClickedBySearch = (event) => {
    event.preventDefault();
    const UpdatedFromData = {
      keywords: searchKeyWordsList?.map((r) => r?.replace(/\s/g, "+"))?.join("+"),
      countryName: selectedCountry,
    };

    setFilter(UpdatedFromData);
    dispatch(
      searchStartUpsActions.setKeyowordFilterKeys({
        keywordFilterKeys: { keywords: searchKeyWordsList, countryName: selectedCountry },
      })
    );
    dispatch(getStartUpsData(UpdatedFromData?.keywords, UpdatedFromData?.countryName, investorId));
    setSelected_Country();
    setFundIndicator();
    setYearIndicator();
    setSelectedCompanyByName();
    setSelectedCategory();
    setPage(0);
    dispatch(
      searchStartUpsActions.setFiltersData({
        filtersData: {},
      })
    );
    dispatch(
      searchStartUpsActions.fetchSelectedStartUpsData({
        selectedStartUpsByName: [],
      })
    );
    dispatch(
      searchStartUpsActions.fetchDataByCompaniesFilter({
        companiesByFilter: {},
      })
    );
  };

  /** Function for Search by Company's Name Card */
  const handleClickedByNameSearch = (event) => {
    event.preventDefault();
    setPage(0);
    dispatch(getSelectedStartUpsData(selectedCompanyByName?.value, investorId));
    dispatch(
      searchStartUpsActions.fetchSearchStartups({
        startUpsData: [],
      })
    );
    dispatch(
      searchStartUpsActions.setFiltersData({
        filtersData: {},
      })
    );
  };

  const handleFundChange = (event) => {
    if (event?.target?.value?.length < 1 || event?.target?.value?.length > 8) {
      setNumberInputError(true);
    } else {
      setNumberInputError(false);
    }
    setFundValue(event.target.value);
  };

  /** Function for Search by By Companies Filter Card */
  const handleClickedByApplyFilters = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObj = Object.fromEntries(formData.entries());
    const modifiedData = {
      category: formDataObj?.category !== "" ? [{ name: formDataObj?.category }] : [],
      city:
        formDataObj["city"] !== undefined
          ? formDataObj?.city !== ""
            ? [{ name: formDataObj?.city }]
            : []
          : [],
      country:
        formDataObj?.country !== ""
          ? [
              {
                name: selectedData?.props?.value,
                fullName: selectedData?.props?.children,
              },
            ]
          : [],
      yearIndicator: formDataObj?.yearIndicator,
      year: formDataObj?.year !== "" ? formDataObj?.year : "",
      fundIndicator: formDataObj?.fundIndicator,
      fund: formDataObj?.fund !== "" ? formDataObj?.fund : "",
    };
    setFilter(modifiedData);
    dispatch(
      searchStartUpsActions.setfilterDatabyCompanyFilterFeild({
        filterFeilds: modifiedData,
      })
    );
    // dispatch(searchStartUpsActions.setLoading(true));
    dispatch(
      searchStartUpsActions.setFiltersData({
        filtersData: modifiedData,
      })
    );
    setPage(0);

    dispatch(getDataByCompaniesFilter(modifiedData, page + 1, investorId));
    setSelectedCompanyByName();

    setNumberInputError(false);
    dispatch(
      searchStartUpsActions.fetchSearchStartups({
        startUpsData: [],
      })
    );
    dispatch(
      searchStartUpsActions.fetchSelectedStartUpsData({
        selectedStartUpsByName: [],
      })
    );
  };

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getCategories());
    setDisplayMinError(false);
  }, [dispatch]);

  // for getting cities to respective country
  useEffect(() => {
    if (selected_Country !== undefined) {
      dispatch(getCity(selected_Country)).then((resp) => {
        console.log(resp);
      });
    }
  }, [dispatch, selected_Country, companyFilterfeild]);

  // for storing if the user comes from overview page to store filter feild for companyname filter
  useEffect(() => {
    if (startsUPDataByName.length > 0) {
      if (Object.keys(compnayNameFilterName).length > 0) {
        setSelectedCompanyByName(compnayNameFilterName);
      }
    }
  }, [compnayNameFilterName, startsUPDataByName.length]);

  // for storing if the user comes from overview page to store filter feild for keyword filter
  useEffect(() => {
    if (Object.keys(keyworkdFilterKey).length > 0) {
      setSearchKeyWordsList(keyworkdFilterKey.keywords);
      setSelectedCountry(
        keyworkdFilterKey?.countryName !== undefined ? keyworkdFilterKey?.countryName : "Qatar"
      );
    }
  }, [keyworkdFilterKey]);

  // for storing if the user comes from overview page to store filter feild for last one company filter
  // console.log(companyFilterfeild);
  useEffect(() => {
    if (Object.keys(companyFilterfeild).length > 0) {
      setSelected_Country(companyFilterfeild?.country?.map((ele) => ele.name));
      setSelectedCity(companyFilterfeild?.city?.map((ele) => ele.name));
      setSelectedCategory(companyFilterfeild?.category?.map((ele) => ele.name));
      setYearIndicator(companyFilterfeild?.yearIndicator);
      setFundIndicator(companyFilterfeild?.fundIndicator);
      setSelectedYear(companyFilterfeild?.year);
      setFundValue(companyFilterfeild?.fund);
    }
  }, [companyFilterfeild]);

  const theme = useTheme();

  return (
    <>
      <Grid item xs={12} sx={customStyles.paper}>
        <Typography variant="h6" sx={customStyles.title}>
          <FormattedMessage id="filterModal.card1.heading" defaultMessage="Search By keywords" />
        </Typography>
        <form onSubmit={handleClickedBySearch}>
          <Grid container direction={"column"}>
            <Grid item style={{ display: "flex", alignItems: "center" }}>
              <Typography style={customFiltersLabel}>
                <FormattedMessage id="filterModal.card1.label" defaultMessage="Keywords" />
              </Typography>
              <Tooltip
                title={
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                    }}
                  >
                    <FormattedMessage
                      id="filterModal.card1.message.text"
                      defaultMessage="Search by : Startup Technology, Startup Sector, Startup Description"
                    />
                  </Typography>
                }
                arrow
                placement="top-end"
              >
                <InfoOutlinedIcon style={{ fontSize: "1rem" }} />
              </Tooltip>
            </Grid>
            <Grid item xs={2} md={2}>
              <TextField
                component="div"
                name="searchKey"
                id="outlined"
                variant="outlined"
                style={{
                  border: " 1px solid gray",
                  borderRadius: 5,
                  overflow: "auto",
                  scrollbarWidth: "20px",
                  WebkitTextFillColor: "gray",
                  marginBottom:
                    /** make margin from bottom when not chip is entered */
                    searchKeyWordsList?.length === 0 && displayMinError === true ? "0px" : "6px",
                  maxHeight: "150px",
                  width: "100%",
                }}
                placeholder={
                  searchKeyWordsList.length === 0
                    ? intl.formatMessage({
                        id: "filterModal.card1.placeholder",
                        defaultMessage: "Enter your Keyword",
                      })
                    : ""
                }
                size="small"
                value={searchKeyWords}
                onChange={(event) => {
                  if (searchKeyWordsList?.length < 5) {
                    setSearchKeyWords(event.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
              />
              {searchKeyWordsList?.length > 0 && (
                <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                  {searchKeyWordsList?.map((kw, index) => (
                    <Chip
                      variant="outlined"
                      key={index}
                      label={kw}
                      sx={{
                        ...customStyles.chip,
                        ".MuiChip-label": {
                          paddingLeft: "0px",
                          paddingRight: "7px",
                        },
                        ".MuiChip-deleteIcon": {
                          width: "1rem",
                          height: "1rem",
                        },
                      }}
                      onDelete={() => handleRemoveChip(index)}
                      deleteIcon={<CloseSharpIcon />}
                    />
                  ))}
                </Box>
              )}
              {searchKeyWordsList?.length === 5 && (
                <Typography
                  style={{
                    fontSize: "12px",
                    marginTop: "-5px",
                  }}
                  color="red"
                >
                  <FormattedMessage
                    id="filterModal.card2.error.message"
                    defaultMessage="*Maximum 5 keywords allowed"
                  />
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography style={customFiltersLabel}>
                <FormattedMessage id="filterModal.card3.country.label" defaultMessage="Country" />
              </Typography>
              <Select
                name="countryName"
                value={selectedCountry || ""}
                onChange={(r) => {
                  setSelectedCountry(r?.target?.value);
                }}
                style={{
                  borderRadius: 5,
                  maxHeight: "41px",
                  border: " 1px solid grey",
                  width: "100%",
                  // marginRight: isRTL && !isSmallScreen ? "280px" : "0px",
                }}
              >
                {countryData.map((option) => (
                  <MenuItem style={{ top: "8px" }} key={option.countryCode} value={option.country}>
                    {option.country}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {isPermitted(permissions.SEARCH_STARTUP_FILTERS) ? (
              <Grid item xs={2} sm={2} style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  size="small"
                  type="submit"
                  style={{
                    backgroundColor:
                      searchKeyWordsList?.length === 0
                        ? "rgb(138 21 56 / 46%)"
                        : "rgba(138, 21, 56, 1)",
                    color: "#ffffff",
                    verticalAlign: "center",
                    height: "35px",
                    borderRadius: "25px",
                    marginTop: "15px",
                    marginBottom: "15px",
                    cursor: "pointer",
                  }}
                  disabled={searchKeyWordsList?.length === 0 ? true : false}
                >
                  <FormattedMessage
                    id="filterModal.card3.button.text"
                    defaultMessage=" Apply Filters"
                  />
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </form>
        <Divider
          orientation="horizontal"
          flexItem
          sx={{
            borderRightWidth: 4,
            marginTop: "0px",
            marginBottom: "20px",
            borderBlockColor: "#cecece",
          }}
        />
        <Typography variant="h6" sx={customStyles.title}>
          <FormattedMessage
            id="filterModal.card2.heading"
            defaultMessage="Search By Company Name"
          />
        </Typography>
        {/* Search by Company name form section */}
        <form onSubmit={handleClickedByNameSearch}>
          <Grid container direction={"column"}>
            <Typography style={customFiltersLabel}>
              <FormattedMessage id="filterModal.card2.label" defaultMessage="Names" />
            </Typography>
            <Grid item xs={2} sm={2}>
              <Autocomplete
                name="searchedByName"
                value={selectedCompanyByName || ""}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setSelectedCompanyByName("");
                    dispatch(
                      searchStartUpsActions.fetchSelectedStartUpsData({
                        selectedStartUpsByName: [],
                      })
                    );
                  }
                  if (newValue !== null) {
                    dispatch(
                      searchStartUpsActions.setCompanyNameFilterName({
                        filterName: newValue,
                      })
                    );
                    setSelectedCompanyByName(newValue);
                    setSelected_Country();
                    setFundIndicator();
                    setYearIndicator();
                    setSelectedCategory();
                  }
                }}
                noOptionsText="No Data"
                options={
                  searchByNameCompaniesData?.length
                    ? searchByNameCompaniesData?.map((r) => ({
                        label: r?.companyName,
                        value: r?.id,
                      }))
                    : []
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      style: {
                        paddingTop: "2px", // Adjust padding top
                        // Adjust padding left
                        ...params.InputProps.style, // Preserve existing input styles
                      },
                    }}
                    style={{
                      border: " 1px solid gray",
                      borderRadius: 5,
                      WebkitTextFillColor: "gray",
                    }}
                    placeholder={intl.formatMessage({
                      id: "filterModal.card2.placeholder",
                      defaultMessage: "Slow type for suggestions",
                    })}
                    onChange={(e) => {
                      const regex = /^[a-zA-Z0-9]{2,}(?: [a-zA-Z0-9]+)*$/;
                      const inputValue = e.target.value;
                      /** resetting the other filters */
                      setSearchKeyWords("");
                      setSearchKeyWordsList([]);
                      setSelectedCountry("Qatar");
                      setSelected_Country();
                      setFundIndicator();
                      setYearIndicator();
                      setSelectedCategory();
                      /** resetting the redux store for removing the data */
                      dispatch(
                        searchStartUpsActions.setFiltersData({
                          filtersData: {},
                        })
                      );
                      dispatch(
                        searchStartUpsActions.fetchDataByCompaniesFilter({
                          companiesByFilter: {},
                        })
                      );
                      dispatch(
                        searchStartUpsActions.fetchSearchStartups({
                          startUpsData: [],
                        })
                      );
                      if (inputValue !== "" && regex.test(inputValue)) {
                        dispatch(getStartUpsDataByName(inputValue, investorId));
                      }
                    }}
                  />
                )}
              />
            </Grid>
            {isPermitted(permissions.SEARCH_STARTUP_FILTERS) ? (
              <Grid item xs={3} sm={3} style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  size="small"
                  type="submit"
                  style={{
                    backgroundColor:
                      selectedCompanyByName?.length === 0 ||
                      searchByNameCompaniesData?.length === 0 ||
                      searchKeyWordsList?.length > 0
                        ? "rgb(138 21 56 / 46%)"
                        : "rgba(138, 21, 56, 1)",
                    color: "#ffffff",
                    verticalAlign: "center",
                    height: "35px",
                    borderRadius: "25px",
                    marginBottom: "-10px",
                    marginTop: "15px",
                    cursor: "pointer",
                  }}
                  disabled={
                    // searchByNameCompaniesData?.length === 0
                    //   ? true
                    //   : searchKeyWordsList?.length > 0 === true
                    //   ? true
                    //   : false
                    selectedCompanyByName?.length === 0
                      ? true
                      : searchByNameCompaniesData?.length === 0
                      ? true
                      : searchKeyWordsList?.length > 0
                      ? true
                      : false
                  }
                >
                  <FormattedMessage
                    id="filterModal.card3.button.text"
                    defaultMessage=" Apply Filters"
                  />
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </form>
        <Divider
          orientation="horizontal"
          flexItem
          sx={{
            borderRightWidth: 4,
            marginTop: "25px",
            marginBottom: "20px",
            borderBlockColor: "#cecece",
          }}
        />
        <Typography variant="h6" sx={customStyles.title}>
          <FormattedMessage
            id="filterModal.card3.heading"
            defaultMessage="Search By companies's filter"
          />
        </Typography>
        <form onSubmit={handleClickedByApplyFilters}>
          <Grid container direction={"column"}>
            <Typography style={customFiltersLabel}>
              <FormattedMessage id="filterModal.card3.country.label" defaultMessage="Country" />
            </Typography>
            <Grid item xs={2} sm={2}>
              <Select
                name="country"
                value={selected_Country || ""}
                onChange={(r, selected) => {
                  setSelectedData(selected);
                  console.log(selectedData);
                  setSelected_Country(r?.target?.value);
                  setSelectedCity();
                  setSearchKeyWords("");
                  setSearchKeyWordsList([]);
                  setSelectedCountry("Qatar");
                }}
                displayEmpty
                sx={{
                  width: "100%",
                  maxHeight: "37px",
                  borderRadius: "5px",
                  border: " 1px solid grey",
                  color: selected_Country === undefined ? "gray" : "black",
                }}
              >
                <MenuItem value="">
                  <FormattedMessage
                    id="filterModal.card3.country.placeholder"
                    defaultMessage="Select your country"
                  />
                </MenuItem>
                {countryData.map((option) => (
                  <MenuItem
                    style={{ top: "8px" }}
                    key={option.countryCode}
                    value={option.countryCode}
                  >
                    {option.country}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {selected_Country !== undefined && (
              <>
                <Grid item xs={2} sm={2}>
                  <Typography style={customFiltersLabel}>
                    <FormattedMessage id="filterModal.card3.city.label" defaultMessage="City" />
                  </Typography>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Select
                    name="city"
                    value={selectedCity || ""}
                    onChange={(r) => {
                      setSelectedCity(r?.target?.value);
                      setSelectedCompanyByName();
                      setSearchKeyWordsList([]);
                    }}
                    displayEmpty
                    sx={{
                      width: "100%",
                      maxHeight: "37px",
                      borderRadius: "5px",
                      border: " 1px solid grey",
                      color: selectedCity === undefined ? "gray" : "black",
                    }}
                  >
                    <MenuItem value="">
                      <FormattedMessage
                        id="filterModal.card3.city.placeholder"
                        defaultMessage="Enter city"
                      />
                    </MenuItem>
                    {cityData?.map((option) => (
                      <MenuItem style={{ top: "8px" }} key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </>
            )}
            <Grid item xs={2} sm={2}>
              <Typography style={customFiltersLabel}>
                <FormattedMessage id="filterModal.card3.category.label" defaultMessage="Category" />
              </Typography>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Select
                name="category"
                value={selectedCategory || ""}
                onChange={(r) => {
                  setSelectedCategory(r?.target?.value);
                }}
                displayEmpty
                sx={{
                  width: "100%",
                  maxHeight: "37px",
                  borderRadius: "5px",
                  border: " 1px solid grey",
                  color: selectedCategory === undefined ? "gray" : "black",
                }}
              >
                <MenuItem value="">
                  <FormattedMessage
                    id="filterModal.card3.categories.placeholder"
                    defaultMessage="Enter categories"
                  />{" "}
                </MenuItem>
                {categoriesData?.map((option) => (
                  <MenuItem
                    style={{ top: "8px" }}
                    key={option.cCategoryId}
                    value={option.cCategoryName}
                  >
                    {option.cCategoryName}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Typography style={customFiltersLabel}>
                <FormattedMessage
                  id="filterModal.card3.foundedYear.label"
                  defaultMessage="Founded Year"
                />
              </Typography>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Select
                name="yearIndicator"
                value={yearIndicator || ""}
                onChange={(r) => {
                  setYearIndicator(r?.target?.value);
                  setSelectedYear();
                }}
                style={{
                  maxHeight: "37px",
                  border: " 1px solid grey",
                  borderRadius: 5,
                  color: "black",
                  width: "100%",
                }}
              >
                <MenuItem value="after">
                  <FormattedMessage id="filterModal.filter.after" defaultMessage="After" />
                </MenuItem>

                <MenuItem value="before">
                  <FormattedMessage id="filterModal.filter.before" defaultMessage="Before" />
                </MenuItem>
              </Select>
              <Select
                name="year"
                value={selectedYear || ""}
                onChange={(r) => {
                  setSelectedYear(r?.target?.value);
                }}
                displayEmpty
                style={{
                  maxHeight: "37px",
                  border: " 1px solid grey",
                  borderRadius: 5,
                  color: selectedYear !== undefined ? "black" : "grey",
                  width: "100%",
                  marginTop: "14px",
                }}
              >
                <MenuItem value="">
                  <FormattedMessage
                    id="filterModal.card3.foundedYear.placeholder"
                    defaultMessage="Select the year"
                  />{" "}
                </MenuItem>
                {listOfYear?.map((option) => (
                  <MenuItem
                    style={{ top: "8px" }}
                    key={option}
                    value={option}
                    disabled={yearIndicator === "after" && option === "2025" ? true : false}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Typography style={customFiltersLabel}>
                <FormattedMessage
                  id="filterModal.card3.founding.label"
                  defaultMessage="Funding (USD)"
                />
              </Typography>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Select
                name="fundIndicator"
                value={fundIndicator || ""}
                onChange={(r) => {
                  setFundIndicator(r?.target?.value);
                }}
                style={{
                  maxHeight: "37px",
                  borderRadius: "5px",
                  border: " 1px solid grey",
                  color: fundIndicator !== "" ? "black" : "gray",
                  width: "100%",
                }}
              >
                <MenuItem value="greater">
                  <FormattedMessage
                    id="filterModal.filter.greaterThan"
                    defaultMessage="Greater than or equal to"
                  />
                </MenuItem>
                <MenuItem value="lesser">
                  <FormattedMessage
                    id="filterModal.filter.lessThan"
                    defaultMessage="Less than or equal to"
                  />
                </MenuItem>
              </Select>
              <OutlinedInput
                type="number"
                helperText="hii"
                name="fund"
                value={fundValue}
                onChange={handleFundChange}
                style={{
                  maxHeight: "37px",
                  borderRadius: "5px",
                  color: fundValue !== "" ? "black" : "gray",
                  border: " 1px solid grey",
                  width: "100%",
                  marginTop: "14px",
                  // marginRight: isRTL && !isSmallScreen ? "57px" : "0px",
                }}
                placeholder={intl.formatMessage({
                  id: "filterModal.card3.amount.placeholder",
                  defaultMessage: "Amount",
                })}
              />
            </Grid>
            {numberInputError === true && (
              <FormHelperText style={{ color: "red" }}>
                <FormattedMessage
                  id="filterModal.card3.founding.error.message"
                  defaultMessage="This number must be between 1 and 8."
                />
              </FormHelperText> // Error message
            )}
            {isPermitted(permissions.SEARCH_STARTUP_FILTERS) ? (
              <Grid item xs={2} sm={2} sx={{ textAlign: "center", marginTop: "10px" }}>
                <Button
                  variant="contained"
                  size="small"
                  type="submit"
                  style={{
                    backgroundColor:
                      selected_Country !== undefined
                        ? "rgba(138, 21, 56, 1)"
                        : "rgb(138 21 56 / 46%)",
                    color: "#ffffff",
                    verticalAlign: "middle",
                    height: "35px",
                    borderRadius: "25px",
                    cursor: "pointer",
                  }}
                  disabled={
                    selected_Country !== undefined ||
                    selectedCity !== undefined ||
                    selectedYear !== undefined ||
                    selectedCategory !== undefined ||
                    fundValue !== ""
                      ? false
                      : true
                  }
                >
                  <FormattedMessage
                    id="filterModal.card3.button.text"
                    defaultMessage="Apply Filters"
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
