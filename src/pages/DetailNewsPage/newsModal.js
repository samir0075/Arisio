import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import CloseIcon from "@mui/icons-material/Close";

import EmailIcon from "@mui/icons-material/Email";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from "src/action/globalApi";
import { getButtonCss } from "src/utils/util";

const newsType = [
  {
    id: 1,
    name: "Finance",
  },
  {
    id: 2,
    name: "Sport",
  },
  {
    id: 3,
    name: "World",
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

const timeZone = [
  {
    id: 1,
    name: "Finance",
  },
  {
    id: 2,
    name: "Sport",
  },
  {
    id: 3,
    name: "World",
  },
];

const TypoStyle = { fontSize: "0.8rem", fontWeight: "600" };

const AddNewsModal = ({ dialogOpen, setDialogOpen }) => {
  const ButtonCss = getButtonCss();
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    // mode: "onChange",
    // defaultValues: {
    //   name: "",
    //   description: "",
    //   type: "",
    //   milestoneDate: "",
    // },
  });

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);
  const countryData = useSelector((state) => state.globalApi.countries);

  const closeDiaglog = () => {
    setDialogOpen(false);
  };
  return (
    <Dialog
      open={dialogOpen}
      onClose={setDialogOpen}
      maxWidth={false}
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "none" } }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Typography style={{ fontSize: "0.9rem", fontWeight: "600" }}>Personal Info</Typography>
        <CloseIcon style={{ cursor: "pointer" }} onClick={closeDiaglog} />
      </Box>
      <Divider sx={{ border: "1px solid #F5F5F5", width: "95%", margin: "auto" }} />
      <DialogContent>
        <form>
          <DialogContent style={{ width: "auto", padding: "0px" }}>
            <FormControl size="small" fullWidth>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>Heading</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <TextField fullWidth size="small" id="outlined-basic" variant="outlined" />
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>Email Address</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                  />
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>Your Photo</Typography>
                  <Typography style={{ fontSize: "0.7rem" }}>
                    This will be displayed on your profile
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  {/* <TextField fullWidth size="small" id="outlined-basic" variant="outlined" /> */}
                  <img
                    style={{ cursor: "pointer" }}
                    src="/Images/uploadImage.png"
                    height="70px"
                    width="60%"
                  />
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>News Type</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <Controller
                    name="newsType"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Select
                        size="small"
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...field}
                        renderValue={(selected) => selected}
                      >
                        {newsType?.map((option) => (
                          <MenuItem
                            style={{ fontSize: "12px" }}
                            key={option?.id}
                            value={option?.name}
                          >
                            {option?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>Country</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <Controller
                    name="countryCode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        size="small"
                        fullWidth
                        displayEmpty
                        labelId="single-select-label"
                        id="single-select"
                        sx={{
                          color:
                            control?._fields?.countryCode?._f?.value?.length === 0
                              ? "gray"
                              : "black",
                        }}
                        {...field}
                        renderValue={(selected) => {
                          if (selected?.length === 0) {
                            return (
                              <FormattedMessage
                                id="addStartups.form.inputField.placeholder"
                                defaultMessage="Select country"
                              />
                            );
                          }
                          const countryOption = countryData.find(
                            (option) => option.countryCode === selected
                          );
                          return countryOption?.country || selected;
                        }}
                      >
                        {countryData.map((option) => (
                          <MenuItem key={option.countryCode} value={option.countryCode}>
                            {option.country}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>Time Zone</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <Controller
                    name="timeZoneType"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Select
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...field}
                        renderValue={(selected) => selected}
                      >
                        {timeZone?.map((option) => (
                          <MenuItem
                            style={{ fontSize: "12px" }}
                            key={option?.id}
                            value={option?.name}
                          >
                            {option?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>Description</Typography>
                  <Typography style={{ fontSize: "0.7rem" }}>Write a short introduction</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  {/* <TextField fullWidth size="small" id="outlined-basic" variant="outlined" /> */}
                  <TextField
                    fullWidth
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
              </Grid>
            </FormControl>
            <Stack
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                flexDirection: "row",
              }}
            >
              <Button
                onClick={closeDiaglog}
                size="small"
                style={{ ...ButtonCss, marginRight: "10px" }}
              >
                <FormattedMessage id="myUpdatesModal.cancelButton.title" defaultMessage="Cancel" />
              </Button>
              <Button size="small" style={ButtonCss} type="submit">
                <FormattedMessage id="myUpdatesModal.submitButton.cancel" defaultMessage="Submit" />
              </Button>
            </Stack>
          </DialogContent>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewsModal;
