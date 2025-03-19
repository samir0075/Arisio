import { Button, Dialog, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./StartupPitch.module.css";
import { useDispatch } from "react-redux";
import { deleteDocument, deleteMember } from "src/action/seeNewMandate";
import { FormattedMessage, useIntl } from "react-intl";

const DeleteModal = ({ deleteDialogOpen, setDeleteDialogOpen, deleteId, deleteFromTab, flow }) => {
  const dispatch = useDispatch();
  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const id = userDetails?.role_id === 3 ? userDetails?.investorId : userDetails?.startupId;

  const [message, setMessage] = useState("");
  const intl = useIntl();

  useEffect(() => {
    if (deleteFromTab === "Document") {
      setMessage(
        <FormattedMessage
          id="startupPitch.deleteModal.documentDelete.heading"
          defaultMessage="Are you sure you want to delete this document ?"
        />
      );
    } else {
      setMessage(
        <FormattedMessage
          id="startupPitch.deleteModal.memberDelete.heading"
          defaultMessage="Are you sure you want to delete this member ?"
        />
      );
    }
  }, [deleteFromTab]);

  const handleClose = () => {
    setDeleteDialogOpen(false);
  };
  const handleDelete = () => {
    deleteFromTab
      ? dispatch(deleteDocument(deleteId, id, intl, flow)).then((res) => {
          setDeleteDialogOpen(false);
        })
      : dispatch(deleteMember(deleteId, id, intl)).then((res) => {
          setDeleteDialogOpen(false);
        });
  };
  return (
    <>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Grid sx={{ p: 4 }}>
          <Typography className={styles.inputField}>{message}</Typography>
          <Grid container justifyContent="center">
            <Button
              style={{ marginLeft: "15px" }}
              onClick={handleDelete}
              type="submit"
              className={styles.nextButton}
            >
              <FormattedMessage
                id="startupPitch.deleteModal.yesButton.title"
                defaultMessage="Yes"
              />
            </Button>
            <Button
              className={styles.nextButton}
              sx={{ backgroundColor: "#F5F5F5 !important", marginLeft: "5px" }}
              onClick={handleClose}
            >
              <FormattedMessage id="startupPitch.deleteModal.noButton.title" defaultMessage="No" />
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default DeleteModal;
