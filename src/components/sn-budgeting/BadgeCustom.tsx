import { Alert } from "@mui/material";
import React from "react";

export const BadgeCustom = ({
  text,
  color = "grey.800",
  bgcolor = "grey.200",
}: {
  text: string;
  color?: string;
  bgcolor?: string;
}) => (
  <Alert
    sx={{
      bgcolor,
      color,
      paddingY: 0,
      ".MuiAlert-message": { paddingY: "5px" },
      display: "inline-block",
    }}
    icon={false}
  >
    {text}
  </Alert>
);
