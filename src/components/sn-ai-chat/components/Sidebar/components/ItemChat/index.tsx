import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, IconButton, MenuItem } from "@mui/material";
import { Input, Text } from "components/shared";
import { PopperMenu } from "components/shared/PopperMenu";
import { NS_AI_CHAT } from "constant/index";
import useTheme from "hooks/useTheme";
import EditUnderlineIconWithGradientIcon from "icons/EditUnderlineWithGradientIcon";
import TrashFillIcon from "icons/TrashFillIcon";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useChatSession } from "store/aiChat/selectors";

const PRIMARY_MAIN = "primary.main";
const PRIMARY_LIGHT = "primary.light";
const GREY_900 = "grey.900";
const INFOR_DARK = "info.dark";
const WHITE = "white";
const GREY_400 = "grey.400";
const TRASH_FILL_ICON_COLOR = "#666666";
const TEXT_BACKGROUND =
  "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)";
const BORDER_COLOR = "#ECECF3";

interface ItemChatProps {
  title: string;
  id: string;
  selectedChat?: string;
  setSelectedChat: () => void;
}

const EditChatForm = ({ chatname, handleTitleChange, handleTitleSubmit }) => (
  <form
    onSubmit={(event) => {
      handleTitleSubmit(event);
    }}
  >
    <Input
      value={chatname}
      onChange={handleTitleChange}
      onBlur={handleTitleSubmit}
      autoFocus
    />
  </form>
);

const ChatTitle = ({ title }) => <Text sx={titleSx}>{title}</Text>;

const ItemChat = ({
  title,
  id,
  setSelectedChat,
  selectedChat,
}: ItemChatProps) => {
  const [menuAnchorElement, setMenuAnchorElement] =
    useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [chatname, setChatname] = useState(title);

  const t = useTranslations(NS_AI_CHAT);
  const { isDarkMode } = useTheme();
  const { onEditChatSession, onDeleteChatSession } = useChatSession();

  const handleEditChatSession = () => {
    setIsEditing(true);
    closeMenu();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatname(event.target.value);
  };

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    onEditChatSession({ id, chatname });
    setIsEditing(false);
  };

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setMenuAnchorElement(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorElement(null);
  };

  const handleDeleteChatClick = () => {
    onDeleteChatSession(id);
    closeMenu();
  };

  return (
    <Box
      sx={{
        ...itemSx,
        borderBottom: `1px solid ${isDarkMode ? WHITE : BORDER_COLOR}`,
        "&:hover": {
          backgroundColor: isDarkMode ? INFOR_DARK : PRIMARY_LIGHT,
          borderRadius: "4px",
        },
        ...(selectedChat === id && {
          backgroundColor: isDarkMode ? INFOR_DARK : PRIMARY_LIGHT,
          borderRadius: "4px",
          borderBottom: 0,
        }),
      }}
      onClick={() => {
        if (!isEditing && !menuAnchorElement) {
          setSelectedChat();
        }
      }}
    >
      {isEditing ? (
        <EditChatForm
          chatname={chatname}
          handleTitleChange={handleTitleChange}
          handleTitleSubmit={handleTitleSubmit}
        />
      ) : (
        <ChatTitle title={title} />
      )}
      <IconButton onClick={handleMenuButtonClick}>
        <MoreHorizIcon />
      </IconButton>
      <PopperMenu
        anchorEl={menuAnchorElement}
        setAnchorEl={setMenuAnchorElement}
      >
        <MenuItem sx={menuItemSx} onClick={handleEditChatSession}>
          <EditUnderlineIconWithGradientIcon sx={iconSx} />
          <Text
            sx={{
              ...textSx,
              background: TEXT_BACKGROUND,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("sideBar.editChat")}
          </Text>
        </MenuItem>
        <MenuItem sx={menuItemSx} onClick={handleDeleteChatClick}>
          <TrashFillIcon fill={TRASH_FILL_ICON_COLOR} sx={iconSx} />
          <Text sx={textSx} color={GREY_400}>
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
  width: "100%",
  padding: "12px",
  cursor: "pointer",
  marginBottom: "8px",
  backgroundColor: "transparent",
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
