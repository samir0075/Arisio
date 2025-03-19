import { Box } from "@mui/system";
import React, { useState } from "react";
import styles from "./SignupLoginModal.module.css";
import InvestorSignup from "./Signup/InvestorSignup";
import InvestorLogin from "./Login/InvestorLogin";

const Investor = ({ setDialogOpen }) => {
  const [action, setAction] = useState(false);

  /*
   ** Setting Signup page or login page
   */
  const handleAction = () => {
    setAction(!action);
  };

  return (
    <>
      <Box className={styles.scrollbar} sx={{ maxHeight: "500px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {action ? (
            // Render SignupComponent when action is true
            <InvestorSignup handleAction={handleAction} setDialogOpen={setDialogOpen} />
          ) : (
            // Render LoginComponent when action is false
            <InvestorLogin handleAction={handleAction} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Investor;
