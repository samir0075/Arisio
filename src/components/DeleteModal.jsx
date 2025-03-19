import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";

const DeleteModal = ({ visible, setDeleteModal, title, handleDelete }) => {
  /**
   * onCancel will close the delete modal
   */
  const handleClose = () => {
    setDeleteModal(false);
  };

  return (
    <Dialog
      open={visible}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogActions>
        <Button style={{ marginLeft: "30px" }} onClick={handleClose}>
          {" "}
          <FormattedMessage id="deleteModal.cancelButton.title" defaultMessage="Cancel" />
        </Button>
        <Button onClick={handleDelete} autoFocus>
          <FormattedMessage id="deleteModal.okayButton.title" defaultMessage="Okay" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
