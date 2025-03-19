/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import {
  newMandate,
  mandateDetails,
  saveUserSelection,
  selectedMandateDetails,
  fetchDomains,
  applicationsDetailsDetails,
  applicationsDetails,
} from "src/action/createMandate";
import { useRouter } from "next/navigation";
import { mandateActions } from "src/store/createMandateSlice";
import {
  Box,
  Checkbox,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Grid,
  CardActions,
  TextField,
  Chip,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { investorSubscriptionLimitCheck } from "src/action/globalApi";
import { SWEETALERT } from "src/components/sweetalert2";
import { searchStartUpsActions } from "src/store/searchStartupsSlice";

const CreateMandates = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const userId = userDetails?.id;
  const investorId = userDetails?.investorId;
  const [selectedBtn, setSelectedBtn] = useState(null);
  const [othersSelected, setOthersSelected] = useState(false);
  const [storeTechId, setStoreTechId] = useState([]);
  const [selectCheckBox, setSelectCheckBox] = useState(false);
  const [storeIds, setStoreIds] = useState([]);
  const otherData = localStorage.getItem("othersTech");
  const otherTechData = otherData ? JSON.parse(otherData) : null;
  const domainData = localStorage.getItem("othersDomain");
  const otherDomainData = domainData ? JSON.parse(domainData) : null;
  const [searchKeyWords, setSearchKeyWords] = useState([] || otherTechData);
  const [searchKeyWordsList, setSearchKeyWordsList] = useState([] || otherDomainData);
  const [description, setDescription] = useState("");
  const [domainName, setDomainName] = useState("");
  const selectedExistingTech = localStorage.getItem("selectedExistingTech");
  const existingSelectedTech =
    selectedExistingTech !== null ? JSON.parse(selectedExistingTech) : null;
  const lang = localStorage.getItem("lang");

  /**
   * Api call
   */
  useEffect(() => {
    dispatch(fetchDomains());
    dispatch(mandateActions.saveMandateId(""));
    setSelectedBtn(null);
    localStorage.removeItem("incompleteMandate");
  }, [dispatch]);

  const mandates = useSelector((state) => state?.newMandate?.domain);

  const createMandate = "mandate_limit";

  const [isAlertShown, setIsAlertShown] = useState(false);

  useEffect(() => {
    let isMounted = true; // To check if the component is still mounted
    let requestCounter = 0; // Track the number of API requests

    const checkInvestorSubscriptionLimit = async () => {
      const currentRequest = ++requestCounter; // Increment the request counter

      dispatch(investorSubscriptionLimitCheck(userId, createMandate)).then((res) => {
        if (isMounted && currentRequest === requestCounter) {
          if (res?.status === false && !isAlertShown) {
            setIsAlertShown(true);
            SWEETALERT({
              text: "Your Mandate posting limit has been reached. Please upgrade your plan to continue!",
            });
          }
        }
      });
    };

    // Call the function
    checkInvestorSubscriptionLimit();

    // Cleanup function to avoid memory leaks
    return () => {
      isMounted = false;
    };
  }, [dispatch, isAlertShown, userId, createMandate]);

  useEffect(() => {
    if (typeof otherTechData === "string") {
      console.log("working");
      setSearchKeyWords(otherTechData);
      setDomainName(otherDomainData);
    }
  }, [otherDomainData, otherTechData]);

  useEffect(() => {
    if (existingSelectedTech !== null) {
      setSelectedBtn(existingSelectedTech);
    }
  }, []);

  useEffect(() => {
    if (selectedBtn?.id) {
      dispatch(applicationsDetails(selectedBtn?.id, investorId));
    }
  }, [dispatch, investorId, selectedBtn?.id]);

  const mandateInfo = useSelector((state) => state?.newMandate?.applications);

  const handleOthersClick = () => {
    setSelectedBtn(0);
    setOthersSelected(true);
    dispatch(
      mandateActions.fetchMandateDetailsById({
        singleMandate: [],
      })
    );
  };

  useEffect(() => {
    if (typeof otherTechData === "string") {
      setSelectedBtn(0);
      dispatch(
        mandateActions.fetchMandateDetailsById({
          singleMandate: [],
        })
      );
    }
  }, [dispatch, otherTechData]);

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
  };

  /**
   * Returns selected btn color
   * @param {object} val
   * @param {number} ind
   */
  const handleBtnClick = (val, ind) => {
    // console.log(ind, val);
    // if (val?.id !== ind) {
    setSelectedBtn(val);
    setOthersSelected(false);
    setStoreTechId([]);
    localStorage.setItem("selectedExistingTech", JSON.stringify({}));
    // } else {
    //   setSelectedBtn(null);
    // }
  };

  const handleContinue = () => {
    /** Checking for the multiple selected techIds and then filters out with Unique only */
    const uniqueStoreTechId = [...new Set(storeTechId)];
    /** this is for storing others tab data */
    if (selectedBtn === 0) {
      localStorage.setItem("othersTech", JSON.stringify(searchKeyWords));
      localStorage.setItem("othersDomain", JSON.stringify(domainName));
      localStorage.removeItem("selectedExistingTech");
      localStorage.removeItem("selectedTech");
      dispatch(
        mandateActions.fetchSelectedMandate({
          selectedMandate: [],
        })
      );
    }
    if (selectedBtn?.id === existingSelectedTech?.id && storeIds?.length === 0) {
      setStoreIds(existingSelectedTech?.techSpaceIDs);
    }
    if (selectedBtn?.id !== undefined) {
      dispatch(saveUserSelection(storeIds?.length > 0 ? storeIds : uniqueStoreTechId, userId)).then(
        (res) => {
          console.log(res);
          if (res?.status === "success") {
            setTimeout(() => {
              dispatch(selectedMandateDetails(investorId));
            }, 1000);
          }
        }
      );
      /** for storing already existing technologies and applications data*/
      localStorage.setItem("selectedExistingTech", JSON.stringify(selectedBtn));
      localStorage.setItem("selectedTech", JSON.stringify(selectedBtn));
      localStorage.removeItem("othersTech");
      localStorage.removeItem("othersDomain");
    }
    router.push("/CreateMandates/stepperForm");
    setStoreTechId([]);
    setStoreIds([]);
  };

  /**
   * Returns the list of all selected technologies id
   * @param {object} value
   * @param {number} ind
   */

  // const getSubModuleData = (value, ind) => {
  //   if (storeTechId.includes(value?.id)) {
  //     // Remove the id from the array

  //     setStoreTechId(storeTechId.filter((id) => id !== value?.id));
  //   } else {
  //     // Add the id to the array
  //     setStoreTechId([...storeTechId, value?.id]);
  //   }
  // };
  const getSubModuleData = (value) => {
    if (storeTechId.includes(value?.id)) {
      // Remove the id from the array
      setStoreTechId(storeTechId.filter((id) => id !== value?.id));
    } else {
      // Add the id to the array
      setStoreTechId([...storeTechId, value?.id]);
    }

    // If any individual space is selected, deselect the "Select All"
    if (selectCheckBox) {
      setSelectCheckBox(false);
    }
  };

  /**
   * handles sub technology select functionality
   * @param {boolean} e
   */
  // const handleCheckbox = (e) => {
  //   setSelectCheckBox(e);
  // };

  const handleCheckbox = (e) => {
    setSelectCheckBox(e);

    if (e) {
      // Select all IDs when checking the "Select All" checkbox
      setStoreIds(mandateInfo?.map((item) => item?.id));
      setStoreTechId(mandateInfo?.map((item) => item?.id));
    } else {
      // Clear all selections when unchecking
      setStoreIds([]);
      setStoreTechId([]);
    }
  };

  useEffect(() => {
    if (selectCheckBox) {
      setStoreIds(mandateInfo?.map((e) => e?.id));
    } else {
      setStoreIds([]);
    }
  }, [mandateInfo, selectCheckBox]);

  useEffect(() => {
    if (
      storeTechId?.length === Object.keys(mandateInfo)?.length &&
      Object.keys(mandateInfo)?.length !== 0
    ) {
      setSelectCheckBox(true);
    }
  }, [mandateInfo, storeTechId.length]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 2,
        background: "rgba(65, 148, 179,0.1) !important",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Card
        sx={{
          width: "auto",
          height: "auto",
          borderRadius: "5px",
        }}
      >
        <CardContent style={{ padding: "20px", borderRadius: "5px" }}>
          <Typography gutterBottom variant="h5" component="div">
            <FormattedMessage
              id="createMandate.card.content"
              defaultMessage="Get ready to explore the power of our platform!"
            />
          </Typography>
          <Typography
            sx={{ fontSize: "14px", marginTop: "15px" }}
            variant="body2"
            color="text.secondary"
          >
            <FormattedMessage
              id="createMandate.card.content2"
              defaultMessage="Pick a technology you want to find startups in. Don't worry, you can always add more
              technologies later. (By the way, these are the hottest technologies today.)"
            />
          </Typography>
          <Stack
            spacing={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
            direction="row"
            useFlexGap
            flexWrap="wrap"
            sx={{ marginTop: "15px" }}
          >
            {mandates.map((e, index) => {
              return (
                <Button
                  style={{ borderRadius: "5px", padding: "5px" }}
                  variant={selectedBtn?.id === e.id ? "contained" : "outlined"}
                  key={e.id}
                  onClick={() => handleBtnClick(e, index)}
                >
                  {e.name}
                </Button>
              );
            })}
            {mandates?.length > 0 && (
              <Button
                style={{ borderRadius: "5px", padding: "5px" }}
                variant={othersSelected === true || selectedBtn === 0 ? "contained" : "outlined"}
                onClick={() => handleOthersClick()}
              >
                Others
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
      {othersSelected === true && (
        <Card
          sx={{
            width: "auto",
            height: "auto",
            p: 2,
            marginTop: 3,
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              <FormattedMessage
                id="createMandate.card2.content"
                defaultMessage="Add more technologies"
              />
            </Typography>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    marginTop: "20px",
                    width: { xs: "auto", sm: "250px", md: "300px" },
                  }}
                >
                  <Box>
                    <Typography gutterBottom variant="h12" component="div">
                      <FormattedMessage
                        id="createMandate.card2.form.label1"
                        defaultMessage="Technologies"
                      />
                    </Typography>
                    <TextField
                      fullWidth
                      component="div"
                      name="searchKey"
                      id="outlined"
                      variant="outlined"
                      style={{
                        border: " 1px solid gray",
                        borderRadius: 11,
                        overflow: "auto",
                        scrollbarWidth: "20px",
                        WebkitTextFillColor: "gray",
                        marginBottom: searchKeyWordsList?.length ? "16px" : "0px",
                        maxHeight: "150px",
                      }}
                      placeholder={intl.formatMessage({
                        id: "createMandate.card2.form.label1.placeholder",
                        defaultMessage: "Enter your Keyword",
                      })}
                      size="small"
                      value={searchKeyWords}
                      onChange={(event) => {
                        setSearchKeyWords(event.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                      InputProps={{
                        startAdornment: (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap", // Allow chips to wrap
                              WebkitScrollBar: { width: "5px" },
                            }}
                          >
                            {searchKeyWordsList?.map((kw, index) => (
                              <Chip
                                key={index}
                                label={kw}
                                style={{
                                  margin: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                onDelete={() => handleRemoveChip(index)}
                              />
                            ))}
                          </div>
                        ),
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography gutterBottom variant="h12" component="div">
                      <FormattedMessage
                        id="createMandate.card2.form.label2"
                        defaultMessage=" Domain"
                      />
                    </Typography>
                    <TextField
                      fullWidth
                      component="div"
                      name="domain"
                      id="outlined"
                      variant="outlined"
                      maxRows={6}
                      style={{
                        border: " 1px solid gray",
                        borderRadius: 11,
                        overflow: "auto",
                        scrollbarWidth: "20px",
                        WebkitTextFillColor: "gray",
                        marginLeft: "0px",
                        maxHeight: "200px",
                      }}
                      placeholder={intl.formatMessage({
                        id: "createMandate.card2.form.label2.placeholder",
                        defaultMessage: "Enter domain for technologies",
                      })}
                      size="small"
                      value={domainName}
                      onChange={(event) => {
                        setDomainName(event.target.value);
                      }}
                    />
                  </Box>
                  {/* <Box>
                    <Typography gutterBottom variant="h12" component="div">
                      <FormattedMessage
                        id="createMandate.card2.form.label3"
                        defaultMessage="Description"
                      />
                    </Typography>
                    <TextField
                      fullWidth
                      component="div"
                      name="description"
                      id="outlined"
                      variant="outlined"
                      style={{
                        border: " 1px solid gray",
                        borderRadius: 11,
                        overflow: "auto",
                        scrollbarWidth: "20px",
                        WebkitTextFillColor: "gray",
                        maxHeight: "150px"
                      }}
                      placeholder={intl.formatMessage({
                        id: "createMandate.card2.form.label3.placeholder",
                        defaultMessage: "Enter Description for the technologies"
                      })}
                      size="small"
                      value={description}
                      onChange={event => {
                        setDescription(event.target.value);
                      }}
                    />
                  </Box> */}
                </Box>
              </form>
            </Grid>
          </CardContent>
        </Card>
      )}

      {othersSelected !== true && (
        <Card
          sx={{
            width: "auto",
            height: "auto",
            // p: 2,
            marginTop: 2,
            borderRadius: "5px",
          }}
        >
          <CardContent style={{ padding: "20px" }}>
            <Typography gutterBottom variant="h6" component="div">
              <FormattedMessage
                id="createMandate.card3.content"
                defaultMessage="Now choose an application area in"
              />
            </Typography>
            {selectedBtn === 0 ? (
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ color: "rgba(108, 25, 62, 1)", marginTop: "15px" }}
              >
                Others
              </Typography>
            ) : selectedBtn?.id !== null ? (
              <Typography
                gutterBottom
                // variant="h6"
                component="div"
                sx={{ color: "rgba(108, 25, 62, 1)", marginTop: "15px", fontSize: "1rem" }}
              >
                {selectedBtn?.name}
              </Typography>
            ) : null}

            <Typography
              sx={{ fontSize: "14px", marginTop: "0px" }}
              variant="body2"
              color="text.secondary"
            >
              <FormattedMessage
                id="createMandate.card3.content2"
                defaultMessage="Did you know that our engine, in real-time, has picked the hottest application areas
                in this technology area for you? Now go ahead and explore more below."
              />
            </Typography>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: "0px",
              }}
            >
              {selectedBtn !== 0 &&
                (selectedBtn?.id !== existingSelectedTech?.id || existingSelectedTech === null) && (
                  <>
                    <Grid item>
                      <Checkbox
                        size="small"
                        checked={selectCheckBox}
                        onChange={(e) => handleCheckbox(e.target.checked)}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={{ fontSize: "14px" }}>
                        <FormattedMessage
                          id="createMandate.card3.checkbox.label"
                          defaultMessage="Select All"
                        />
                      </Typography>
                    </Grid>
                  </>
                )}
            </Grid>
          </CardContent>
        </Card>
      )}
      <Grid sx={{ display: "flex !important", flexWrap: "wrap", justifyContent: "flex-start" }}>
        {mandateInfo.length > 0 &&
          selectedBtn?.id !== existingSelectedTech?.id &&
          mandateInfo?.map((e, index) => (
            <Card
              key={e?.id}
              sx={{
                width: "300px",
                // padding: "10px",
                margin: 1,
                borderRadius: "5px",
              }}
            >
              <CardContent style={{ padding: "15px" }}>
                {/* <Typography gutterBottom variant="h6" component="div">
                  {e?.technologyEntity?.name}
                </Typography> */}
                <Typography gutterBottom variant="h6" component="div" sx={{ color: "#1d4c9e" }}>
                  {e?.excubatorDomainEntity?.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    marginTop: "15px",
                    height: "280px",
                    overflowY: "auto",
                    scrollbarWidth: "none", // For Firefox
                    msOverflowStyle: "none", // For Internet Explorer and Edge
                    "&::-webkit-scrollbar": {
                      display: "none", // For Chrome, Safari, and Opera
                    },
                  }}
                >
                  {e?.messageDescription}
                </Typography>
              </CardContent>
              <CardActions sx={{ position: "relative", bottom: "0" }}>
                <Grid container spacing={2}>
                  <Grid item xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Button
                      {...{
                        [lang === "ar" ? "endIcon" : "startIcon"]: (
                          <CheckCircleOutlineIcon
                            sx={{
                              color:
                                storeTechId.includes(e.id) || storeIds.includes(e.id)
                                  ? "success"
                                  : "disabled",
                            }}
                          />
                        ),
                      }}
                      onClick={() => getSubModuleData(e, index)}
                      sx={{
                        width: "100%",
                        color: "#1d4c9e",
                        fontFamily: "Calibri",
                        fontSize: "20px",
                        fontWeight: 600,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        // opacity: storeTechId?.includes(e?.id) || storeIds?.length > 0 ? 1.5 : 0.5,
                        opacity: storeTechId.includes(e.id) || storeIds.includes(e.id) ? 1.5 : 0.5,
                        "& .MuiButton-icon": {
                          marginRight: "0px !important",
                        },
                      }}
                    >
                      <FormattedMessage
                        id="createMandate.card3.checkbox2.label"
                        defaultMessage="CHOOSE SPACE"
                      />
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          ))}
      </Grid>
      {(mandateInfo.length > 0 || selectedBtn === 0) && (
        <Button
          variant="contained"
          sx={{
            maxWidth: "100px",
            alignItems: "center",
            margin: " 15px auto",
          }}
          onClick={() => {
            handleContinue();
          }}
          disabled={
            othersSelected === true
              ? (othersSelected === false &&
                  searchKeyWordsList?.length === 0 &&
                  domainName === "" &&
                  description === "") ||
                searchKeyWords === "" ||
                domainName === ""
              : !(
                  storeTechId.length > 0 ||
                  storeIds?.length > 0 ||
                  selectedBtn?.id !== existingSelectedTech?.id ||
                  existingSelectedTech !== null
                ) ||
                (othersSelected === false &&
                  selectedBtn?.id !== existingSelectedTech?.id &&
                  storeTechId?.length === 0 &&
                  storeIds?.length === 0)
          }
        >
          <FormattedMessage id="createMandate.submit.button.text" defaultMessage="Continue" />
        </Button>
      )}
    </Box>
  );
};
CreateMandates.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default CreateMandates;
