import { Box, Button, Input, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IMindmapItem } from "../../..";
import useMindmap from "../../../hooks/useMindmap";
import HoverIconAdd from "../../HoverIconAdd";
import HoverIconDelete from "../../HoverIconDelete";
import { useState } from "react";
import MindmapChildOfChild from "./MindmapChildOfChild";

export default function MindmapChildrenMore({
  mindMapParent,
  handleAddSession,
}: {
  mindMapParent: IMindmapItem;
  handleAddSession?: (newChild: IMindmapItem) => void;
}) {
  const { getNewChild } = useMindmap();
  const handleAddChildOfChildren = () => {
    console.log("add");
  };

  const handleDeleteChildOfChildren = () => {
    console.log("delete");
  };

  const handleAddSessionChild = () => {
    const newChild = getNewChild();
    if (handleAddSession) handleAddSession(newChild);
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
      }}
      gap="10px"
    >
      {mindMapParent.children?.map((item, index) => (
        <Box
          key={item.id}
          display="flex"
          alignItems="center"
          onMouseEnter={() =>
            setHoveredItems((prev) => ({ ...prev, [item.id]: true }))
          }
          onMouseLeave={() =>
            setHoveredItems((prev) => ({ ...prev, [item.id]: false }))
          }
        >
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
            {index >= 1 ? (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    left: "-10px",
                    top: "0",
                    height: "100%",
                    width: "2px",
                    backgroundColor: "#14B9E5",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: "0",
                      top: "50%",
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
                    top: "0",
                    height: "125%",
                    width: "2px",
                    backgroundColor: "#14B9E5",
                  }}
                />
              </>
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  left: "-10px",
                  top: "50%", // Bắt đầu từ dưới Box đầu tiên
                  height: "calc(60% + 5px)", // Kéo dài xuống giữa Button
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
            )}
          </Box>
          {hoveredItems[item.id] && !item.children?.length && (
            <HoverIconAdd onClickIcon={() => handleAddChildOfChildren()} />
          )}
        </Box>
      ))}

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
          onClick={handleAddSessionChild}
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
  );
}
