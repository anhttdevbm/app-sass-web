/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import ArrowDownIcon from "icons/ArrowDownIcon";

interface IProps<T> {
  selectedValue: T;
  setSelectedValue: (value: T) => void;
  label: string | React.ReactNode;
  data: { label: string; value: string; key: string }[] | string[];
}

export default function SettingSelect<T>({
  selectedValue,
  setSelectedValue,
  label,
  data,
}: IProps<T>) {
  const isStringArray = (data: any[]): data is string[] => {
    return typeof data[0] === "string";
  };
  return (
    <FormControl
      fullWidth
      sx={{
        background: "#F7F7FD",
        "& fieldset": {
          border: "none",
        },
      }}
    >
      <Select
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value as T)}
        fullWidth
        IconComponent={() => (
          <ArrowDownIcon
            sx={{
              transform: "rotate(-90deg)",
              position: "absolute",
              right: "20px",
              color: "#666",
              cursor: "pointer",
              pointerEvents: "none",
            }}
          />
        )}
        renderValue={(value) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              pl: "20px",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "#999",
              }}
            >
              {label}
            </Typography>
            <Typography>
              {(!isStringArray(data) &&
                data.find((item) => item.value === value)?.label) ||
                (value as unknown as string)}
            </Typography>
          </Box>
        )}
        sx={{
          fontSize: "14px",
          color: "#212121",
          height: "54px",
          "& .MuiSelect-select": {
            paddingY: "0px",
          },
        }}
      >
        {data.map((item) =>
          typeof item === "string" ? (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ) : (
            <MenuItem key={item.key} value={item.value}>
              {item.label}
            </MenuItem>
          ),
        )}
      </Select>
    </FormControl>
  );
}
