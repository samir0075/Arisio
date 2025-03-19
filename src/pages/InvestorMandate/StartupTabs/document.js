import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { startupTabDocument } from "src/action/investorMandates";
import { urlForDownload } from "src/action/seeNewMandate";

const Document = () => {
  const dispatch = useDispatch();
  const startupId = localStorage.getItem("selectedStartupId");
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;

  useEffect(() => {
    dispatch(startupTabDocument(investorId, startupId));
  }, [dispatch, startupId, investorId]);

  const startUpDocumentTabData = useSelector(
    (state) => state?.investorMandates?.startupTabDocument
  );

  const getFileExtension = (fileName) => {
    return fileName.split(".").pop();
  };

  const handlePdfToOpen = (pdf) => {
    dispatch(urlForDownload(startupId, pdf)).then((res) => {
      window.open(res, "_blank", "noreferrer");
    });
  };
  return (
    <>
      <Typography style={{ fontSize: "16px", fontWeight: "bold", color: "#8a1538" }}>
        <FormattedMessage id="startUpTabs.landingPage.tab3.label" defaultMessage="DOCUMENTS" />
      </Typography>
      <Grid container>
        {startUpDocumentTabData?.map((doc) => {
          const extension = getFileExtension(doc?.documentUrl);
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
                borderRadius: "8px",
              }}
            >
              <Grid item>
                <img
                  onClick={() => {
                    handlePdfToOpen(doc.documentUrl);
                  }}
                  src={imgSrc}
                  width="100"
                  height="100"
                  alt="format"
                />

                <Grid container direction="column" justifyContent="center">
                  <Typography style={{ color: "#8a1538", fontSize: "14px", fontWeight: "bold" }}>
                    {doc?.documentType}
                  </Typography>
                  <Typography style={{ color: "#808080", fontSize: "14px" }}>
                    {" "}
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(doc?.entryDate))}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
export default Document;
