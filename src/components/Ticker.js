import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Link from "next/link";

const Ticker = ({
  items = [
    "Web Summit Qatar Exclusive Offer",
    "Web Summit Qatar Exclusive Offer",
    "Web Summit Qatar Exclusive Offer",
    "Web Summit Qatar Exclusive Offer",
    "Web Summit Qatar Exclusive Offer",
  ],
  backgroundColor = "#FF6002",
  textColor = "#ffffff",
  speed = 45,
  height = "2rem",
}) => {
  const tickerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && tickerRef.current) {
      const contentWidth = contentRef.current.offsetWidth;

      const keyframes = `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${contentWidth / 2}px); }
        }
      `;

      const styleSheet = document.createElement("style");
      styleSheet.textContent = keyframes;
      document.head.appendChild(styleSheet);

      return () => {
        document.head.removeChild(styleSheet);
      };
    }
  }, [items]);

  const tickerStyle = {
    position: "fixed",
    width: "100%",
    height,
    backgroundColor,
    overflow: "hidden",
    top: { xs: 63, md: 72 },
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
  };
  const contentStyle = {
    display: "flex",
    whiteSpace: "nowrap",
    animation: `ticker ${speed}s linear infinite`,
    "&:hover": {
      animationPlayState: "paused",
    },
  };

  const itemStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "0 2rem",
    fontSize: "1rem",
    color: textColor,
    fontWeight: 400,
  };

  // Double the items to ensure seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <Box ref={tickerRef} sx={tickerStyle}>
      <Box ref={contentRef} sx={contentStyle}>
        {duplicatedItems.map((item, index) => (
          <Box key={index} sx={itemStyle}>
            {item} -{" "}
            <Link
              style={{
                color: "white",
                fontWeight: 500,
                marginLeft: "4px",
              }}
              href="/Pricing"
            >
              Click here
            </Link>{" "}
            !
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Ticker;
