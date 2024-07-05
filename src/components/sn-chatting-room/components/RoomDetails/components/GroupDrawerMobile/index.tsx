import { Box, Drawer } from "@mui/material";
import { IChatItemInfo } from "store/chat/type";
import MembersMobile from "./MembersMobile";
import StorageInfoMobile from "../DrawerMobile/StorageInfo";
import StorageGroupInfoMobile from "./StorageGroupInfo";

interface GroupchatDrawerMobileProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversation: IChatItemInfo;
  type?: string;
  onChangeTypeDrawer?: (type: string) => void;
}

const GroupDrawerMobile: React.FC<GroupchatDrawerMobileProps> = (props) => {
  const styleDrawerOpen = props.isOpen ? { width: "100%" } : { width: "0" };

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        ...styleDrawerOpen,
        "& .MuiDrawer-paper": {
          width: "100%",
          boxSizing: "border-box",
          border: "none",
        },
      }}
      variant="persistent"
      anchor="right"
      open={props.isOpen}
    >
      {props?.type === "members" ? (
        <MembersMobile {...props} />
      ) : (
        <StorageGroupInfoMobile {...props} />
      )}
    </Drawer>
  );
};

export default GroupDrawerMobile;
