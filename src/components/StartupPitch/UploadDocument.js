import { Box, Button, Dialog, FormLabel, Grid, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";
import styles from "./StartupPitch.module.css";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import CancelIcon from "@mui/icons-material/Cancel";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadDocument } from "src/action/seeNewMandate";
import { getInvestorProfileCheck, getUserProfile } from "src/action/signIn";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { uploadDocumentForInvestor } from "src/action/investorProfileStepper";

const documentType = [
  {
    id: "1",
    name: "Business Plan Deck Document",
  },
  {
    id: "2",
    name: "Venture Financial Document",
  },
  {
    id: "3",
    name: "Venture Review Report",
  },
  {
    id: "4",
    name: "Recognition Document",
  },
  {
    id: "5",
    name: "Link for marketing video",
  },
  {
    id: "6",
    name: "Last Audited Balance Sheet",
  },
  {
    id: "7",
    name: "Other",
  },
];

const schema = yup
  .object({
    documentType: yup
      .string()
      .required(
        <FormattedMessage
          id="startupPitch.documentTabInfoModal.documentType.required.errorMessage"
          defaultMessage="Add your document"
        />
      ),
    pitchDeck: yup
      .mixed()
      .test(
        <FormattedMessage
          id="startupPitch.documentTabInfoModal.documentType.fileSize.errorMessage"
          defaultMessage="File Size"
        />,
        <FormattedMessage
          id="startupPitch.documentTabInfoModal.documentType.fileSizeRequired.errorMessage"
          defaultMessage="File size is too large (max 10MB)"
        />,
        (value) => !value || (value && value.size <= 10 * 1024 * 1024)
      )
      .test(
        <FormattedMessage
          id="startupPitch.documentTabInfoModal.documentType.fileType.errorMessage"
          defaultMessage="File Type"
        />,

        <FormattedMessage
          id="startupPitch.documentTabInfoModal.documentType.fileTypeAllowed.errorMessage"
          defaultMessage="Invalid file type. Only PDF, Excel, and Word files are allowed."
        />,
        (value) =>
          !value ||
          (value &&
            (value.type === "application/pdf" || // PDF files
              value.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Excel files
              value.type === "application/msword" || // Word files (old .doc format)
              value.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) // Word files (new .docx format)
      ),
  })
  .required();

const UploadDocument = ({ dialogOpen, setDialogOpen, newProfile, flow }) => {
  const [fileName, setFileName] = useState("");
  const lang = localStorage.getItem("lang");
  const isRTL = lang === "ar";
  const dispatch = useDispatch();
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const startupId = userDetails?.startupId;
  const investorId = userDetails?.investorId;
  const [btnvisible, setBtnVisible] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    setDialogOpen(false);
  };
  const intl = useIntl();
  const onSubmit = (data) => {
    setBtnVisible(true);
    const documentType = data?.documentType;
    const formData = new FormData();
    !flow
      ? formData.append("pitchDeck", data?.pitchDeck)
      : formData.append("uploaddocument", data?.pitchDeck);

    !flow ? documentType : formData.append("document_type", data?.documentType);

    // Call the dispatch function with the FormData object
    !flow
      ? dispatch(uploadDocument(formData, documentType, startupId, intl)).then((res) => {
          setDialogOpen(false);
          setBtnVisible(false);

          let profileUpdated = localStorage.getItem("isProfileUpdated");
          let isProfileUpdated = profileUpdated ? JSON.parse(profileUpdated) : null;

          newProfile &&
            isProfileUpdated?.isProfileUpdated === 0 &&
            dispatch(getUserProfile(startupId)).then((res) => {
              const userProfileData = res;

              const existingData = JSON.parse(localStorage.getItem("isProfileUpdated"));

              const updatedData = { ...existingData, ...userProfileData };

              localStorage.setItem("isProfileUpdated", JSON.stringify(updatedData));

              let profileUpdated = localStorage.getItem("isProfileUpdated");
              let isProfileUpdated = profileUpdated ? JSON.parse(profileUpdated) : null;

              if (isProfileUpdated?.isProfileUpdated === 1) {
                toast.success("Profile Updated  Successfully", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                setTimeout(() => {
                  window.location.reload();
                }, [3000]);
              }
            });
        })
      : dispatch(uploadDocumentForInvestor(formData, investorId, intl)).then((res) => {
          setDialogOpen(false);
          dispatch(getInvestorProfileCheck(investorId));
        });
  };

  const handleDocument = (e) => {
    const selectedFile = e?.target?.files[0];

    if (selectedFile) {
      setValue("pitchDeck", selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid sx={{ p: 4 }}>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Grid item>
              <Typography className={styles.heading}>
                <FormattedMessage
                  id="startupPitch.documentTabInfoModal.header"
                  defaultMessage="Add your document"
                />
              </Typography>
            </Grid>
            <CancelIcon
              onClick={handleClose}
              sx={{ fontSize: "1.2rem" }}
              color="disabled"
              style={{ cursor: "pointer", width: "40px" }}
            />
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid sx={{ my: 2 }}>
              <Typography className={styles.inputField}>
                <FormattedMessage
                  id="startupPitch.documentTabInfoModal.uploadFile.label"
                  defaultMessage="Upload File"
                />
                <span className={styles.error}>*</span>
              </Typography>
              <Box component="label" sx={{ cursor: "pointer", width: "100%" }}>
                <input
                  accept=".pdf, .xlsx, .xls, .doc, .docx"
                  type="file"
                  {...register("pitchDeck")}
                  onChange={handleDocument}
                  hidden
                />
                {isRTL ? (
                  <img src="/Images/arabicUploadFile.png" height="90px" width="100%" />
                ) : (
                  <img
                    className="responsive-img"
                    src="/Images/Upload.png"
                    height="90px"
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                    }}
                  />
                )}
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.630rem" }}>
                <FormattedMessage
                  id="startupPitch.documentTabInfoModal.uploadFile.10mb.label"
                  defaultMessage="Attach file. File size of your documents should not exceed 10MB"
                />
              </Typography>
              {fileName && <Typography>{fileName} </Typography>}
            </Grid>
            {errors.pitchDeck && <span className={styles.error}>{errors.pitchDeck?.message}</span>}

            <Grid sx={{ my: 2 }}>
              <FormLabel className={styles.inputField}>
                <FormattedMessage
                  id="startupPitch.documentTabInfoModal.documentType.label"
                  defaultMessage="Document Types"
                />{" "}
                <span className={styles.error}>*</span>
              </FormLabel>
              <Controller
                name="documentType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    fullWidth
                    labelId="single-select-label"
                    id="single-select"
                    {...field}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: { xs: "240px", sm: "auto" },
                          width: { xs: "70%", sm: "auto" },
                        },
                      },
                    }}
                  >
                    {documentType?.map((option) => (
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
            </Grid>

            {errors.documentType && (
              <span className={styles.error}>{errors.documentType?.message}</span>
            )}

            <Box className={styles.buttonExternal}>
              <Button
                type="submit"
                className={styles.nextButton}
                sx={{
                  opacity: btnvisible ? 0.5 : 1,
                  pointerEvents: btnvisible ? "none" : "auto",
                }}
              >
                <FormattedMessage
                  id="startupPitch.documentTabInfoModal.submitButton.title"
                  defaultMessage="Submit"
                />
              </Button>
            </Box>
          </form>
        </Grid>
      </Dialog>
    </>
  );
};

export default UploadDocument;
