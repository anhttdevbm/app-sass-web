import { SxProps, Theme } from "@mui/material";
import { Endpoint } from "api";
import { DrawerChatIgnore } from "components/sn-chatting-room/components/RoomDetails";
import { NS_COMMON } from "constant/index";
import useGetScreenMode from "hooks/useGetScreenMode";
import { useTranslations } from "next-intl";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "store/app/selectors";
import { useWSChat } from "store/chat/helpers";
import { uploadFile } from "store/chat/media/actionMedia";
import { useChat } from "store/chat/selectors";
import { CHAT_EVENT_TYPE, CHAT_EVENT_TYPE_V2 } from "store/chat/type";
import { useAppDispatch } from "store/hooks";
import ChatInput from "../chat/ChatInput";
import Messages from "../messages/Messages";

const initPageIndex = 10;

interface Props {
  wrapperMessageSx?: SxProps<Theme>;
  wrapperInputSx?: SxProps<Theme>;
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result); // Chuỗi base64 bao gồm cả prefix data:image/jpeg;base64,...
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file); // Đọc file dạng base64
  });
}
const Conversation: FC<Props> = ({ wrapperMessageSx, wrapperInputSx }) => {
  const {
    roomId,
    conversationInfo,
    convention,
    messages,
    messagePaging: { pageIndex, pageSize },
    messageStatus,
    mediaListConversation,
    stateSendMessage,
    dataTransfer,
    stateSearchMessage,
    unReadMessage,
    isChatDesktop,
    isOpenInfoChat,
    typeDrawerChat,
  } = useChat();

  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { sendMessage } = useWSChat();
  const { extraDesktopMode } = useGetScreenMode();
  const t = useTranslations(NS_COMMON);
  const [files, setFiles] = useState<File[]>([]);
  const [medias, setMedias] = useState<File[]>([]);

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

  const account = useMemo(
    () =>
      convention?.find(
        (item) => item.id === (isChatDesktop ? dataTransfer?.id : roomId),
      ),
    [convention, dataTransfer?.id, isChatDesktop, roomId],
  );

  useEffect(() => {
    const countNew = initPageIndex;
    setFiles([]);
    setMedias([]);
    if ((!roomId || roomId?.length === 0) && !dataTransfer?.id) return;
    if (inputRef.current) {
      inputRef.current.pageRef.current = countNew - initPageIndex;
      inputRef.current.scrollMessage();
    }
  }, [roomId, dataTransfer?.id, stateSearchMessage, t]);

  useEffect(() => {
    if (stateSendMessage.status) {
      setFiles([]);
      setMedias([]);
    }
  }, [stateSendMessage.status]);

  type MessageHandle = React.ElementRef<typeof Messages>;
  const inputRef = useRef<MessageHandle>(null);

  const handleSendMessage = useCallback(
    async (message: string) => {
      

      const base64List = await Promise.all(
        [...files,...medias].map(file => fileToBase64(file))
      );
     
      if (message) {
        sendMessage({
          code: CHAT_EVENT_TYPE_V2.MESSAGE_SEND,
          data: {
            id: dataTransfer?.id,
            content: message
            // lstFile: base64List
          }
        });
      }
      inputRef?.current?.clearScrollContentMessage();
  

      setFiles([]);
      setMedias([]);
    },
    [files, medias, sendMessage],
  );

  return (
    <>
      <Messages
        pageIndex={pageIndex}
        pageSize={pageSize}
        sessionId={user?.id}
        isGroup={isGroup}
        avatarPartner={account?.avatar ?? conversationInfo?.avatar ?? undefined}
        initialMessage={messages}
        mediaListPreview={mediaListConversation}
        stateMessage={stateSendMessage}
        statusLoadMessage={messageStatus}
        focusMessage={stateSearchMessage}
        unReadMessage={unReadMessageClone}
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
        medias={medias}
        onChangeFiles={(file) => setFiles(file)}
        onChangeMedias={(file) => setMedias(file)}
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
