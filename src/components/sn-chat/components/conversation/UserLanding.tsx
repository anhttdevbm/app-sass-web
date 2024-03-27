import { useChat } from "store/chat/selectors";
import ProfileHeader from "../common/ProfileHeader";
import Box from "@mui/material/Box";
import Avatar from "components/Avatar";
import { SxProps } from "@mui/material";
import ProfileCircleIcon from "icons/ProfileCircleIcon";
import MediaFileIcon from "icons/MediaFileIcon";
import LinkIcon from "icons/LinkIcon";
import FileBasicIcon from "icons/FileBasicIcon";
import { MessageSearchInfo, STEP_INFO } from "store/chat/type";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MessageListSearch from "../messages/MessageListSearch";
import { useSnackbar } from "store/app/selectors";
import { AN_ERROR_TRY_AGAIN, NS_CHAT_BOX, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import UserInfo from "./UserInfo";
import GroupMediaProfile from "./GroupMediaProfile";
import ItemProfile from "../common/ItemProfile";
import useTheme from "hooks/useTheme";

interface UserLandingProps {
  displayUserInfo: boolean;
  onPrevious: () => void;
}
const UserLanding = ({ displayUserInfo, onPrevious }: UserLandingProps) => {
  const { conversationInfo, onSetStateSearchMessage, onSearchChatText } =
    useChat();
  const { isDarkMode } = useTheme();

  const { onAddSnackbar } = useSnackbar();
  const t = useTranslations(NS_COMMON);
  const { avatar, name } = conversationInfo || {};
  const [stateSearch, setStateSearch] = useState<{
    isSearch: boolean;
    isToggle?: boolean;
    text: string;
  }>({ isSearch: false, isToggle: false, text: "" });
  const [stepMedia, setStepMedia] = useState<STEP_INFO>(STEP_INFO.IDLE);
  const [isShowMedia, setShowMedia] = useState(false);

  const text = stateSearch.text;
  const isToggle = stateSearch.isToggle;
  const isSearch = stateSearch.isSearch;
  const commonChatBox = useTranslations(NS_CHAT_BOX);

  const handleSearchChatText = useCallback(async () => {
    try {
      if (text && isSearch) {
        await onSearchChatText({ text: stateSearch.text, type: "d" });
      }
    } catch (error) {
      onAddSnackbar(
        typeof error === "string" ? error : t(AN_ERROR_TRY_AGAIN),
        "error",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToggle, onSearchChatText, t]);

  useEffect(() => {
    handleSearchChatText();
  }, [handleSearchChatText]);

  const handleSelectMessage = useCallback(
    (message: MessageSearchInfo) => {
      onSetStateSearchMessage(message);
      setStateSearch({ isSearch: false, text: "" });
      onPrevious();
    },
    [onPrevious, onSetStateSearchMessage],
  );

  const handleSetStep = (step: STEP_INFO) => {
    setStepMedia(step);
    setShowMedia(true);
  };

  const resetForm = (step: STEP_INFO) => {
    setShowMedia(false);
    setTimeout(() => {
      setStepMedia(step);
    }, 200);
  };

  const renderContent = useMemo(() => {
    if (stateSearch.isSearch) {
      return (
        <Box overflow="auto" maxHeight="calc(600px - 65px)">
          <MessageListSearch
            text={stateSearch.text}
            type="d"
            onSelectMessage={handleSelectMessage}
          />
        </Box>
      );
    } else {
      return (
        <Box textAlign="center" pt={2} pb={4} overflow="auto">
          <Avatar
            alt="Avatar"
            src={avatar || undefined}
            size={120}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <Box display="flex" flexDirection="column" gap={2} mt={5}>
            <ItemProfile
              Icon={ProfileCircleIcon}
              title={commonChatBox("chatBox.accountInformation")}
              onClick={() => handleSetStep(STEP_INFO.USER)}
            />
            <ItemProfile
              Icon={MediaFileIcon}
              title={commonChatBox("chatBox.media")}
              onClick={() => handleSetStep(STEP_INFO.MEDIA)}
            />
            <ItemProfile
              Icon={LinkIcon}
              title={commonChatBox("chatBox.link")}
              onClick={() => handleSetStep(STEP_INFO.LINK)}
            />
            <ItemProfile
              Icon={FileBasicIcon}
              title={commonChatBox("chatBox.file")}
              onClick={() => handleSetStep(STEP_INFO.FILE)}
            />
          </Box>
        </Box>
      );
    }
  }, [
    avatar,
    handleSelectMessage,
    stateSearch.isSearch,
    stateSearch.text,
    commonChatBox,
  ]);

  const renderMediaContent = useMemo(() => {
    switch (stepMedia) {
      case STEP_INFO.USER:
        return <UserInfo onPrevious={resetForm} />;
      case STEP_INFO.MEDIA:
      case STEP_INFO.LINK:
      case STEP_INFO.FILE:
        return <GroupMediaProfile type={stepMedia} onPrevious={resetForm} />;
      default:
        return null;
    }
  }, [stepMedia]);

  const defaultSxContent: SxProps = {
    width: "100%",
    height: "inherit",
    overflow: "hidden",
    backgroundColor: isDarkMode ? "#303031" : "white",
    display: "flex",
    flexDirection: "column",
  };
  return (
    <Box
      sx={{
        ...defaultSxContent,
        position: "relative",
        transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        transform: `translate(${displayUserInfo ? "0" : "100%"}, -100%)`,
        zIndex: 1,
      }}
    >
      <>
        <ProfileHeader
          name={name || ""}
          onPrevious={onPrevious}
          textSearch={stateSearch.text}
          isSearch={stateSearch.isSearch}
          onChangeText={(value) =>
            setStateSearch((prev) => ({ ...prev, text: value }))
          }
          onSearch={(text: string, isSearch: boolean) => {
            setStateSearch((prev) => ({
              text,
              isSearch,
              isToggle: !prev.isToggle,
            }));
          }}
          nameProps={{
            sx: {
              maxWidth: "100%",
              width: "200px",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            },
          }}
        />
        {renderContent}
        <Box
          sx={{
            ...defaultSxContent,
            transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            transform: `translate(${isShowMedia ? "0" : "100%"}, -100%)`,
            position: "absolute",
            top: "100%",
          }}
        >
          {renderMediaContent}
        </Box>
      </>
    </Box>
  );
};

export default UserLanding;
