import { Box } from "@mui/material";
import { useState } from "react";
import MindmapParent from "./components/MindmapParent";
import { uuid } from "utils/index";
import useMindmap from "./hooks/useMindmap";

export interface IMindmapItem {
  title: string;
  id: string;
  children?: IMindmapItem[];
}

export default function MindmapItem() {
  const { mindMapItem } = useMindmap();

  const onChangeTitleParent = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e", event.target.value);
  };

  return (
    <Box sx={{ width: "100%", paddingY: 2 }}>
      <MindmapParent
        onChangeTitleParent={onChangeTitleParent}
        mindmapParent={mindMapItem}
      />
    </Box>
  );
}
