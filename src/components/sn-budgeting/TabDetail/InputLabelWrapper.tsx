import { Stack, SxProps, Typography } from "@mui/material";
import React from "react";

interface InputLabelWrapperProps {
  children: React.ReactNode;
  sx?: SxProps;
  labelSx?: SxProps;
  label: string;
}

function InputLabelWrapper({
  children,
  sx,
  labelSx,
  label,
}: InputLabelWrapperProps) {
  return (
    <Stack direction="column" sx={sx}>
      <Typography
        fontWeight="bold"
        variant="caption"
        sx={{
          ml: 2,
          color: "grey.300",
          ...labelSx,
        }}
      >
        {label}
      </Typography>
      {children}
    </Stack>
  );
}

export default InputLabelWrapper;
