import { Box, Drawer } from "@mui/material";
import MembersHeaderMobile from "./MembersHeaderMobile";
import MembersItemMobile from "./MembersItemMobile";
import { IChatItemInfo } from "store/chat/type";

interface MembersMobileProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversation: IChatItemInfo;
}

const MembersMobile: React.FC<MembersMobileProps> = (props) => {
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <MembersHeaderMobile onClose={props.onClose} />
        <Box
          sx={{
            padding: "0px 16px",
            display: "inline-flex",
            gap: "16px",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <MembersItemMobile {...props.currentConversation} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default MembersMobile;
