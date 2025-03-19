import { Box, FormLabel, TextField } from "@mui/material";
import React from "react";

const CustomTextField = (props) => {
  const { label, placeholder, keyName, isRequired, register, errors, multiline } = props;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", py: 1 }}>
      <FormLabel sx={{ fontWeight: "400", fontSize: "1rem", color: "#1D2026" }}>
        {label} <span style={{ color: "red" }}>{isRequired && "*"}</span>
      </FormLabel>

      <Box>
        <TextField
          fullWidth
          multiline={multiline}
          rows={multiline ? "4" : ""}
          id="outlined-basic"
          variant="outlined"
          placeholder={placeholder}
          {...register(keyName, { required: !!isRequired })} //Converts isRequired to a boolean (true or false).
          error={!!errors?.[keyName]}
          helperText={errors?.[keyName]?.message}
          InputProps={{ sx: { fontWeight: "400", color: "#6d6d6d" } }}
        />
      </Box>
    </Box>
  );
};

export default CustomTextField;
