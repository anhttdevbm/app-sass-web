import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Box, IconButton, Tab, Tabs } from "@mui/material";
import AITabIcon from "icons/AITabIcon";
import BackTabIcon from "icons/BackTabIcon";
import ChatTabIcon from "icons/ChatTabIcon";
import React, { useState } from "react";

interface HeaderProps {
  onBack: () => void;
  onClose: () => void;
  value: number;
  handleChange: (event, newValue) => void;
}

const HeaderChatListTemp: React.FC<HeaderProps> = ({
  onBack,
  onClose,
  value,
  handleChange,
}) => {
  const selectedTabStyle = {
    background: "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)",
    border: "none",
    borderRadius: "4px",
    padding: "4px 12px 4px 12px",
  };
  const unselectedTabStyle = {
    background: "#EEF8FF",
    border: "none",
    borderRadius: "4px",
    padding: "4px 12px 4px 12px",
  };

  return (
    <AppBar
      position="static"
      sx={{ boxShadow: "none", backgroundColor: "transparent" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          onClick={onBack}
        >
          <BackTabIcon />
        </IconButton>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs"
          TabIndicatorProps={{
            style: { display: "none" },
          }}
        >
          <Tab
            icon={
              <ChatTabIcon
                {...(value === 1 ? { fill: "#BABCC6" } : { fill: "white" })}
              />
            }
            aria-label="Chat"
            sx={value === 0 ? selectedTabStyle : unselectedTabStyle}
          />
          <Tab
            icon={
              <AITabIcon
                {...(value === 0 ? { fill: "#BABCC6" } : { fill: "white" })}
              />
            }
            aria-label="AI Chat"
            sx={value === 1 ? selectedTabStyle : unselectedTabStyle}
          />
        </Tabs>
        <IconButton
          edge="end"
          aria-label="close"
          onClick={onClose}
          sx={{ color: "#BABCC6" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </AppBar>
  );
};

export default HeaderChatListTemp;
