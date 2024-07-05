import CameraIcon from "icons/CameraIcon";
import DeleteChatIcon from "icons/DeleteChatIcon";
import GroupChatIcon from "icons/GroupChatIcon";
import LeaveGroupIcon from "icons/LeaveGroupIcon";
import MediaFileIcon from "icons/MediaFileIcon";
import SearchIcon from "icons/SearchIcon";
import { useCallback, useMemo, useState } from "react";
import { useChat } from "store/chat/selectors";
import { IChatItemInfo, RoomType } from "store/chat/type";

interface MenuItem {
  text: string;
  icon: JSX.ElementType;
  stroke?: string;
  borderBottom?: boolean;
  type?: string;
  handleOnClick?: (fileType?: any) => void;
}

export enum TypeDrawer {
  members = "members",
  media = "media",
}

export interface GroupChatInfoReturns {
  isDrawerOpen: boolean;
  onOpenDrawer: () => void;
  closeDrawer: () => void;
  topMenuItems: MenuItem[];
  midMenuItems: MenuItem[];
  bottomMenuItems: MenuItem[];
  typeDrawer: "members" | "media";
  onChangeTypeDrawer: (type: string) => void;
}

export const useGroupChat = ({
  currentConversation,
}: {
  currentConversation: IChatItemInfo;
}): GroupChatInfoReturns => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { onGetChatAttachments, onGetChatUrls } = useChat();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [typeDrawer, setTypeDrawer] = useState<keyof typeof TypeDrawer | any>(
    TypeDrawer.members,
  );

  const onOpenDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    setTypeDrawer("members");
  }, [currentConversation]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const callbackChatAttachment = useCallback(
    (fileType: "link" | "media" | "file") => {
      if(!currentConversation?.t || !currentConversation?._id) return;
      onGetChatAttachments({
        roomId: currentConversation?._id,
        roomType: currentConversation?.t as RoomType,
        fileType,
      });
      setTypeDrawer("media");
      setIsDrawerOpen(true);
    },
    [currentConversation],
  );

  const onChangeTypeDrawer = useCallback((type: string) => {
    setTypeDrawer(type as TypeDrawer);
  }, []);
  const topMenuItems: MenuItem[] = [
    {
      text: "Change group photo",
      icon: CameraIcon,
      stroke: "#8950FC",
    },
  ];

  const midMenuItems: MenuItem[] = useMemo(
    () => [
      {
        text: "Members",
        icon: GroupChatIcon,
        stroke: "#3699FF",
        borderBottom: true,
        type: TypeDrawer.members,
        handleOnClick: onOpenDrawer,
      },
      {
        text: "Media files, files and links",
        icon: MediaFileIcon,
        stroke: "#1BC5BD",
        borderBottom: true,
        type: TypeDrawer.media,
        handleOnClick: callbackChatAttachment,
      },
      {
        text: "Search in conversation",
        icon: SearchIcon,
        stroke: "#999999",
      },
    ],
    [currentConversation?.usernames, onOpenDrawer, onChangeTypeDrawer],
  );

  const bottomMenuItems: MenuItem[] = [
    {
      text: "Delete conversation",
      icon: DeleteChatIcon,
      borderBottom: true,
    },
    {
      text: "Leave the group",
      icon: LeaveGroupIcon,
    },
  ];

  const menuItems: MenuItem[] = [
    ...topMenuItems,
    ...midMenuItems,
    ...bottomMenuItems,
  ];

  return {
    onOpenDrawer,
    closeDrawer,
    isDrawerOpen,
    topMenuItems,
    midMenuItems,
    bottomMenuItems,
    typeDrawer,
    onChangeTypeDrawer,
  };
};
