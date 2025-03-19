import { Box } from "@mui/system";
import React, { useState } from "react";
import styles from "./SignupLoginModal.module.css";
import StartupSignup from "./Signup/StartupSignup";
import StartupLogin from "./Login/StartupLogin";

const Startup = ({ setDialogOpen }) => {
  const [action, setAction] = useState(false);

  /*
   ** Setting Signup page or login page
   */
  const handleAction = () => {
    setAction(!action);
  };

  return (
    <Box className={styles.scrollbar} sx={{ maxHeight: "510px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {action ? (
          // Render SignupComponent when action is true
          <StartupSignup handleAction={handleAction} setDialogOpen={setDialogOpen} />
        ) : (
          // Render LoginComponent when action is false
          <StartupLogin handleAction={handleAction} />
        )}
      </Box>
    </Box>
  );
};

export default Startup;
