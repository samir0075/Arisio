/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Controller, useForm } from "react-hook-form";
import { getDomains, getTechnologies, getCountries, getCity } from "src/action/globalApi";
import MobileStepper from "@mui/material/MobileStepper";
import { getInvestorProfileStepperData } from "src/action/investorProfileStepper";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

const ProfileStepperModal = ({ columns, data, open, setOpen, handelSubmit }) => {
  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [city, setSelectedCity] = useState("");
  const [investorType, setInvestorType] = useState("");
  const [globalData, setGlobalData] = useState();
  const router = useRouter();
  const {
    // register,
    control,
    // handleSubmit,
    watch,
    // formState: { errors },
    // setValue,
  } = useForm({
    // resolver: yupResolver(schema),
  });

  const InvestorType = [
    {
      id: "1",
      name: "Angel Investor",
    },
    {
      id: "2",
      name: "Family Office",
    },
    {
      id: "3",
      name: "Venture Capital (VC)",
    },
    {
      id: "4",
      name: "Venture Builder",
    },
    {
      id: "5",
      name: "Incubator",
    },
    {
      id: "6",
      name: "Accelerator",
    },
    {
      id: "7",
      name: "Corporate Venture Investor",
    },
    {
      id: "8",
      name: "Government/Development Fund",
    },
    {
      id: "9",
      name: "Sovereign Wealth Fund",
    },
    {
      id: "10",
      name: "Private Equity (PE)",
    },
  ];

  const steps = [
    {
      description: (
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card sx={{ minWidth: { xs: 250, sm: 500 } }}>
            <CardContent>
              <Typography
                sx={{
                  fontSize: 14,
                  textAlign: "center",
                  color: "rgba(108, 25, 62, 1)",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Enter Organization Name
              </Typography>
              <TextField
                required
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                id="standard-basic"
                variant="standard"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </CardContent>
          </Card>
        </Box>
      ),
    },
    {
      description: (
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card sx={{ minWidth: { xs: 280, sm: 500 } }}>
            <CardContent>
              <Typography
                sx={{
                  fontSize: 14,
                  textAlign: "center",
                  color: "rgba(108, 25, 62, 1)",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Where are you located ?
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-evenly",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormLabel style={{ marginTop: "10px" }}>Country</FormLabel>
                  <Controller
                    name="country"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Select
                        style={{ width: "150px", marginTop: "20px" }}
                        size="small"
                        labelId="select"
                        {...field}
                        // onChange={(e) => setSelectedCountry(e.target.value)}
                        // value={country}
                      >
                        {countryData?.map((option) => (
                          <MenuItem key={option?.countryCode} value={option.countryCode}>
                            <ListItemText primary={option?.country} />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormLabel style={{ marginTop: "10px" }}>City</FormLabel>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Select
                        style={{ width: "150px", marginTop: "20px" }}
                        size="small"
                        labelId="select"
                        {...field}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        value={city}
                      >
                        {cityData?.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ),
    },
    {
      description: (
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card sx={{ minWidth: { xs: 250, sm: 500 } }}>
            <CardContent>
              <Typography
                sx={{
                  fontSize: 14,
                  textAlign: "center",
                  color: "rgba(108, 25, 62, 1)",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                What best describes your organization?
              </Typography>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <AccountCircleIcon
                  style={{ fontSize: "40px", color: "rgba(108, 25, 62, 1)", margin: "10px 0px" }}
                />
                <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>Investor</Typography> */}

                <FormLabel style={{ display: "flex", margin: "10px 0px" }}>
                  <FormattedMessage
                    id="investorSignUp.investorType.textfield"
                    defaultMessage="Investor Type"
                  />
                  <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Controller
                  name="investorType"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "Please select an investor type" }}
                  render={({ field }) => (
                    <Select
                      // InputProps={{
                      //   sx: inputStyles, // Apply the styles generated by the function
                      // }}
                      size="small"
                      {...field}
                      labelId="single-select-label"
                      id="single-select"
                      // error={Boolean(errors.investorType)}
                      fullWidth
                      displayEmpty
                      onChange={(e) => {
                        setInvestorType(e.target.value);
                      }}
                      value={investorType}
                    >
                      <MenuItem value="" disabled>
                        Select Investor Type
                      </MenuItem>
                      {InvestorType.map((option) => (
                        <MenuItem key={option.id} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {/* {errors.investorType && (
                  <span className={styles.error}>{errors.investorType?.message}</span>
                )} */}
              </Box>
            </CardContent>
          </Card>
        </Box>
      ),
    },
    {
      description: (
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card sx={{ minWidth: { xs: 250, sm: 500 } }}>
            <CardContent>
              <Typography
                sx={{
                  fontSize: 14,
                  textAlign: "center",
                  color: "rgba(108, 25, 62, 1)",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Finally, Lets confirm your eligibility
              </Typography>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  // justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControlLabel control={<Checkbox color="success" defaultChecked />} />
                <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
                  I am atleast 18 years old
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ),
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDomains());
    dispatch(getTechnologies());
    dispatch(getCountries());
  }, [dispatch]);

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const userId = userDetails?.id;
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setGlobalData({ name, countryName, city });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const investorIdObj = useSelector((state) => state?.investorProfileStepper?.investorId);
  const investorId = investorIdObj?.investorId;

  if (userDetails) {
    userDetails.investorId = investorId;
  }

  // const updatedUserData = JSON.stringify(userDetails);
  // localStorage.setItem("userDetails", updatedUserData);

  const countryData = useSelector((state) => state.globalApi.countries);

  const cityData = useSelector((state) => state.globalApi.cities);

  // Watch the value of the "Country" field
  const countryValue = watch("country");

  const countryName = countryData.find((country) => country.countryCode === countryValue)?.country;

  // useEffect to log the value whenever it changes
  useEffect(() => {
    dispatch(getCity(countryValue));
  }, [countryValue, dispatch]);

  const handleSubmit = () => {
    const data = {
      name,
      country: countryName,
      city: city,
      investorType: investorType,
    };
    dispatch(getInvestorProfileStepperData(userId, data)).then((res) => {
      /** Updating the UserDetails*/
      const investorData = res;
      const existingData = JSON.parse(localStorage.getItem("userDetails"));
      const updatedData = { ...existingData, ...investorData };
      localStorage.setItem("userDetails", JSON.stringify(updatedData));
      // setTimeout(() => {
      //   window.location.reload();
      // }, [3000]);
    });
    router.push("/Profile");
    toast.warn("Please Update the profile to access the platform!", {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 80px)",
          backgroundColor: "#eaf0f1",
          paddingBottom: "30px",
          width: "100%",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {/* <AccountCircleIcon
            style={{ fontSize: "80px", color: "rgba(108, 25, 62, 1)", margin: "20px 0px" }}
          /> */}
          <img style={{ margin: "20px 0px" }} src="/Images/icon_individual_Investor.png" />
          <Typography style={{ fontWeight: "bold", color: "rgba(108, 25, 62, 1)" }}>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Let's Begin
          </Typography>
          <Typography style={{ fontWeight: "bold", margin: "20px 0px" }}>
            Tell us little bit about yourself
          </Typography>

          <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
            <Box sx={{ p: 2 }}>{steps[activeStep].description}</Box>
            <MobileStepper
              variant="text"
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  disabled={activeStep === steps.length - 1 ? false : name.trim() === ""}
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}

                  {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  Back
                </Button>
              }
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};
ProfileStepperModal.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default ProfileStepperModal;
