/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonBase,
  MenuItem,
  Popover,
  popoverClasses
} from "@mui/material";
import { Text } from "components/shared";
import TextFieldSelect from "components/shared/TextFieldSelect";
import { STATUS_OPTIONS } from "components/sn-projects/components/helpers";
import { sxConfig } from "components/sn-ticket/FilterSearchDocs/FilterSearchDocs";
import { NS_COMMON, NS_DOCS } from "constant/index";
import ChevronIcon from "icons/ChevronIcon";
import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";
import { GetDocQueries } from "../helpers";
import type { FilterSearchDocsProps } from "./FilterSearchDocs";

const FilterProjectStatus = ({ onChange }: FilterSearchDocsProps) => {
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
            value={""} // Replace with the appropriate value or state
            onChange={(e) => {
              onChange(e.target.value as Partial<GetDocQueries>);
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
