import { Box, Button, Input, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useMindmap from "../../../hooks/useMindmap";
import { useState } from "react";
import { IMindmapItem } from "../../..";
import HoverIconAdd from "../../HoverIconAdd";
import HoverIconDelete from "../../HoverIconDelete";
import MindMapChildOfChild from "../../MindmapChildOfChild";
import { uuid } from "utils/index";

export default function MindmapChildrenOne() {
 ;
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const { handleAddChildren, deleteChildToChild, setMindmapItem, mindMapItem } =
    useMindmap();

  const handleAddChildToChild = () => {
    const updatedChildren = mindMapItem.children?.map((child) => {
      if (child.id === mindMapItem[0]?.id) {
        const newChildren = Array(3)
          .fill(null)
          .map(() => ({
            id: uuid(),
            title: "",
            children: [],
          }));
        return {
          ...child,
          children: [...(child.children || []), ...newChildren],
        };
      }
      return child;
    });
    setMindmapItem({
      ...mindMapItem,
      children: updatedChildren,
    });
  };

  const handleDeleteChildOfChildren = (idChildren: string) => {
    deleteChildToChild(idChildren);
  };

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
                height: "calc(50% + 5px)", // Kéo dài xuống giữa Button
                width: "2px",
                backgroundColor: "#14B9E5",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: "0",
                  top: "-2px",
                  width: "10px", // Chiều dài của đường ngang trên cùng
                  height: "2px",
                  backgroundColor: "#14B9E5",
                },
              }}
            />
          </Box>
          {isShowAdd && !mindMapItem?.children?.length && (
            <HoverIconAdd onClickIcon={() => handleAddChildToChild()} />
          )}
          {/* {isShowAdd && mindMapItem?.children?.length && (
            <HoverIconDelete
              onClickIcon={() => deleteChildToChild(mindMapItem.id)}
            />
          )} */}
          {mindMapItem?.children &&
            mindMapItem?.children?.length > 1 && (
              <MindMapChildOfChild childrenMindMap={mindMapItem.children} />
            )}
        </Box>

        <Box
          minHeight="48px"
          display="flex"
          alignItems="center"
          position="relative"
        >
          <Button
            sx={{
              display: "flex",
              width: "124px",
              backgroundColor: "#14B9E5",
              color: "white",
              borderRadius: "100px",
              textTransform: "none",
              paddingY: 1,
              paddingX: 1,
              "&:hover": {
                backgroundColor: "#008ba3",
              },
              gap: 0.5,
            }}
            onClick={() => handleAddChildren()}
          >
            <AddIcon width="10px" height="10px" />
            <Typography fontSize="13px">Add version</Typography>
          </Button>
          {/* Đường nối */}

          <Box
            sx={{
              position: "absolute",
              left: "-10px",
              top: "50%",
              height: "100%",
              "&::before": {
                content: '""',
                position: "absolute",
                left: "0",
                top: "0",
                transform: "translateY(-50%)",
                width: "10px", // Chiều dài của đường ngang
                height: "2px",
                backgroundColor: "#14B9E5",
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "-10px",
              top: "-5px",
              height: "calc(50% + 5px)",
              width: "2px",
              backgroundColor: "#14B9E5",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
