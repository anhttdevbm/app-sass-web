import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, IconButton, MenuItem } from "@mui/material";
import { Text } from "components/shared";
import { PopperMenu } from "components/shared/PopperMenu";
import { NS_AI_CHAT } from "constant/index";
import useTheme from "hooks/useTheme";
import EditUnderlineIconWithGradientIcon from "icons/EditUnderlineWithGradientIcon";
import TrashFillIcon from "icons/TrashFillIcon";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

// Define constants for colors
const PRIMARY_MAIN = "primary.main";
const PRIMARY_LIGHT = "primary.light";
const GREY_900 = "grey.900";
const INFOR_DARK = "info.dark";

interface ItemChatProps {
  title: string;
  id: string;
  selectedChat: string | null;
  setSelectedChat: () => void;
}

const ItemChat = ({
  title,
  id,
  selectedChat,
  setSelectedChat,
}: ItemChatProps) => {
  const [menuAnchorElement, setMenuAnchorElement] =
    useState<null | HTMLElement>(null);

  const t = useTranslations(NS_AI_CHAT);

  const { isDarkMode } = useTheme();

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setMenuAnchorElement(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorElement(null);
  };

  const handleMenuOptionClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    closeMenu();
  };

  return (
    <Box
      sx={{
        ...itemSx,
        backgroundColor:
          selectedChat === id
            ? PRIMARY_MAIN
            : isDarkMode
            ? INFOR_DARK
            : PRIMARY_LIGHT,
      }}
      onClick={setSelectedChat}
    >
      <Text sx={titleSx}>{title}</Text>
      <IconButton onClick={handleMenuButtonClick}>
        <MoreHorizIcon />
      </IconButton>
      <PopperMenu
        anchorEl={menuAnchorElement}
        setAnchorEl={setMenuAnchorElement}
      >
        <MenuItem sx={menuItemSx} onClick={handleMenuOptionClick}>
          <EditUnderlineIconWithGradientIcon sx={iconSx} />
          <Text
            sx={{
              ...textSx,
              background:
                "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("sideBar.editChat")}
          </Text>
        </MenuItem>
        <MenuItem sx={menuItemSx} onClick={handleMenuOptionClick}>
          <TrashFillIcon fill="#666666" sx={iconSx} />
          <Text sx={textSx} color={"grey.400"}>
            {t("sideBar.deleteChat")}
          </Text>
        </MenuItem>
      </PopperMenu>
    </Box>
  );
};

export default ItemChat;

const itemSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "4px",
  width: "100%",
  padding: "12px",
  "&:hover": {
    backgroundColor: PRIMARY_MAIN,
    color: "white",
  },
  marginBottom: "8px",
  cursor: "pointer",
};

const menuItemSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "160px",
};

const textSx = {
  marginLeft: "12px",
  fontSize: 14,
  fontWeight: 400,
};

const iconSx = {
  fontSize: 20,
};

const titleSx = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: "14px",
  fontWeight: "400",
  color: GREY_900,
};
