/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import React, {
  forwardRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CHAT_EVENT_TYPE,
  MediaPreviewItem,
  MessageInfoV2,
  MessageSearchInfo,
  UnreadUserInfo,
} from "store/chat/type";
import { DataStatus } from "constant/enums";
import Skeleton from "@mui/material/Skeleton";
import MessageLayout from "./MessageLayout";
import MessageContent from "./MessageContent";
import { formatDate, sleep } from "utils/index";
import Typography from "@mui/material/Typography";
import { nameMonthList, NS_CHAT_BOX } from "constant/index";
import { useTranslations } from "next-intl";
import useTheme from "hooks/useTheme";
import { useChat } from "store/chat/selectors";
import { useChatHelpers } from "store/chat/helpers";

interface MessagesProps {
  sessionId: string | undefined;
  avatarPartner: string | undefined;
  pageIndex: number;
  pageSize: number;
  isGroup: boolean;
  initialMessage: MessageInfoV2[];
  mediaListPreview: MediaPreviewItem[];
  statusLoadMessage: DataStatus;
  stateMessage?: {
    // filePreview?: File | File[] | null;
    // fix build
    filePreview?: any;
    status: DataStatus;
  };
  focusMessage: MessageSearchInfo | null;
  unReadMessage: UnreadUserInfo[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapperMessageSx?: any;
}

type MessageHandle = {
  pageRef: MutableRefObject<number>;
  isBottomScrollMessage: boolean;
  initScrollIntoView: () => void;
  clearScrollContentMessage: () => void;
  scrollMessage: () => void;
};

const Messages: React.ForwardRefRenderFunction<MessageHandle, MessagesProps> = (
  {
    sessionId,
    avatarPartner,
    pageIndex,
    pageSize,
    isGroup,
    initialMessage: messages,
    mediaListPreview,
    statusLoadMessage,
    stateMessage,
    focusMessage,
    unReadMessage,
    wrapperMessageSx,
  }: MessagesProps,
  ref,
) => {
  const [firstElement, setFirstElement] = useState(null);
  const [isBottomScrollMessage, setBottomScrollMessage] = useState(false);
  const commonChatBox = useTranslations(NS_CHAT_BOX);
  const { isDarkMode } = useTheme();
  const {
    isChatDesktop,
    dataTransfer,
    messagePagingV2: messagePaging,
  } = useChat();
  const { loadMoreMessages } = useChatHelpers();

  const pageRef = useRef(pageIndex);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContentRef = useRef<HTMLDivElement>(null);

  const scrollHeightRef = useRef(0);
  const observer = useMemo(() => {
    return new IntersectionObserver((entries) => {
      const first = entries[0];

      if (first.isIntersecting) {
        pageRef.current = pageRef.current + pageSize;
        scrollHeightRef.current = messagesContentRef.current?.scrollHeight || 0;
        const clientHeight =
          (messagesContentRef.current?.clientHeight || 0) + 50;
        if (scrollHeightRef.current > clientHeight && !!messagePaging.next) {
          loadMoreMessages(messagePaging.current);
        }
      }
    });
  }, [messagesContentRef.current?.scrollHeight]);

  const isScrolling = useMemo(() => {
    if (!messagesContentRef?.current) return false;

    return (
      messagesContentRef?.current?.scrollHeight >
        messagesContentRef?.current?.clientHeight ||
      messagesContentRef?.current?.scrollWidth >
        messagesContentRef?.current?.clientWidth
    );
  }, []);

  const getTimeStamp = (time: string | Date) => {
    const date = new Date(time);
    const lastHours = date.getHours();
    let half = " AM";
    if (lastHours === undefined) {
      return "";
    }
    if (lastHours > 12) {
      date.setHours(lastHours - 12);
      half = " PM";
    }
    if (lastHours === 0) date.setHours(12);
    if (lastHours === 12) half = " PM";
    return `${formatDate(date, "HH:mm")}${half}`;
  };

  const focusMessageRef = useRef<HTMLDivElement>(null);

  const clearScrollContentMessage = async () => {
    scrollHeightRef.current = 0;
  };

  const scrollMessage = async () => {
    // console.log("scrollMessage");

    clearScrollContentMessage();
    await sleep(500);
    if (focusMessageRef.current) {
      focusMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      if (focusMessageRef.current.hasChildNodes()) {
        const child = focusMessageRef.current?.childNodes[0] as HTMLDivElement;
        child.style.border = "1px solid gray";

        setTimeout(() => {
          child.style.border = "1px solid transparent";
        }, 2000);
      }
    }
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        pageRef,
        isBottomScrollMessage,
        initScrollIntoView,
        clearScrollContentMessage,
        scrollMessage,
      };
    },
    [isBottomScrollMessage],
  );

  const initScrollIntoView = useCallback(() => {
    if (messagesContentRef.current) {
      const index = messagesContentRef.current?.scrollHeight
        ? Number(
            messagesContentRef.current?.scrollHeight -
              scrollHeightRef.current || 0,
          )
        : 0;
      messagesContentRef.current.scrollTo(0, index);
    }
  }, []);

  useEffect(() => {
    pageRef.current = pageIndex;
  }, [pageIndex]);

  useEffect(() => {
    initScrollIntoView();
  }, [
    messages,
    stateMessage?.status,
    scrollHeightRef,
    messagesContentRef,
    initScrollIntoView,
    statusLoadMessage,
    dataTransfer,
  ]);

  useEffect(() => {
    const currentElement = firstElement;
    const currentObserver = observer;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [firstElement, isChatDesktop, messagesContentRef]);

  const renderMessage = (message: MessageInfoV2) => {
    let msg = "";
    switch (message?.type) {
      case "au":
        msg = commonChatBox("chatBox.group.add", {
          user1: message?.sender,
          user2: message?.content,
          time: getTimeStamp(message?.created_at ?? ""),
        });
        break;
      case "ru":
        msg = commonChatBox("chatBox.group.remove", {
          user1: message?.sender,
          user2: message?.content,
          time: getTimeStamp(message?.created_at ?? ""),
        });
        break;
      case "subscription-role-added":
        msg = commonChatBox("chatBox.group.lead_trans", {
          user1: message?.sender,
          user2: message?.content,
          time: getTimeStamp(message?.created_at ?? ""),
        });
        break;
      case "subscription-role-removed":
        msg = commonChatBox("chatBox.group.lead_remove", {
          user1: message?.sender,
          user2: message?.content,
          time: getTimeStamp(message?.created_at ?? ""),
        });
        break;
      case "r":
        msg = commonChatBox("chatBox.group.rename", {
          user1: message?.sender,
          name: message?.content,
          time: getTimeStamp(message?.created_at ?? ""),
        });
        break;
    }
    return msg;
  };

  return (
    <>
      <Box
        ref={messagesContentRef}
        onScroll={(e) => {
          const h = e.currentTarget.scrollTop + e.currentTarget.clientHeight;
          setBottomScrollMessage(h === e.currentTarget.scrollHeight);
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          overflowY: "scroll",
          height: "100vh",

          ...(messages.length < 5
            ? {
                justifyContent: "flex-end",
              }
            : {
                flex: "1 1 auto",
              }),
          padding: "1rem",
          ...(!!wrapperMessageSx
            ? { ...wrapperMessageSx }
            : { height: "100%" }),
        }}
      >
        {messages.length < 15 && <Box height={"400px"} />}
        {messages.map((message, index) => {
          // Need to separate this cluster into a separate component
          const isCurrentUser = message?.sender === sessionId;
          const hasNextMessageFromSameUser =
            messages[index + 1]?.sender === messages[index]?.sender;
          const currentTimeMessage = new Date(
            formatDate(messages[index]?.created_at, "MM/dd/yyyy"),
          );
          const nextTimeMessage = new Date(
            formatDate(messages[index + 1]?.created_at, "MM/dd/yyyy"),
          );
          const hasNextDay =
            index !== messages.length - 1
              ? currentTimeMessage.getTime() - nextTimeMessage.getTime() !== 0
              : false;

          const isShowYear =
            new Date().getFullYear() !== nextTimeMessage.getFullYear();
          const showDate = `${nextTimeMessage.getDate()} ${
            nameMonthList[Number(nextTimeMessage.getMonth())]
          } ${isShowYear ? nextTimeMessage.getFullYear() : ""}`.trim();

          return (
            <React.Fragment key={index}>
              {["text", "file", "media"].includes(message?.type) ? (
                <MessageLayout
                  sessionId={sessionId}
                  message={message}
                  avatarPartner={avatarPartner || undefined}
                  hasNextMessageFromSameUser={hasNextMessageFromSameUser}
                  messageProps={{
                    ...(index === 0 && {
                      ref: setFirstElement,
                    }),
                    ...(message.id === focusMessage?.messageId && {
                      ref: focusMessageRef,
                    }),
                  }}
                >
                  <MessageContent
                    message={message}
                    mediaListPreview={mediaListPreview}
                    isCurrentUser={isCurrentUser}
                    isGroup={isGroup}
                    unReadMessage={unReadMessage}
                  />
                </MessageLayout>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      backgroundColor: isDarkMode ? "#5b5959" : "#f1f1f1",
                      fontSize: "10px",
                      padding: "2px 5px",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                  >
                    {renderMessage(message)}
                  </Typography>
                </Box>
              )}
              {hasNextDay && (
                <Typography
                  textAlign="center"
                  color="#999999"
                  fontSize="12px"
                  lineHeight="18px"
                >
                  {showDate}
                </Typography>
              )}
            </React.Fragment>
          );
        })}
        {stateMessage?.status === DataStatus.LOADING && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              "&:last-child": {
                paddingBottom: "1rem",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "0.3rem",
                alignItems: "flex-end",
                borderRadius: "10px",
              }}
              order={2}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                  gap: "0.2rem",
                  maxWidth: "232px",
                }}
              >
                {Array.from(
                  { length: stateMessage?.filePreview?.length || 0 },
                  (_, i) => {
                    return (
                      <Skeleton
                        key={i}
                        variant="rounded"
                        width={112}
                        height={112}
                      />
                    );
                  },
                )}
              </Box>
            </Box>
          </Box>
        )}
        <Box ref={messageEndRef} />
      </Box>
    </>
  );
};

export default forwardRef(Messages);
