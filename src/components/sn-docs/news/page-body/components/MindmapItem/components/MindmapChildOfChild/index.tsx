import { Box, Button, Input, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";
import useMindmap from "../../hooks/useMindmap";
import { IMindmapItem } from "../..";
import HoverIconAdd from "../HoverIconAdd";
import HoverIconDelete from "../HoverIconDelete";

export default function MindMapChildOfChild({
  childrenMindMap,
}: {
  childrenMindMap?: IMindmapItem[];
}) {
  const { handleAddChildren } = useMindmap();
  const handleAddChildOfChildren = () => {
    console.log("add");
  };

  const handleDeleteChildOfChildren = () => {
    console.log("delete");
  };

  const [hoveredItems, setHoveredItems] = useState<{ [key: string]: boolean }>(
    {},
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        paddingLeft: "20px",
        top: 0
      }}
      gap="10px"
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
            disableUnderline
            onChange={() => {
              console.log("onchange");
            }}
          />
          {/* Đường nối */}
          <Box
            sx={{
              position: "absolute",
              left: "-10px",
              top: "50%", // Bắt đầu từ dưới Box đầu tiên
              width: "2px",
              backgroundColor: "#14B9E5",
              "&::before": {
                content: '""',
                position: "absolute",
                left: "-10px",
                top: "-2px",
                width: "20px", // Chiều dài của đường ngang trên cùng
                height: "2px",
                backgroundColor: "#14B9E5",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
