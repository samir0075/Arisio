import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Checkbox,
  Divider,
  Typography,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState, memo } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Grid2 from "@mui/material/Unstable_Grid2";
import { FormattedMessage, useIntl } from "react-intl";
import {
  displayMandateDetails,
  eventsQuestionDelete,
  getEventsQuestions,
  getMandateNameDuplication,
  getMandateType,
  launchMandate,
  postMandateImage,
  saveUserSelection,
  showMandateDetails,
} from "src/action/createMandate";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import { getCity, getCountries } from "src/action/globalApi";
import { getRevenueStageType, getStartupStageType } from "src/action/investorProfileStepper";
import { TableBar } from "@mui/icons-material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import PreviewMandate from "./previewMandate";
import ConfirmationModal from "src/components/ConfirmationModal";
import { NotMoreThan20CharactersWithoutSpace } from "src/components/validators";

const inputStyling = {
  background: "#FFF",
};
const inputExternal = {
  display: "flex",
  flexDirection: "column !important",
  marginTop: "10px",
};

const error = {
  color: "red",
};

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

const MandateForm = memo(
  ({
    headingTag,
    investorId,
    userId,
    activeDomainId,
    activeApplicationId,
    otherDomainData,
    activeDomainName,
    activeApplicationName,
  }) => {
    const intl = useIntl();
    const router = useRouter();

    const schema = yup
      .object({
        mandateType: yup
          .string()
          .required(
            <FormattedMessage
              id="startupPitch.OverViewTabInfo.mandateType.required.errorMessage"
              defaultMessage="Select a Mandate Type"
            />
          ),
        title: yup
          .string()
          .trim()
          .required(
            <FormattedMessage
              id="investor.createMandate.title.required.errorMessage"
              defaultMessage="Enter Mandate Title"
            />
          )
          .min(
            2,
            <FormattedMessage
              id="investor.createMandate.title.minLength.errorMessage"
              defaultMessage="Mandate Title should be at least 2 characters"
            />
          )
          .max(
            150,
            <FormattedMessage
              id="investor.createMandate.title.maxLength.errorMessage"
              defaultMessage="Mandate Title should not exceed 150 characters"
            />
          )
          .matches(/^[^/]+$/, {
            message: (
              <FormattedMessage
                id="investor.createMandate.title.noSpecialChars.errorMessage"
                defaultMessage="Mandate Title should not contain slashes"
              />
            ),
          })
          .matches(NotMoreThan20CharactersWithoutSpace, {
            message: (
              <FormattedMessage
                id="investor.createMandate.title.spaceafter20.errorMessage"
                defaultMessage="You cannot enter more than 20 letters in a row without a space."
              />
            ),
          }),
        description: yup
          .string()
          .trim()
          .required(
            <FormattedMessage
              id="investor.createMandate.description.required.errorMessage"
              defaultMessage="Enter Mandate Description"
            />
          )
          .min(
            2,
            <FormattedMessage
              id="investor.createMandate.description.minLength.errorMessage"
              defaultMessage="Mandate Description should be at least 2 characters"
            />
          )
          .max(
            450,
            <FormattedMessage
              id="investor.createMandate.description.maxLength.errorMessage"
              defaultMessage="Mandate Description should not exceed 450 characters"
            />
          )
          .matches(NotMoreThan20CharactersWithoutSpace, {
            message: (
              <FormattedMessage
                id="investor.createMandate.title.spaceafter20.errorMessage"
                defaultMessage="You cannot enter more than 20 letters in a row without a space."
              />
            ),
          }),
        startDate: yup
          .string()
          .required(
            <FormattedMessage
              id="investor.createMandate.startDate.required.errorMessage"
              defaultMessage="Select a Start Date"
            />
          ),
        endDate: yup
          .string()
          .required(
            <FormattedMessage
              id="investor.createMandate.endDate.required.errorMessage"
              defaultMessage="Select an End Date"
            />
          ),
        stage: yup
          .string()
          .required(
            <FormattedMessage
              id="preferencesForm.step2.form.inputField.error.message"
              defaultMessage="Please select startup stage"
            />
          ),
        revenue_status: yup
          .string()
          .required(
            <FormattedMessage
              id="preferencesForm.step2.form.inputField2.error.message"
              defaultMessage="Please select product stage "
            />
          ),
        country: yup.array().min(
          1,
          intl.formatMessage({
            id: "preferencesForm.step2.form.inputField3.error.message",
            defaultMessage: "Select at least one country",
          })
        ),
        location: yup.array().min(
          1,
          intl.formatMessage({
            id: "preferencesForm.step2.form.inputField4.error.message",
            defaultMessage: "Select at least one city",
          })
        ),
        teamSize: yup
          .string()
          .required(
            <FormattedMessage
              id="preferencesForm.step2.form.inputField5.error.message"
              defaultMessage="Please select team size "
            />
          ),
        investmentOffering: yup
          .string()
          .required(
            <FormattedMessage
              id="preferencesForm.step2.form.inputField6.error.message"
              defaultMessage="Please select investment offering"
            />
          ),
        amount: yup
          .string()
          .required(
            <FormattedMessage
              id="preferencesForm.step2.form.inputField7.error.message"
              defaultMessage="Please select startup amount "
            />
          ),
      })
      .required();

    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
      value,
      setValue,
      watch,
    } = useForm({
      resolver: yupResolver(schema),
    });

    const dispatch = useDispatch();
    const url = useRouter();
    const [picture, setPicture] = useState();
    const [savePicture, setSavePicture] = useState();
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedImageId, setSelectedImageId] = useState("");
    //Question

    const [question, setQuestion] = useState("");
    const [editButtonClicked, setEditButtonClicked] = useState(false);
    const [selectedQuestionId, setSelectedQuestionID] = useState(null);
    const [helperText, setHelperText] = useState(false);
    const [storeQuestion, setStoreQuestion] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [mandateData, setMandateData] = useState({});
    const [countryName, setCountryName] = useState("");
    const [mandateTypeName, setMandateTypeName] = useState("");

    // Dropdown Api Call
    useEffect(() => {
      dispatch(getMandateType());
      dispatch(getCountries());
      dispatch(getStartupStageType());
      dispatch(getRevenueStageType());
    }, []);
    let editMandateData = useSelector((state) => state.newMandate.incompleteMandateData);
    const mandateType = useSelector((state) => state.newMandate.mandateType);
    const countryData = useSelector((state) => state.globalApi.countries);
    const cityData = useSelector((state) => state.globalApi.cities);
    const startupStage = useSelector((state) => state?.investorProfileStepper.startupStageType);
    const ProductStage = useSelector((state) => state?.investorProfileStepper.preRevenueStageType);
    const eventQuestionList = useSelector((state) => state?.newMandate?.eventQuestions);
    // const previewDetails = useSelector((state) => state?.newMandate?.showMandate);

    const shouldDisableDate = (date) => {
      const oneDayLessThanToday = new Date();
      oneDayLessThanToday.setDate(oneDayLessThanToday.getDate() - 1);
      return date < oneDayLessThanToday;
    };

    const shouldDisableDateStarting = (date) => {
      const today = new Date();
      if (startDate === null) {
        return date < today;
      } else {
        return date < startDate;
      }
    };

    const startDate = watch("startDate");

    //Image Upload

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 2) {
          toast.error(
            intl.formatMessage({
              id: "mandateStepperForm.forMoreThan2MB.card.message.",
              defaultMessage: "File should be less than 2MB",
            })
          );
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImage(reader.result);

          setSavePicture(5);
          const binaryImageData = atob(reader.result.split(",")[1]);
          const uint8Array = new Uint8Array(binaryImageData.length);
          for (let i = 0; i < binaryImageData.length; i++) {
            uint8Array[i] = binaryImageData.charCodeAt(i);
          }
          const blob = new Blob([uint8Array], { type: file.type });
          const formData = new FormData();
          formData.append("uploadLetter", blob, file.name);
          dispatch(postMandateImage(investorId, formData)).then((res) => {
            setSelectedImageId(res);
          });
        };
        reader.readAsDataURL(file);
      }
    };

    useEffect(() => {
      const updatePicture = () => {
        switch (savePicture) {
          case 1:
            setPicture(1);
            break;
          case 2:
            setPicture(2);
            break;
          case 3:
            setPicture(3);
            break;
          case 4:
            setPicture(4);
            break;
          case 5:
            setPicture(selectedImageId);
            break;
          case "":
            setPicture(null);
            break;
          default:
            setPicture(null);
            break;
        }
      };

      updatePicture(); // Call the function to update the picture
    }, [savePicture, selectedImageId, setPicture]);

    const countryValue = watch("country");
    const cityValue = watch("location");

    // useEffect to log the value whenever it changes
    useEffect(() => {
      if (countryValue !== undefined) {
        dispatch(getCity(countryValue)).then((newCityData) => {
          // Assuming getCity returns a promise that resolves to the new city data
          const validCities = cityValue?.filter((location) => newCityData?.includes(location));
          // // Update city selection to only include valid cities
          setValue("location", validCities);
        });
      }
    }, [countryValue, setValue, dispatch]);

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

    const handleEdit = (index, item) => {
      setEditButtonClicked(true);
      setSelectedQuestionID(index);
      setQuestion(item);
      setHelperText(false);
    };
    useEffect(() => {
      setTimeout(() => {
        setHelperText(false);
      }, 10000);
    }, []);

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

    let allFormValues = watch();

    const previewData = {
      ...allFormValues,
      technology: activeDomainId === "" ? "" : activeDomainId,
      imageId: savePicture === 5 ? picture : savePicture,
      eventQuesAraay: storeQuestion,
      othersDomain: otherDomainData?.newDomain ? otherDomainData?.newDomain : null,
      othersTech: otherDomainData?.newApplication ? otherDomainData?.newApplication : null,
    };

    const title = "Are you sure you want to launch the mandate ? ";

    const onSubmit = (data) => {
      if (!savePicture) {
        toast.warn("Please select a mandate thumbnail", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (!activeDomainId && !activeApplicationId) {
        toast.warn("Please select a Domain and its application", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (data?.title && !url.query.edit) {
        dispatch(getMandateNameDuplication(data?.title)).then((res) => {
          if (res.success === false) {
            toast.error(res.message, {
              position: "top-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            const newMandateData = {
              ...data,
              technology:
                activeDomainId === 0
                  ? 0
                  : url.query.edit === "true" || editMandateData?.technology?.length === 0
                  ? 0
                  : url.query.edit === "true" || editMandateData?.technology?.length > 0
                  ? activeDomainId[0]
                  : activeDomainId,
              imageId: savePicture === 5 ? picture : savePicture,
              eventQuesAraay: storeQuestion,
              othersDomain: otherDomainData?.newDomain ? otherDomainData?.newDomain : null,
              othersTech: otherDomainData?.newApplication ? otherDomainData?.newApplication : null,
            };

            setMandateData(newMandateData);
            setConfirmationDialogOpen(true);
          }
        });
      } else {
        const newMandateData = {
          ...data,
          technology:
            activeDomainId === 0
              ? 0
              : url.query.edit === "true" || editMandateData?.technology?.length === 0
              ? 0
              : url.query.edit === "true" || editMandateData?.technology?.length > 0
              ? activeDomainId[0]
              : activeDomainId,
          imageId: savePicture === 5 ? picture : savePicture,
          eventQuesAraay: storeQuestion,
          othersDomain: otherDomainData?.newDomain ? otherDomainData?.newDomain : null,
          othersTech: otherDomainData?.newApplication ? otherDomainData?.newApplication : null,
        };

        setMandateData(newMandateData);
        setConfirmationDialogOpen(true);
      }
    };

    const handleSave = () => {
      dispatch(saveUserSelection(activeApplicationId, userId));
      dispatch(displayMandateDetails(investorId, mandateData)).then((res) => {
        if (editMandateData?.is_active !== 3) {
          console.log("hello");
          dispatch(launchMandate(investorId, res?.id)).then((resp) => {
            if (resp?.status === "true") {
              url.query.edit === "true"
                ? toast.success("Mandate Edited Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                : toast.success("Mandate Launched Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
              setConfirmationDialogOpen(false);
              router.push("/InvestorMandate");
            }
          });
        } else {
          url.query.edit === "true"
            ? toast.success("Mandate Edited Successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            : toast.success("Mandate Launched Successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
          setConfirmationDialogOpen(false);
          router.push("/InvestorMandate");
        }
      });
    };

    const hanldePreviewData = () => {
      setDialogOpen(true);
    };

    /**
     * Setting the mandate data in form while editing
     */
    useEffect(() => {
      if (editMandateData) {
        setValue("title", editMandateData?.title || "");
        setValue("mandateType", editMandateData?.mandateTypeId || "");
        setValue("description", editMandateData?.description || "");
        setValue("startDate", editMandateData?.startDate || "");
        setValue("endDate", editMandateData?.endDate || "");
        setValue("stage", editMandateData?.stage || "");
        setValue("revenue_status", editMandateData?.revenue_status || "");
        setValue("country", editMandateData?.countryList || []);
        setValue("location", editMandateData?.location || []);
        setValue("teamSize", editMandateData?.teamSize || "");
        setValue("investmentOffering", editMandateData?.investmentOffering || "");
      }
      setValue("amount", editMandateData?.amount || "");
    }, [setValue, editMandateData]);

    useEffect(() => {
      if (editMandateData?.images) {
        setSavePicture(editMandateData?.images?.id);
      }
      if (editMandateData?.images?.imageContent) {
        setUploadedImage(`data:image/PNG;base64,${editMandateData?.images?.imageContent}`);
      }
      if (url.query.edit === "true") {
        setStoreQuestion(editMandateData?.eventQuesArray);
        setCountryName(editMandateData?.country);
      }
    }, [editMandateData?.eventQuesArray, editMandateData?.images, setSavePicture, url.query.edit]);

    useEffect(() => {
      if (editMandateData?.mandateTypeId) {
        const selectedMandate = mandateType?.data?.find(
          (option) => option.id === editMandateData?.mandateTypeId
        );

        if (selectedMandate) {
          setMandateTypeName(selectedMandate.mandate_name);
        }
      }
    }, [editMandateData?.mandateTypeId, mandateType?.data, setValue]);

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Accordion defaultExpanded sx={{ my: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography sx={{ ...headingTag }}>Basic Details</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid2 container spacing={2}>
                {/* Mandate Title  */}
                <Grid2 xs={12} sm={12} md={6} xl={6}>
                  <Grid2 sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: "500" }}>
                      Mandate Title <span style={error}>*</span>
                    </Typography>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder="Enter Mandate Title"
                      sx={inputStyling}
                      fullWidth
                      disabled={url.query.edit === "true"}
                      {...register("title", { required: true })}
                    />
                    {errors.title && <Typography style={error}>{errors.title?.message}</Typography>}
                  </Grid2>
                  {/* Mandate Descripton  */}
                  <Grid2 sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: "500" }}>
                      Description <span style={error}>*</span>
                    </Typography>

                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder="Enter Description"
                      sx={inputStyling}
                      multiline
                      rows={4}
                      fullWidth
                      {...register("description", { required: true })}
                    />
                    {errors.description && (
                      <Typography style={error}>{errors.description?.message}</Typography>
                    )}
                  </Grid2>

                  {/* Start Date  */}
                  <Grid2 sx={{ mt: 2 }}>
                    <Typography>
                      <FormattedMessage
                        id="mandateStepperForm.card.startDate.label"
                        defaultMessage="Start Date"
                      />
                      <span style={error}>*</span>
                    </Typography>
                    <Controller
                      name="startDate"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          value={field?.value ? dayjs(field?.value) : null} // Ensure proper date handling
                          format="DD/MM/YYYY" // Ensures UI displays date correctly
                          shouldDisableDate={!url.query.edit && shouldDisableDate}
                          fullWidth
                          disabled={url.query.edit === "true"}
                          onChange={(newValue) => {
                            const formattedDate = newValue
                              ? dayjs(newValue).format("YYYY-MM-DD")
                              : null;
                            field.onChange(formattedDate); // Store date in proper format
                            setValue("endDate", null);
                          }}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              fullWidth
                              sx={{
                                "& .MuiInputBase-input": {
                                  position: "relative !important",
                                  bottom: "6px !important",
                                  background: "#FFFFFF",
                                },
                              }}
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                            />
                          )}
                        />
                      )}
                    />
                    {errors.startDate && <span style={error}>{errors.startDate?.message}</span>}
                  </Grid2>

                  {/* End Date  */}
                  <Grid2 sx={{ mt: 2 }}>
                    <Typography>
                      <FormattedMessage
                        id="mandateStepperForm.card.EndDate.label"
                        defaultMessage="End Date"
                      />
                      <span style={error}>*</span>
                    </Typography>
                    <Controller
                      name="endDate"
                      defaultValue={null}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          value={field?.value ? dayjs(field?.value) : null} // Ensure proper date handling
                          format="DD/MM/YYYY" // Ensures UI displays date correctly
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              {...params}
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              fullWidth
                              sx={{
                                "& .MuiInputBase-input": {
                                  position: "relative !important",
                                  bottom: "6px !important",
                                  background: "#FFFFFF",
                                },
                              }}
                            />
                          )}
                          shouldDisableDate={shouldDisableDateStarting}
                          minDate={startDate}
                        />
                      )}
                    />
                    {errors.endDate && <span style={error}>{errors.endDate?.message}</span>}
                  </Grid2>
                </Grid2>
                {/* Mandate Type   */}
                <Grid2 xs={12} sm={12} md={6} xl={6}>
                  <Grid2 sx={{ mt: 2 }}>
                    <Typography>
                      <FormattedMessage
                        id="mandateStepperForm.card.mandateType.label"
                        defaultMessage="Mandate Type"
                      />{" "}
                      <span style={error}>*</span>
                    </Typography>
                    <Controller
                      name="mandateType"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          labelId="single-select-label"
                          id="single-select"
                          {...field}
                          sx={inputStyling}
                          fullWidth
                          displayEmpty
                          defaultValue=""
                          onChange={(event) => {
                            const selectedId = event.target.value;
                            field.onChange(selectedId);

                            const selectedMandate = mandateType?.data?.find(
                              (option) => option.id === selectedId
                            );
                            setMandateTypeName(selectedMandate?.mandate_name || "");
                          }}
                        >
                          <MenuItem value="" disabled sx={{ display: "none" }}>
                            <FormattedMessage
                              id="mandateStepperForm.card.mandateType.label.placeHolder"
                              defaultMessage="Select Mandate Type"
                            />
                          </MenuItem>
                          {mandateType?.data?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.mandate_name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.mandateType && <span style={error}>{errors.mandateType?.message}</span>}
                  </Grid2>

                  {/* Mandate Image */}

                  <Grid2 sx={{ mt: 2 }}>
                    <Typography>
                      <FormattedMessage
                        id="mandateStepperForm.step3.card.heading"
                        defaultMessage="Upload or pick a thumbnail for your mandate."
                      />
                      <span style={error}>*</span>
                    </Typography>
                    <Card
                      sx={{
                        backgroundColor: "#f2f2f2",
                        marginTop: "15px ",
                        overflow: "auto",
                      }}
                    >
                      <Grid2
                        container
                        alignItems="center"
                        justifyContent="space-around"
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                      >
                        <Grid2 item xs={11} sm={11} md={4} lg={4}>
                          <input
                            accept="image/*"
                            style={{
                              display: "none",

                              border: savePicture === 5 ? "3px solid rgba(108, 25, 62, 1)" : null,
                            }}
                            id="upload-file"
                            type="file"
                            onChange={handleFileChange}
                          />
                          <label htmlFor="upload-file">
                            {uploadedImage ? (
                              <div>
                                <img
                                  src={uploadedImage}
                                  alt="Selected"
                                  style={{
                                    height: { xs: "10rem", sm: "14rem", md: "14rem" },
                                    width: "100%",
                                    border:
                                      savePicture === 5 ? "3px solid rgba(108, 25, 62, 1)" : null,
                                  }}
                                />
                              </div>
                            ) : (
                              <Button
                                component="span"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                sx={{
                                  backgroundColor: "#c4c5c9",
                                  borderRadius: "10px",
                                  height: { xs: "10rem", sm: "14rem", md: "14rem" },
                                  width: "100%",
                                  marginLeft: { xs: "0px", sm: "0px", lg: "5px" },
                                  marginTop: { xs: "10px", sm: "10px" },
                                }}
                              >
                                <FormattedMessage
                                  id="mandateStepperForm.step3.card.upload.button.text"
                                  defaultMessage="Upload file"
                                />
                              </Button>
                            )}
                          </label>
                          <Typography sx={{ fontSize: "0.75rem", textAlign: "center" }}>
                            <FormattedMessage
                              id="mandateStepperForm.step3.card.upload.warning.message"
                              defaultMessage="Upload thumbnail (upto 2MB)"
                            />
                          </Typography>
                          <Typography sx={{ fontSize: "0.60rem", textAlign: "center" }}>
                            {/* <FormattedMessage
                        id="mandateStepperForm.step3.card.upload.warning.message"
                        defaultMessage="Upload thumbnail (upto 2MB)"
                      /> */}
                            Image dimensions should be 550 x 250 pixels.
                          </Typography>
                        </Grid2>

                        <Grid2
                          container
                          justifyContent="space-between"
                          item
                          xs={12}
                          sm={7}
                          md={7}
                          lg={7}
                        >
                          <Grid2 item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                            <CardActionArea
                              onClick={() => setSavePicture(1)}
                              style={{
                                border: savePicture === 1 ? "3px solid rgba(108, 25, 62, 1)" : null,
                                borderRadius: savePicture === 1 ? "5px" : null,
                              }}
                              defaultValue={picture}
                            >
                              <CardMedia
                                component="img"
                                image={`/Images/Image-1.png`}
                                alt="Mandate Form"
                              />
                            </CardActionArea>
                          </Grid2>

                          <Grid2 item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                            <CardActionArea
                              onClick={() => setSavePicture(2)}
                              style={{
                                border: savePicture === 2 ? "3px solid rgba(108, 25, 62, 1)" : null,
                                borderRadius: savePicture === 2 ? "5px" : null,
                              }}
                              defaultValue={picture}
                            >
                              <CardMedia
                                component="img"
                                image={`/Images/Image-2.png`}
                                alt="Mandate Form"
                              />
                            </CardActionArea>
                          </Grid2>

                          <Grid2 item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                            <CardActionArea
                              onClick={() => setSavePicture(3)}
                              style={{
                                border: savePicture === 3 ? "3px solid rgba(108, 25, 62, 1)" : null,
                                borderRadius: savePicture === 3 ? "5px" : null,
                              }}
                              defaultValue={picture}
                            >
                              <CardMedia
                                component="img"
                                image={`/Images/Image-3.png`}
                                alt="Mandate Form"
                              />
                            </CardActionArea>
                          </Grid2>

                          <Grid2 item xs={5.75} sm={5.75} md={5.75} lg={5.75} sx={{ my: 1 }}>
                            <CardActionArea
                              onClick={() => setSavePicture(4)}
                              style={{
                                border: savePicture === 4 ? "3px solid rgba(108, 25, 62, 1)" : null,
                                borderRadius: savePicture === 4 ? "5px" : null,
                              }}
                              defaultValue={picture}
                            >
                              <CardMedia
                                component="img"
                                image={`/Images/Image-4.png`}
                                alt="Mandate Form"
                              />
                            </CardActionArea>
                          </Grid2>
                        </Grid2>
                      </Grid2>
                    </Card>
                  </Grid2>
                </Grid2>
              </Grid2>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography sx={{ ...headingTag }}>Preferences</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid2 container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid2 item xs={12} sm={12} md={6} lg={6}>
                  <Box sx={inputExternal}>
                    <Typography>
                      {intl.formatMessage({
                        id: "preferencesForm.step2.form.inputField.label",
                        defaultMessage: "Startup stage",
                      })}
                      <span style={error}>*</span>
                    </Typography>
                    <Controller
                      name="stage"
                      control={control}
                      defaultValue=""
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
                        >
                          <MenuItem value="" disabled sx={{ display: "none" }}>
                            Select Startup Stage
                          </MenuItem>
                          {startupStage?.map((option) => (
                            <MenuItem key={option?.id} value={option?.stage_name}>
                              {option?.stage_name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.stage && <span style={error}>{errors.stage?.message}</span>}
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={12} md={6} xl={6}>
                  <Box sx={inputExternal}>
                    <Typography>
                      {intl.formatMessage({
                        id: "preferencesForm.step2.form.inputField2.label",
                        defaultMessage: "Revenue Status",
                      })}{" "}
                      <span style={error}>*</span>
                    </Typography>
                    <Controller
                      name="revenue_status"
                      control={control}
                      defaultValue=""
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
                        >
                          {" "}
                          <MenuItem value="" disabled sx={{ display: "none" }}>
                            Select Revenue Status
                          </MenuItem>
                          {ProductStage?.map((option) => (
                            <MenuItem key={option?.id} value={option?.revenue_name}>
                              {option?.revenue_name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.revenue_status && (
                      <span style={error}>{errors.revenue_status?.message}</span>
                    )}
                  </Box>
                </Grid2>
              </Grid2>
              <Grid2 container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid2 item xs={12} sm={12} md={6} xl={6}>
                  <Box sx={inputExternal}>
                    <Typography>
                      <FormattedMessage
                        id="preferencesForm.step2.form.inputField3.label"
                        defaultMessage="Startup Country"
                      />{" "}
                      <span style={error}>*</span>
                    </Typography>

                    <Controller
                      name="country"
                      control={control}
                      defaultValue={[]} // Ensure the default is an array for multiple selections
                      render={({ field }) => (
                        <Select
                          labelId="multi-select-label"
                          id="multi-select"
                          multiple
                          displayEmpty
                          sx={{
                            color: field?.value?.length === 0 ? "gray" : "black",
                          }}
                          {...field}
                          renderValue={(selected) => {
                            //  Convert selected country codes to country names
                            const selectedCountries = countryData
                              ?.filter((item) => selected.includes(item.countryCode)) // Match by code
                              ?.map((item) => item.country); // Get country name

                            return selectedCountries.length === 0
                              ? "Select Country"
                              : selectedCountries.join(", ");
                          }}
                          onChange={(event) => {
                            const selectedIds = event.target.value; //  Get all selected country codes (array)
                            field.onChange(selectedIds);

                            // ✅ Store all selected country names
                            const selectedCountries = countryData
                              ?.filter((item) => selectedIds.includes(item.countryCode))
                              ?.map((item) => item.country);

                            setCountryName(selectedCountries.join(", "));
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: { xs: "240px", sm: "auto" },
                                width: { xs: "70%", sm: "auto" },
                              },
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Country
                          </MenuItem>
                          {countryData?.map((option, ind) => (
                            <MenuItem
                              key={ind}
                              value={option?.countryCode}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <Checkbox checked={field?.value?.includes(option?.countryCode)} />
                              {option?.country}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.country && <span style={error}>{errors.country?.message}</span>}
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={12} md={6} xl={6}>
                  <Box sx={inputExternal}>
                    <Typography>
                      <FormattedMessage
                        id="preferencesForm.step2.form.inputField5.label"
                        defaultMessage="Startup City"
                      />{" "}
                      <span style={error}>*</span>
                    </Typography>
                    <Controller
                      name="location"
                      control={control}
                      defaultValue={[]} // Ensure the default is an array for multiple selections
                      render={({ field }) => (
                        <Select
                          labelId="multi-select-label"
                          id="multi-select"
                          multiple
                          displayEmpty
                          sx={{
                            color: field?.value?.length === 0 ? "gray" : "black",
                          }}
                          {...field}
                          renderValue={(selected) =>
                            selected.length === 0 ? "Select City" : selected.join(", ")
                          } // Show selected cities or placeholder
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: { xs: "240px", sm: "auto" },
                                width: { xs: "70%", sm: "auto" },
                              },
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select City
                          </MenuItem>
                          {cityData?.map((option, ind) => (
                            <MenuItem
                              key={ind}
                              value={option}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <Checkbox checked={field?.value?.includes(option)} />
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.location && <span style={error}>{errors.location?.message}</span>}
                  </Box>
                </Grid2>
              </Grid2>
              <Grid2 container spacing={2} sx={{ marginTop: "10px", marginBottom: "10px" }}>
                <Grid2 item xs={12} sm={12} md={6} xl={6}>
                  <Box sx={inputExternal}>
                    <Typography>
                      <FormattedMessage
                        id="preferencesForm.step2.form.inputField6.label"
                        defaultMessage="Team Size"
                      />{" "}
                      <span style={error}>*</span>
                    </Typography>
                    <Controller
                      name="teamSize"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          labelId="single-select-label"
                          id="single-select"
                          displayEmpty
                          sx={{
                            color:
                              control?._fields?.teamSize?._f?.value?.length === 0
                                ? "gray"
                                : "black",
                          }}
                          {...field}
                        >
                          {" "}
                          <MenuItem value="" disabled sx={{ display: "none" }}>
                            Select Team Size
                          </MenuItem>
                          {teamSize?.map((option) => (
                            <MenuItem key={option?.id} value={option?.name}>
                              {option?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.teamSize && <span style={error}>{errors.teamSize?.message}</span>}
                  </Box>
                </Grid2>
              </Grid2>
              <Divider></Divider>
              <Typography sx={{ ...headingTag, mt: 1 }}>
                <FormattedMessage
                  id="preferencesForm.step2.form.heading2"
                  defaultMessage="What are you offering the startup?"
                />
              </Typography>
              <Grid2 container spacing={2} sx={{ marginTop: "10px" }}>
                <Grid2 item xs={12} sm={12} md={6} xl={6}>
                  <Box sx={inputExternal}>
                    <Typography>
                      <FormattedMessage
                        id="preferencesForm.step2.form.inputFiled7.label"
                        defaultMessage="Investment Offering"
                      />{" "}
                      <span style={error}>*</span>
                    </Typography>
                    <Controller
                      name="investmentOffering"
                      control={control}
                      defaultValue=""
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
                        >
                          {" "}
                          <MenuItem value="" disabled sx={{ display: "none" }}>
                            Select Investment Offering
                          </MenuItem>
                          {investmentOffering?.map((option) => (
                            <MenuItem key={option?.id} value={option?.name}>
                              {option?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.investmentOffering && (
                      <span style={error}>{errors.investmentOffering?.message}</span>
                    )}
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={12} md={6} xl={6}>
                  <Box sx={inputExternal}>
                    <Typography>
                      <FormattedMessage
                        id="preferencesForm.step2.form.inputFiled8.label"
                        defaultMessage="Investment amount"
                      />{" "}
                      <span style={error}>*</span>
                    </Typography>
                    <Controller
                      name="amount"
                      control={control}
                      defaultValue=""
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
                              control?._fields?.teamSize?._f?.value?.length === 0
                                ? "gray"
                                : "black",
                          }}
                        >
                          {" "}
                          <MenuItem value="" disabled sx={{ display: "none" }}>
                            Select Investment amount
                          </MenuItem>
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
                    {errors.amount && <span style={error}>{errors.amount?.message}</span>}
                  </Box>
                </Grid2>

                <Grid2 sx={{ mt: 2 }}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "1rem",
                      color: "#8B8787",
                      textAlign: "center",
                    }}
                  >
                    <FormattedMessage
                      id="quickQuestionsForm.step3.card.heading"
                      defaultMessage="Don't bother asking the name, or the location, or the description of the startup or
            contact details or the profile of the team. We get them anyway."
                    />
                  </Typography>
                  <Typography sx={{ mx: 1, my: 1 }}>Quick Question</Typography>

                  <Grid2
                    sx={{
                      height: storeQuestion?.length === 0 ? "300px" : "",
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
                      onChange={(e) => {
                        const value = e.target.value;
                        const regex = /^(?!.*\b[a-zA-Z0-9]{21,}\b).*$/;
                        // const regex = NotMoreThan20CharactersWithoutSpace;
                        if (regex.test(value)) {
                          setQuestion(value);
                          setErrorMessage("");
                        } else {
                          setErrorMessage(
                            "You cannot enter more than 20 letters in a row without a space."
                          );
                        }
                      }}
                      inputProps={{ minLength: 4, maxLength: 150 }}
                      error={
                        ((question?.length <= 3 || question?.length >= 150) && question !== "") ||
                        helperText === true
                      }
                      helperText={
                        (question?.length <= 3 || question?.length >= 150) && question !== "" ? (
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
                        width: "94%",
                        backgroundColor: "#fff",
                        margin: 1,
                      }}
                    />

                    {errorMessage && <Typography style={error}>{errorMessage}</Typography>}

                    <Grid2 container justifyContent="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleClick()}
                        disabled={
                          question === "" ||
                          question?.length < 4 ||
                          errorMessage ||
                          question?.length > 149
                            ? true
                            : false
                        }
                      >
                        {getBtnText()}
                      </Button>
                    </Grid2>
                    {storeQuestion?.length !== 0
                      ? storeQuestion?.map((item, index) => (
                          <Grid2
                            key={index}
                            sx={{
                              p: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Grid2 sx={{ width: "85%" }}>
                              <Typography>{`${index + 1}. ${item}`}</Typography>
                            </Grid2>
                            <Grid2
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleEdit(index, item)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleDelete(item)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Grid2>
                          </Grid2>
                        ))
                      : null}
                  </Grid2>
                </Grid2>
              </Grid2>
            </AccordionDetails>
          </Accordion>

          {/* Button  */}

          <Grid2 container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              onClick={hanldePreviewData}
              sx={{
                backgroundColor: "#8A1538",
                color: "#fff",
                mr: 2,

                "&:hover": {
                  backgroundColor: "#8A1538",
                  color: "#fff",
                },
              }}
            >
              Preview
            </Button>

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
          </Grid2>
        </form>

        {dialogOpen && (
          <PreviewMandate
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            previewDetails={previewData}
            activeDomainName={activeDomainName}
            activeApplicationName={activeApplicationName}
            uploadedImage={uploadedImage}
            countryName={countryName}
            mandateTypeName={mandateTypeName}
          />
        )}

        {confirmationDialogOpen && (
          <ConfirmationModal
            dialogOpen={confirmationDialogOpen}
            setDialogOpen={setConfirmationDialogOpen}
            title={title}
            handleSave={handleSave}
          />
        )}
      </>
    );
  }
);

export default MandateForm;
