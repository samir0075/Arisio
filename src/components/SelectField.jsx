import { Box, Checkbox, FormLabel, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

const feildInputProps = {
  fontWeight: 500,
  color: "#6d6d6d",
  whiteSpace: "normal",
  wordBreak: "break-word",
};

const SelectField = (props) => {
  const {
    label,
    keyName,
    placeholder,
    dropdownArray,
    errors,
    styling,
    isMultiple,
    control,
    isRequired,
  } = props;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", py: 1 }}>
      <FormLabel sx={{ fontWeight: "400", fontSize: "1rem", color: "#1D2026" }}>
        {label} <span style={{ color: "red" }}>{isRequired && "*"}</span>
      </FormLabel>

      <Controller
        name={keyName}
        control={control}
        defaultValue={isMultiple ? [] : ""}
        render={({ field }) => (
          <Select
            labelId="multi-select-label"
            fullWidth
            id="multi-select"
            size="medium"
            multiple={!!isMultiple}
            displayEmpty
            sx={styling}
            {...field}
            error={!!errors?.[keyName]}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: { xs: "240px", sm: "auto" },
                  width: { xs: "70%", sm: "auto" },
                },
              },
            }}
            renderValue={(selected) => {
              if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                return (
                  <span style={{ ...feildInputProps, color: "rgba(0, 0, 0, 0.523)" }}>
                    {placeholder}
                  </span>
                );
              }

              const selectedNames = isMultiple
                ? dropdownArray
                    ?.filter((option) => selected.includes(option.id)) // Array case
                    .map((option) => option.name)
                : dropdownArray?.find((option) => option.id === selected)?.name; // String case

              return (
                <Typography sx={feildInputProps}>
                  {isMultiple ? selectedNames.join(", ") : selectedNames}
                </Typography>
              );
            }}
          >
            {dropdownArray?.map((option) => (
              <MenuItem
                key={option?.id}
                value={option?.id}
                sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
              >
                {isMultiple && <Checkbox checked={field.value.includes(option?.id)} />}
                {option?.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors?.[keyName] && (
        <Typography sx={{ color: "red", fontSize: "0.75rem", mt: 1 }}>
          {errors[keyName]?.message}
        </Typography>
      )}
    </Box>
  );
};

export default SelectField;
