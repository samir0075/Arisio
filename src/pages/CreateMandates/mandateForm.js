import React, { useEffect, useState } from "react";
import styles from "./createMandate.module.css";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MandateStepperForm from "./mandateStepperForm";
import PreferencesForm from "./preferencesForm";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Tab, Button, CardMedia, Stack, MobileStepper } from "@mui/material";
import QuickQuestionForm from "./quickQuestionForm";
import { useRouter, useSearchParams } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";
import dayjs from "dayjs";

const MandateForm = () => {
  const intl = useIntl();
  const theme = useTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState("1");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [picture, setPicture] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formData, setFormData] = useState({});
  const [preferenceFormData, setPreferenceFormData] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [storeQuestion, setStoreQuestion] = useState([]);
  const [savePicture, setSavePicture] = useState();
  const searchParams = useSearchParams();
  const formDetails = JSON.parse(searchParams.get("details"));
  const otherData = localStorage.getItem("othersTech");
  const otherTechData = otherData ? JSON.parse(otherData) : null;
  const domainData = localStorage.getItem("othersDomain");
  const otherDomainData = domainData ? JSON.parse(domainData) : null;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNext = () => {
    setFormData({
      name,
      desc,
      picture,
      date: [dayjs(startDate).format("YYYY-MM-DD"), dayjs(endDate).format("YYYY-MM-DD")],
      ...preferenceFormData,
      storeQuestion,
    });
    if (activeStep === 3) {
      setValue("2");
    } else if (activeStep === 4) {
      setValue("3");
    } else if (activeStep === 5) {
      const modifiedStoreQuestion = storeQuestion?.map((r) => r?.trim());
      const modifiedFormData = {
        ...formData,
        modifiedStoreQuestion,
        otherTechData,
        otherDomainData,
      };
      router.push(`./showMandates?details=${JSON.stringify(modifiedFormData)}`);
    } else {
      null;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 4) {
      setValue("1");
    } else if (activeStep === 5) {
      setValue("2");
    } else {
      null;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month?.padStart(2, "0");
    const paddedDay = day?.padStart(2, "0");

    return `${paddedDay}/${paddedMonth}/${year}`;
  };

  useEffect(() => {
    if (formDetails) {
      setName(formDetails?.name || formDetails?.title);
      setDesc(formDetails?.desc || formDetails?.description);
      setPicture(formDetails?.picture || formDetails?.images?.id);
      setSavePicture(formDetails?.picture || formDetails?.images?.id);
      setStartDate(formDetails?.date?.[0] || formDetails?.startDate);
      setEndDate(formDetails?.date?.[1] || formDetails?.endDate);
      setPreferenceFormData({
        startupStage: formDetails?.startupStage || formDetails?.stage,
        productStage: formDetails?.productStage || formDetails?.productStage,
        city: formDetails?.city || formDetails?.location,
        country:
          typeof formDetails?.country === "string"
            ? [formDetails?.country]
            : formDetails?.country || typeof formDetails?.country === "string"
            ? [formDetails?.country]
            : formDetails?.country,
        teamSize: formDetails?.teamSize || formDetails?.teamSize,
        investmentOffering: formDetails?.investmentOffering || formDetails?.investmentOffering,
        investmentAmount: formDetails?.investmentAmount || formDetails?.amount,
      });
    }
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 2,
        background: "rgba(65, 148, 179,0.1) !important",
      }}
    >
      <Typography className={styles.formHeading} style={{ fontSize: "26px" }}>
        <FormattedMessage
          id="mandateForm.main.heading"
          defaultMessage="Now set up your mandate form"
        />
      </Typography>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <TabList
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
            >
              <Tab
                label={intl.formatMessage({
                  id: "mandateForm.tab.panel.tab1.heading",
                  defaultMessage: "CREATE A MANDATE",
                })}
                value="1"
                className={styles.tabStyle}
              />
              <Tab
                label={intl.formatMessage({
                  id: "mandateForm.tab.panel.tab2.heading",
                  defaultMessage: "PREFERENCES",
                })}
                value="2"
                className={styles.tabStyle}
              />
              <Tab
                label={intl.formatMessage({
                  id: "mandateForm.tab.panel.tab3.heading",
                  defaultMessage: "QUICK QUESTIONS",
                })}
                value="3"
                className={styles.tabStyle}
              />
            </TabList>
          </Box>

          <TabPanel value="1">
            <Stack spacing={1} className={styles.stack}>
              <CardMedia
                component="img"
                image={`/Images/rocket.png`}
                alt="Mandate Form"
                sx={{ width: "9rem" }}
              />
              <Typography className={styles.formtext} style={{ fontSize: "26px" }}>
                <FormattedMessage
                  id="mandateForm.tab.panel.tab1.card.heading"
                  defaultMessage="Create your Mandate"
                />
              </Typography>
              <Typography className={styles.formSubtext} style={{ fontSize: "20px" }}>
                <FormattedMessage
                  id="mandateForm.tab.panel.tab1.card.heading2"
                  defaultMessage="Mandate details will be published for startups to view"
                />
              </Typography>
            </Stack>
            <MandateStepperForm
              activeStep={activeStep}
              name={name}
              setName={setName}
              setDesc={setDesc}
              desc={desc}
              picture={picture}
              setPicture={setPicture}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              formdata={formData}
              savePicture={savePicture}
              setSavePicture={setSavePicture}
            />
          </TabPanel>
          <TabPanel value="2">
            <Stack spacing={1} className={styles.stack}>
              <CardMedia
                component="img"
                image={`/Images/preference.png`}
                alt="Mandate Form"
                sx={{ width: "9rem" }}
              />
              <Typography className={styles.formtext} style={{ fontSize: "26px" }}>
                <FormattedMessage
                  id="mandateForm.tab.panel.tab2.card.heading"
                  defaultMessage="Set mandate preferences"
                />
              </Typography>
              <PreferencesForm
                preferenceFormData={preferenceFormData}
                setPreferenceFormData={setPreferenceFormData}
                setIsVisible={setIsVisible}
                isVisible={isVisible}
              />
            </Stack>
          </TabPanel>
          <TabPanel value="3">
            <Stack spacing={1} className={styles.stack}>
              <CardMedia
                component="img"
                image={`/Images/startups.png`}
                alt="Mandate Form"
                sx={{ width: "9rem" }}
              />
              <Typography className={styles.formtext} style={{ fontSize: "26px" }}>
                <FormattedMessage
                  id="mandateForm.tab.panel.tab2.card.heading2"
                  defaultMessage="Add your short-answer questions here"
                />
              </Typography>
              <QuickQuestionForm
                setQuestion={setQuestion}
                question={question}
                storeQuestion={storeQuestion}
                setStoreQuestion={setStoreQuestion}
              />
            </Stack>
          </TabPanel>
          <MobileStepper
            steps={6}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={
                  activeStep === 7 - 1 ||
                  (activeStep === 4 && !isVisible) ||
                  (activeStep === 0 && !name) ||
                  (activeStep === 0 && name.length < 2) ||
                  (activeStep === 0 && name.length > 80) ||
                  (activeStep === 1 && !desc) ||
                  (activeStep === 1 && desc.length > 450) ||
                  (activeStep === 1 && desc.length < 4) ||
                  (activeStep === 2 && !picture) ||
                  (activeStep === 3 && formatDate(startDate) !== formatDate(new Date())) ||
                  (activeStep === 3 && !endDate) ||
                  (activeStep === 5 && storeQuestion?.length === 0)
                }
              >
                <FormattedMessage
                  id="mandateForm.tab.panel.stepper.button.next"
                  defaultMessage="Next"
                />
                {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                <FormattedMessage
                  id="mandateForm.tab.panel.stepper.button.back"
                  defaultMessage="Back"
                />
              </Button>
            }
            sx={{ backgroundColor: "transparent" }}
          />
        </TabContext>
      </Box>
    </Box>
  );
};

MandateForm.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default MandateForm;
