import { Drawer, Box, Typography, Avatar } from "@mui/material";
import { IChatItemInfo } from "store/chat/type";
import React, { useMemo } from "react";
import AccountInfoMobile from "./AccountInfoMobile";
import StorageInfoMobile from "./StorageInfo";

interface DrawerMobileProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversation: IChatItemInfo;
  type: string;
  onChangeTypeDrawer?: (type: string) => void;
}

const DrawerMobile: React.FC<DrawerMobileProps> = (props) => {
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
      {/* {props?.type === "account" ? (
        <AccountInfoMobile {...props} />
      ) : (
        <StorageInfoMobile {...props} />
      )} */}
    </Drawer>
  );
};

export default DrawerMobile;
