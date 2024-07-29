import { Box, Input } from "@mui/material";
import HoverIconAdd from "../../HoverIconAdd";
import HoverIconDelete from "../../HoverIconDelete";
import { useState } from "react";
import { IMindmapItem } from "../../..";
import useMindmap from "../../../hooks/useMindmap";

export default function MindmapChildOfChild({
  item,
  handleAddChildOfChild,
  handleDeleteChild,
}: {
  item: IMindmapItem;
  handleAddChildOfChild: (newChild: IMindmapItem, id: string) => void;
  handleDeleteChild: (id: string) => void;
}) {
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const { getNewChild } = useMindmap();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          paddingLeft: "20px",
        }}
        gap="10px"
        onMouseEnter={() => setIsShowAdd(true)}
        onMouseLeave={() => setIsShowAdd(false)}
      >
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: "240px",
              height: "48px",
              borderRadius: "100px",
              backgroundColor: "grey.50",
              display: "flex",
              alignItems: "center",
              position: "relative",
              paddingX: 2,
              fontSize: "12px",
            }}
          >
            <Input
              value={item.title}
              disableUnderline
              onChange={() => {
                console.log("onchange");
              }}
            />
          </Box>
          {isShowAdd && (
            <HoverIconAdd
              onClickIcon={() => {
                handleAddChildOfChild(getNewChild(), item.id);
              }}
            />
          )}
          {isShowAdd && item.children && item.children.length > 0 && (
            <HoverIconDelete
              onClickIcon={() => {
                handleDeleteChild(item.id);
              }}
            />
          )}
        </Box>

        {item.children && item.children.length > 0 && (
          <Box paddingLeft="20px">
            {item.children.map((child) => (
              <MindmapChildOfChild
                key={child.id}
                item={child}
                handleAddChildOfChild={handleAddChildOfChild}
                handleDeleteChild={handleDeleteChild}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
