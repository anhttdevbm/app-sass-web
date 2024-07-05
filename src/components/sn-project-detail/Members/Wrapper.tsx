"use client";

import { memo } from "react";
import { Stack } from "@mui/material";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <Stack flex={1}>{children}</Stack>;
};

export default memo(Wrapper);
