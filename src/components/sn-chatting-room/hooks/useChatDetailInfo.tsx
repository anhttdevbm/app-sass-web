import AccountProfileIcon from "icons/AccountProfileIcon";
import FileBasicIcon from "icons/FileBasicIcon";
import LinkIcon from "icons/LinkIcon";
import MediaFileIcon from "icons/MediaFileIcon";
import { TypeDrawerChat } from "store/chat/type";
import { useChatHelpers } from "store/chat/helpers";

interface MenuItem {
  text: string;
  icon: JSX.ElementType;
  callback: (username?: string) => void;
  type: TypeDrawerChat;
}

export interface useChatDetailInfoReturns {
  menuItems: MenuItem[];
  onChangeTypeDrawer: (type: string) => void;
}

export const useChatDetailInfo = ({
  currentConversation,
}): useChatDetailInfoReturns => {
  const { handleGetChatMedias, handleGetChatLinks, handleGetChatFiles } =
    useChatHelpers();

  const menuItems: MenuItem[] = [
    {
      text: "Account infomation",
      icon: AccountProfileIcon,
      callback: () => console.log(currentConversation),
      type: "account",
    },
    {
      text: "Media file",
      icon: MediaFileIcon,
      callback: () => handleGetChatMedias(1),
      type: "media",
    },
    {
      text: "Link",
      icon: LinkIcon,
      callback: () => handleGetChatLinks(1),
      type: "link",
    },
    {
      text: "File",
      icon: FileBasicIcon,
      callback: () => handleGetChatFiles(1),
      type: "file",
    },
  ];

  const onChangeTypeDrawer = (type: string) => {
    const onCallBackByType = menuItems.find(
      (menuItem) => menuItem.type === type,
    )?.callback;
    if (onCallBackByType) {
      onCallBackByType();
    }
  };

  return {
    menuItems,
    onChangeTypeDrawer,
  };
};
