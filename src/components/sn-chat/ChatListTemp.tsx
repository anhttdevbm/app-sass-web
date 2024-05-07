"use client";

import { Grow, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Button } from "components/shared";
import SwitchChatAI, {
  CHAT_AI_STEP,
} from "components/sn-ai-chat/components/SwitchChatAI";
import SwitchChat from "components/sn-chat/SwitchChat";
import { Permission } from "constant/enums";
import { NS_COMMON } from "constant/index";
import useTheme from "hooks/useTheme";
import ChatMessageIcon from "icons/ChatMessageIcon";
import CloseIcon from "icons/CloseIcon";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { useChat } from "store/chat/selectors";
import HeaderChatListTemp from "./components/HeaderChatListTemp";

const ChatListTemp = () => {
  const { user } = useAuth();
  const { onClearConversation, onReset, onSetChatDesktop } = useChat();
  const popperRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const commonT = useTranslations(NS_COMMON);
  const { onAddSnackbar } = useSnackbar();
  const { isDarkMode } = useTheme();
  const [selectedTab, setSelectedTab] = useState(1);
  const [currentStepChatAI, setCurrentStepChatAI] = useState(CHAT_AI_STEP.IDLE);

  const init = {
    type: "",
    statusPopup: false,
    title: "",
    content: <></>,
    widthPopup: "500px",
  };

  const [showPopup, setShowPopup] = useState(init);
  const roleChatAccept = useMemo(() => {
    const role =
      user?.roles?.findIndex(
        (i) => i === Permission.AM || i === Permission.ST,
      ) || 0;
    return role > -1;
  }, [user]);
  let browserWidth = window.innerWidth;

  const handleShowPopup = () => {
    setShowPopup((pre) => ({
      ...pre,
      statusPopup: true,
      title: "Message",
      content: (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: 400,
              padding: "15px 0",
            }}
          >
            <Typography>Bạn có muốn chuyển sang message?</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              padding: 2,
            }}
          >
            <Button
              type="button"
              variant="primaryOutlined"
              size="small"
              sx={defaultSx.buttonCancel}
              onClick={() => {
                setShowPopup(init);
                setOpen(false);
              }}
            >
              {commonT("form.cancel")}
            </Button>
            <Button
              variant="primary"
              sx={defaultSx.buttonConfirm}
              type="button"
              size="small"
              onClick={() => {
                setShowPopup(init);
                setOpen(false);
              }}
            >
              {commonT("form.confirm")}
            </Button>
          </Box>
        </>
      ),
    }));
  };

  const handleCloseChatBox = () => {
    setShowPopup(init);
    setOpen(false);
  };

  const handleBackToSidebar = () => {
    if (selectedTab === 1) {
      setCurrentStepChatAI(CHAT_AI_STEP.SIDEBAR);
    }
  };

  window.addEventListener("resize", () => {
    browserWidth = window.innerWidth;
    if (browserWidth < 768) {
      popperRef.current = false;
      setOpen(false);
    } else {
      setShowPopup(init);
    }
  });

  const handleTrigger = (e: React.MouseEvent<HTMLDivElement>) => {
    popperRef.current = !popperRef.current;
    onSetChatDesktop(false);
    if (browserWidth < 768) {
      setOpen(false);
      setShow(true);
      handleShowPopup();
    } else {
      setShow(false);
      setShowPopup(init);
      setOpen((state) => !state);
    }
    if (popperRef.current) {
      // TODO:
    } else {
      onClearConversation();
      onReset();
    }
  };
  if (!roleChatAccept) {
    return null;
  }
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 1300,
      }}
    >
      {show ? (
        <DefaultPopupLayout
          title={showPopup?.title}
          content={showPopup?.content}
          open={showPopup?.statusPopup}
          onClose={() => {
            setShowPopup(init);
            setOpen(false);
          }}
          sx={{ width: showPopup?.widthPopup }}
        />
      ) : (
        <>
          <Grow
            in={open}
            style={{ transformOrigin: "bottom right" }}
            {...(open ? { timeout: 500 } : {})}
          >
            <Box
              sx={{
                position: "absolute",
                width: "348px",
                height: "calc(100% - 4rem)",
                maxHeight: "600px",
                overflow: "hidden",
                bottom: "2rem",
                right: "4rem",
                borderRadius: "16px",
                boxShadow: "2px 2px 24px 0px #0000001A",
                backgroundColor: isDarkMode ? "#303130" : "white",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  overflow: "hidden",
                  backgroundColor: isDarkMode ? "#303130" : "white",
                }}
              >
                <HeaderChatListTemp
                  onBack={handleBackToSidebar}
                  onClose={handleCloseChatBox}
                  value={selectedTab}
                  handleChange={(event, newValue) => {
                    setSelectedTab(newValue);
                  }}
                />
                {open && selectedTab === 0 && (
                  <SwitchChat onCloseChatBox={handleCloseChatBox} />
                )}
                {open && selectedTab === 1 && (
                  <SwitchChatAI
                    currStep={currentStepChatAI}
                    setCurrStep={setCurrentStepChatAI}
                  />
                )}
              </Box>
            </Box>
          </Grow>
        </>
      )}
      <Box
        position="fixed"
        bottom="2rem"
        right="4rem"
        sx={{
          backgroundColor: "#3699FF",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          // display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "2px 2px 24px 0px #0000001A",
          cursor: "pointer",
          display: open ? "none" : "flex",
        }}
        component={"div"}
        onClick={handleTrigger}
      >
        {open ? (
          <CloseIcon
            sx={{
              color: "white",
            }}
          />
        ) : (
          <ChatMessageIcon />
        )}
      </Box>
    </Box>
  );
};

export default ChatListTemp;

const defaultSx = {
  buttonCancel: {
    minWidth: 120,
    mx: 1.5,
    borderRadius: "0.25rem",
    background: "var(--blue-light, #E1F0FF)",
    color: "var(--brand-primary, #3699FF)",
    border: "1px solid var(--brand-primary, #3699FF)",
    "&:hover": {
      background: "var(--blue-light, #E1F0FF)",
    },
  },
  buttonConfirm: {
    minWidth: 120,
    mx: 1.5,
    borderRadius: "0.25rem",
    border: "1px solid var(--brand-primary, #3699FF)",
    color: "var(--brand-primary, #FFF)",
  },
};
