import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "store/chat/selectors";
import { useAuth, useSnackbar } from "store/app/selectors";
import { useWSChat } from "store/chat/helpers";
import ChatInput from "../chat/ChatInput";
import Messages from "../messages/Messages";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { SxProps, Theme } from "@mui/material";
import useGetScreenMode from "hooks/useGetScreenMode";
import { DrawerChatIgnore } from "components/sn-chatting-room/components/RoomDetails";

const initPageIndex = 10;

interface Props {
  wrapperMessageSx?: SxProps<Theme>;
  wrapperInputSx?: SxProps<Theme>;
}

const Conversation: FC<Props> = ({ wrapperMessageSx, wrapperInputSx }) => {
  const {
    roomId,
    conversationInfo,
    convention,
    messageInfo,
    messagePaging: { pageIndex, pageSize },
    messageStatus,
    mediaListConversation,
    stateSendMessage,
    dataTransfer,
    stateSearchMessage,
    unReadMessage,
    onGetUnReadMessages,
    onGetLastMessages,
    onUploadAndSendFile,
    isChatDesktop,
    isOpenInfoChat,
    typeDrawerChat,
  } = useChat();

  const { user } = useAuth();

  const { sendMessage } = useWSChat();
  const { extraDesktopMode } = useGetScreenMode();
  const { onAddSnackbar } = useSnackbar();
  const t = useTranslations(NS_COMMON);
  const [files, setFiles] = useState<File[]>([]);

  const isGroup = useMemo(
    () => conversationInfo?.t !== "d",
    [conversationInfo?.t],
  );

  const unReadMessageClone = useMemo(
    () =>
      unReadMessage?.info.filter(
        (item) => item.username !== user?.["username"],
      ) || [],
    [unReadMessage?.info, user],
  );

  const currentRoomId = useMemo(() => {
    return dataTransfer?._id ?? roomId;
  }, [dataTransfer, roomId]);

  const currentRoomType = useMemo(() => {
    return dataTransfer?.t ?? "d";
  }, [dataTransfer]);

  const account = useMemo(
    () =>
      convention?.find(
        (item) => item._id === (isChatDesktop ? dataTransfer?._id : roomId),
      ),
    [convention, dataTransfer?._id, isChatDesktop, roomId],
  );

  const getLastMessage = useCallback(
    async (page?: number, size?: number) => {
      if (currentRoomId?.length === 0) return;
      if (currentRoomType?.length === 0) return;
      try {
        // TODO:
      } catch (error) {
        onAddSnackbar(
          typeof error === "string" ? error : t(AN_ERROR_TRY_AGAIN),
          "error",
        );
      }
    },
    [onAddSnackbar, onGetLastMessages, currentRoomId, t, currentRoomType],
  );

  const getUnReadMessage = useCallback(async () => {
    await onGetUnReadMessages({
      type: dataTransfer?.t ?? "d",
    });
  }, [dataTransfer?.t, onGetUnReadMessages]);

  useEffect(() => {
    const countNew = stateSearchMessage?.offset
      ? stateSearchMessage?.offset + initPageIndex
      : initPageIndex;
    setFiles([]);
    if ((!roomId || roomId?.length === 0) && !dataTransfer?._id) return;
    getLastMessage(0, countNew);
    if (inputRef.current) {
      inputRef.current.pageRef.current = countNew - initPageIndex;
      inputRef.current.scrollMessage();
    }
  }, [roomId, dataTransfer?._id, getLastMessage, stateSearchMessage, t]);

  useEffect(() => {
    if (stateSendMessage.status) {
      setFiles([]);
    }
  }, [stateSendMessage.status]);

  type MessageHandle = React.ElementRef<typeof Messages>;
  const inputRef = useRef<MessageHandle>(null);

  // console.log("Message: --", stateSendMessage);

  const handleSendMessage = useCallback(
    async (message: string) => {
      // console.log("stateSendMessage: " + stateSendMessage);

      sendMessage({
        message,
      });
      inputRef?.current?.clearScrollContentMessage();
      if (files.length > 0) {
        await onUploadAndSendFile({
          endpoint: "files/upload-link",
          files,
        });
      }
    },
    [files, onUploadAndSendFile, sendMessage],
  );

  return (
    <>
      <Messages
        pageIndex={pageIndex}
        pageSize={pageSize}
        sessionId={user?.["username"]}
        isGroup={isGroup}
        avatarPartner={account?.avatar ?? conversationInfo?.avatar ?? undefined}
        initialMessage={messageInfo}
        mediaListPreview={mediaListConversation}
        stateMessage={stateSendMessage}
        statusLoadMessage={messageStatus}
        focusMessage={stateSearchMessage}
        unReadMessage={unReadMessageClone}
        onRefetch={(page) => {
          getLastMessage(page, 10);
        }}
        ref={inputRef}
        {...(isChatDesktop && {
          wrapperMessageSx: {
            ...(isOpenInfoChat && !DrawerChatIgnore.includes(typeDrawerChat)
              ? {
                width: `calc(100% - ${extraDesktopMode ? "424px" : "272px"})`,
              }
              : {}),
          },
        })}
      />
      <ChatInput
        isLoading={false}
        onEnterMessage={handleSendMessage}
        files={files}
        onChangeFiles={(file) => setFiles(file)}
        onResize={() => {
          if (inputRef?.current?.isBottomScrollMessage) {
            inputRef?.current?.clearScrollContentMessage();
            inputRef?.current?.initScrollIntoView();
          }
        }}
        wrapperInputSx={wrapperInputSx}
      />
    </>
  );
};

export default Conversation;
