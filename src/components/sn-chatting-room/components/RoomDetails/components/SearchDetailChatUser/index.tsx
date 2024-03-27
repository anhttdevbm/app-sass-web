import React, { useEffect, useState } from "react";
import { Drawer, Box } from "@mui/material";
import SearchDetailChatUserHead from "./SearchDetailUserChatHead";
import { createPortal } from "react-dom";
import SearchDetailUserChatItem from "./SearchDetailUserChatItem";
import { IChatItemInfo } from "store/chat/type";

interface SearchDetailChatUserProps {
  isOpen: boolean;
  onClose?: () => void;
  currentConversation: IChatItemInfo;
}

interface chatSearch {
  avatar: string;
  name: string;
  message: string;
}

const SearchDetailChatUser: React.FC<SearchDetailChatUserProps> = ({
  isOpen,
  onClose,
  currentConversation,
}) => {
  const chatSearch: chatSearch[] = [
    {
      avatar: currentConversation?.avatar,
      name: currentConversation?.name,
      message: "Have a good day!",
    },
    {
      avatar: currentConversation?.avatar,
      name: currentConversation?.name,
      message: "Have a good day!",
    },
    {
      avatar: currentConversation?.avatar,
      name: currentConversation?.name,
      message: "Have a good day!",
    },
  ];

  const [isSearching, setIsSearching] = useState(false);

  const handleSearchConversation = () => {
    setIsSearching(true);
  };

  useEffect(() => {
    setIsSearching(!isOpen);
  }, [isOpen]);

  const styleBackgroud = isSearching
    ? { background: "#FFF" }
    : {
        background: "rgba(0, 0, 0, 0.25)",
      };

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          position: "absolute",
          top: "0px",
          height: "100%",
          boxSizing: "border-box",
          border: "none",
          display: "flex",
          gap: "16px",
          ...styleBackgroud,
        },
      }}
      variant="persistent"
      anchor="top"
      open={isOpen}
    >
      <SearchDetailChatUserHead
        onClose={onClose}
        onSearch={handleSearchConversation}
      />
      <Box id="search-item" sx={{ padding: "0 16px" }}>
        {isSearching &&
          chatSearch.map((item, index) =>
            createPortal(
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {index !== 0 && (
                  <Box
                    sx={{
                      borderTop: "1px solid #E1F0FF",
                    }}
                  ></Box>
                )}
                <SearchDetailUserChatItem
                  key={index}
                  avatar={item.avatar}
                  name={item.name}
                  message={item.message}
                />
                {index !== chatSearch.length - 1 && (
                  <Box
                    sx={{
                      borderBottom: "1px solid #E1F0FF",
                    }}
                  ></Box>
                )}
              </Box>,
              document.getElementById("search-item") as HTMLElement,
            ),
          )}
      </Box>
    </Drawer>
  );
};

export default SearchDetailChatUser;
