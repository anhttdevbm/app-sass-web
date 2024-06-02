import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  IconButton,
  Tab,
  TabProps,
  Tabs,
  styled,
} from "@mui/material";
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
      sx={{
        boxShadow: "none",
        backgroundColor: "transparent",
        borderBottom: "1px solid #ECECF3",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 16px",
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
          sx={{ alignItems: "center" }}
        >
          <Tab
            icon={
              <ChatTabIcon
                fontSize="small"
                {...(value === 1 ? { fill: "#BABCC6" } : { fill: "white" })}
              />
            }
            aria-label="Chat"
            sx={{
              ...(value === 0 ? selectedTabStyle : unselectedTabStyle),
              width: "44px",
              height: "28px",
              minWidth: "44px",
              minHeight: "28px",
            }}
          />
          <Tab
            icon={
              <AITabIcon
                sx={value === 0 ? { color: "#BABCC6" } : { color: "white" }}
                fontSize="small"
              />
            }
            aria-label="AI Chat"
            sx={{
              ...(value === 1 ? selectedTabStyle : unselectedTabStyle),
              width: "44px",
              height: "28px",
              minWidth: "44px",
              minHeight: "28px",
            }}
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
