import { useState } from "react";
import data from "@emoji-mart/data";
import Box from "@mui/material/Box";
import ImojiImportIcon from "icons/ImojiImportIcon";
import dynamic from "next/dynamic";
import Popper from "@mui/material/Popper";
import { useOnClickOutside } from "hooks/useOnClickOutside";

const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

export interface Emoji {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
}
interface ChatEmojiProps {
  onChange: (emoji: Emoji) => void;
}
const ChatEmoji = ({ onChange }: ChatEmojiProps) => {
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (event: React.MouseEvent<SVGSVGElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const ref = useOnClickOutside(handleClose);

  return (
    <Box position="relative" display="flex">
      <ImojiImportIcon
        sx={{
          fill: "transparent",
          cursor: "pointer",
        }}
        onMouseDown={handleOpen}
      />
      <Popper
        ref={ref}
        open={open}
        anchorEl={anchorEl}
        placement={"top-end"}
        sx={{
          zIndex: 9999,
          "& .MuiBox-root": {
            boxShadow: "none",
            paddingBottom: ".8rem",
            backgroundColor: "transparent",
          },
        }}
      >
        <Box
          sx={{
            width: "352px",
            height: "435px",
            borderRadius: "10px",
            display: "table",
          }}
        >
          <Picker data={data} onEmojiSelect={onChange} theme="light" />
        </Box>
      </Popper>
    </Box>
  );
};

export default ChatEmoji;
