import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { IHandleClickFormat, IToolBarDraftActionItem } from "../..";
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

export default function ColorFormatText({
  handleChangeColor,
}: {
  handleChangeColor: (
    e: React.MouseEvent<HTMLButtonElement> | SelectChangeEvent,
    typeClick: IHandleClickFormat,
  ) => void;
}) {
  const [colorFormat, setColorFormat] = useState<string>();
  const colorFormatList: IColorFormatListItem[] = [
    {
      id: uuid(),
      label: "black",
      icon: <BoxColor colorCode="#000000" />,
      style: "color",
      method: "inline",
      codeColor: "#000000",
    },
    {
      id: uuid(),
      label: "white",
      icon: <BoxColor colorCode="#FFFFFF" />,
      style: "color",
      method: "inline",
      codeColor: "#FFFFFF",
    },
    {
      id: uuid(),
      label: "red",
      icon: <BoxColor colorCode="#FF0000" />,
      style: "color",
      method: "inline",
      codeColor: "#FF0000",
    },
    {
      id: uuid(),
      label: "cyan",
      style: "color",
      icon: <BoxColor colorCode="#00FFFF" />,
      method: "inline",
      codeColor: "#00FFFF",
    },
    {
      id: uuid(),
      label: "blue",
      style: "color",
      icon: <BoxColor colorCode="#0000FF" />,
      method: "inline",
      codeColor: "#0000FF",
    },
    {
      id: uuid(),
      label: "darkBlue",
      style: "color",
      icon: <BoxColor colorCode="#00008B" />,
      method: "inline",
      codeColor: "#00008B",
    },
    {
      id: uuid(),
      label: "yellow",
      style: "color",
      icon: <BoxColor colorCode="#FFFF00" />,
      method: "inline",
      codeColor: "#FFFF00",
    },
    {
      id: uuid(),
      label: "green",
      style: "color",
      icon: <BoxColor colorCode="#14fa02" />,
      method: "inline",
      codeColor: "#14fa02",
    },
  ];

  const handleChange = (event: SelectChangeEvent) => {
    handleChangeColor(event, { style: "color", method: "inline" });
  };

  return (
    <Box
      sx={{
        ...borderRightStyle,
        display: "flex",
        justifyContent: "center",
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
          defaultValue={colorFormatList[0].codeColor}
          onChange={handleChange}
        >
          {colorFormatList.map((item) => (
            <MenuItem
              sx={{
                backgroundColor: "background.default",
              }}
              key={item.id}
              value={item.codeColor}
            >
              {item.icon}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
