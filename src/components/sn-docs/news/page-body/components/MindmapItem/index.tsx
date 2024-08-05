import { Box } from "@mui/material";
import { useState } from "react";
import MindmapParent from "./components/MindmapParent";
import { uuid } from "utils/index";
import useMindmap from "./hooks/useMindmap";
import { debounce } from "lodash";

export interface IMindmapItem {
  title: string;
  id: string;
  children?: IMindmapItem[];
}

export default function MindmapItem() {
  const { mindMapItem, setMindmapItem } = useMindmap();

  const onChangeTitleParent = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounce((event) => {
      setMindmapItem({ ...mindMapItem, title: event.target.value });
    }, 300);
  };

  const handleAddChidrenNodeOne = (newChild: IMindmapItem) => {
    setMindmapItem((prevItem) => {
      if (prevItem.children) {
        return {
          ...prevItem,
          children: [...prevItem.children, newChild],
        };
      }
      // Nếu children chưa tồn tại, tạo mới mảng children
      return {
        ...prevItem,
        children: [newChild],
      };
    });
  };

  const handleDeleteRootChildren = () => {
    setMindmapItem({ ...mindMapItem, children: [] });
  };

  const handleAddNodeChildren = (newChild: IMindmapItem, targetId: string) => {
    const addNodeRecursively = (node: IMindmapItem): IMindmapItem => {
      if (node.id === targetId) {
        return {
          ...node,
          children: [...(node.children || []), newChild],
        };
      }

      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map((child) => addNodeRecursively(child)),
        };
      }

      return node;
    };

    setMindmapItem((prevMindmap) => addNodeRecursively(prevMindmap));
  };

  console.log("mindMapItem", mindMapItem);

  return (
    <Box sx={{ width: "100%", paddingY: 2 }}>
      <MindmapParent
        handleAddChildOfChild={handleAddNodeChildren}
        onChangeTitleParent={onChangeTitleParent}
        mindmapParent={mindMapItem}
        addChildNodeOne={handleAddChidrenNodeOne}
        deleteRootChildren={handleDeleteRootChildren}
      />
    </Box>
  );
}
