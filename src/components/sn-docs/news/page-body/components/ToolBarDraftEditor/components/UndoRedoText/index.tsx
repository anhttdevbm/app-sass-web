import { IToolBarDraftActionItem } from "../..";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { Box } from "@mui/material";

const TagNameIcon = () => {
  return <Box>@</Box>;
};

export default function UndoRedoText() {
  const formatListText: IToolBarDraftActionItem[] = [
    {
      label: "undo-text",
      method: "block",
      icon: <UndoIcon />,
    },
    {
      label: "redo-text",
      method: "block",
      icon: <RedoIcon />,
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
