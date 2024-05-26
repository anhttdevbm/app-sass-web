import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef } from "react";
import { useSnackbar } from "store/app/selectors";
import { useChat } from "store/chat/selectors";

const useGetLastChatting = () => {
  const { dataTransfer, roomId, onGetLastMessages } = useChat();
  const messagesContentRef = useRef<HTMLDivElement>(null);

  const { onAddSnackbar } = useSnackbar();
  const t = useTranslations(NS_COMMON);

  const currentRoomId = useMemo(() => {
    return dataTransfer?._id ?? roomId;
  }, [dataTransfer, roomId]);

  const currentRoomType = useMemo(() => {
    return dataTransfer?.t ?? "d";
  }, [dataTransfer]);

  const getLastMessage = useCallback(
    async (page?: number, size?: number) => {
      if (currentRoomId?.length === 0) return;
      if (currentRoomType?.length === 0) return;
      try {
        await onGetLastMessages({
          roomId: currentRoomId,
          type: currentRoomType,
          offset: page,
          count: size,
        });
      } catch (error) {
        onAddSnackbar(
          typeof error === "string" ? error : t(AN_ERROR_TRY_AGAIN),
          "error",
        );
      }
    },
    [onAddSnackbar, onGetLastMessages, currentRoomId, t, currentRoomType],
  );

  return {
    getLastMessage,
  };
};

export default useGetLastChatting;
