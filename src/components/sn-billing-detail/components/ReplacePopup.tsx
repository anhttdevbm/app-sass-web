import React, { memo, useState } from "react";
import PopoverLayout from "./PopoverLayout";
import { Input, Text } from "components/shared";
import { Popover, Stack, popoverClasses } from "@mui/material";
import { FormikProps } from "formik";
import { Billing } from "store/billing/reducer";
import { formatNumber } from "utils/index";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_BILLING } from "constant/index";
import { useTranslations } from "next-intl";

type IProps = {
  selected?: string;
  fileName?: string;
  anchorEl?: any;
  setAnchorEl?: (value: any | null) => void;
  setFileName?: (value: string) => void;
};
const ReplacePopup = (props: IProps) => {
  const { fileName, setFileName, selected, anchorEl, setAnchorEl } = props;
  const billingT = useTranslations(NS_BILLING);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl?.(null);
  };

  const handleChange = (data) => {
    setFileName?.(data?.target?.value);
  };

  return (
    <Stack gap={2}>
      <Popover
        open={Boolean(open)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 250,
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 216,
            maxWidth: 236,
            maxHeight: 300,
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
        <Stack gap={2} p={2}>
          <Input
            placeholder={""}
            rootSx={sxConfig.input}
            fullWidth
            name="fileName"
            value={fileName}
            onChange={handleChange}
          />
        </Stack>
      </Popover>
      {/* <PopoverLayout
        // eslint-disable-next-line react/no-children-prop
        children={
          <>
            <Stack gap={2} p={2}>
              <Input
                placeholder={""}
                rootSx={sxConfig.input}
                fullWidth
                name="fileName"
                value={fileName}
                onChange={handleChange}
              />
            </Stack>
          </>
        }
        label={selected}
      /> */}
    </Stack>
  );
};
const sxConfig = {
  input: {
    height: 56,
  },
};
export default memo(ReplacePopup);
