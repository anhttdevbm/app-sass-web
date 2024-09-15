"use client";
import { AddReaction } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import Picker from "emoji-picker-react";
import useTheme from "hooks/useTheme";
import { useState } from "react";
import { sxBtnCircleActiveDark, sxBtnCircleActiveLight } from "../style";

export default function ReactionButton() {
  const { isDarkMode } = useTheme();
  const [isShow, setIsShow] = useState(false);
  return (
    <Box>
      <IconButton
        sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
        onClick={() => setIsShow(!isShow)}
        style={{ width: "40px", height: "40px" }}
      >
        <AddReaction />
      </IconButton>
      <Picker
        open={isShow}
        reactionsDefaultOpen={true}
        allowExpandReactions={false}
        style={{
          zIndex: 1000,
          bottom: "80px",
          position: "fixed",
        }}
      />
    </Box>
  );
}
