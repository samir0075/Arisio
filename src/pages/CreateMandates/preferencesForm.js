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
  Select
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

const PreferencesForm = ({
  preferenceFormData,
  setPreferenceFormData,
  setIsVisible,
  isVisible
}) => {
  const dispatch = useDispatch();
  const [formCityData, setFormCityData] = useState("");
  const [formCountryData, setFormCountryData] = useState("");
  const [formStartupStageData, setFormStartupStageData] = useState("");
  const [formProductStageData, setFormProductStageData] = useState("");
  const [formTeamSizeData, setFormTeamSizeData] = useState("");
  const [formInvestmentOfferingData, setFormInvestmentOfferingData] = useState("");
  const [formInvestmentAmountData, setFormInvestmentAmountData] = useState("");

  const intl = useIntl();

  const schema = yup.object({
    startupStage: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField.error.message",
        defaultMessage: "Please select startup stage"
      })
    ),
    productStage: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField2.error.message",
        defaultMessage: "Please select product stage "
      })
    ),
    country: yup.array().min(
      1,
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField3.error.message",
        defaultMessage: "Select at least one country"
      })
    ),
    city: yup.array().min(
      1,
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField4.error.message",
        defaultMessage: "Select at least one city"
      })
    ),
    teamSize: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField5.error.message",
        defaultMessage: "Please select team size "
      })
    ),
    investmentOffering: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField6.error.message",
        defaultMessage: "Please select investment offering"
      })
    ),
    investmentAmount: yup.string().required(
      intl.formatMessage({
        id: "preferencesForm.step2.form.inputField7.error.message",
        defaultMessage: "Please select startup amount "
      })
    )
  });
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = data => {
    setIsVisible(true);
    setPreferenceFormData(data);
  };

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  const countryData = useSelector(state => state.globalApi.countries);
  const cityData = useSelector(state => state.globalApi.cities);

  // Watch the value of the "Country" field
  const countryValue = watch("country");

  // useEffect to log the value whenever it changes
  useEffect(() => {
    dispatch(getCity(countryValue));
  }, [countryValue, dispatch]);

  /**
   * Static data for fields that don't need api calls
   */
  const startupStage = [
    {
      id: 1,
      name: "Pre Revenue"
    },
    {
      id: 2,
      name: "less than $100,000 last 12 months"
    },
    {
      id: 3,
      name: "$100,000 to $500,000 last 12 months"
    },
    {
      id: 4,
      name: "more than $500,000 last 12 months"
    }
  ];

  const ProductStage = [
    {
      id: 1,
      name: "Concept only"
    },
    {
      id: 2,
      name: "Product in development"
    },
    {
      id: 3,
      name: "Prototype/MVP ready"
    },
    {
      id: 4,
      name: "Product deployed to customers"
    }
  ];

  const teamSize = [
    {
      id: 1,
      name: "1-5"
    },
    {
      id: 2,
      name: "5-50"
    },
    {
      id: 3,
      name: "More than 50"
    },
    {
      id: 4,
      name: "Any team size"
    }
  ];

  const investmentOffering = [
    {
      id: 1,
      name: "Equity"
    },
    {
      id: 2,
      name: "Debt"
    },
    {
      id: 3,
      name: "Other"
    }
  ];

  const investmentAmount = [
    {
      id: 1,
      name: "less than $10k"
    },
    {
      id: 2,
      name: "$10k - $25k"
    },
    {
      id: 3,
      name: "$25k - $50k"
    },
    {
      id: 4,
      name: "$50k - $150k"
    },
    {
      id: 5,
      name: "$150k - $500k"
    },
    {
      id: 6,
      name: "More than $500k"
    }
  ];

  useEffect(() => {
    setValue("startupStage", preferenceFormData?.startupStage || "");
    setValue("productStage", preferenceFormData?.productStage || "");
    setValue("country", preferenceFormData?.country || []);
    setValue("city", preferenceFormData?.city || []);
    setValue("teamSize", preferenceFormData?.teamSize || "");
    setValue("investmentOffering", preferenceFormData?.investmentOffering || "");
    setValue("investmentAmount", preferenceFormData?.investmentAmount || "");
  }, [preferenceFormData, setValue]);

  return (
    <Box
      sx={{
        maxWidth: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Card
        sx={{
          width: "60vw",
          height: "auto",
          p: 4
        }}
      >
        <Typography className={styles.formtext} sx={{ fontSize: "20px", textAlign: "center" }}>
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
                    defaultMessage: "Startup Stage"
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
                          control?._fields?.startupStage?._f?.value?.length === 0 ? "gray" : "black"
                      }}
                      renderValue={selected => {
                        if (selected?.length === 0) {
                          return (
                            <FormattedMessage
                              id="preferencesForm.step2.form.inputField.placeholder"
                              defaultMessage="Select startup stage"
                            />
                          );
                        }
                        setFormStartupStageData(selected);
                        if (formStartupStageData !== selected && isVisible === true) {
                          setIsVisible(false);
                        }
                        return selected;
                      }}
                    >
                      {startupStage?.map(option => (
                        <MenuItem key={option?.id} value={option?.name}>
                          {option?.name}
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
            <Grid item xs={12} sm={12} md={6} xl={6} sx={{ width: "100%" }}>
              <Box className={styles.inputExternal}>
                <FormLabel className={styles.inputField}>
                  {intl.formatMessage({
                    id: "preferencesForm.step2.form.inputField2.label",
                    defaultMessage: "Product Stage"
                  })}{" "}
                  <span className={styles.error}>*</span>
                </FormLabel>
                <Controller
                  name="productStage"
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
                          control?._fields?.productStage?._f?.value?.length === 0 ? "gray" : "black"
                      }}
                      renderValue={selected => {
                        setFormProductStageData(selected);
                        if (formProductStageData !== selected && isVisible === true) {
                          setIsVisible(false);
                        }
                        if (selected?.length === 0) {
                          return (
                            <FormattedMessage
                              id="preferencesForm.step2.form.inputField2.placeholder"
                              defaultMessage="Select product stage"
                            />
                          );
                        }
                        return selected;
                      }}
                    >
                      {ProductStage?.map(option => (
                        <MenuItem key={option?.id} value={option?.name}>
                          {option?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.productStage && (
                  <span className={styles.error}>{errors.productStage?.message}</span>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "10px" }}>
            <Grid item xs={6}>
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
                        color: control?._fields?.country?._f?.value?.length === 0 ? "gray" : "black"
                      }}
                      {...field}
                      renderValue={selected => {
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
                          .map(value => {
                            const countryOption = countryData.find(
                              option => option.countryCode === value
                            );
                            return countryOption?.country || value;
                          })
                          .join(", ");
                      }}
                    >
                      {countryData?.map(option => (
                        <MenuItem key={option?.countryCode} value={option?.countryCode}>
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
            <Grid item xs={6}>
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
                        color: control?._fields?.city?._f?.value?.length === 0 ? "gray" : "black"
                      }}
                      {...field}
                      renderValue={selected => {
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
                      {cityData?.map(option => (
                        <MenuItem key={option} value={option}>
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
            <Grid item xs={6}>
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
                          control?._fields?.teamSize?._f?.value?.length === 0 ? "gray" : "black"
                      }}
                      {...field}
                      renderValue={selected => {
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
                      {teamSize?.map(option => (
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
          <Typography className={styles.formtext} sx={{ fontSize: "20px", textAlign: "center" }}>
            <FormattedMessage
              id="preferencesForm.step2.form.heading2"
              defaultMessage="What are you offering the startup?"
            />
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: "10px" }}>
            <Grid item xs={6}>
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
                            : "black"
                      }}
                      {...field}
                      renderValue={selected => {
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
                      {investmentOffering?.map(option => (
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
            <Grid item xs={6}>
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
                      sx={{
                        color:
                          control?._fields?.teamSize?._f?.value?.length === 0 ? "gray" : "black"
                      }}
                      renderValue={selected => {
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
                      {investmentAmount?.map(option => (
                        <MenuItem key={option?.id} value={option?.name}>
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
          </Grid>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
            <Button type="submit" variant="outlined">
              <FormattedMessage
                id="preferencesForm.step2.form.button.submit.text"
                defaultMessage="Save"
              />
            </Button>
          </div>
        </form>
      </Card>
    </Box>
  );
};

export default PreferencesForm;
