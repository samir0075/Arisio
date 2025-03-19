/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { Button, Grid, Modal, TextField, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { getMandateShortDetails, manageExtendedDate } from "src/action/investorMandates";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormattedMessage } from "react-intl";

const schema = yup
  .object({
    foundedYear: yup.string().required("Enter the date"),
  })
  .required();

const manageExtendedDateModal = ({ openExtendedDateModal, setOpenExtendedDateModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const investorId = userDetails?.investorId;
  const mandateShortDetails = useSelector((state) => state.investorMandates.shortDetails);
  const [handleKey, setHandleKey] = useState("");
  const mandateId = mandateShortDetails?.id ? mandateShortDetails?.id : null;

  const handleClose = () => {
    setOpenExtendedDateModal(false);
  };

  useEffect(() => {
    setValue("foundedYear", "");
  }, [setValue]);

  const onSubmit = (data) => {
    const date = data?.foundedYear;
    if (date === mandateShortDetails?.endDate.split(" ")[0]) {
      setHandleKey(
        <FormattedMessage
          id="mandateExtendedDateModal.card.handelKey.text1"
          defaultMessage="Please select other Date. Its already Present as end Date"
        />
      );
    } else {
      dispatch(manageExtendedDate(investorId, mandateId, date)).then((res) => {
        if (res?.status === "true") {
          setHandleKey(
            <FormattedMessage
              id="mandateExtendedDateModal.card.handelKey.text2"
              defaultMessage="Mandate end date has been updated successfully"
            />
          );
        }
      });
      setTimeout(() => {
        dispatch(getMandateShortDetails(investorId, mandateId));
        setOpenExtendedDateModal(false);
      }, 5000);
    }
  };

  return (
    <>
      <Modal
        open={openExtendedDateModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "35px",
            paddingRight: "25px",
            paddingLeft: "25px",
            borderRadius: "10px",
            bgcolor: "#ffffff",
            boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.56)",
            p: 4,
          }}
          style={{ width: "40%", padding: "20px" }}
        >
          <CancelIcon
            sx={{
              position: "absolute",
              top: "10px", // Adjust to your liking
              right: "10px", // Adjust to your liking
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
            color="disabled"
            onClick={handleClose}
          />
          <Grid style={{ float: "left", display: "flex", flexDirection: "row" }}>
            <img
              style={{ height: "50px", width: "50px", marginLeft: "10px", marginTop: "-8px" }}
              src="/Images/Schedule-meeting-logo.png"
              alt="Meeting LOGO"
            />
            <Typography
              style={{
                fontFamily: "Calibri",
                fontWeight: 700,
                fontSize: "20px",
                color: "#393939",
                marginLeft: "15px",
              }}
            >
              {" "}
              <FormattedMessage
                id="mandateExtendedDateModal.card.heading.text1"
                defaultMessage="Extend Mandate End Date"
              />
            </Typography>
          </Grid>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container md={12} direction="column" style={{ padding: "20px 20px 0px 20px" }}>
              <Grid item md={8} direction="row">
                <Typography
                  style={{
                    fontFamily: "Calibri",
                    fontWeight: 600,
                    fontSize: "18px",
                    color: "#5b5858",
                    paddingBottom: "0px",
                  }}
                >
                  {" "}
                  <FormattedMessage
                    id="mandateExtendedDateModal.card.heading.text2"
                    defaultMessage="Choose date"
                  />
                </Typography>
              </Grid>
              <Grid item md={8} direction="row" style={{ marginTop: "10px" }}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  fullWidth
                  type="date"
                  helperText={handleKey}
                  inputProps={{
                    min: mandateShortDetails?.endDate.split(" ")[0],
                  }}
                  onSelect={(event) => {
                    setHandleKey("");
                  }}
                  FormHelperTextProps={{
                    style: {
                      color:
                        handleKey === "Please select other Date. Its already Present as end Date"
                          ? "red"
                          : "green",
                    },
                  }}
                  {...register("foundedYear", { required: true })}
                />
                {errors.foundedYear && (
                  <span style={{ color: "red" }}>{errors.foundedYear?.message}</span>
                )}
              </Grid>
              <Grid
                item
                md={8}
                direction="row"
                style={{ display: "flex", justifyContent: "flex-end", marginTop: "150px" }}
              >
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    style={{
                      fontSize: "18px",
                      fontFamily: "Calibri",
                      width: "85px",
                      fontWeight: 600,
                      verticalAlign: "middle",
                      borderRadius: "25px",
                      cursor: "pointer",
                      backgroundColor: "#8a1538",
                      color: "#fff",
                    }}
                  >
                    <FormattedMessage
                      id="mandateExtendedDateModal.card.button.text"
                      defaultMessage="Submit"
                    />
                  </Button>
                </>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </>
  );
};

manageExtendedDateModal.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default manageExtendedDateModal;
