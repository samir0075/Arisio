/* eslint-disable react-hooks/rules-of-hooks */
import React, { use, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { searchStartUpsActions } from "src/store/searchStartupsSlice";
import { useRouter } from "next/router";
import { getCategories, getCity, getCountries } from "src/action/globalApi";
import {
  getSelectedStartUpsData,
  getStartUpsData,
  getStartUpsDataByName,
} from "src/action/searchStartups";
import { FormattedMessage, useIntl } from "react-intl";
import { borderColor, display } from "@mui/system";

// Custom styles to ensure responsive design
const customStyles = {
  mainContainer: {
    flexGrow: 1,
    p: 2,
    background: "rgba(65, 148, 179,0.1) !important",
  },
  paper: {
    padding: "4px",
    margin: "30px 0",
  },
  title: {
    textAlign: "center",
    fontWeight: 600,
    fontSize: "20px",
    fontFamily: "Calibri",
    margin: "10px",
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
    alignItems: "center",
  },
};

const filterModal = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  const router = useRouter();
  const [searchKeyWords, setSearchKeyWords] = useState("");
  const [searchKeyWordsList, setSearchKeyWordsList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Qatar");
  const [selected_Country, setSelected_Country] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [fundValue, setFundValue] = useState("");
  const [yearIndicator, setYearIndicator] = useState("after");
  const [selectedYear, setSelectedYear] = useState();
  const [fundIndicator, setFundIndicator] = useState("greater");
  const [selectedCompanyByName, setSelectedCompanyByName] = useState();
  const [numberInputError, setNumberInputError] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const [displayMinError, setDisplayMinError] = useState(false);
  const investorId = userDetails?.investorId;

  const listOfYear = [
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
  ];

  /** function used for switching back to the parent component */
  // const goBack = () => {
  //   router.push("/SearchStartups");
  //   /** Used for  resetting all redux state */
  //   // dispatch(
  //   //   searchStartUpsActions.cleanAllStates({
  //   //     startUpsData: [],
  //   //     startUpsByNameData: [],
  //   //     selectedStartUpsByName: [],
  //   //     keywords: [],
  //   //     companiesByFilter: {},
  //   //     filtersData: {},
  //   //   })
  //   // );
  //   dispatch(searchStartUpsActions.setLoading(false));
  // };

  /** function to handel Enter key press  */
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchKeyWords.trim() !== "") {
      setSearchKeyWordsList((prevKeywords) => [...prevKeywords, searchKeyWords.trim()]);
      setSearchKeyWords("");
      event.preventDefault();
    }
  };

  /** function for handling cross button functionality in Chips  */
  const handleRemoveChip = (index) => {
    setSearchKeyWordsList((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
    if (index === 0) {
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
    dispatch(
      searchStartUpsActions.getTheKeywords({
        keywords: searchKeyWordsList?.map((r) => r).join("&") + "," + selectedCountry,
      })
    );
    dispatch(getStartUpsData(UpdatedFromData?.keywords, UpdatedFromData?.countryName, investorId));
    router.push("/SearchStartups");
  };

  /** Function for Search by Company's Name Card */
  const handleClickedByNameSearch = (event) => {
    event.preventDefault();
    dispatch(
      searchStartUpsActions.getTheKeywords({
        keywords: selectedCompanyByName?.label,
      })
    );
    dispatch(getSelectedStartUpsData(selectedCompanyByName?.value, investorId));
    router.push("/SearchStartups");
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

    /** Modifying the data for displaying it in on the Search Page */
    const formDataElements = (
      <>
        {modifiedData?.category?.length ? (
          <p style={{ marginBlockStart: "0px", marginBlockEnd: "0px" }}>
            Categories : {modifiedData.category[0]?.name}
          </p>
        ) : null}
        {modifiedData?.city?.length ? (
          <p style={{ marginBlockStart: "0px", marginBlockEnd: "0px" }}>
            Cities : {modifiedData?.city[0]?.name}
          </p>
        ) : null}
        {modifiedData?.country?.length ? (
          <p style={{ marginBlockStart: "0px", marginBlockEnd: "0px" }}>
            Country : {modifiedData?.country[0]?.fullName}
          </p>
        ) : null}
        {modifiedData?.year !== "" && modifiedData?.fund !== "" ? (
          <p style={{ marginBlockStart: "0px", marginBlockEnd: "0px" }}>
            Founded After {modifiedData?.year}&nbsp;&nbsp;&nbsp;&nbsp;Funding{" "}
            {modifiedData?.fundIndicator === "greater"
              ? "Greater than or equal to"
              : "Less than or equal to"}
            {modifiedData?.fund}(USD)
          </p>
        ) : null}
        {modifiedData?.year !== "" ? (
          <p style={{ marginBlockStart: "0px", marginBlockEnd: "0px" }}>
            Founded After {modifiedData?.year}
          </p>
        ) : null}
        {modifiedData?.fund !== "" ? (
          <p style={{ marginBlockStart: "0px", marginBlockEnd: "0px" }}>
            Funding{" "}
            {modifiedData?.fundIndicator === "greater"
              ? "Greater than or equal to"
              : "Less than or equal to"}
            {modifiedData?.fund} (USD)
          </p>
        ) : null}
      </>
    );
    dispatch(searchStartUpsActions.setLoading(true));
    dispatch(
      searchStartUpsActions.setFiltersData({
        filtersData: modifiedData,
      })
    );
    dispatch(
      searchStartUpsActions.getTheKeywords({
        keywords: formDataElements,
      })
    );
    router.push("/SearchStartups");
    setSelectedData();
    setNumberInputError(false);
  };

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getCategories());
    // dispatch(
    //   searchStartUpsActions.cleanAllStates({
    //     startUpsData: [],
    //     startUpsByNameData: [],
    //     selectedStartUpsByName: [],
    //     keywords: [],
    //     filtersData: {},
    //   })
    // );
    setDisplayMinError(false);
  }, [dispatch]);

  useEffect(() => {
    if (selected_Country !== undefined) {
      dispatch(getCity(selected_Country));
    }
  }, [dispatch, selected_Country]);

  const countryData = useSelector((state) => state.globalApi.countries);
  const cityData = useSelector((state) => state.globalApi.cities);
  const categoriesData = useSelector((state) => state.globalApi.categories);
  const searchByNameCompaniesData = useSelector((state) => state.searchStartUps.startUpsByNameData);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          background: "rgba(65, 148, 179,0.1) !important",
        }}
      >
        <Container maxWidth="xl">
          {/* <Grid container onClick={goBack} alignItems="center">
            <CancelIcon sx={{ fontSize: "1.2rem", cursor: "pointer" }} color="disabled" />
          </Grid> */}
          <Grid container direction="column" alignItems="center">
            {/* Search by Keywords */}
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Paper elevation={16} sx={customStyles.paper}>
                <Typography variant="h6" sx={customStyles.title}>
                  <FormattedMessage
                    id="filterModal.card1.heading"
                    defaultMessage="Search By keywords"
                  />
                </Typography>
                <form onSubmit={handleClickedBySearch}>
                  <Grid
                    container
                    direction={isSmallScreen ? "column" : "row"}
                    alignItems={"center"}
                    spacing={isSmallScreen ? 2 : 4}
                  >
                    <Grid
                      item
                      xs={isSmallScreen ? 12 : 3}
                      sm={3}
                      sx={{
                        marginLeft: isSmallScreen ? "0px" : "-85px",
                        paddingLeft: isSmallScreen ? "32px" : "0px",
                      }}
                    >
                      <Typography
                        style={{
                          textAlign: "center",
                          fontSize: "18px",
                          fontFamily: "Calibri",
                          marginLeft: isSmallScreen ? "0px" : "45px",
                          marginBottom: "24px",
                        }}
                      >
                        <FormattedMessage id="filterModal.card1.label" defaultMessage="Keywords" />
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={isSmallScreen ? 12 : 3}
                      sm={3}
                      sx={{
                        marginLeft: isSmallScreen ? "0px" : "-20px",
                        paddingLeft: isSmallScreen ? "32px" : "0px",
                      }}
                    >
                      <TextField
                        component="div"
                        name="searchKey"
                        id="outlined"
                        variant="outlined"
                        style={{
                          width: isSmallScreen ? "215px" : "500px",
                          border: " 1px solid gray",
                          borderRadius: 5,
                          overflow: "auto",
                          scrollbarWidth: "20px",
                          WebkitTextFillColor: "gray",
                          marginBottom:
                            searchKeyWordsList?.length === 0 && displayMinError === true
                              ? "0px"
                              : "16px",
                          maxHeight: "150px",
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
                        InputProps={{
                          startAdornment: (
                            <Box sx={customStyles.chipContainer}>
                              {searchKeyWordsList?.map((kw, index) => (
                                <Chip
                                  key={index}
                                  label={kw}
                                  sx={customStyles.chip}
                                  onDelete={() => handleRemoveChip(index)}
                                />
                              ))}
                            </Box>
                          ),
                        }}
                        sx={{
                          width: isSmallScreen ? "100%" : "100%",
                          maxHeight: "150px",
                        }}
                      />
                      {searchKeyWordsList?.length === 0 && displayMinError === true ? (
                        <Typography
                          style={{
                            textAlign: "right",
                            fontSize: "14px",
                          }}
                          color="red"
                        >
                          <FormattedMessage
                            id="filterModal.card1.error.message"
                            defaultMessage="*Minimum 1 keywords required"
                          />
                        </Typography>
                      ) : (
                        searchKeyWordsList?.length === 5 && (
                          <Typography
                            style={{
                              textAlign: "right",
                              fontSize: "14px",
                              marginTop: "-15px",
                            }}
                            color="red"
                          >
                            <FormattedMessage
                              id="filterModal.card2.error.message"
                              defaultMessage="*Maximum 5 keywords allowed"
                            />
                          </Typography>
                        )
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={isSmallScreen ? 12 : 3}
                      sm={3}
                      style={{ paddingLeft: isSmallScreen ? "0px" : "32px" }}
                    >
                      <Select
                        name="countryName"
                        value={selectedCountry || ""}
                        onChange={(r) => setSelectedCountry(r?.target?.value)}
                        style={{
                          width: isSmallScreen ? "130px" : "50%",
                          borderRadius: 5,
                          maxHeight: "41px",
                          border: " 1px solid grey",
                          marginBottom: "22px",
                          marginLeft: isSmallScreen ? "0px" : "280px",
                          marginRight: isRTL && !isSmallScreen ? "280px" : "0px",
                        }}
                      >
                        {countryData.map((option) => (
                          <MenuItem
                            style={{ width: "30px", top: "8px" }}
                            key={option.countryCode}
                            value={option.country}
                          >
                            {option.country}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid
                      item
                      xs={isSmallScreen ? 12 : 3}
                      sm={3}
                      style={{
                        paddingLeft: isSmallScreen ? "0px" : "160px",
                        paddingRight: isRTL && !isSmallScreen ? "160px" : "0px",
                      }}
                    >
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
                          width: "110px",
                          verticalAlign: "middle",
                          height: "39px",
                          borderRadius: "25px",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          marginLeft: "51px",
                          marginBottom: "24px",
                          marginRight: "65px",
                        }}
                        disabled={searchKeyWordsList?.length === 0 ? true : false}
                      >
                        <FormattedMessage
                          id="filterModal.card1.button.text"
                          defaultMessage="Search"
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </form>
                <Typography
                  sx={{
                    textAlign: "left",
                    fontSize: "0.7rem",
                    padding: "0.5rem",
                  }}
                >
                  <FormattedMessage
                    id="filterModal.card1.message.text"
                    defaultMessage="Search by : Startup Technology, Startup Sector, Startup Description"
                  />
                </Typography>
              </Paper>
            </Grid>
            {/* Search by Company Name */}
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Paper
                elevation={16}
                sx={customStyles.paper}
                style={{ height: isSmallScreen ? "200px" : "145px" }}
              >
                <Typography
                  variant="h6"
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "20px",
                    fontFamily: "Calibri",
                    margin: "10px",
                  }}
                >
                  <FormattedMessage
                    id="filterModal.card2.heading"
                    defaultMessage="Search By Company Name"
                  />
                </Typography>
                <form onSubmit={handleClickedByNameSearch}>
                  <Grid
                    container
                    direction={isSmallScreen ? "column" : "row"}
                    alignItems={"center"}
                    spacing={isSmallScreen ? 2 : 4}
                    sx={{ marginTop: "-15px" }}
                  >
                    <Grid
                      item
                      xs={isSmallScreen ? 12 : 3}
                      sm={3}
                      sx={{
                        marginLeft: isSmallScreen ? "0px" : "-85px",
                        paddingLeft: isSmallScreen ? "32px" : "0px",
                      }}
                    >
                      <Typography
                        style={{
                          textAlign: "center",
                          fontSize: "18px",
                          fontFamily: "Calibri",
                          marginLeft: isSmallScreen ? "0px" : "45px",
                        }}
                      >
                        <FormattedMessage id="filterModal.card2.label" defaultMessage="Names" />
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={isSmallScreen ? 12 : 6}
                      sm={6}
                      sx={{
                        marginLeft: isSmallScreen ? "0px" : "-20px",
                        paddingLeft: isSmallScreen ? "32px" : "0px",
                      }}
                    >
                      <Autocomplete
                        name="searchedByName"
                        value={selectedCompanyByName || ""}
                        onChange={(event, newValue) => {
                          if (newValue !== null) {
                            setSelectedCompanyByName(newValue);
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
                                paddingLeft: "8px", // Adjust padding left
                                ...params.InputProps.style, // Preserve existing input styles
                              },
                            }}
                            style={{
                              border: " 1px solid gray",
                              borderRadius: 5,
                              WebkitTextFillColor: "gray",
                              width: isSmallScreen ? "250px" : "100%",
                            }}
                            placeholder={intl.formatMessage({
                              id: "filterModal.card2.placeholder",
                              defaultMessage: "Slow type for suggestions",
                            })}
                            onKeyDown={(e) => {
                              const regex = /^[a-zA-Z0-9]{2,}(?: [a-zA-Z0-9]+)*$/;
                              const inputValue = e.target.value;
                              if (inputValue !== "" && regex.test(inputValue)) {
                                dispatch(getStartUpsDataByName(inputValue, investorId));
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={isSmallScreen ? 12 : 3}
                      sm={3}
                      style={{
                        paddingLeft: isSmallScreen ? "0px" : "160px",
                        paddingRight: isRTL && !isSmallScreen ? "160px" : "0px",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        type="submit"
                        style={{
                          backgroundColor:
                            searchByNameCompaniesData?.length === 0
                              ? "rgb(138 21 56 / 46%)"
                              : "rgba(138, 21, 56, 1)",
                          color: "#ffffff",
                          width: "110px",
                          verticalAlign: "middle",
                          height: "39px",
                          borderRadius: "25px",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          marginRight: "65px",
                          marginLeft: "51px",
                        }}
                        disabled={searchByNameCompaniesData?.length === 0 ? true : false}
                      >
                        <FormattedMessage
                          id="filterModal.card2.button.text"
                          defaultMessage="Search"
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
            {/* Search by Company Filters */}
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Paper elevation={16} sx={customStyles.paper} style={{ height: "100%" }}>
                <Typography variant="h6" sx={customStyles.title}>
                  <FormattedMessage
                    id="filterModal.card3.heading"
                    defaultMessage="Search By companies's filter"
                  />
                </Typography>
                <form onSubmit={handleClickedByApplyFilters}>
                  <Grid
                    container
                    direction={isSmallScreen ? "column" : "row"}
                    spacing={2}
                    style={{ marginRight: isRTL && !isSmallScreen ? "59px" : "0px" }}
                  >
                    <Grid item xs={12} sm={3} style={{ maxWidth: "13%" }}>
                      <Typography
                        style={{
                          fontSize: "18px",
                          fontFamily: "Calibri",
                          marginLeft: "42px",
                        }}
                      >
                        <FormattedMessage
                          id="filterModal.card3.country.label"
                          defaultMessage="Country"
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Select
                        name="country"
                        value={selected_Country || ""}
                        onChange={(r, selected) => {
                          setSelectedData(selected);
                          setSelected_Country(r?.target?.value);
                        }}
                        displayEmpty
                        sx={{
                          width: "73%",
                          maxHeight: "37px",
                          marginLeft: "39px",
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
                            style={{ width: "30px", top: "8px" }}
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
                        <Grid item xs={12} sm={3} style={{ maxWidth: "13%" }}>
                          <Typography
                            style={{
                              fontSize: "18px",
                              fontFamily: "Calibri",
                              marginLeft: "42px",
                            }}
                          >
                            <FormattedMessage
                              id="filterModal.card3.city.label"
                              defaultMessage="City"
                            />
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <Select
                            name="city"
                            value={selectedCity || ""}
                            onChange={(r) => setSelectedCity(r?.target?.value)}
                            displayEmpty
                            sx={{
                              width: "73%",
                              maxHeight: "37px",
                              marginLeft: "38px",
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
                              <MenuItem
                                style={{ width: "30px", top: "8px" }}
                                key={option}
                                value={option}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={3} style={{ maxWidth: "13%" }}>
                      <Typography
                        style={{
                          fontSize: "18px",
                          fontFamily: "Calibri",
                          marginLeft: "42px",
                        }}
                      >
                        <FormattedMessage
                          id="filterModal.card3.category.label"
                          defaultMessage="Category"
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Select
                        name="category"
                        value={selectedCategory || ""}
                        onChange={(r) => setSelectedCategory(r?.target?.value)}
                        displayEmpty
                        sx={{
                          width: "73%",
                          marginLeft: "38px",
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
                            style={{ width: "30px", top: "8px" }}
                            key={option.cCategoryId}
                            value={option.cCategoryName}
                          >
                            {option.cCategoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{ maxWidth: "13%" }}>
                      <Typography
                        style={{
                          fontSize: "18px",
                          fontFamily: "Calibri",
                          marginLeft: "42px",
                        }}
                      >
                        <FormattedMessage
                          id="filterModal.card3.foundedYear.label"
                          defaultMessage="Founded Year"
                        />
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={9}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Grid item xs={12} sm={3.5}>
                        <Select
                          name="yearIndicator"
                          value={yearIndicator || ""}
                          onChange={(r) => {
                            setYearIndicator(r?.target?.value);
                            setSelectedYear();
                          }}
                          style={{
                            width: isSmallScreen ? "70%" : "115%",
                            maxHeight: "37px",
                            border: " 1px solid grey",
                            borderRadius: 5,
                            color: "gray",
                            marginLeft: "38px",
                          }}
                        >
                          <MenuItem value="after">After </MenuItem>
                          <MenuItem value="before">Before </MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={3.5}>
                        <Select
                          name="year"
                          value={selectedYear || ""}
                          onChange={(r) => setSelectedYear(r?.target?.value)}
                          displayEmpty
                          style={{
                            width: isSmallScreen ? "70%" : "127%",
                            maxHeight: "37px",
                            border: " 1px solid grey",
                            borderRadius: 5,
                            color: "gray",
                            marginLeft: isSmallScreen ? "0px" : "95px",
                            marginRight: isRTL && !isSmallScreen ? "57px" : "0px",
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
                              style={{ width: "30px", top: "8px" }}
                              key={option}
                              value={option}
                              disabled={
                                yearIndicator === "after" && option === "2025" ? true : false
                              }
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{ maxWidth: "13%" }}>
                      <Typography
                        style={{
                          fontSize: "18px",
                          fontFamily: "Calibri",
                          marginLeft: "42px",
                        }}
                      >
                        <FormattedMessage
                          id="filterModal.card3.founding.label"
                          defaultMessage="Funding (USD)"
                        />
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={9}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingTop: "5px",
                      }}
                    >
                      <Grid item xs={12} sm={3.5}>
                        <Select
                          name="fundIndicator"
                          value={fundIndicator || ""}
                          onChange={(r) => setFundIndicator(r?.target?.value)}
                          style={{
                            width: isSmallScreen ? "70%" : "115%",
                            maxHeight: "37px",
                            borderRadius: "5px",
                            border: " 1px solid grey",
                            color: "gray",
                            marginLeft: "38px",
                          }}
                        >
                          <MenuItem value="greater">Greater than or equal to </MenuItem>
                          <MenuItem value="lesser">Less than or equal to</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={3.5}>
                        <OutlinedInput
                          type="number"
                          helperText="hii"
                          name="fund"
                          value={fundValue}
                          onChange={handleFundChange}
                          style={{
                            width: isSmallScreen ? "70%" : "127%",
                            maxHeight: "37px",
                            borderRadius: "5px",
                            color: "gray",
                            border: " 1px solid grey",
                            marginLeft: isSmallScreen ? "0px" : "95px",
                            marginRight: isRTL && !isSmallScreen ? "57px" : "0px",
                          }}
                          placeholder={intl.formatMessage({
                            id: "filterModal.card3.amount.placeholder",
                            defaultMessage: "Amount",
                          })}
                        />
                        {numberInputError === true && (
                          <FormHelperText
                            style={{ color: "red", marginLeft: "100px", width: "100%" }}
                          >
                            <FormattedMessage
                              id="filterModal.card3.founding.error.message"
                              defaultMessage="This number must be between 1 and 8."
                            />
                          </FormHelperText> // Error message
                        )}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        size="medium"
                        type="submit"
                        style={{
                          backgroundColor:
                            selected_Country !== undefined ||
                            selectedCity !== undefined ||
                            selectedYear !== undefined ||
                            selectedCategory !== undefined ||
                            fundValue !== ""
                              ? "rgba(138, 21, 56, 1)"
                              : "rgb(138 21 56 / 46%)",
                          color: "#ffffff",
                          width: "126px",
                          verticalAlign: "middle",
                          height: "49px",
                          borderRadius: "25px",
                          cursor: "pointer",
                          marginBottom: "15px",
                          marginLeft: isRTL && !isSmallScreen ? "125px" : "0px",
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
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

filterModal.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default filterModal;
