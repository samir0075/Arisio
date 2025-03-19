/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { Button, Container, Grid, MenuItem, Paper, Select, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from "next/router";
import { getCountries, getTechnologies } from "src/action/globalApi";
import { shortListStartUpsActions } from "src/store/shortListStartUpsSlice";
import { FormattedMessage } from "react-intl";

const addFiltersModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selected_Country, setSelected_Country] = useState();
  const [selectedTechnology, setSelectedTechnology] = useState();
  const [selectedStartupStage, setSelectedStartupStage] = useState();
  const [selectedData, setSelectedData] = useState();

  /** function used for switching back to the parent component */
  const goBack = () => {
    router.push("/ShortlistStartups");
    /** Used for  resetting all redux state */
    dispatch(shortListStartUpsActions.setLoading(false));
    dispatch(
      shortListStartUpsActions.setFilters({
        filtersData: {},
      })
    );
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
    router.push("/ShortlistStartups");
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
          <Grid container onClick={goBack}>
            <CancelIcon
              sx={{ fontSize: "1.2rem" }}
              color="disabled"
              style={{ marginLeft: "-30px", cursor: "pointer" }}
            />
          </Grid>
          <Grid container>
            <Grid item md={8} direction="row" style={{ marginTop: "30px" }}>
              <Paper elevation={16} style={{ padding: 4, width: "150%", height: "100%" }}>
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
                    id="addFilterModal.card.heading"
                    defaultMessage="Search By companies's filter"
                  />{" "}
                </Typography>
                <form onSubmit={handleClickedByApplyFilters}>
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "right",
                      justifyContent: "space-evenly",
                      marginTop: "38px",
                    }}
                  >
                    <Grid
                      item
                      md={8}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "18px",
                          fontFamily: "Calibri",
                          marginLeft: "53px",
                        }}
                      >
                        <FormattedMessage
                          id="addFilterModal.card.country.label"
                          defaultMessage="Country"
                        />
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
                          width: "73%",
                          maxHeight: "37px",
                          border: " 1px solid grey",
                          borderRadius: 5,
                          marginBottom: "24px",
                          marginLeft: "39px",
                          color: selected_Country === undefined ? "gray" : "black",
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
                    <Grid
                      item
                      md={8}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "18px",
                          fontFamily: "Calibri",
                          marginLeft: "53px",
                        }}
                      >
                        <FormattedMessage
                          id="addFilterModal.card.technology.label"
                          defaultMessage="Technology"
                        />
                      </Typography>
                      <Select
                        name="spaceId"
                        value={selectedTechnology || ""}
                        onChange={(r) => setSelectedTechnology(r?.target?.value)}
                        displayEmpty
                        style={{
                          width: "73%",
                          maxHeight: "37px",
                          border: " 1px solid grey",
                          borderRadius: 5,
                          marginBottom: "24px",
                          marginLeft: "67px",
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
                          <MenuItem
                            style={{ width: "30px", top: "8px" }}
                            key={option.id}
                            value={option.id}
                          >
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid
                      item
                      md={8}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "18px",
                          fontFamily: "Calibri",
                          marginLeft: "51px",
                        }}
                      >
                        <FormattedMessage
                          id="addFilterModal.card.startUp.label"
                          defaultMessage="StartUp Stage"
                        />
                      </Typography>
                      <Select
                        name="startupStage"
                        value={selectedStartupStage || ""}
                        onChange={(r) => setSelectedStartupStage(r?.target?.value)}
                        displayEmpty
                        style={{
                          width: "73%",
                          maxHeight: "37px",
                          border: " 1px solid grey",
                          borderRadius: 5,
                          marginBottom: "24px",
                          marginLeft: "35px",
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
                          <MenuItem
                            style={{ width: "30px", top: "8px" }}
                            key={option.id}
                            value={option.id}
                          >
                            {option.stage_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid
                      item
                      md={8}
                      style={{
                        margin: "auto",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="medium"
                        type="submit"
                        style={{
                          backgroundColor: "rgba(138, 21, 56, 1)",
                          color: "#ffffff",
                          width: "126px",
                          verticalAlign: "middle",
                          height: "49px",
                          borderRadius: "25px",
                          cursor: "pointer",
                          marginRight: "51px",
                          margin: "10px",
                        }}
                      >
                        <FormattedMessage
                          id="addFilterModal.card.submit.button.text"
                          defaultMessage="Apply Filters"
                        />
                      </Button>
                    </Grid>
                  </Box>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

addFiltersModal.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default addFiltersModal;
