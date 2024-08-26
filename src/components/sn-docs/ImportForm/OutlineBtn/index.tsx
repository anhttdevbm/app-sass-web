import { Button, SxProps, Typography } from "@mui/material";
import React from "react";

export default function OutlineBtn({
  text,
  startIcon,
  onClick,
  isLinear = false,
  sx = {},
}: {
  text: string;
  startIcon?: JSX.Element;
  onClick?: () => void;
  isLinear?: boolean;
  sx?: SxProps;
}) {
  const style: SxProps = isLinear
    ? {
        position: "relative",
        border: "1px solid transparent",
        backgroundClip: "padding-box",
        bgcolor: "rgba(255, 255, 255, 100%)",
        borderRadius: 1,
        "&:after": {
          position: "absolute",
          top: -1,
          left: -1,
          right: -1,
          bottom: -1,
          background: `linear-gradient(90deg, #73ACDF, #B673DF, #DF7373, #73DF84, #73ACDF)`,
          content: '""',
          zIndex: -1,
          borderRadius: 1,
        },
        "&:hover": {
          border: "1px solid transparent",
          bgcolor: "rgba(255, 255, 255, 95%)",
        },
      }
    : {};
  return (
    <Button
      variant="outlined"
      startIcon={startIcon}
      size="large"
      fullWidth
      sx={{
        py: 1.5,
        textTransform: "none",
        ...style,
        ...sx,
      }}
      onClick={onClick}
    >
      <Typography variant="body2">{text}</Typography>
    </Button>
  );
}
