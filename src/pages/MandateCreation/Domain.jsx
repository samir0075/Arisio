import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useEffect, useState } from "react";
import NoDataMsg from "src/components/NoDataMsg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { startupNameRegex } from "src/components/validators";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    newDomain: yup
      .string()
      .trim()
      .required("Enter Domain ")
      .min(2, "Domain should be at least 2 characters")
      .max(50, "Domain should not exceed 50 characters")
      .matches(
        startupNameRegex,
        () => "Domain must contain letters or spaces; it can't be only numbers."
      ),
    newApplication: yup
      .string()
      .trim()
      .required("Enter Applications")
      .min(2, "Applications should be at least 2 characters")
      .max(50, "Applications should not exceed 50 characters")
      .matches(
        startupNameRegex,
        () => "Applications must contain letters or spaces; it can't be only numbers."
      )

      .trim(),
  })
  .required();
const Domain = ({
  domains,
  activeDomainId,
  applications,
  activeApplicationId,
  handleApplicationDetail,
  handleApplicationSelection,
  isNewSelectionMade,
  headingTag,
  handleCheckbox,
  selectCheckBox,
  activeDomainName,
  setOtherDomainData,
  otherDomainData,
  editMandateData,
}) => {
  const cardExternal = {
    background: "#fff",
    p: 2,
    borderRadius: "8px",
    height: "350px",
    overflow: "auto",
  };

  const cardInternal = {
    border: "1px solid #8A1538",
    p: 1,
    borderRadius: "8px",
    mt: 1,
    cursor: "pointer",
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (editMandateData) {
      setValue("newDomain", editMandateData?.othersDomain || "");
      setValue("newApplication", editMandateData?.othersTech || "");
    }
  }, []);

  const [searchTech, setSearchTech] = useState("");
  const [filteredDomainData, setfilteredDomainData] = useState([]);

  useEffect(() => {
    if (domains) {
      let domainList = [...domains];
      if (!domainList.some((domain) => domain.name === "Others")) {
        domainList.push({ id: 0, name: "Others" });
      }
      setfilteredDomainData(domainList);
    }
  }, [domains, editMandateData?.technology?.length]);

  const handleSearchDomain = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTech(searchValue);

    if (searchValue.trim() === "") {
      setfilteredDomainData(domains);
    } else {
      const filteredData = domains.filter((data) => data.name.toLowerCase().includes(searchValue));

      // Always include "Others" in the list while search
      if (!filteredData.some((domain) => domain.name === "Others")) {
        filteredData.push({ id: 0, name: "Others" });
      }
      setfilteredDomainData(filteredData);
    }
  };

  const otherFormData = watch(); // Watching form data

  useEffect(() => {
    if (otherFormData && JSON.stringify(otherFormData) !== JSON.stringify(otherDomainData)) {
      console.log(otherFormData);
      setOtherDomainData(otherFormData);
    }
  }, [otherFormData, otherDomainData]); // ✅ Depend on both values

  // const onSubmit = (data) => {
  //   setOtherDomainData(data);
  //   setFormVisible(true);
  // };

  return (
    <>
      <Accordion defaultExpanded sx={{ my: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ ...headingTag }}>Domain List</Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            background: "rgba(65, 148, 179,0.1) !important",
          }}
        >
          {/* SEARCH BOX */}

          <TextField
            size="small"
            placeholder="Search for Domain Name"
            variant="outlined"
            value={searchTech}
            onChange={(e) => handleSearchDomain(e)}
            sx={{
              background: "#FFFFFF",
              borderRadius: "8px",
              mt: 1,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              // endAdornment: (
              //     searchLoader && (
              //   <InputAdornment position="end">
              //     <CircularProgress size={20} sx={{ marginRight: 1 }} />
              //   </InputAdornment>
              // )
              // ),
              sx: {
                padding: "5px 20px",
                color: "#8B8787",
              },
            }}
          />

          {/* DOMAIN CARDS  */}

          <Grid2 container justifyContent="space-between" sx={{ mt: 2 }}>
            <Grid2 xs={12} sm={4} md={4} xl={4} sx={cardExternal}>
              {filteredDomainData?.length > 0 ? (
                filteredDomainData?.map((domain) => (
                  <>
                    <Grid2
                      key={domain.id}
                      sx={{
                        ...cardInternal,
                        backgroundColor: (
                          isNewSelectionMade
                            ? activeDomainId === domain?.id
                            : activeDomainId === domain?.id ||
                              editMandateData?.technology?.includes(domain.id)
                        )
                          ? "#8A1538"
                          : "transparent",
                        color: (
                          isNewSelectionMade
                            ? activeDomainId === domain?.id
                            : activeDomainId === domain?.id ||
                              editMandateData?.technology?.includes(domain.id)
                        )
                          ? "#fff"
                          : "#000",
                      }}
                      onClick={() => handleApplicationDetail(domain)}
                    >
                      {domain?.name}
                    </Grid2>
                  </>
                ))
              ) : (
                <NoDataMsg message={"No Domain available "} height={"40vh"} />
              )}
            </Grid2>

            {/* APPLICATONS DETAILS CARDS  */}

            {activeDomainName === "Others" ? (
              <Grid2 xs={12} sm={8} md={8} xl={8} sx={cardExternal}>
                <Typography sx={{ fontWeight: "600" }}>Add More Technologies</Typography>
                <form>
                  <Grid2 sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: "500" }}>Domain</Typography>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      {...register("newDomain", { required: true })}
                    />
                    {errors.newDomain && (
                      <Typography style={{ color: "red" }}>{errors.newDomain?.message}</Typography>
                    )}
                  </Grid2>
                  <Grid2 sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: "500" }}>Applications</Typography>

                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      {...register("newApplication", { required: true })}
                    />
                    {errors.newApplication && (
                      <Typography style={{ color: "red" }}>
                        {errors.newApplication?.message}
                      </Typography>
                    )}
                  </Grid2>
                  {/* <Grid2 container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button
                      type="submit"
                      sx={{
                        backgroundColor: "#8A1538",
                        color: "#fff",

                        "&:hover": {
                          backgroundColor: "#8A1538",
                          color: "#fff",
                        },
                      }}
                    >
                      Save
                    </Button>
                  </Grid2> */}
                </form>
              </Grid2>
            ) : (
              <Grid2 xs={12} sm={7.5} md={7.5} xl={7.5} sx={cardExternal}>
                {activeDomainId?.length !== 0 ? (
                  <>
                    <Typography variant="h6" component="div">
                      Now choose an application area in
                    </Typography>
                    <Typography
                      gutterBottom
                      // variant="h6"
                      component="div"
                      sx={{
                        color: "rgba(108, 25, 62, 1)",
                        fontSize: "1rem",
                        fontWeight: "600",
                        mt: 0.75,
                      }}
                    >
                      {activeDomainName}
                    </Typography>

                    <Typography sx={{ fontSize: "1rem", fontWeight: "600", color: "grey" }}>
                      Did you know that our engine, in real-time, has picked the hottest application
                      areas in this technology area for you? Now go ahead and explore more below.
                    </Typography>
                    <Grid2>
                      <Grid2 container>
                        <Checkbox
                          size="small"
                          checked={selectCheckBox}
                          onChange={(e) => handleCheckbox(e.target.checked)}
                        />

                        <Typography
                          variant="body2"
                          sx={{ fontSize: "1rem", fontWeight: "600", mt: 0.75 }}
                        >
                          Select All
                        </Typography>
                      </Grid2>

                      <Grid2 container justifyContent="space-around">
                        {applications?.map((app) => {
                          const isSelected = activeApplicationId?.includes(app?.id);

                          return (
                            <>
                              <Grid2
                                key={app.id}
                                xs={12}
                                sm={5.5}
                                md={5.5}
                                xl={5.5}
                                sx={{
                                  ...cardInternal,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  minHeight: "135px",
                                  position: "relative",
                                }}
                                // onClick={() => handleApplicationSelection(app)}
                              >
                                <Box sx={{ flexGrow: 1 }}>
                                  <Grid2
                                    container
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Typography sx={{ color: "#129690", fontWeight: "600" }}>
                                      {app?.excubatorDomainEntity?.name}
                                    </Typography>
                                    <Checkbox
                                      size="small"
                                      checked={isSelected}
                                      onChange={(e) =>
                                        handleApplicationSelection(app, e.target.checked)
                                      }
                                    />
                                  </Grid2>
                                  <Typography sx={{ fontWeight: "500" }}>
                                    {app?.technologyEntity?.name}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontWeight: "400",
                                      color: "#8B8787",
                                      fontSize: "0.9rem",
                                      height: "45px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2, // Limit text to 2 lines
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  >
                                    <Tooltip title={app?.messageDescription}>
                                      {app?.messageDescription}
                                    </Tooltip>
                                  </Typography>
                                </Box>

                                {/* <Grid2 container justifyContent="center">
                                  <Button
                                    sx={{
                                      border: "1px solid #8A1538",
                                      backgroundColor: isSelected ? "#8A1538" : "white",
                                      color: isSelected ? "#fff" : "#8A1538",

                                      "&:hover": {
                                        backgroundColor: isSelected ? "#8A1538" : "white",
                                        color: isSelected ? "#fff" : "#8A1538",
                                      },
                                    }}
                                  >
                                    Select
                                  </Button>
                                </Grid2> */}
                              </Grid2>
                            </>
                          );
                        })}
                      </Grid2>
                    </Grid2>
                  </>
                ) : (
                  <NoDataMsg message={"Please Select any of the Domain."} height={"40vh"} />
                )}
              </Grid2>
            )}
          </Grid2>
          {/* {activeDomainName !== "Others" && (
            <Grid2 container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                disabled={activeApplicationId?.length === 0}
                sx={{
                  backgroundColor: "#8A1538",
                  color: "#fff",

                  "&:hover": {
                    backgroundColor: "#8A1538",
                    color: "#fff",
                  },

                  "&:disabled": {
                    backgroundColor: "grey",
                    color: "#FFFFFF",
                  },
                }}
                onClick={handleSaveDomainData}
              >
                {formVisible ? "Saved" : "Save"}
              </Button>
            </Grid2>
          )} */}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default Domain;
