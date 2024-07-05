"use client";

import React from "react";
import { Box } from "@mui/material";
import { Text } from "components/shared";
import { HeaderMobileProps } from "components/sn-chatting-room/type";

const HeaderMobile: React.FC<HeaderMobileProps> = ({
  children,
  prefix,
  suffix,
  title,
  backgroundColor,
}) => {
  const defaultBackgroundColor = backgroundColor ? backgroundColor : "#3699FF";
  return (
    <>
      <Box
        sx={{
          display: "flex",
          backgroundColor: defaultBackgroundColor,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "54px",
          padding: "16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {prefix}
          <Text
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: "white",
              ...(prefix && { marginLeft: "24px" }),
            }}
          >
            {title}
          </Text>
        </Box>

        {suffix}
      </Box>

      {children}
    </>
  );
};

export default HeaderMobile;
