import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { memo, useEffect, useMemo, useState } from "react";
import { STEP_INFO } from "store/chat/type";
import ProfileHeader from "../common/ProfileHeader";
import { useChat } from "store/chat/selectors";
import { SxProps } from "@mui/material";
import LinkContent from "../common/LinkContent";
import MediaContent from "../common/MediaContent";
import FileContent from "../common/FileContent";
import { useTranslations } from "next-intl";
import { NS_CHAT_BOX } from "constant/index";

interface GroupMediaProfileProps {
  type?: STEP_INFO;
  onPrevious: (step) => void;
}
const GroupMediaProfile = ({
  type = STEP_INFO.MEDIA,
  onPrevious,
}: GroupMediaProfileProps) => {
  const [tab, setTab] = useState<STEP_INFO>(type);
  const { conversationInfo } = useChat();
  const { name } = conversationInfo || {};
  const commonChatBox = useTranslations(NS_CHAT_BOX);

  const renderContent = useMemo(() => {
    switch (tab) {
      case STEP_INFO.MEDIA:
        return <MediaContent />;
      case STEP_INFO.LINK:
        return <LinkContent />;
      case STEP_INFO.FILE:
        return <FileContent />;
    }
  }, [tab]);

  useEffect(() => {
    setTab(type);
  }, [type]);

  const styleButtonTab: SxProps = {
    width: "121px",
    border: "1px solid #999999",
    borderRadius: "20px",
    color: "#999999",
    textTransform: "inherit",
    "&:hover": {
      border: "1px solid #999999",
    },
  };
  return (
    <>
      <ProfileHeader
        name={name || ""}
        onPrevious={() => {
          onPrevious(STEP_INFO.IDLE);
        }}
        containerProps={{
          sx: {
            position: "relative",
          },
        }}
        nameProps={{
          sx: {
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "100%",
            width: "200px",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textAlign: "center",
          },
        }}
      />
      <Box height="calc(100% - 72px)" display="flex" flexDirection="column">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          mt={2}
          mb={2}
          sx={{
            "& .active": {
              color: "#3699FF",
              border: "1px solid #3699FF !important",
            },
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setTab(STEP_INFO.MEDIA)}
            sx={styleButtonTab}
            className={tab === STEP_INFO.MEDIA ? "active" : ""}
          >
            {commonChatBox("chatBox.media")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setTab(STEP_INFO.LINK)}
            sx={styleButtonTab}
            className={tab === STEP_INFO.LINK ? "active" : ""}
          >
            {commonChatBox("chatBox.link")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setTab(STEP_INFO.FILE)}
            sx={styleButtonTab}
            className={tab === STEP_INFO.FILE ? "active" : ""}
          >
            {commonChatBox("chatBox.file")}
          </Button>
        </Box>
        {renderContent}
      </Box>
    </>
  );
};

export default memo(GroupMediaProfile);
