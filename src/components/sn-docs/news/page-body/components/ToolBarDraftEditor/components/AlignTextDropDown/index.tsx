import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { IToolBarDraftActionItem } from "../..";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { uuid } from "utils/index";

const borderRightStyle = {
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "25%",
    bottom: "25%",
    right: 0,
    width: "2px",
    backgroundColor: "grey.500",
  },
};

export default function AlignTextDropDown() {
  const [alignFormat, setAlignFormat] = useState<string>();
  const alignFormatList: IToolBarDraftActionItem[] = [
    {
      id: uuid(),
      label: "Left",
      style: "leftAlign",
      icon: <FormatAlignLeftIcon />,
      method: "block",
    },
    {
      id: uuid(),
      label: "Center",
      style: "centerAlign",
      icon: <FormatAlignCenterIcon />,
      method: "block",
    },
    {
      id: uuid(),
      label: "Right",
      style: "rightAlign",
      icon: <FormatAlignRightIcon />,
      method: "block",
    },
  ];

  const handleChange = (event: SelectChangeEvent) => {
    setAlignFormat(event.target.value as string);
  };

  return (
    <Box
      sx={{
        ...borderRightStyle,
      }}
    >
      <FormControl fullWidth>
        <Select
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          labelId="dropdown-select-textFormat"
          id="dropdown-select-textFormat"
          defaultValue={alignFormatList[0].label}
          onChange={handleChange}
        >
          {alignFormatList.map((item) => (
            <MenuItem key={item.id} value={item.label}>
              {item.icon}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
