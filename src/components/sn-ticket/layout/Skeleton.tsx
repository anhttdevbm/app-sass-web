"use client";

import { Box, CircularProgress } from "@mui/material";

export default function Skeleton({
  color = "primary",
}: {
  color?:
    | "primary"
    | "inherit"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress color={color} />
    </Box>
  );
}
