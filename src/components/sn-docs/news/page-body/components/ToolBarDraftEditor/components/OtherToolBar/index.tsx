import { IToolBarDraftActionItem } from "../..";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import PhotoIcon from "@mui/icons-material/Photo";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import GridOnIcon from "@mui/icons-material/GridOn";
import TagIcon from "@mui/icons-material/Tag";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateMindMapOpen } from "store/docs/reducer";
import { useAppSelector } from "store/hooks";
import TableChartIcon from '@mui/icons-material/TableChart';

const TagNameIcon = () => {
  return <Box>@</Box>;
};

export default function OtherToolBar() {
  const dispatch = useDispatch();
  const mindMapOpen = useAppSelector((state) => state.doc.mindMapOpen);

  const formatListText: IToolBarDraftActionItem[] = [
    {
      label: "insert-link",
      method: "block",
      style: "insert-link",
      icon: <InsertLinkIcon />,
    },
    {
      label: "insert-image",
      method: "block",
      style: "insert-image",
      icon: <PhotoIcon />,
    },
    {
      label: "Indent-Decrease",
      method: "block",
      style: "indent-decrease",
      icon: <TagIcon />,
    },
    {
      label: "insert-emotion",
      method: "block",
      style: "insert-emotion",
      icon: <InsertEmoticonIcon />,
    },
    {
      label: "insert-grid",
      method: "block",
      style: "insert-grid",
      icon: <GridOnIcon />,
    },
    {
      label: "mindmap",
      method: "block",
      style: "insert-grid",
      icon: <TableChartIcon />,
    },
  ];

  const handleClickIcon = (typeIcon: string) => {
    switch (typeIcon) {
      case "mindmap":
        dispatch(updateMindMapOpen(!mindMapOpen));
        break;
      default:
        break;
    }
  };

  return (
    <Box display="flex" gap={0.5}>
      {formatListText.map((item, idx) => (
        <button
          style={{
            color: "#222222",
          }}
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={() => handleClickIcon(item.label)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon ?? item.label}
        </button>
      ))}
    </Box>
  );
}
