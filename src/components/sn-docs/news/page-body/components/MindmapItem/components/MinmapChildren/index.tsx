import { Box, Button, Input, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IMindmapItem } from "../..";
import MindmapChildrenOne from "./components/MindmapChildrenOne";
import MindmapChildrenMore from "./components/MindmapChildrenMore";
import { mimiMap } from '../../../../../../../../store/chat/type';
import useMindmap from "../../hooks/useMindmap";

export default function MindmapChildren() {
  const { mindMapItem } = useMindmap();
  if (mindMapItem.children?.length === 1) {
    return <MindmapChildrenOne  />;
  } else if (mindMapItem.children && mindMapItem.children?.length > 1) {
    return <MindmapChildrenMore />;
  } else {
    return null;
  }
}
