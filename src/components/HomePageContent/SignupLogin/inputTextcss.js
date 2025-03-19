// utils/inputStyles.js

import { fontWeight } from "@mui/system";

export const getInputStyles = () => ({
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "20px", // Adjust the height as needed
    borderRadius: "4px",
    padding: "6.5px", // Adjust the padding as needed
  },
  "& .MuiInputLabel-root": {
    height: "13px", // Match the input height
    lineHeight: "17px", // Vertically center the label text
    // fontSize: "12px",
  },
  "& .css-19j8lcu-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-19j8lcu-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-19j8lcu-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
    {
      fontWeight: "300 !important",
    },
  "& .MuiInputBase-input": {
    fontWeight: "300",
  },
  "& .MuiInputBase-root": {
    fontWeight: "300",
  },

  /**
   * To remove autofill css
   */
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px white inset",
    WebkitTextFillColor: "black",
    fontWeight: "300",
  },
  "& input:-webkit-autofill:hover": {
    WebkitBoxShadow: "0 0 0 1000px white inset",
    WebkitTextFillColor: "black",
  },
});
