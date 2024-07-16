import { IToolBarDraftActionItem } from "../..";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";

import { Box } from "@mui/material";

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

export default function ListFormatText() {
  const formatListText: IToolBarDraftActionItem[] = [
    {
      label: "Unordered-List",
      style: "unordered-list-item",
      method: "block",
      icon: <FormatListBulletedIcon />,
    },
    {
      label: "Ordered-List",
      style: "ordered-list-item",
      method: "block",
      icon: <FormatListNumberedIcon />,
    },
    {
      label: "Indent-Decrease",
      method: "block",
      style: "indent-decrease",
      icon: <FormatIndentDecreaseIcon />,
    },
    {
      label: "Indent-Increase",
      method: "block",
      style: "indent-increase",
      icon: <FormatIndentIncreaseIcon />,
    },
  ];

  return (
    <Box display="flex" gap={0.5} sx={borderRightStyle}>
      {formatListText.map((item, idx) => (
        <button
          style={{
            color: "#222222",
          }}
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={() => console.log("click")}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon || item.label}
        </button>
      ))}
    </Box>
  );
}
