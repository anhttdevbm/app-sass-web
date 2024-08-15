import { IToolBarDraftActionItem } from "../..";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import PhotoIcon from "@mui/icons-material/Photo";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import GridOnIcon from "@mui/icons-material/GridOn";
import TableChartIcon from "@mui/icons-material/TableChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import TagIcon from "@mui/icons-material/Tag";
import { Box } from "@mui/material";
import { useAppSelector } from "store/hooks";
import DashboardIcon from "@mui/icons-material/Dashboard";

import {
  updateStatusOpenMindMap,
  updateVersionMindMap,
  updateStatusOpenBoardEditor
} from "store/docs/reducer";
import { useDispatch } from "react-redux";

const TagNameIcon = () => {
  return <Box>@</Box>;
};

export default function OtherToolBar() {
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
      label: "insert-grid",
      method: "block",
      style: "insert-grid",
      icon: <GridOnIcon />,
    },
    {
      label: "insert-mindmap",
      method: "block",
      style: "insert-mindmap",
      icon: <TableChartIcon />,
    },
    {
      label: "insert-chart",
      method: "block",
      style: "insert-chart",
      icon: <BarChartIcon />,
    },
    {
      label: "insert-board",
      method: "block",
      style: "insert-board",
      icon: <DashboardIcon />,
    },
  ];

  const isOpenMindMap = useAppSelector(
    (state) => state.doc.mindMap.isOpenMindMap,
  );

  const isOpenBoard = useAppSelector((state) => state.doc.board.isOpenBoard);
  
  const dispatch = useDispatch();
  const handleClickOtherTool = (type: string) => {
    switch (type) {
      case "insert-mindmap":
        dispatch(updateStatusOpenMindMap(!isOpenMindMap));
        dispatch(updateVersionMindMap("mindmap"));
        break;
      case "insert-chart":
        dispatch(updateStatusOpenMindMap(!isOpenMindMap));
        dispatch(updateVersionMindMap("chart"));
      case "insert-board":
        dispatch(updateStatusOpenBoardEditor(!isOpenBoard));
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
          onClick={() => console.log("click")}
          onMouseDown={(e) => handleClickOtherTool(item.label)}
        >
          {item.icon ?? item.label}
        </button>
      ))}
    </Box>
  );
}