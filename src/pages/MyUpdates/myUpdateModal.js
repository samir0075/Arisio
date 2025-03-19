import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addMyUpdate } from "src/action/myUpdates";
import { FormattedMessage, useIntl } from "react-intl";
import { nameRegex } from "src/components/validators";
import CancelIcon from "@mui/icons-material/Cancel";

const updateType = [
  {
    id: 1,
    name: "Product Release",
  },
  {
    id: 2,
    name: "Funding",
  },
  {
    id: 3,
    name: "Media Coverage",
  },
  {
    id: 4,
    name: "Business Performance",
  },
  {
    id: 5,
    name: "Strategy Update",
  },
  {
    id: 6,
    name: "Award Recognition",
  },
];

const MyUpdateModal = ({ dialogOpen, setDialogOpen }) => {
  /*
   ** Pattern Validator
   */

  const schema = yup.object().shape({
    name: yup
      .string()
      .required(
        <FormattedMessage
          id="addUpdatesModal.updateTitle.required.errorMessage"
          defaultMessage="Name is required"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="addUpdatesModal.updateTitle.minLength.required.errorMessage"
          defaultMessage="Minimum 2 characters are required"
        />
      )
      .max(
        150,
        <FormattedMessage
          id="addUpdatesModal.updateTitle.maxLength.required.errorMessage"
          defaultMessage="Maximum 150 characters are allowed"
        />
      )
      .matches(nameRegex, () => (
        <FormattedMessage
          id="addUpdatesModal.updateTitle.nameRegex.errorMessage"
          defaultMessage="Name must contain only alphabets and whitespace"
        />
      ))
      .trim(),
    description: yup
      .string()
      .required(
        <FormattedMessage
          id="addUpdatesModal.description.required.errorMessage"
          defaultMessage="Description is required"
        />
      )
      .min(
        2,
        <FormattedMessage
          id="addUpdatesModal.description.minLength.required.errorMessage"
          defaultMessage="Description should be at least 2 characters"
        />
      )
      .max(
        300,
        <FormattedMessage
          id="addUpdatesModal.description.maxLength.required.errorMessage"
          defaultMessage="Maximum 300 characters are allowed"
        />
      ),
    milestoneDate: yup
      .string()
      .required(
        <FormattedMessage
          id="addUpdatesModal.date.required.errorMessage"
          defaultMessage="Date is required"
        />
      ),
    type: yup
      .string()
      .required(
        <FormattedMessage
          id="addUpdatesModal.updateType.required.errorMessage"
          defaultMessage="Type is required"
        />
      ),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // mode: "onChange",
    // defaultValues: {
    //   name: "",
    //   description: "",
    //   type: "",
    //   milestoneDate: "",
    // },
  });

  const dispatch = useDispatch();
  const intl = useIntl();
  const storedUserDetails = localStorage.getItem("userDetails");
  let startupId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  startupId = startupId?.startupId;

  const onSubmit = (data) => {
    const message = intl.formatMessage({
      id: "myUpdateModal.addUpdate.successMessage",
      defaultMessage: "Updates created successfully",
    });
    dispatch(addMyUpdate(startupId, data, message));
    setDialogOpen(false);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Dialog open={dialogOpen}>
        <DialogTitle
          style={{
            color: "#8a1538",
            padding: "20px",
            fontSize: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormattedMessage id="addUpdatesModal.title" defaultMessage="Add Updates" />
          <CancelIcon
            onClick={handleClose}
            sx={{ fontSize: "1.2rem" }}
            // color="disabled"
            style={{ cursor: "pointer", width: "40px", alignItems: "center" }}
          />
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent style={{ width: "auto", padding: "10px" }}>
            <FormControl size="small">
              <Grid
                style={{ padding: "10px" }}
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                    <FormattedMessage
                      id="myUpdatesModal.updateTitle"
                      defaultMessage="Update Title"
                    />

                    <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                  </FormLabel>
                  <TextField
                    fullWidth
                    id="outlined-required"
                    placeholder={intl.formatMessage({
                      id: "myUpdatesModal.updateTitle.placeholder",
                      defaultMessage: "Example: Acquired new customer or released new product",
                    })}
                    hiddenLabel
                    variant="filled"
                    size="small"
                    inputProps={{
                      sx: {
                        "&::placeholder": {
                          color: "grey",
                          opacity: 1,
                        },
                      },
                    }}
                    {...register("name")}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.name?.message}
                  </p>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                    <FormattedMessage
                      id="myUpdatesModal.updateType.title"
                      defaultMessage="Update Type"
                    />

                    <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                  </FormLabel>
                  <Controller
                    name="type"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...field}
                        renderValue={(selected) => selected}
                      >
                        {updateType?.map((option) => (
                          <MenuItem
                            style={{ color: "grey", fontSize: "12px" }}
                            key={option?.id}
                            value={option?.name}
                          >
                            {option?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.type?.message}
                  </p>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                    <FormattedMessage id="myUpdatesModal.date.title" defaultMessage="Date" />

                    <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                  </FormLabel>
                  <TextField
                    fullWidth
                    hiddenLabel
                    id="filled-hidden-label-small"
                    variant="filled"
                    type="date"
                    defaultValue="Choose date"
                    size="small"
                    {...register("milestoneDate")}
                    inputProps={{ min: today }}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.milestoneDate?.message}
                  </p>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel style={{ display: "flex", flexDirection: "row" }}>
                    <FormattedMessage
                      id="myUpdatesModal.description.title"
                      defaultMessage="Description"
                    />

                    <div style={{ marginLeft: "5px", color: "red" }}>*</div>
                  </FormLabel>
                  <TextField
                    fullWidth
                    hiddenLabel
                    id="filled-hidden-label-small"
                    variant="filled"
                    multiline
                    helperText={intl.formatMessage({
                      id: "myUpdatesModal.description.helperText",
                      defaultMessage: "300 Characters Maximum",
                    })}
                    rows={4}
                    size="small"
                    placeholder={intl.formatMessage({
                      id: "myUpdatesModal.description.placeholder",
                      defaultMessage: "Describe your progress update in detail",
                    })}
                    inputProps={{
                      sx: {
                        "&::placeholder": {
                          color: "grey",
                          opacity: 1,
                        },
                      },
                    }}
                    {...register("description")}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.description?.message}
                  </p>
                </Grid>
              </Grid>
            </FormControl>
            <Stack
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "10px",
                alignItems: "flex-end",
              }}
            >
              <Button
                size="small"
                style={{
                  color: "#ffff",
                  backgroundColor: "#8a1538",
                  borderRadius: "5px",
                }}
                type="submit"
              >
                <FormattedMessage id="myUpdatesModal.submitButton.title" defaultMessage="Submit" />
              </Button>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default MyUpdateModal;
