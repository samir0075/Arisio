import { Box, Button, Dialog, DialogContentText, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userEmailVerification } from "src/action/signIn";

const EmailVerification = () => {
  const [open, setOpen] = useState(true);
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const { verificationToken } = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userEmailVerification(verificationToken)).then((res) => {
      setMsg(res?.status);
    });
  }, [dispatch, verificationToken]);

  const handleClose = () => {
    router.push("/");
    setOpen(false);
  };

  return (
    <>
      {msg ? (
        <Dialog open={open}>
          <Box sx={{ p: 2 }}>
            <DialogContentText>{msg}</DialogContentText>
            <Grid container justifyContent={"flex-end"}>
              <Button
                sx={{ bgcolor: "rgba(138, 21, 56, 0.15)!important", marginTop: "10px" }}
                onClick={handleClose}
              >
                OK
              </Button>
            </Grid>
          </Box>
        </Dialog>
      ) : (
        ""
      )}
    </>
  );
};

export default EmailVerification;
