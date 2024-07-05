"use client";

import { memo } from "react";
import { Box, Stack } from "@mui/material";
import { RangeDatePicker, Pagination } from "./components";

type ActionsProps = {};

const Actions = (props: ActionsProps) => {
  return (
    <Stack direction="row" my={3} justifyContent="space-between" px={3}>
      <Box component="span" />
      <RangeDatePicker />
      <Pagination />
    </Stack>
  );
};

export default memo(Actions);
