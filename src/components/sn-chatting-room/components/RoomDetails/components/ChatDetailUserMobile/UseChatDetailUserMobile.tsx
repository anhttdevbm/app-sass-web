import AccountProfileIcon from "icons/AccountProfileIcon";
import CreateGroupChatIcon from "icons/CreateGroupChatIcon";
import MediaFileIcon from "icons/MediaFileIcon";
import SearchIcon from "icons/SearchIcon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChat } from "store/chat/selectors";
import { IChatItemInfo } from "store/chat/type";

interface MenuItem {
  text: string;
  icon: JSX.ElementType;
  stroke: string;
  borderBottom?: boolean;
  handleOnClick?: any;
  type?: string;
}

export enum TypeDrawer {
  account = "account",
  media = "media",
  link = "link",
  file = "file",
  group = "group",
}

export interface useChatDetailInfoReturns {
  accountInfoShow: boolean;
  searchConversationShow: boolean;
  handleCloseAccountInfoMobile: () => void;
  handleSearchConversation: () => void;
  menuItems: MenuItem[];
  typeDrawer: "account" | "link" | "media" | "file" | "group" | "forward";
  onChangeTypeDrawer: (type: string) => void;
}

export const useChatDetailUserMobile = ({
  currentConversation,
}: {
  currentConversation: IChatItemInfo;
}): useChatDetailInfoReturns => {
  const [searchConversationShow, setSearchConversationShow] = useState(false);
  const [accountInfoShow, setAccountInfoShow] = useState(false);

  const { onGetUserInfo, onGetChatAttachments, onGetChatUrls } = useChat();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [typeDrawer, setTypeDrawer] = useState<keyof typeof TypeDrawer | any>(
    TypeDrawer.account,
  );

  const handleOpenAccountInfoMobile = useCallback(() => {

    if (currentConversation?.usernames[0]) {
      setAccountInfoShow(true);
      onGetUserInfo(currentConversation?.usernames[0]);
      setTypeDrawer(TypeDrawer.account);
    }
  }, [currentConversation?.usernames]);

  const callbackChatAttachment = useCallback(
    (fileType: "link" | "media" | "file") => {
      onGetChatAttachments({
        roomId: currentConversation?._id,
        roomType: "d",
        fileType,
      });
      setTypeDrawer(TypeDrawer.media);
      setAccountInfoShow(true);
    },
    [currentConversation],
  );

  const handleCloseAccountInfoMobile = () => {
    setAccountInfoShow(false);
  };

  const handleSearchConversation = useCallback(() => {
    setSearchConversationShow(!searchConversationShow);
  }, []);

  const onChangeTypeDrawer = useCallback((type: string) => {
    setTypeDrawer(type as TypeDrawer);
  }, []);

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        text: "Account infomation",
        icon: AccountProfileIcon,
        stroke: "#3699FF",
        borderBottom: true,
        handleOnClick: handleOpenAccountInfoMobile,
        type: "account",
      },
      {
        text: `Create a chat group with ${currentConversation?.name}`,
        icon: CreateGroupChatIcon,
        stroke: "#3699FF",
        borderBottom: true,
      },
      {
        text: "Media files, files and links",
        icon: MediaFileIcon,
        stroke: "#1BC5BD",
        borderBottom: true,
        handleOnClick: callbackChatAttachment,
        type: "media",
      },
      {
        text: "Search in conversation",
        icon: SearchIcon,
        stroke: "#999999",
        handleOnClick: handleSearchConversation,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      handleOpenAccountInfoMobile,
      currentConversation?.name,
      onChangeTypeDrawer,
      handleSearchConversation,
    ],
  );

  return {
    menuItems,
    accountInfoShow,
    searchConversationShow,
    handleCloseAccountInfoMobile,
    handleSearchConversation,
    typeDrawer,
    onChangeTypeDrawer,
  };
};
