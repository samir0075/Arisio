import React, { useState, useEffect } from "react";
import styles from "./createMandate.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCountries, getCity } from "src/action/globalApi";
import {
  Box,
  Typography,
  FormLabel,
  Card,
  Grid,
  Divider,
  Button,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import { getRevenueStageType, getStartupStageType } from "src/action/investorProfileStepper";
import { eventsQuestionDelete, getEventsQuestions } from "src/action/createMandate";

const PreferencesForm = ({
  preferenceFormData,
  setPreferenceFormData,
  setIsVisible,
  isVisible,
  question,
  setQuestion,
  storeQuestion,
  setStoreQuestion,
}) => {
  const dispatch = useDispatch();
  const [formCityData, setFormCityData] = useState("");
  const [formCountryData, setFormCountryData] = useState("");
  const [formRevenueStageData, setFormRevenueStageData] = useState("");
  const [formProductStageData, setFormProductStageData] = useState("");
  const [formTeamSizeData, setFormTeamSizeData] = useState("");
  const [formInvestmentOfferingData, setFormInvestmentOfferingData] = useState("");
  const [formInvestmentAmountData, setFormInvestmentAmountData] = useState("");
  const [prevFormCountryDataLength, setPrevFormCountryDataLength] = useState(0);

  const intl = useIntl();

  const schema = yup.object({
    startupStage: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField.error.message",
        defaultMessage: "Please select startup stage",
      })
    ),
    revenue_status: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField2.error.message",
        defaultMessage: "Please select product stage ",
      })
    ),
    country: yup.array().min(
      1,
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField3.error.message",
        defaultMessage: "Select at least one country",
      })
    ),
    city: yup.array().min(
      1,
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField4.error.message",
        defaultMessage: "Select at least one city",
      })
    ),
    teamSize: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField5.error.message",
        defaultMessage: "Please select team size ",
      })
    ),
    investmentOffering: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField6.error.message",
        defaultMessage: "Please select investment offering",
      })
    ),
    investmentAmount: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField7.error.message",
        defaultMessage: "Please select startup amount ",
      })
    ),
  });
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getStartupStageType());
    dispatch(getRevenueStageType());
  }, [dispatch]);

  const countryData = useSelector((state) => state.globalApi.countries);
  const cityData = useSelector((state) => state.globalApi.cities);

  // const ProductStage = useSelector((state) => state?.investorProfileStepper.startupStageType);
  const startupStage = useSelector((state) => state?.investorProfileStepper.startupStageType);

  const ProductStage = useSelector((state) => state?.investorProfileStepper.preRevenueStageType);
  // Watch the value of the "Country" field
  const mandateId = useSelector((state) => state?.newMandate?.saveMandateId);

  console.log(mandateId);
  useEffect(() => {
    if (mandateId !== "") dispatch(getEventsQuestions(mandateId));
  }, []);

  const eventQuestionList = useSelector((state) => state?.newMandate?.eventQuestions);

  const countryValue = watch("country");
  const cityValue = watch("city");

  // useEffect to log the value whenever it changes
  useEffect(() => {
    if (countryValue !== undefined) {
      dispatch(getCity(countryValue)).then((newCityData) => {
        // Assuming getCity returns a promise that resolves to the new city data
        const validCities = cityValue?.filter((city) => newCityData?.includes(city));
        // // Update city selection to only include valid cities
        setValue("city", validCities);
      });
    }
  }, [countryValue, setValue, dispatch]);

  /**
   * Static data for fields that don't need api calls
   */
  // const startupStage = [
  //   {
  //     id: 1,
  //     name: "Pre Revenue",
  //   },
  //   {
  //     id: 2,
  //     name: "less than $100,000 last 12 months",
  //   },
  //   {
  //     id: 3,
  //     name: "$100,000 to $500,000 last 12 months",
  //   },
  //   {
  //     id: 4,
  //     name: "more than $500,000 last 12 months",
  //   },
  // ];

  // const ProductStage = [
  //   {
  //     id: 1,
  //     name: "Concept only",
  //   },
  //   {
  //     id: 2,
  //     name: "Product in development",
  //   },
  //   {
  //     id: 3,
  //     name: "Prototype/MVP ready",
  //   },
  //   {
  //     id: 4,
  //     name: "Product deployed to customers",
  //   },
  // ];

  const teamSize = [
    {
      id: 1,
      name: "1-5",
    },
    {
      id: 2,
      name: "5-50",
    },
    {
      id: 3,
      name: "More than 50",
    },
    {
      id: 4,
      name: "Any team size",
    },
  ];

  const investmentOffering = [
    {
      id: 1,
      name: "Equity",
    },
    {
      id: 2,
      name: "Debt",
    },
    {
      id: 3,
      name: "Other",
    },
  ];

  const investmentAmount = [
    {
      id: 1,
      name: "less than $10k",
    },
    {
      id: 2,
      name: "$10k - $25k",
    },
    {
      id: 3,
      name: "$25k - $50k",
    },
    {
      id: 4,
      name: "$50k - $150k",
    },
    {
      id: 5,
      name: "$150k - $500k",
    },
    {
      id: 6,
      name: "More than $500k",
    },
  ];

  useEffect(() => {
    setValue(
      "startupStage",
      preferenceFormData?.startupStage
        ? preferenceFormData?.startupStage
        : preferenceFormData?.stage || ""
    );
    setValue("revenue_status", preferenceFormData?.revenue_status || "");
    setValue(
      "country",
      preferenceFormData?.countryList
        ? preferenceFormData?.countryList
        : typeof preferenceFormData?.countryCode === "string"
        ? preferenceFormData.country.includes(",")
          ? preferenceFormData.country.split(",")
          : [preferenceFormData.country]
        : preferenceFormData?.country || []
    );
    setValue(
      "city",
      preferenceFormData?.city ? preferenceFormData?.city : preferenceFormData?.location || []
    );
    setValue("teamSize", preferenceFormData?.teamSize || "");
    setValue("investmentOffering", preferenceFormData?.investmentOffering || "");
    setValue(
      "investmentAmount",
      preferenceFormData?.investmentAmount
        ? preferenceFormData?.investmentAmount
        : preferenceFormData?.amount || ""
    );
  }, [preferenceFormData, setValue]);
  const router = useRouter();

  const { id } = router.query;

  //Question

  const [editButtonClicked, setEditButtonClicked] = useState(false);
  const [selectedQuestionId, setSelectedQuestionID] = useState(null);
  const [helperText, setHelperText] = useState(false);

  const handleClick = () => {
    if (storeQuestion?.length !== 0 && selectedQuestionId !== null) {
      const newQuestions = [...storeQuestion];
      // storeQuestion?.splice(selectedQuestionId, 1, question);
      newQuestions.splice(selectedQuestionId, 1, question);
      setStoreQuestion(newQuestions);
      setQuestion("");

      setEditButtonClicked(false);
      setSelectedQuestionID(null);
    } else {
      if (storeQuestion?.length > 4) {
        setHelperText(true);
        setQuestion("");
      } else {
        setStoreQuestion([...storeQuestion, question]);
        setQuestion("");
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setHelperText(false);
    }, 10000);
  }, []);

  const handleEdit = (index, item) => {
    setEditButtonClicked(true);
    setSelectedQuestionID(index);
    setQuestion(item);
    setHelperText(false);
  };

  const handleDelete = (item) => {
    const deleteId = eventQuestionList?.filter((ele) => ele?.question === item);
    if (deleteId.length !== 0) {
      dispatch(eventsQuestionDelete(deleteId[0]?.id));
    }
    const deletedQuestionId = storeQuestion.indexOf(item);

    if (deletedQuestionId !== -1) {
      // storeQuestion?.splice(deletedQuestionId, 1);
      // setStoreQuestion([...storeQuestion]);
      const newStoreQuestion = [...storeQuestion];
      newStoreQuestion.splice(deletedQuestionId, 1);
      setStoreQuestion(newStoreQuestion);
    }
    setHelperText(false);
    setQuestion("");
  };

  const getBtnText = () => {
    if (editButtonClicked === false || question === "") {
      return (
        <FormattedMessage
          id="quickQuestionsForm.step3.card.submit.button.add"
          defaultMessage="Add"
        />
      );
    } else {
      return (
        <FormattedMessage
          id="quickQuestionsForm.step3.card.submit.button.update"
          defaultMessage="Update"
        />
      );
    }
  };

  const onSubmit = (data) => {
    setIsVisible(true);
    setPreferenceFormData(data);
  };

  return (
    <Box
      sx={{
        mt: 2,
        maxWidth: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        sx={{
          width: "100%",
          height: "auto",
          p: { xs: "", sm: 1, md: 4 },
        }}
      >
        <Typography className={styles.formTextWOBold}>
          <FormattedMessage
            id="preferencesForm.step2.card.heading"
            defaultMessage="What kind of startups are you looking for?"
          />
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  {intl.formatMessage({
                    id: "preferencesForm.step2.form.inputField.label",
                    defaultMessage: "Startup stage",
                  })}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <Controller
                  name="startupStage"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      labelId="single-select-label"
                      id="single-select"
                      {...field}
                      displayEmpty
                      sx={{
                        color:
                          control?._fields?.startupStage?._f?.value?.length === 0
                            ? "gray"
                            : "black",
                      }}
                      renderValue={(selected) => {
                        if (selected?.length === 0) {
                          return (
                            <FormattedMessage
                              id="preferencesForm.step2.form.inputField.placeholder"
                              defaultMessage=" Select startup stage"
                            />
                          );
                        }
                        setFormRevenueStageData(selected);
                        if (formRevenueStageData !== selected && isVisible === true) {
                          setIsVisible(false);
                        }
                        return selected;
                      }}
                    >
                      {startupStage?.map((option) => (
                        <MenuItem key={option?.id} value={option?.stage_name}>
                          {option?.stage_name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.startupStage && (
                  <span className={styles.error}>{errors.startupStage?.message}</span>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={6}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  {intl.formatMessage({
                    id: "preferencesForm.step2.form.inputField2.label",
                    defaultMessage: "Revenue Status",
                  })}{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <Controller
                  name="revenue_status"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      labelId="single-select-label"
                      id="single-select"
                      {...field}
                      displayEmpty
                      sx={{
                        color:
                          control?._fields?.revenue_status?._f?.value?.length === 0
                            ? "gray"
                            : "black",
                      }}
                      renderValue={(selected) => {
                        setFormProductStageData(selected);
                        if (formProductStageData !== selected && isVisible === true) {
                          setIsVisible(false);
                        }
                        if (selected?.length === 0) {
                          return (
                            <FormattedMessage
                              id="preferencesForm.step2.form.inputField2.placeholder"
                              defaultMessage="Select revenue status"
                            />
                          );
                        }
                        return selected;
                      }}
                    >
                      {ProductStage?.map((option) => (
                        <MenuItem key={option?.id} value={option?.revenue_name}>
                          {option?.revenue_name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.revenue_status && (
                  <span className={styles.error}>{errors.revenue_status?.message}</span>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={12} md={6} xl={6}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="preferencesForm.step2.form.inputField3.label"
                    defaultMessage="Startup Country"
                  />{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>

                <Controller
                  name="country"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      labelId="multi-select-label"
                      id="multi-select"
                      multiple
                      displayEmpty
                      sx={{
                        color:
                          control?._fields?.country?._f?.value?.length === 0 ? "gray" : "black",
                      }}
                      {...field}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: { xs: "240px", sm: "auto" },
                            width: { xs: "70%", sm: "auto" },
                          },
                        },
                      }}
                      renderValue={(selected) => {
                        setFormCountryData(selected);
                        if (
                          JSON.stringify(formCountryData) !== JSON.stringify(selected) &&
                          isVisible === true
                        ) {
                          setIsVisible(false);
                        }
                        if (selected?.length === 0) {
                          return (
                            <FormattedMessage
                              id="preferencesForm.step2.form.inputField4.placeholder"
                              defaultMessage="Select your startup country"
                            />
                          );
                        }
                        return selected
                          ?.map((value) => {
                            const countryOption = countryData.find(
                              (option) => option.countryCode === value
                            );
                            return countryOption?.country || value;
                          })
                          .join(", ");
                      }}
                    >
                      {countryData?.map((option, ind) => (
                        <MenuItem
                          key={ind}
                          value={option?.countryCode}
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          <Checkbox checked={field.value.includes(option?.countryCode)} />
                          <ListItemText primary={option?.country} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {errors.country && <span className={styles.error}>{errors.country?.message}</span>}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={6}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="preferencesForm.step2.form.inputField5.label"
                    defaultMessage="Startup City"
                  />{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <Controller
                  name="city"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      labelId="multi-select-label"
                      id="multi-select"
                      multiple
                      displayEmpty
                      sx={{
                        color: control?._fields?.city?._f?.value?.length === 0 ? "gray" : "black",
                      }}
                      {...field}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: { xs: "240px", sm: "auto" },
                            width: { xs: "70%", sm: "auto" },
                          },
                        },
                      }}
                      renderValue={(selected) => {
                        setFormCityData(selected);
                        if (
                          JSON.stringify(formCityData) !== JSON.stringify(selected) &&
                          isVisible === true
                        ) {
                          setIsVisible(false);
                        }
                        if (selected?.length === 0) {
                          return (
                            <FormattedMessage
                              id="preferencesForm.step2.form.inputField5.placeholder"
                              defaultMessage="Select your startup city"
                            />
                          );
                        }
                        return selected.join(", ");
                      }}
                    >
                      {cityData?.map((option, ind) => (
                        <MenuItem
                          key={ind}
                          value={option}
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          <Checkbox checked={field.value.includes(option)} />
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.city && <span className={styles.error}>{errors.city?.message}</span>}
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "10px", marginBottom: "10px" }}>
            <Grid item xs={12} sm={12} md={6} xl={6}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="preferencesForm.step2.form.inputField6.label"
                    defaultMessage="Team Size"
                  />{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <Controller
                  name="teamSize"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      labelId="single-select-label"
                      id="single-select"
                      displayEmpty
                      sx={{
                        color:
                          control?._fields?.teamSize?._f?.value?.length === 0 ? "gray" : "black",
                      }}
                      {...field}
                      renderValue={(selected) => {
                        setFormTeamSizeData(selected);
                        if (formTeamSizeData !== selected && isVisible === true) {
                          setIsVisible(false);
                        }
                        if (selected?.length === 0) {
                          return (
                            <FormattedMessage
                              id="preferencesForm.step2.form.inputField6.placeholder"
                              defaultMessage="Select your team size"
                            />
                          );
                        }
                        return selected;
                      }}
                    >
                      {teamSize?.map((option) => (
                        <MenuItem key={option?.id} value={option?.name}>
                          {option?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.teamSize && (
                  <span className={styles.error}>{errors.teamSize?.message}</span>
                )}
              </Box>
            </Grid>
          </Grid>
          <Divider></Divider>
          <Typography className={styles.formTextWOBold}>
            <FormattedMessage
              id="preferencesForm.step2.form.heading2"
              defaultMessage="What are you offering the startup?"
            />
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={12} md={6} xl={6}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="preferencesForm.step2.form.inputFiled7.label"
                    defaultMessage="Investment Offering"
                  />{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <Controller
                  name="investmentOffering"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      labelId="single-select-label"
                      id="single-select"
                      displayEmpty
                      sx={{
                        color:
                          control?._fields?.investmentOffering?._f?.value?.length === 0
                            ? "gray"
                            : "black",
                      }}
                      {...field}
                      renderValue={(selected) => {
                        setFormInvestmentOfferingData(selected);
                        if (formInvestmentOfferingData !== selected && isVisible === true) {
                          setIsVisible(false);
                        }
                        if (selected?.length === 0) {
                          return (
                            <FormattedMessage
                              id="preferencesForm.step2.form.inputFiled7.placeholder"
                              defaultMessage="Select investment offering"
                            />
                          );
                        }
                        return selected;
                      }}
                    >
                      {investmentOffering?.map((option) => (
                        <MenuItem key={option?.id} value={option?.name}>
                          {option?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.investmentOffering && (
                  <span className={styles.error}>{errors.investmentOffering?.message}</span>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={6}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  <FormattedMessage
                    id="preferencesForm.step2.form.inputFiled8.label"
                    defaultMessage="Investment amount"
                  />{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <Controller
                  name="investmentAmount"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      labelId="single-select-label"
                      id="single-select"
                      {...field}
                      displayEmpty
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: { xs: "240px", sm: "auto" },
                            width: { xs: "70%", sm: "auto" },
                          },
                        },
                      }}
                      sx={{
                        color:
                          control?._fields?.teamSize?._f?.value?.length === 0 ? "gray" : "black",
                      }}
                      renderValue={(selected) => {
                        setFormInvestmentAmountData(selected);
                        if (formInvestmentAmountData !== selected && isVisible === true) {
                          setIsVisible(false);
                        }
                        if (selected?.length === 0) {
                          return (
                            <FormattedMessage
                              id="preferencesForm.step2.form.inputFiled8.placeholder"
                              defaultMessage="Select investment amount"
                            />
                          );
                        }
                        return selected;
                      }}
                    >
                      {investmentAmount?.map((option) => (
                        <MenuItem
                          key={option?.id}
                          value={option?.name}
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {option?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.investmentAmount && (
                  <span className={styles.error}>{errors.investmentAmount?.message}</span>
                )}
              </Box>
            </Grid>
            <Box
              sx={{
                // maxWidth: "100%",
                mt: 2,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                sx={{
                  width: "100%",
                  // height: "auto",
                  py: 3,
                  px: 1,
                }}
              >
                <Typography
                  className={styles.formTextWOBold}
                  sx={{
                    fontSize: {
                      xs: "13px",
                      sm: "15px",
                      md: "17px",
                    },
                  }}
                >
                  <FormattedMessage
                    id="quickQuestionsForm.step3.card.heading"
                    defaultMessage="Don't bother asking the name, or the location, or the description of the startup or
            contact details or the profile of the team. We get them anyway."
                  />
                </Typography>
                <Box sx={{ marginLeft: "20px", marginTop: "5px", display: "flex" }}>
                  <Typography className={styles.inputField}>Quick Question</Typography>
                </Box>
                <Grid
                  sx={{
                    height: storeQuestion.length === 0 ? "300px" : "",
                  }}
                >
                  <TextField
                    id="filled-multiline-static"
                    placeholder={intl.formatMessage({
                      id: "quickQuestionsForm.step3.form.textField.placeholder",
                      defaultMessage: "Create your question",
                    })}
                    multiline
                    rows={4}
                    variant="filled"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    inputProps={{ minLength: 4, maxLength: 150 }} // Define min and max length for the input
                    error={
                      ((question.length <= 4 || question.length >= 150) && question !== "") ||
                      helperText === true
                    } // Set error state based on min and max length criteria
                    helperText={
                      (question.length <= 4 || question.length >= 150) && question !== "" ? (
                        <FormattedMessage
                          id="quickQuestionsForm.step3.form.textField.helperText"
                          defaultMessage="Question must be between 4 and 150 characters long"
                        />
                      ) : helperText === true ? (
                        <FormattedMessage
                          id="quickQuestionsForm.step3.form.textField.helperText.maxQuestion"
                          defaultMessage="Max 5 Questions are allowed"
                        />
                      ) : (
                        ""
                      )
                    }
                    sx={{
                      marginTop: "10px",
                      width: "94%",
                      backgroundColor: "#fff",
                      margin: 3,
                    }}
                  />

                  <div className={styles.btnStyle}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleClick()}
                      disabled={question === "" ? true : false}
                    >
                      {getBtnText()}
                    </Button>
                  </div>

                  {storeQuestion?.length !== 0
                    ? storeQuestion?.map((item, index) => (
                        <Grid
                          key={index}
                          container
                          justifyContent="center"
                          alignItems="center"
                          sx={{ padding: "10px 15px" }}
                        >
                          <Grid item xs={12} sm={6} md={8} lg={8}>
                            <Typography
                              sx={{
                                maxWidth: "100%",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                              }}
                            >
                              {`${index + 1}.${item}`}
                            </Typography>
                          </Grid>
                          {/* {!id && (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={4}
                              className={styles.iconBtn}
                              sx={{ marginTop: { xs: "10px", sm: "10px", md: 0 } }}
                            >
                              <Grid item xs={6} sm={3} md={2} lg={2} textAlign={"center"}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleEdit(index, item)}
                                >
                                  <EditIcon />
                                </Button>
                              </Grid>
                              <Grid item xs={6} sm={3} md={2} lg={2} textAlign={"center"}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleDelete(item)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          )} */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            className={styles.iconBtn}
                            sx={{ marginTop: { xs: "10px", sm: "10px", md: 0 } }}
                          >
                            <Grid item xs={6} sm={3} md={2} lg={2} textAlign={"center"}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleEdit(index, item)}
                              >
                                <EditIcon />
                              </Button>
                            </Grid>
                            <Grid item xs={6} sm={3} md={2} lg={2} textAlign={"center"}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleDelete(item)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))
                    : null}
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
            <Button type="submit" variant="outlined">
              <FormattedMessage
                id="preferencesForm.step2.form.button.submit.text"
                defaultMessage="Save"
              />
            </Button>
          </div>
        </form>
      </Grid>
    </Box>
  );
};

export default PreferencesForm;
