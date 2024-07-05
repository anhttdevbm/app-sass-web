/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonBase,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  popoverClasses,
  selectClasses,
  Theme,
} from "@mui/material";
import React, { memo, useMemo, useState } from "react";
import { FilterSearchDocsProps, sxConfig } from "./FilterSearchDocs";
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_DOCS } from "constant/index";
import { SelectMembers } from "components/sn-projects/components";
import { useFormik } from "formik";
import TextFieldSelect from "components/shared/TextFieldSelect";
import { Dropdown } from "components/Filters";
import { STATUS_OPTIONS } from "components/sn-projects/components/helpers";
import ChevronIcon from "icons/ChevronIcon";

const FilterProjectStatus = ({ onChange, queries }: FilterSearchDocsProps) => {
  const docsT = useTranslations(NS_DOCS);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const commonT = useTranslations(NS_COMMON);

  const statusOptions = useMemo(() => {
    const res = STATUS_OPTIONS.map((item) => ({
      ...item,
      label: commonT(item.label),
    }));
    return [
      {
        label: "None",
        value: "",
      },
      ...res,
    ];
  }, [commonT]);

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={sxConfig.item}
      >
        <Text variant="body2" color="grey.400">
          {docsT("filter.filter.projectStatus")}
        </Text>
        <ChevronIcon fontSize="small"></ChevronIcon>
      </MenuItem>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
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
        <Box
          sx={{
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderTopWidth: 0,
            borderColor: "grey.100",
            borderRadius: 1,
          }}
        >
          <TextFieldSelect
            value={queries?.project_status}
            onChange={(e) => {
              onChange("project_status", e.target.value);
            }}
            options={statusOptions}
            label={commonT("status")}
            sx={{ flex: 1 }}
          />
        </Box>
      </Popover>
    </>
  );
};

export default memo(FilterProjectStatus);
