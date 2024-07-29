import { Box, Button, Input, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useMindmap from "../../../hooks/useMindmap";
import { useState } from "react";
import { IMindmapItem } from "../../..";
import HoverIconAdd from "../../HoverIconAdd";
import HoverIconDelete from "../../HoverIconDelete";
import { uuid } from "utils/index";
import MindmapChildOfChild from "./MindmapChildOfChild";

export default function MindmapChildrenOne({
  mindMapOne,
  handleAddSesion,
  handleAddChildOfChild,
}: {
  mindMapOne: IMindmapItem;
  handleAddSesion?: (newChild: IMindmapItem) => void;
  handleAddChildOfChild: (newChild: IMindmapItem, id: string) => void;
}) {
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const { getNewChild } = useMindmap();
  const handleAddSesionChildOne = () => {
    const newChild = getNewChild();
    if (handleAddSesion) handleAddSesion(newChild);
  };

  const handleDeleteChild = () => {
    console.log("abc");
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
              value={mindMapOne.title}
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
          {isShowAdd && mindMapOne.children?.length === 0 ? (
            <HoverIconAdd
              onClickIcon={() => {
                handleAddChildOfChild(getNewChild(), mindMapOne.id);
              }}
            />
          ) : null}
          {isShowAdd &&
          mindMapOne?.children &&
          mindMapOne?.children.length > 0 ? (
            <HoverIconDelete
              onClickIcon={() => {
                console.log("delete");
              }}
            />
          ) : null}

          {mindMapOne?.children && mindMapOne?.children.length > 0 && (
            <Box paddingLeft="20px">
              {mindMapOne.children.map((child) => (
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
            onClick={() => {
              handleAddSesionChildOne();
            }}
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
