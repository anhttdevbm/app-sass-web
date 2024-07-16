import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { IToolBarDraftActionItem } from "../..";
import { uuid } from "utils/index";

const borderXStyle = {
  position: "relative",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "2px",
    backgroundColor: "grey.500",
    top: "25%",
    bottom: "25%",
  },
  "&::before": {
    left: 0,
  },
  "&::after": {
    right: 0,
  },
};

export default function TextFormatDropDown() {
  const [textFormat, setTextFormat] = useState<string>();
  const textFormarts: IToolBarDraftActionItem[] = [
    { id: uuid(), label: "Normal Text", style: "normaltext", method: "block" },
    { id: uuid(), label: "H1", style: "header-one", method: "block" },
    { id: uuid(), label: "H2", style: "header-two", method: "block" },
    { id: uuid(), label: "H3", style: "header-three", method: "block" },
    { id: uuid(), label: "H4", style: "header-four", method: "block" },
    { id: uuid(), label: "H5", style: "header-five", method: "block" },
    { id: uuid(), label: "H6", style: "header-six", method: "block" },
  ];

  const handleChange = (event: SelectChangeEvent) => {
    setTextFormat(event.target.value as string);
  };

  return (
    <Box
      sx={{
        ...borderXStyle,
        minWidth: 120,
      }}
    >
      <FormControl fullWidth>
        <Select
          sx={{
            fontWeight: "bold",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          labelId="dropdown-select-textFormat"
          id="dropdown-select-textFormat"
          defaultValue={textFormarts[0].label}
          onChange={handleChange}
        >
          {textFormarts.map((item) => (
            <MenuItem key={item.id} value={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
