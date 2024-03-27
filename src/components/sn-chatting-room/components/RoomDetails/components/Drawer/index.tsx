import AccountInfo from "./AccountInfo";
import StorageInfo from "./StorageInfo";
import AddGroup from "components/sn-chat/chatGroup/AddGroup";
import { useMemo } from "react";
import MenuInfo from "./MenuInfo";
import { useChat } from "store/chat/selectors";
import ArrowDownIcon from "icons/ArrowDownIcon";
import ForwardLayout from "./ChatForward/ForwardLayout";

const DrawerInfoChat = () => {
  const {
    typeDrawerChat,
    onSetDrawerType,
    onSetConversationInfo,
    isFetchingDetail,
  } = useChat();

  const DrawerObjs = useMemo(
    () => ({
      info: <MenuInfo />,
      group: (
        <AddGroup
          callbackBackIcon={() => onSetDrawerType("info")}
          onSelectNewGroup={(value) => onSetConversationInfo(value)}
          CustomCallBackIcon={<ArrowDownIcon sx={{ fontSize: "2rem" }} />}
        />
      ),
      account: <AccountInfo />,
    }),

    [onSetDrawerType, onSetConversationInfo],
  );

  return DrawerObjs[typeDrawerChat] || <StorageInfo />;
};

export default DrawerInfoChat;
