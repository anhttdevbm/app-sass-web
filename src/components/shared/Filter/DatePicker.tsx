import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";

//import { MobileDatePicker } from "@mui/x-date-pickers";

import React from "react";
import dayjs, { Dayjs } from "dayjs";

interface IProps {
  value: string;
  label: string;
  onChange?(value: string): void;
  sx?: object;
}

const typographyStyles = {
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "18px",
  color: "#666666",
};

const FilterSelect: React.FC<IProps> = ({ label, value, sx, onChange }) => {
  const [currentDate] = React.useState<Dayjs | null>(null);

  const calendarRef = React.useRef<HTMLInputElement | null>(null);
  return (
    <Stack
      direction="row"
      sx={{ minWidth: "max-content", alignItems: "center", ...sx }}
    >
      <Typography
        sx={{ ...typographyStyles, marginRight: "4px" }}
        onClick={() => {
          if (calendarRef) calendarRef.current?.click();
        }}
      >
        {value ? value : label}
      </Typography>
      <Box
        component="img"
        //src={Assets.calendarIcon}
        sx={{ width: "20px", height: "20px" }}
        onClick={() => calendarRef && calendarRef.current?.click()}
      />
      {/* <MobileDatePicker
        inputRef={calendarRef}
        closeOnSelect
        value={dayjs(currentDate)}
        sx={{ display: "none" }}
        onChange={(value: any) =>
          onChange && onChange(dayjs(value).format("MM/DD/YYYY"))
        }
        slotProps={{
          actionBar: {
            actions: [],
          },
          toolbar: {
            hidden: true,
          },
          day: {
            sx: {
              transition: "all ease 0.25s",
              borderRadius: "4px",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "#ffffff",
                background: `red !important`,
                "&.MuiPickersDay-today": {
                  color: "#ffffff",
                  borderColor: "green",
                },
              },
              "&.MuiPickersDay-today": {
                color: "red",
                borderColor: "green",
              },
              ":hover": {
                background: "red",
              },
            },
          },
        }}
      /> */}
    </Stack>
  );
};

export default FilterSelect;
