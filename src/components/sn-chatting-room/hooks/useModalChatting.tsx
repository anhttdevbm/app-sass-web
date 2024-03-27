import { useMemo } from "react";
import { useChat } from "store/chat/selectors";
import ForwardLayout from "../components/RoomDetails/components/Drawer/ChatForward/ForwardLayout";
import AddGroup from "components/sn-chat/chatGroup/AddGroup";

const useModalChatting = () => {
  const {
    isOpenInfoChat,
    typeDrawerChat,
    onCloseDrawer,
    onSetConversationInfo,
  } = useChat();

  const contentObject = useMemo(
    () => ({
      ["forward"]: {
        title: "Forward message",
        content: <ForwardLayout />,
        open: typeDrawerChat === "forward" && isOpenInfoChat,
        onClose: () => onCloseDrawer("account"),
        sx: { width: "500px" },
      },
      ["group-modal"]: {
        title: "Add group",
        content: (
          <AddGroup
            isNew={true}
            type="modal"
            onSelectNewGroup={(value) => onSetConversationInfo(value)}
          />
        ),
        open: typeDrawerChat === "group-modal" && isOpenInfoChat,
        onClose: () => onCloseDrawer("account"),
        sx: { width: "500px" },
      },
    }),
    [isOpenInfoChat, onCloseDrawer, onSetConversationInfo, typeDrawerChat],
  );

  const contentChatting = useMemo(
    () => contentObject[typeDrawerChat],
    [contentObject, typeDrawerChat],
  );

  return contentChatting;
};

export default useModalChatting;
