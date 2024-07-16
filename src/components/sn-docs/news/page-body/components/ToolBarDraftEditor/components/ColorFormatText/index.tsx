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

const BoxColor = ({ colorCode }: { colorCode: string }) => {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        bgcolor: colorCode,
        display: "inline-block",
      }}
    />
  );
};

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

export interface IColorFormatListItem extends IToolBarDraftActionItem {
  codeColor: string;
}

export default function ColorFormatText() {
  const [colorFormat, setColorFormat] = useState<string>();
  const colorFormatList: IColorFormatListItem[] = [
    {
      id: uuid(),
      label: "red",
      icon: <BoxColor colorCode="#FF0000" />,
      style: "color-red",
      method: "block",
      codeColor: "#FF0000",
    },
    {
      id: uuid(),
      label: "cyan",
      style: "color-cyan",
      icon: <BoxColor colorCode="#00FFFF" />,
      method: "block",
      codeColor: "#00FFFF",
    },
    {
      id: uuid(),
      label: "blue",
      style: "color-blue",
      icon: <BoxColor colorCode="#0000FF" />,
      method: "block",
      codeColor: "#0000FF",
    },
    {
      id: uuid(),
      label: "darkBlue",
      style: "color-darkBlue",
      icon: <BoxColor colorCode="#00008B" />,
      method: "block",
      codeColor: "#00008B",
    },
    {
      id: uuid(),
      label: "yellow",
      style: "color-yellow",
      icon: <BoxColor colorCode="#FFFF00" />,
      method: "block",
      codeColor: "#FFFF00",
    },
  ];

  const handleChange = (event: SelectChangeEvent) => {
    setColorFormat(event.target.value as string);
  };

  return (
    <Box
      sx={{
        ...borderRightStyle,
        display: "flex",
        justifyContent: "center"
      }}
    >
      <FormControl sx={{ height: "100%" }} fullWidth>
        <Select
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          labelId="dropdown-select-textFormat"
          id="dropdown-select-textFormat"
          defaultValue={colorFormatList[0].label}
          onChange={handleChange}
        >
          {colorFormatList.map((item) => (
            <MenuItem key={item.id} value={item.label}>
              {item.icon}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
