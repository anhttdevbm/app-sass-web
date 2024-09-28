/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ButtonBase,
  MenuItem,
  Popover,
  popoverClasses
} from "@mui/material";
import { Input, Text } from "components/shared";
import { sxConfig } from "components/sn-ticket/FilterSearchDocs/FilterSearchDocs";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";

interface FilterSearchDocsProps {
  onChange: (value: string) => void;
  queries: { name: string };
}

const FilterName = ({ onChange, queries }: FilterSearchDocsProps & { queries: { name: string } }) => {
  const docsT = useTranslations(NS_DOCS);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={sxConfig.item}
      >
        <Text variant="body2" color="grey.400">
          {docsT("filter.filter.name")}
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
        <Input
          onChange={(e) => onChange(e.target.value)}
          value={queries?.name}
          placeholder="Nhập tên doc"
        ></Input>
      </Popover>
    </>
  );
};

export default memo(FilterName);
