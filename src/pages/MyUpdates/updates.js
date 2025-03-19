import React, { useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useForm } from "react-hook-form";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";

import AccordionSummary from "@mui/material/AccordionSummary";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myUpdate, deleteMyUpdates } from "src/action/myUpdates";
// import moment from "moment";
import { useRouter } from "next/router";
import MyUpdateModal from "./myUpdateModal";
import DeleteModal from "../../components/DeleteModal";
import ExternalContainer from "src/components/ExternalContainer";
import { FormattedMessage, useIntl } from "react-intl";

const MyUpdates = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);

  const storedUserDetails = localStorage.getItem("userDetails");
  let startupId = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  startupId = startupId?.startupId;
  const intl = useIntl();

  const onAdd = () => {
    setDialogOpen(true);
  };
  const onDelete = (record) => {
    console.log("record", record);
    setDeleteModal(true);
    setSelectedUpdate(record);
  };

  const handleDelete = () => {
    const message = intl.formatMessage({
      id: "myUpdateModal.delete.successMessage",
      defaultMessage: "Updates deleted successfully",
    });
    dispatch(deleteMyUpdates(selectedUpdate, startupId, message));
    setDeleteModal(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const message = intl.formatMessage({
      id: "myUpdateModal.add.successMessage",
      defaultMessage: "Updates added successfully",
    });
    dispatch(myUpdate(startupId, intl));
  }, [dispatch, startupId]);

  let myUpdateData = useSelector((state) => state?.seeMyUpdates?.myUpdates);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(undefined, options);

    // Pad day and month with leading zeros if less than 10
    const [month, day, year] = formattedDate.split("/");
    const paddedMonth = month.padStart(2, "0");
    const paddedDay = day.padStart(2, "0");

    return `${paddedDay}/${paddedMonth}/${year}`;
  };

  // const onSubmit = (data) => {
  //   data.preventDefault();
  //   console.log("data");
  //   setDialogOpen(false);

  //   // dispatch(addMyUpdate(startupId, data));
  // };

  return (
    <>
      <ExternalContainer>
        <Box sx={{ bgcolor: "#ffff", width: "auto", height: "auto" }}>
          <Typography
            style={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "30px",
            }}
            level="h4"
          >
            <FormattedMessage id="myUpdates.title" defaultMessage=" My Updates" />
          </Typography>
          <Container
            style={{
              display: "flex",
              padding: "20px",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              onClick={onAdd}
              size="md"
              style={{
                width: "150px",
                borderRadius: "8px",
                backgroundColor: "#8a1538",
                color: "#ffff",
              }}
            >
              <FormattedMessage id="myUpdates.addButton.title" defaultMessage=" + Add An Update" />
            </Button>
          </Container>
          <Divider
            variant="middle"
            style={{
              borderTopWidth: "2px",
            }}
            orientation="horizontal"
          />

          <Box style={{ overflowY: "auto", height: "400px" }}>
            {myUpdateData?.map((myUpdate) => (
              // console.log("myUpdatesss", myUpdate),
              <Container
                key={myUpdate.id}
                style={{
                  display: "flex",
                  padding: "20px",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Accordion size="sm" sx={{ maxWidth: 400 }}>
                  <AccordionSummary style={{ fontWeight: 600, color: "#8a1538", fontSize: 14 }}>
                    {myUpdate.name} / {myUpdate.type}
                  </AccordionSummary>
                  <AccordionDetails style={{ fontSize: "14px" }}>
                    <Typography style={{ fontSize: "14px" }}>
                      {/* {moment(myUpdate?.dbUpdatedAt).format("YYYY-MM-DD HH:mm:ss")} */}
                      {formatDate(myUpdate?.milestoneDate)}
                    </Typography>
                    {myUpdate.description}
                  </AccordionDetails>
                </Accordion>

                <Button
                  size="sm"
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#8a1538",
                    color: "#ffff",
                    marginTop: "10px",
                  }}
                  onClick={(e) => {
                    onDelete(myUpdate?.id);
                  }}
                >
                  <DeleteOutlinedIcon />
                </Button>
              </Container>
            ))}
          </Box>
        </Box>
      </ExternalContainer>

      {dialogOpen && <MyUpdateModal dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />}
      {deleteModal && (
        <DeleteModal
          visible={deleteModal}
          setDeleteModal={setDeleteModal}
          // title={intl.formatMessage({
          //   id: "myUpdates.deleteUpdate.title",
          //   defaultMessage: "Are You Sure To Delete The Updates?",
          // })}
          title={
            <FormattedMessage
              id="myUpdates.deleteUpdate.title"
              defaultMessage="Are You Sure To Delete The Updates?"
            />
          }
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};
MyUpdates.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default MyUpdates;
