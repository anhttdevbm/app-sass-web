import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import { Box } from "@mui/material";
import { IToolBarDraftActionItem } from "../..";

const TagNameIcon = () => {
  return <Box>@</Box>;
};

export default function UndoRedoText() {
  const formatListText: IToolBarDraftActionItem[] = [
    {
      label: "undo-text",
      method: "block",
      icon: <UndoIcon />,
      style: "",
    },
    {
      label: "redo-text",
      method: "block",
      icon: <RedoIcon />,
      style: "",
    },
  ];

  return (
    <Box display="flex" gap={0.5}>
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
          {item.icon ?? item.label}
        </button>
      ))}
    </Box>
  );
}
