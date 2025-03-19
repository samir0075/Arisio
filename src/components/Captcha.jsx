import ReCAPTCHA from "react-google-recaptcha";
import { Box, useMediaQuery } from "@mui/material";
import { RECAPTCHA_SITE_KEY } from "src/utils/request";

const Captcha = ({ setLoading, setError, error, setCaptchaValue, recaptchaRef }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleRecaptchaChange = (value) => {
    setCaptchaValue(value);

    if (!value) {
      alert("Please complete the reCAPTCHA");
      setLoading(true);
      return;
    }
    setError(null);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        mt: 1,
        transform: isMobile ? "scale(0.7, 0.85)" : isMedium ? "scaleX(0.6)" : "scaleX(1)",
        transformOrigin: "0 0",
      }}
    >
      <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} ref={recaptchaRef} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Box>
  );
};

export default Captcha;
