/* eslint-disable react-hooks/exhaustive-deps */
import { Popup } from "@mui/base/Unstable_Popup/Popup";
import {
  Fullscreen,
  FullscreenExit,
  Minimize,
  Settings,
  SettingsOutlined,
  SpaceDashboard,
} from "@mui/icons-material";
import { Box, Button, Popover, Popper, Stack } from "@mui/material";
import LayoutSelect from "components/sn-meeting/components/LayoutSelect";
import { textTransform } from "html2canvas/dist/types/css/property-descriptors/text-transform";
import { LayoutIcon } from "icons/LayoutIcon";
import { MaximizeScreenIcon } from "icons/MaximizeScreenIcon";
import { MinimizeScreenIcon } from "icons/MinimizeScreenIcon";
import { SettingsOutlineIcon } from "icons/SettingsOutlineIcon";
import { VisualEffectIcon } from "icons/VisualEffectIcon";
import React, { useEffect, useRef, useState } from "react";

interface OptionPopupProps {
  sx?: object;
  anchorElP: HTMLElement | null;
  onClose: () => void;
  onClickSetting?: (e: React.MouseEvent<HTMLElement>) => void;
}

const OptionPopup: React.FC<OptionPopupProps> = (props: OptionPopupProps) => {
  const { anchorElP, onClose, onClickSetting } = props;
  const [isOpenLayoutSelect, setIsOpenLayoutSelect] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const open = Boolean(anchorElP);
  const id = open ? "simple-popper" : undefined;
  const handleFullscreen = () => {
    console.log("Fullscreen");
  };

  const handleMinimizeChat = () => {
    console.log("Minimize Chat");
  };

  const handleApplyVisual = () => {
    console.log("Apply Visual Effects");
  };

  const handleSettings = (e: React.MouseEvent<HTMLElement>) => {
    onClickSetting && onClickSetting(e);
    onClose();
  };
  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      (open || !popupRef.current.contains(event.target))
    ) {
      onClose();
      setIsOpenLayoutSelect(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Popper
      id={id}
      open={open}
      anchorEl={anchorElP}
      sx={{
        zIndex: 999999,
      }}
    >
      <Stack
        ref={popupRef}
        direction="column"
        alignItems={"baseline"}
        bgcolor={"white"}
        borderRadius={"4px"}
        sx={{
          boxShadow: "2px 2px 24px 0px #0000001A",
          border: "1px solid #ECECF3",
          borderRadius: "4px",
          position: "relative",
          bottom: "12px",
        }}
      >
        <Button
          onClick={() => setIsOpenLayoutSelect(true)}
          sx={{ ...sxBtnPopup }}
        >
          <LayoutIcon sx={sxIconPopup} /> Change layout
        </Button>
        <Button onClick={handleFullscreen} sx={{ ...sxBtnPopup }}>
          <MaximizeScreenIcon sx={sxIconPopup} />
          Fullscreen
        </Button>
        <Button onClick={handleMinimizeChat} sx={{ ...sxBtnPopup }}>
          <MinimizeScreenIcon sx={sxIconPopup} />
          Minimize chat
        </Button>
        <Button onClick={handleApplyVisual} sx={{ ...sxBtnPopup }}>
          <VisualEffectIcon sx={sxIconPopup} />
          Apply visual effects
        </Button>
        <Button onClick={handleSettings} sx={{ ...sxBtnPopup }}>
          <SettingsOutlineIcon sx={sxIconPopup} />
          Settings
        </Button>

        <Box
          sx={{
            position: "absolute",
            bottom: "0",
            left: "0",
            backgroundColor: "#fff",
            borderRadius: "4px",
            minWidth: "300px",
          }}
        >
          {isOpenLayoutSelect && (
            <LayoutSelect onBack={() => setIsOpenLayoutSelect(false)} />
          )}
        </Box>
      </Stack>
    </Popper>
  );
};

export default OptionPopup;

const sxBtnPopup = {
  color: "#666666",
  width: "100%",
  justifyContent: "flex-start",
  textTransform: "capitalize",
};

const sxIconPopup = {
  marginRight: "12px",
  fill: "none",
};
