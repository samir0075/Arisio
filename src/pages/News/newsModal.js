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
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import EmailIcon from "@mui/icons-material/Email";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from "src/action/globalApi";
import { getButtonCss } from "src/utils/util";
import { FormattedMessage, useIntl } from "react-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { nameRegex } from "src/components/validators";
import {
  addMyNews,
  adminAllNewsFetch,
  adminNewsFetch,
  myAllNewsFetch,
  myNewsFetch,
  myNewsType,
  updateMyNews,
  uploadNewsImage,
} from "src/action/news";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// const categories = [
//   {
//     id: "Finance",
//     name: "Finance",
//   },
//   {
//     id: "Sport",
//     name: "Sport",
//   },
//   {
//     id: "Local News",
//     name: "Local News",
//   },
//   {
//     id: "National News",
//     name: "National News",
//   },
//   {
//     id: " International News",
//     name: " International News",
//   },
//   {
//     id: "Business News",
//     name: "Business News",
//   },
//   {
//     id: "Technology News",
//     name: "Technology News",
//   },
//   {
//     id: "Award Recognition",
//     name: "Award Recognition",
//   },
// ];

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

const AddNewsModal = ({
  dialogOpen,
  setDialogOpen,
  page,
  section,
  country,
  newsType,
  debouncedQuery,
  newsId,
  setSelectedNewsId,
  value,
}) => {
  const [fileName, setFileName] = useState("");
  const intl = useIntl();
  const ButtonCss = getButtonCss();
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    title: yup
      .string()
      .required(
        <FormattedMessage
          id="addUpdatesModal.updateTitle.required.errorMessa"
          defaultMessage="Title is required"
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
        200,
        <FormattedMessage
          id="addNewsModal.newsTitle.maxLength.required.errorMessage"
          defaultMessage="Maximum 200 characters are allowed"
        />
      ),
    // .matches(nameRegex, () => (
    //   <FormattedMessage
    //     id="addUpdatesModal.updateTitle.nameRegex.errorMessage"
    //     defaultMessage="Name must contain only alphabets and whitespace"
    //   />
    // ))
    // .trim()
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
      ),
    // .max(
    //   2000,
    //   <FormattedMessage
    //     id="addNewsModal.description.maxLength.required.errorMessa"
    //     defaultMessage="Maximum 2000 characters are allowed"
    //   />
    // ),
    // createdAt: yup
    //   .string()
    //   .required(
    //     <FormattedMessage
    //       id="addUpdatesModal.date.required.errorMessage"
    //       defaultMessage="Date is required"
    //     />
    //   ),
    country: yup
      .string()
      .required(
        <FormattedMessage
          id="addStartups.form.inputField.Country.placeholder"
          defaultMessage="Country is required"
        />
      ),
    categories: yup
      .string()
      .required(
        <FormattedMessage
          id="addUpdatesModal.updateType.required.errorMessage"
          defaultMessage="News type is required"
        />
      ),
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const storedUserDetails = localStorage.getItem("userDetails");
  let UserId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const userId = UserId?.id;

  let newsImage = useSelector((state) => state?.myNews?.newsImage?.image_url);
  let newsTypes = useSelector((state) => state?.myNews?.myNewsType);

  // const [fileName, setFileName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(myNewsType());
  }, [dispatch]);
  const countryData = useSelector((state) => state.globalApi.countries);

  const closeDialog = () => {
    setDialogOpen(false);
    reset();
    setSelectedNewsId(null);
  };

  useEffect(() => {
    if (newsId) {
      setValue("title", newsId?.title || "");
      setValue("description", newsId?.description || "");
      setValue("country", newsId?.country || "");
      setValue("categories", newsId?.categories || "");
    }
  }, []);

  const onSubmit = (data) => {
    if (newsId === null && fileName === "") {
      toast.error(
        <FormattedMessage
          id="addEventsModal.updateImage.fileFormat.errorMessage"
          defaultMessage="Please provide event image"
        />,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setDialogOpen(true);
    } else {
      if (!newsId) {
        const updateData = {
          image_url: newsImage,
          ...data,
        };

        const message = intl.formatMessage({
          id: "myNewsModal.addNews.successMessage",
          defaultMessage: "News created successfully",
        });
        if (UserId?.role === "ENTREPRENEUR") {
          dispatch(addMyNews(`startup/addNews`, updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (value === "own") {
                dispatch(myNewsFetch("startup", page, value, country, newsType, debouncedQuery));
              } else {
                dispatch(myAllNewsFetch("startup", page, value, country, newsType, debouncedQuery));
              }
            })
            .catch((err) => {});
        } else if (UserId?.role === "INVESTOR") {
          dispatch(addMyNews(`investor/addNews`, updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (value === "own") {
                dispatch(myNewsFetch("investor", page, value, country, newsType, debouncedQuery));
              } else {
                dispatch(
                  myAllNewsFetch("investor", page, value, country, newsType, debouncedQuery)
                );
              }
            });
        } else if (UserId?.role === "ADMINISTRATOR" && section !== "PendingNews") {
          dispatch(addMyNews(`admin/addNews`, updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (value === "own") {
                dispatch(adminNewsFetch("active", page, value, country, newsType, debouncedQuery));
              } else {
                dispatch(
                  adminAllNewsFetch("active", page, value, country, newsType, debouncedQuery)
                );
              }
            });
        }

        setDialogOpen(false);
        setSelectedNewsId(null);
      } else {
        const myNewsId = newsId?.id;

        const updateData = {
          // image_url: !newsId?.image_url ? null : newsId?.image_url,
          image_url: !newsImage ? null : newsImage,
          ...data,
          // categories: newsId?.categories,
        };

        const message = intl.formatMessage({
          id: "myEventsModal.addEvents.successMessage",
          defaultMessage: "News Updated successfully",
        });
        if (UserId?.role === "INVESTOR") {
          dispatch(updateMyNews(`investor/updateNews/${myNewsId}`, updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (value === "own") {
                dispatch(myNewsFetch("investor", page, value, country, newsType, debouncedQuery));
              } else {
                dispatch(
                  myAllNewsFetch("investor", page, value, country, newsType, debouncedQuery)
                );
              }
            });
        } else if (UserId?.role === "ADMINISTRATOR") {
          dispatch(updateMyNews(`admin/updateNews/${myNewsId}`, updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (UserId?.role === "ADMINISTRATOR" && section === "PendingEvents") {
                dispatch(myNewsFetch(`admin/news_list/${page}?listType=pending`));
              } else {
                if (value === "own") {
                  dispatch(
                    adminNewsFetch("active", page, value, country, newsType, debouncedQuery)
                  );
                } else {
                  dispatch(
                    adminAllNewsFetch("active", page, value, country, newsType, debouncedQuery)
                  );
                }
              }
            });
        } else if (UserId?.role === "ENTREPRENEUR") {
          dispatch(updateMyNews(`startup/updateNews/${myNewsId}`, updateData, message))
            .then((res) => {
              res?.success === true;
            })
            .then(() => {
              if (value === "own") {
                dispatch(myNewsFetch("startup", page, value, country, newsType, debouncedQuery));
              } else {
                dispatch(myAllNewsFetch("startup", page, value, country, newsType, debouncedQuery));
              }
            });
        }
        setDialogOpen(false);
        setSelectedNewsId(null);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (["image/jpg", "image/jpeg", "image/png"].includes(file.type) === false) {
        toast.error(
          <FormattedMessage
            id="addEventsModal.updateImage.fileFormat.errorMessage"
            defaultMessage="Supported only for  .JPEG or .PNG or .JPG file"
          />,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setDialogOpen(true);
        return;
      }
      if (file.size > 500 * 1024) {
        // Display an error message or perform any other action
        toast.error(
          <FormattedMessage
            id="news.form.fileSize.error.message"
            defaultMessage="File size exceeds 500 KB. Please choose a smaller file."
          />,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        return;
      } else {
        setFileName(file.name);
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
          formData.append("image", blob, file.name);

          // Dispatch the action with formData
          if (UserId?.role === "ENTREPRENEUR") {
            dispatch(uploadNewsImage("startup", formData));
          } else if (UserId?.role === "INVESTOR") {
            dispatch(uploadNewsImage("investor", formData));
          } else if (UserId?.role === "ADMINISTRATOR") {
            dispatch(uploadNewsImage("admin", formData));
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      maxWidth={false}
      // fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: { xs: "80%", sm: "70%", md: "50%", lg: "50%" },
          maxWidth: "none",
        },
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Typography style={{ fontSize: "0.9rem", fontWeight: "600" }}>
          {" "}
          {newsId ? (
            <FormattedMessage id="addnews.updateNews" defaultMessage="Update News" />
          ) : (
            <FormattedMessage id="news.addNews" defaultMessage="Add News" />
          )}
        </Typography>
        <CloseIcon style={{ cursor: "pointer" }} onClick={closeDialog} />
      </Box>
      <Divider sx={{ border: "1px solid #F5F5F5", width: "95%", margin: "auto" }} />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent style={{ width: "auto", padding: "0px" }}>
            <FormControl size="small" fullWidth>
              <Grid container rowSpacing={2}>
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addnews.feild.heading" defaultMessage="Heading" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <TextField
                    placeholder={intl.formatMessage({
                      id: "addnews.placeholder.heading",
                      defaultMessage: "News Heading",
                    })}
                    sx={{
                      "& input::placeholder": {
                        color: "rgba(0, 0, 0, 0.523)",
                      },
                    }}
                    name=""
                    fullWidth
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    {...register("title")}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.title?.message}
                  </p>
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                {/* <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>Email Address</Typography>
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={6} xl={6}>
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
                </Grid> */}

                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addnews.field.newsImage" defaultMessage="News Image" />
                  </Typography>
                  <Typography style={{ fontSize: "0.7rem" }}>
                    <FormattedMessage
                      id="addnews.field.newsImage.tagLine"
                      defaultMessage="This will be displayed on News Content"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      justifyContent: "center",
                    }}
                  >
                    {newsId?.image_url ? (
                      <img
                        src={`data:image/PNG;base64,${newsId?.image_url}`}
                        alt="Selected"
                        width="120px"
                        height="120px"
                      />
                    ) : (
                      ""
                    )}
                    <Button
                      style={{
                        marginTop: "10px",
                        width: "90%",
                        borderRadius: "5px",
                        mx: "auto",
                        gap: "10px",
                      }}
                      size="small"
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      onChange={handleImageChange}
                    >
                      <FormattedMessage
                        id="addnews.field.uploadImage.button"
                        defaultMessage="Upload Image"
                      />
                      <VisuallyHiddenInput type="file" />
                    </Button>
                    {/* {fileName && <Typography variant="body2">Uploaded file: {fileName}</Typography>} */}
                    {fileName !== ""
                      ? fileName && (
                          <Typography variant="body2">
                            <FormattedMessage
                              id="  addEvent.field.uploadedImage"
                              defaultMessage="Uploaded File"
                            />
                            {fileName}
                          </Typography>
                        )
                      : null}
                  </Box>
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addnews.field.newsType" defaultMessage="News Type" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  {/* <Controller
                    name="categories"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        multiple
                        size="small"
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...field}
                        renderValue={(selected) => [selected]}
                      >
                        {categories?.map((option) => (
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
                  /> */}
                  <Controller
                    name="categories"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        size="small"
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={field.value || ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value);
                        }}
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span style={{ color: "#808080" }}>
                            <FormattedMessage
                              id="addnews.placeholder.newtype"
                              defaultMessage="Select news type"
                            />
                          </span>
                        </MenuItem>

                        {/* Render other options */}
                        {newsTypes?.map((option) => (
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

                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.categories?.message}
                  </p>
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />
                <Grid item xs={12} sm={4} md={4} xl={4}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addnews.field.Country" defaultMessage="Country" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="single-select-label"
                        id="single-select"
                        displayEmpty
                        defaultValue=""
                        {...field}
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <FormattedMessage
                                id="addnews.placeholder.Country"
                                defaultMessage="Select country"
                              />
                            );
                          }

                          const countryOption = countryData.find(
                            (option) => option.country === selected
                          );

                          return countryOption?.country;
                        }}
                        sx={{
                          width: "100%",
                          color: field.value ? "black" : "gray",
                        }}
                      >
                        {countryData.map((option) => (
                          <MenuItem key={option.country} value={option.country}>
                            {option.country}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <p
                    style={{ color: "red", fontSize: "12px", marginTop: "2px", marginLeft: "5px" }}
                  >
                    {errors.country?.message}
                  </p>
                </Grid>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "95%",
                    margin: "10px auto",
                  }}
                />

                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <Typography style={TypoStyle}>
                    <span style={{ color: "red" }}>*</span>
                    <FormattedMessage id="addnews.field.description" defaultMessage="Description" />
                  </Typography>
                  <Typography style={{ fontSize: "0.7rem", marginLeft: "8px" }}>
                    <FormattedMessage
                      id="addnews.field.description.tagLine"
                      defaultMessage="Write a short introduction about news"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  {/* <TextField fullWidth size="small" id="outlined-basic" variant="outlined" /> */}
                  <TextField
                    fullWidth
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    multiline
                    rows={10}
                    {...register("description")}
                    // placeholder=""
                    placeholder={intl.formatMessage({
                      id: "addnews.placeholder.heading",
                      defaultMessage: "News Description",
                    })}
                    sx={{
                      "& textarea::placeholder": {
                        color: "rgba(0, 0, 0, 0.523)",
                      },
                    }}
                  />
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errors.description?.message}
                  </p>
                </Grid>
                {/* <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "100%",
                    margin: "5px auto",
                  }}
                /> */}
                <Typography
                  sx={{ fontSize: "12px", margin: "auto", display: "flex", alignItems: "center" }}
                >
                  <span style={{ color: "red" }}>*</span>
                  <FormattedMessage
                    id="addnews.waring.tagLine"
                    defaultMessage="Your news will be automatically deleted 3 days after creation"
                  />
                </Typography>
                <Divider
                  sx={{
                    border: "1.5px solid #F5F5F5",
                    width: "100%",
                    margin: "5px auto",
                  }}
                />
              </Grid>
            </FormControl>
            <Stack
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                // alignItems: "flex-end",
                flexDirection: "row",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <Button
                onClick={closeDialog}
                size="small"
                style={{
                  ...ButtonCss,
                  padding: "8px 15px",
                  // marginRight: "10px",
                  background: "#d32f2f",
                  color: "#fff",
                }}
              >
                <FormattedMessage id="myUpdatesModal.cancelButton.title" defaultMessage="Cancel" />
              </Button>
              <Button
                size="small"
                style={{ ...ButtonCss, background: "green", color: "#ffff", padding: "8px 15px" }}
                type="submit"
              >
                <FormattedMessage id="myUpdatesModal.submitButton.title" defaultMessage="Submit" />
              </Button>
            </Stack>
          </DialogContent>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewsModal;
