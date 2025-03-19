import { Box, Grid, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { toast } from "react-toastify";

const ImageField = (props) => {
  const { label, keyName, errors, isRequired, selectedImage, setSelectedImage, control, setValue } =
    props;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setValue(keyName, file);

    if (file) {
      if (file.size > 200 * 1024) {
        // Display an error message or perform any other action
        toast.error("File size exceeds 200 KB. Please choose a smaller file.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        // Convert the base64-encoded data to binary
        const binaryImageData = atob(reader.result.split(",")[1]);
        // Create a Uint8Array from the binary data
        const uint8Array = new Uint8Array(binaryImageData.length);
        for (let i = 0; i < binaryImageData.length; i++) {
          uint8Array[i] = binaryImageData.charCodeAt(i);
        }
        // Create a Blob from the Uint8Array
        const blob = new Blob([uint8Array], { type: file.type });
        // Create FormData object and append the Blob
        const formData = new FormData();
        formData.append("uploadImage", blob, file.name);

        // Dispatch the action with formData
        // dispatch(uploadInvestorProfileImage(profileId, formData));
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* <Box className={styles.imageExternal}> */}
      <Grid>
        <Typography
          sx={{
            fontFamily: "Calibri",
            fontWeight: 700,
            fontSize: "20px",
            color: "#393939",
          }}
        >
          {label}

          <span style={{ color: "red" }}>{isRequired && "*"}</span>
        </Typography>
        <Box component="label" sx={{ cursor: "pointer" }}>
          <Controller
            name={keyName}
            control={control}
            error={!!errors?.[keyName]}
            render={({ field }) => (
              <input
                hidden
                // disabled={pitchingDisable}
                accept="image/*"
                type="file"
                onChange={(e) => {
                  handleImageChange(e);
                  field.onChange(e.target.files[0]); // Update React Hook Form's field value
                }}
              />
            )}
          />
          {selectedImage !== null ? (
            <div>
              <img
                src={selectedImage}
                alt="Selected"
                width="120px"
                height="120px"
                style={{ borderRadius: "50%" }}
              />
            </div>
          ) : (
            <img src="/Images/upload-company's-logo.png" alt="Upload" />
          )}
        </Box>

        {errors?.[keyName] && !selectedImage && (
          <Typography sx={{ color: "red", fontSize: "0.75rem", mt: 1 }}>
            {errors[keyName]?.message}
          </Typography>
        )}

        <Typography sx={{ fontSize: "12px" }}>Allowed file types: .jpeg, .jpg, or .png</Typography>
      </Grid>
      {/* </Box> */}
    </>
  );
};

export default ImageField;
