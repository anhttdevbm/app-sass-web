"use client";

import {
  ButtonBase,
  MenuItem,
  Popover,
  Stack,
  popoverClasses,
} from "@mui/material";
import React, { memo, useState } from "react";
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_PROJECT } from "constant/index";
import { TFilterSearchProps } from "components/sn-project-detail/Budget/Actions/Filter";
import DatePicker from "react-datepicker";

const FilterDate = ({ onChange, queries }: TFilterSearchProps) => {
  const projectT = useTranslations(NS_PROJECT);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [paperHeight, setPaperHeight] = useState<string | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChangeDateFilter = ([startDate, endDate]) => {
    onChange("start_date", startDate);
    onChange("end_date", endDate);
  };

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={{
          width: "100%",
          py: 1,
          px: 2,
        }}
      >
        <Text variant="body2" color="grey.400">
          {projectT("budget.filter.time")}
        </Text>
      </MenuItem>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 270,
            maxWidth: 270,
            height: paperHeight ?? "auto",
          },
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              mt: 0.5,
            },
          },
        }}
      >
        <Stack
          sx={{
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderTopWidth: 0,
            borderColor: "grey.100",
            borderRadius: 1,
          }}
        >
          <DatePicker
            selected={queries?.start_date}
            onChange={onChangeDateFilter}
            startDate={queries?.start_date}
            endDate={queries?.end_date}
            onFocus={() => setPaperHeight("330px")}
            onBlur={() => setPaperHeight(null)}
            selectsRange
            inline
          />
        </Stack>
      </Popover>
    </>
  );
};

export default memo(FilterDate);
