import { Box } from "@mui/material";
import useGetScreenMode from "hooks/useGetScreenMode";
import { FC } from "react";
import InfoHeader from "../AccountInfo/InfoHeader";
import MediaContent from "components/sn-chat/components/common/MediaContent";
import FileContent from "components/sn-chat/components/common/FileContent";
import LinkContent from "components/sn-chat/components/common/LinkContent";
import useTheme from "hooks/useTheme";
import { useChat } from "store/chat/selectors";
import { TypeDrawerChat } from "store/chat/type";

const TYPES = [
  {
    text: "Media file",
    type: "media",
  },
  {
    text: "Link",
    type: "link",
  },
  {
    text: "File",
    type: "file",
  },
];

const StorageInfo = () => {
  const { extraDesktopMode } = useGetScreenMode();
  const { isDarkMode } = useTheme();
  const { typeDrawerChat, onSetDrawerType } = useChat();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: extraDesktopMode ? "424px" : "272px",
        // height: extraDesktopMode ? "948px" : "730px",
        gap: "12px",
        backgroundColor: isDarkMode ? "#313130" : "var(--Gray0, #F7F7FD)",
        overflow: "auto",
        height: "100%",
      }}
    >
      <InfoHeader
        onClose={() => onSetDrawerType("info")}
        title="Chat detail info"
      />
      <Box
        sx={{
          display: "flex",
          gap: "12px",
        }}
      >
        {TYPES.map((type) => (
          <Box
            gap="10px"
            key={type.type}
            sx={{
              padding: "5px 10px",
              borderRadius: "30px",
              border: `1px solid ${
                type?.type === typeDrawerChat ? "#3699FF" : "#999999"
              }`,
              color: type?.type === typeDrawerChat ? "#3699FF" : "#999999",
              minWidth: "78px",
              textAlign: "center",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() =>
              onSetDrawerType && onSetDrawerType(type?.type as TypeDrawerChat)
            }
          >
            {type.text}
          </Box>
        ))}
      </Box>
      <Box>
        {typeDrawerChat === "media" && <MediaContent />}
        {typeDrawerChat === "link" && <LinkContent />}
        {typeDrawerChat === "file" && <FileContent />}
      </Box>
    </Box>
  );
};

export default StorageInfo;
