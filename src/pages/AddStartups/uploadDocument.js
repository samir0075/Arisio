import { Box, Button, Dialog, DialogContent, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FormattedMessage, useIntl } from "react-intl";
import { uploadDocument } from "src/action/startup";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const UploadDocument = ({ dialogOpen, setDialogOpen }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const storedUserDetails = localStorage.getItem("userDetails");
  let UserId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const adminUserId = UserId?.id;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile);
      setFileName(selectedFile ? selectedFile.name : "");
    } else {
      toast.error("File type is invalid! Please download template for reference ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const bulkUpload = () => {
    const formData = new FormData();
    formData?.append("uploadLetter", file, file?.name);

    console.log(formData, file);
    // Call the dispatch function with the FormData object
    dispatch(uploadDocument(formData, adminUserId));
    setDialogOpen(false);
  };
  const loader = useSelector((state) => state.startupSlice.loading);

  const handleDownload = () => {
    // Path to the file in your assets folder
    const filePath = "/assets/excel/format.xlsx";

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "format.xlsx"; // The name you want the downloaded file to have
    document.body.appendChild(link);
    // Trigger the download
    link.click();
    // Cleanup
    document.body.removeChild(link);
    setDialogOpen(false);
  };
  const handleClose = () => {
    setDialogOpen(false);
  };
  return (
    <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm">
      <DialogContent>
        <Box style={{ background: "rgba(65, 148, 179,0.1) !important", borderRadius: "10px" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                display: "flex",
                flexDirection: "row",
                fontSize: "0.8rem",
                py: 1,
              }}
              level="h2"
            >
              <FormattedMessage id="addStartups.bulkUpload" defaultMessage="Bulk Upload" />{" "}
            </Typography>
            <CloseIcon onClick={handleClose} style={{ fontSize: "18px", cursor: "pointer" }} />
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            component="label"
          >
            {/* <Typography style={{ color: "#8a1538" }}>Upload File</Typography> */}
            <input
              accept=".pdf, .xlsx, .xls, .doc, .docx"
              type="file"
              onChange={handleFileChange}
              hidden
            />
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img
                style={{ cursor: "pointer" }}
                src="/Images/uploadImage.png"
                height="70px"
                width="100%"
              />
              {fileName && <Typography style={{ fontSize: "0.7rem" }}>{fileName}</Typography>}
            </Box>
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "10px",
            }}
          >
            <Tooltip title="Select File">
              <Button
                size="small"
                disabled={!file}
                style={{
                  padding: "3px 0px",
                  fontSize: "0.7rem",
                  ...(file ? { background: "#eedce1", color: "#8a1538" } : {}),
                }}
                onClick={bulkUpload}
              >
                {loader === true ? (
                  <FormattedMessage id="addStartups.uploading" defaultMessage="Uploading.." />
                ) : (
                  <FormattedMessage id="addStartups.Upload" defaultMessage="Upload" />
                )}
              </Button>
            </Tooltip>

            <Box>
              <Typography
                onClick={handleDownload}
                style={{
                  cursor: "pointer",
                  color: "#8a1538",
                  padding: "3px 0px",
                  fontSize: "0.7rem",
                  margin: "5px",
                }}
              >
                <FormattedMessage
                  id="addStartups.downloadTemplate"
                  defaultMessage="Download Template ?"
                />{" "}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocument;
