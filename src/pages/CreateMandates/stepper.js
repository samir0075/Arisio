import ExternalContainer from "src/components/ExternalContainer";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper as MuiStepper,
  Typography,
  Grid,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import MandateForm from "./createMandateForm";
import PreferencesForm from "./createPreferencesForm";
import { useDispatch, useSelector } from "react-redux";
import {
  displayMandateDetails,
  getEventsQuestions,
  launchMandate,
  navigateIncompleteMandate,
  saveEventsQuestion,
  selectedMandateDetails,
  showMandateDetails,
} from "src/action/createMandate";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { FormattedMessage } from "react-intl";
import PreviewMandate from "./previewMandate";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { mandateActions } from "../../store/createMandateSlice";
import { styled } from "@mui/material/styles";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";

const RTLConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    left: "calc(-50% + 20px)",
    right: "calc(+50% + 20px)",
  },
}));

const Stepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mandateDetails, setMandateDetails] = useState("");
  const [picture, setPicture] = useState("");
  const [savePicture, setSavePicture] = useState();
  const [disable, setDisable] = useState(true);
  const [preferenceFormData, setPreferenceFormData] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [storeQuestion, setStoreQuestion] = useState([]);
  const router = useRouter();
  const otherData = localStorage.getItem("othersTech");
  const otherTechData = otherData ? JSON.parse(otherData) : null;
  const domainData = localStorage.getItem("othersDomain");
  const otherDomainData = domainData ? JSON.parse(domainData) : null;

  const dispatch = useDispatch();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;
  const { id } = router.query;
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";

  // useEffect(() => {
  //   if (incompleteMandate) {
  //     dispatch(navigateIncompleteMandate(investorId, id));
  //   }
  // }, [dispatch, id, incompleteMandate, investorId]);

  const incompleteMandateData = useSelector((state) => state.newMandate.incompleteMandateData);

  const steps = [
    {
      id: "showMandatesForm.createmandate.text",
      label: "Create Mandate",
    },
    {
      id: "showMandatesForm.preference.text",
      label: "Preferences",
    },
  ];

  useEffect(() => {
    dispatch(selectedMandateDetails(investorId));
  }, [dispatch, investorId]);

  const selectedTechnology = localStorage.getItem("selectedTech");
  // const selectedTechnology = localStorage.getItem("selectedTech");

  const parsedSelectedTechnology = selectedTechnology ? JSON.parse(selectedTechnology) : null;

  const selectedTechId = parsedSelectedTechnology?.id;

  // Array of Question storing in key eventQuesAraay

  const eventQuesAraay = storeQuestion;
  const is_active = incompleteMandateData?.is_active;
  const technology = incompleteMandateData?.technology;
  const incompeleteotherTechData = incompleteMandateData?.othersTech;
  const incompeleteotherDomainData = incompleteMandateData?.othersDomain;

  const formDetail = useMemo(() => {
    return {
      ...mandateDetails,
      ...preferenceFormData,
      eventQuesAraay,
    };
  }, [eventQuesAraay, mandateDetails, preferenceFormData]);

  const formDetails = formDetail;

  const sendFormData = {
    title: formDetails?.name || formDetails?.title,
    mandateType: parseInt(formDetails?.mandateTypeId),
    description: formDetails?.desc || formDetails?.description,
    imageId: formDetails?.picture || formDetails?.images?.id,
    // startDate: formDetails?.startDate || formDetails?.startDate,
    // endDate: formDetails?.endDate || formDetails?.endDate,
    startDate: formDetails?.startDate
      ? format(new Date(formDetails.startDate), "yyyy/MM/dd")
      : null,
    endDate: formDetails?.endDate ? format(new Date(formDetails.endDate), "yyyy/MM/dd") : null,
    stage: formDetails?.startupStage || formDetails?.stage,
    revenue_status: formDetail?.revenue_status || formDetail?.revenue_status,
    // productStage: formDetails?.productStage || formDetails?.productStage,
    location: formDetails?.location ? formDetails?.location : formDetails?.city,
    country: formDetails?.country,
    teamSize: formDetails?.teamSize || formDetails?.teamSize,
    investmentOffering: formDetails?.investmentOffering || formDetails?.investmentOffering,
    amount: formDetails?.investmentAmount || formDetails?.amount,
    othersTech: otherTechData ? otherTechData : incompeleteotherTechData,
    othersDomain: otherDomainData ? otherDomainData : incompeleteotherDomainData,

    technology: technology !== undefined ? technology[0] : selectedTechId,
    eventQuesAraay: formDetails?.eventQuesAraay,
  };

  useEffect(() => {
    if (id) {
      setMandateDetails(incompleteMandateData);
      setPreferenceFormData(incompleteMandateData);
      setStoreQuestion(incompleteMandateData?.eventQuesArray);
    }
  }, [id, incompleteMandateData]);

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      // if (!incompleteMandate) {
      dispatch(displayMandateDetails(investorId, sendFormData)).then((res) => {
        if (res?.id) {
          dispatch(mandateActions.saveMandateId(res?.id));
          // dispatch(saveEventsQuestion(investorId, storeQuestion, res?.id));
          dispatch(showMandateDetails(investorId, res?.id));
          dispatch(getEventsQuestions(res?.id));
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
      });
      // }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const previewDetails = useSelector((state) => state?.newMandate?.showMandate);
  const eventQuestionList = useSelector((state) => state?.newMandate?.eventQuestions);
  const mandatesInfo = useSelector((state) => state?.newMandate?.displayMandate);

  const handleSubmit = (data) => {
    if (mandatesInfo?.id) {
      dispatch(launchMandate(investorId, mandatesInfo?.id)).then((resp) => {
        if (resp?.status === "true") {
          router.push("/InvestorMandate");
        } else {
          toast.warning(resp, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
    }
  };

  return (
    <>
      <Box>
        <MuiStepper
          activeStep={activeStep}
          alternativeLabel
          // sx={{ width: "100%" }}
          orientation="horizontal"
          connector={<RTLConnector />}
          dir={isRTL ? "ltr" : "ltr"}
        >
          {steps.map((data, index) => (
            <Step key={data}>
              <StepLabel>
                <FormattedMessage id={data.id} defaultMessage={data.label} />
              </StepLabel>
            </Step>
          ))}
        </MuiStepper>
      </Box>
      {activeStep === steps.length ? (
        <>
          <Grid sx={{ backgroundColor: "#f0f5f5", mt: 2 }}>
            <Grid>
              <Typography
                sx={{
                  px: 2,
                  pt: 4,
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "rgba(108, 25, 62, 1)",
                }}
              >
                <FormattedMessage
                  id="mandateStepperForm.final.tagLine"
                  defaultMessage="Ensure your mandate details are perfect by previewing them before submitting."
                />
              </Typography>
            </Grid>
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "5px",
                marginRight: "10px",
              }}
            >
              <Button
                sx={{ margin: "20px", marginRight: "10px" }}
                variant="outlined"
                startIcon={<RemoveRedEyeIcon style={{ marginLeft: "10px" }} />}
                onClick={() => setDialogOpen(true)}
              >
                <FormattedMessage
                  id="showMandatesForm.previewMandate.button.text"
                  defaultMessage="Preview Mandate"
                />
              </Button>
            </Box>
          </Grid>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              pt: 2,
            }}
          >
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1, background: "rgba(138, 21, 56, 0.15)" }}
            >
              <FormattedMessage id="mandateStepperForm.card.back.button" defaultMessage="Back" />
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleSubmit} sx={{ background: "rgba(138, 21, 56, 0.15)" }}>
              <FormattedMessage
                id="mandateStepperForm.card.launch.button"
                defaultMessage="Launch"
              />
            </Button>
          </Box>
        </>
      ) : (
        <>
          {activeStep === 0 ? (
            <MandateForm
              mandateDetails={mandateDetails}
              setMandateDetails={setMandateDetails}
              picture={picture}
              setPicture={setPicture}
              savePicture={savePicture}
              setSavePicture={setSavePicture}
              setDisable={setDisable}
            />
          ) : (
            <PreferencesForm
              preferenceFormData={preferenceFormData}
              setPreferenceFormData={setPreferenceFormData}
              setIsVisible={setIsVisible}
              isVisible={isVisible}
              question={question}
              setQuestion={setQuestion}
              storeQuestion={storeQuestion}
              setStoreQuestion={setStoreQuestion}
            />
          )}
          <Box sx={{ display: "flex", flexDirection: "row", px: 2 }}>
            <Button
              color="inherit"
              sx={{ background: "rgba(138, 21, 56, 0.15)" }}
              disabled={activeStep === 0}
              onClick={handleBack}
              // sx={{ mr: 1 }}
            >
              <FormattedMessage id="mandateStepperForm.card.back.button" defaultMessage="Back" />
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={handleNext}
              disabled={
                !mandateDetails || disable || (activeStep === 1 && !preferenceFormData)
                // (activeStep === 1 && storeQuestion?.length === 0)
              }
              sx={{ background: "rgba(138, 21, 56, 0.15)" }}
            >
              {activeStep === steps.length - 1 ? (
                <FormattedMessage
                  id="mandateStepperForm.card.finish.button"
                  defaultMessage="Finish"
                />
              ) : (
                <FormattedMessage id="mandateStepperForm.card.next.button" defaultMessage="Next" />
              )}
            </Button>
          </Box>
        </>
      )}
      {dialogOpen && (
        <PreviewMandate
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          previewDetails={previewDetails}
          eventQuestionList={eventQuestionList}
        />
      )}
    </>
  );
};

export default Stepper;
