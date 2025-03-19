import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./StartupPitch.module.css";
import UploadDocument from "./UploadDocument";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./DeleteModal";
import { urlForDownload } from "src/action/seeNewMandate";
import { FormattedMessage } from "react-intl";
import { urlForDownloadForInvestor } from "src/action/investorProfileStepper";

const Document = ({
  switchToNextTab,
  switchToPreviousTab,
  documentList,
  newProfile,
  flow,
  pitchingDisable
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteID] = useState();
  const [disableDelete, setDisableDelete] = useState(false);

  const deleteFromTab = "Document";

  const dispatch = useDispatch();

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const startupId = userDetails?.startupId;
  const investorId = userDetails?.investorId;
  const userRole = userDetails?.role;

  const handleDocumentsUpload = () => {
    setDialogOpen(true);
  };

  const handleDeleteDialog = data => {
    console.log(data);
    setDeleteID(data?.id);
    setDeleteDialogOpen(true);
  };

  // flow key we r checking for because different data needs to pass  in investor ,
  //  this module is common in startup and investor

  const handlePdfToOpen = pdf => {
    !flow
      ? dispatch(urlForDownload(startupId, pdf)).then(res => {
          window.open(res, "_blank", "noreferrer");
        })
      : dispatch(urlForDownloadForInvestor(investorId, pdf)).then(res => {
          window.open(res, "_blank", "noreferrer");
        });
  };

  // Function to get file extension
  const getFileExtension = fileName => {
    return fileName?.split(".")?.pop();
  };

  useEffect(() => {
    if (documentList?.length === 1) {
      setDisableDelete(true);
    } else {
      setDisableDelete(false);
    }
  }, [documentList]);

  const formattedDate = date => {
    const newDate = new Date(date); // Convert string to Date object
    const day = String(newDate.getDate()).padStart(2, "0"); // Ensure day has two digits
    const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = newDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Box>
        <Grid>
          <Typography className={styles.heading}>
            <FormattedMessage
              id="startupPitch.documentTabInfo.header"
              defaultMessage="Upload documents"
            />
          </Typography>
          <Typography className={`${styles.inputField} ${styles.normalText}`}>
            {userRole === "INVESTOR" ? (
              <FormattedMessage
                id="investorProfile.documentTabInfo.title"
                defaultMessage="Investment thesis, portfolio highlights, financial performance reports, or other relevant documents 
                to showcase your fund's strengths and strategy."
              />
            ) : (
              <FormattedMessage
                id="startupPitch.documentTabInfo.title"
                defaultMessage="Pitch-decks, business plans, financial projections or other supplemental documents to
          showcase your startup."
              />
            )}
          </Typography>
          <Grid container>
            {documentList?.map(doc => {
              const extension = getFileExtension(!flow ? doc.documentUrl : doc.document_url);
              let imgSrc = "/Images/doc.png"; // Default image source

              // Determine image source based on file extension
              if (extension === "pdf") {
                imgSrc = "/Images/Pdf.png";
              } else if (extension === "xlsx") {
                imgSrc = "/Images/Excel.png";
              } else {
                imgSrc = "/Images/doc.png";
              }

              return (
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  key={doc?.id}
                  xs={12}
                  sm={5.5}
                  md={3.5}
                  xl={3.5}
                  sx={{
                    padding: "4px",
                    margin: "10px",
                    border: "2px solid #F5F5F5",
                    borderRadius: "8px"
                  }}
                >
                  <Grid item>
                    <img
                      src={imgSrc}
                      width="100"
                      height="100"
                      alt="format"
                      onClick={() => {
                        handlePdfToOpen(!flow ? doc.documentUrl : doc.document_url);
                      }}
                    />

                    <Grid container direction="column" justifyContent="center">
                      <Typography className={styles.heading}>
                        {!flow ? doc?.documentType : doc?.document_type}
                      </Typography>
                      <Typography className={styles.inputField}>
                        {" "}
                        {/* {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })?.format(new Date(!flow ? doc?.entryDate : doc?.entry_date))} */}
                        {formattedDate(!flow ? doc?.entryDate : doc?.entry_date)}
                      </Typography>
                    </Grid>
                  </Grid>
                  {disableDelete === false && !pitchingDisable ? (
                    <Grid item>
                      <DeleteIcon
                        sx={{ marginTop: "15px", cursor: "pointer" }}
                        onClick={() => {
                          handleDeleteDialog(doc);
                        }}
                      />
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              );
            })}
            {documentList?.length < 3 && !pitchingDisable ? (
              <Grid
                item
                sx={{ marginTop: "10px", margin: "10px" }}
                xs={12}
                sm={5.5}
                md={3.5}
                xl={3.5}
              >
                <img
                  src="/Images/add-button.png"
                  alt="Add Button"
                  onClick={handleDocumentsUpload}
                  style={{ cursor: "pointer" }}
                />

                <Typography sx={{ color: "#6d6d6d", fontSize: "14px" }}>
                  {" "}
                  <FormattedMessage
                    id="startupPitch.documentTabInfo.addMoreButton.title"
                    defaultMessage="Add more"
                  />
                </Typography>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Box>
      <Grid container justifyContent="space-between">
        <Button className={styles.nextButton} onClick={switchToPreviousTab}>
          <FormattedMessage
            id="startupPitch.documentTabInfo.backButton.title"
            defaultMessage="Back"
          />
        </Button>

        {!newProfile && (
          <Button className={styles.nextButton} onClick={switchToNextTab}>
            <FormattedMessage
              id="startupPitch.documentTabInfo.nextButton.title"
              defaultMessage="Next"
            />
          </Button>
        )}
      </Grid>

      {dialogOpen && (
        <UploadDocument
          newProfile={newProfile}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          flow={flow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteModal
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          deleteId={deleteId}
          deleteFromTab={deleteFromTab}
          flow={flow}
        />
      )}
    </>
  );
};

export default Document;
