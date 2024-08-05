import { Box, Button, Input, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IMindmapItem } from "../..";
import MindmapChildrenOne from "./components/MindmapChildrenOne";
import MindmapChildrenMore from "./components/MindmapChildrenMore";
import { mimiMap } from "../../../../../../../../store/chat/type";
import useMindmap from "../../hooks/useMindmap";

export default function MindmapChildren({
  mindMapParent,
  handleAddSession,
  handleAddChildOfChild
}: {
  mindMapParent: IMindmapItem;
  handleAddSession?: (newChild: IMindmapItem) => void;
  handleAddChildOfChild: (newChild: IMindmapItem, id: string) => void;
}) {
  if (mindMapParent.children?.length === 1) {
    return (
      <MindmapChildrenOne
        handleAddChildOfChild={handleAddChildOfChild}
        handleAddSesion={handleAddSession}
        mindMapOne={mindMapParent.children[0]}
      />
    );
  } else if (mindMapParent.children && mindMapParent.children?.length > 1) {
    return (
      <MindmapChildrenMore
        handleAddSession={handleAddSession}
        mindMapParent={mindMapParent}
      />
    );
  } else {
    return null;
  }
}
