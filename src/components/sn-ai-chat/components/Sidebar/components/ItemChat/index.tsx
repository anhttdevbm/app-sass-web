import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, IconButton, MenuItem } from "@mui/material";
import { Text } from "components/shared";
import { PopperMenu } from "components/shared/PopperMenu";
import { NS_AI_CHAT } from "constant/index";
import EditUnderlineIconWithGradientIcon from "icons/EditUnderlineWithGradientIcon";
import TrashFillIcon from "icons/TrashFillIcon";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface ItemChatProps {
  title: string;
  id: string;
  selectedChat: string | null;
  setSelectedChat: () => void;
}

const ItemChat = ({ title, id, selectedChat, setSelectedChat }: ItemChatProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const t = useTranslations(NS_AI_CHAT);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onOptionClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    handleClose();
  };

  return (
    <Box
      sx={{
        ...itemSx,
        backgroundColor: selectedChat === id ? "primary.main" : "primary.light",
      }}
      onClick={setSelectedChat}
    >
      <Text fontSize={14} fontWeight={400} color={"grey.900"}>
        {title}
      </Text>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>
      <PopperMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
        <MenuItem sx={menuItemSx} onClick={onOptionClick}>
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
            {t('sideBar.edit')}
          </Text>
        </MenuItem>
        <MenuItem sx={menuItemSx} onClick={onOptionClick}>
          <TrashFillIcon fill="#666666" sx={iconSx} />
          <Text sx={textSx} color={"grey.400"}>
          {t('sideBar.delete')}
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
    backgroundColor: "primary.main",
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
