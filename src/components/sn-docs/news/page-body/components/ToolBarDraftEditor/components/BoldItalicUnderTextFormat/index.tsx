import { IHandleClickFormat, IToolBarDraftActionItem } from "../..";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
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

export default function BoldItalicUnderlineTextFormat({
  handleClickFormatBIU,
}: {
  handleClickFormatBIU: (
    e: React.MouseEvent<HTMLButtonElement>,
    typeClick: IHandleClickFormat,
  ) => void;
}) {
  const formatListText: IToolBarDraftActionItem[] = [
    {
      label: "bold",
      style: "BOLD",
      icon: <FormatBoldIcon />,
      method: "inline",
    },
    {
      label: "italic",
      style: "ITALIC",
      icon: <FormatItalicIcon />,
      method: "inline",
    },
    {
      label: "underline",
      style: "UNDERLINE",
      icon: <FormatUnderlinedIcon />,
      method: "inline",
    },
    {
      label: "strike-through",
      style: "STRIKETHROUGH",
      icon: <StrikethroughSIcon />,
      method: "inline",
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
          onClick={(e) => {
            handleClickFormatBIU(e, { style: item.style, method: item.method });
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon || item.label}
        </button>
      ))}
    </Box>
  );
}
