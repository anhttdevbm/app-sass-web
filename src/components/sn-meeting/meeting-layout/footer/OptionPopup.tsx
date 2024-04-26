import { Popup } from "@mui/base/Unstable_Popup/Popup";
import {
  Fullscreen,
  FullscreenExit,
  Minimize,
  Settings,
  SpaceDashboard,
} from "@mui/icons-material";
import { Box, Button, Popover, Popper, Stack } from "@mui/material";
import React from "react";

interface OptionPopupProps {
  sx: object;
  isShown: boolean;
  idPopup: string;
  anchorElP: HTMLButtonElement | null;
}

const OptionPopup: React.FC<OptionPopupProps> = (props: OptionPopupProps) => {
  const { sx, isShown,idPopup, anchorElP } = props;
  const handleChangeLayout = () => {
    console.log("Change Layout");
  };

  const handleFullscreen = () => {
    console.log("Fullscreen");
  };

  const handleMinimizeChat = () => {
    console.log("Minimize Chat");
  };

  const handleApplyVisual = () => {
    console.log("Apply Visual Effects");
  };

  const handleSettings = () => {
    console.log("Settings");
  };

  //----------------------------------------------------------------
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    anchorElP,
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  //----------------------------------------------------------------
  return (
    <Popper
      id={idPopup}
      open={isShown}
      anchorEl={anchorEl}
    >
      <Stack direction='column' alignItems={'baseline'} bgcolor={'white'} borderRadius={'4px'}>
        <Button onClick={handleChangeLayout} sx={{...sxBtnPopup}}>
          <SpaceDashboard sx={sxIconPopup} /> Change Layout
        </Button>
        <Button onClick={handleFullscreen} sx={{...sxBtnPopup}}>
          <Fullscreen sx={sxIconPopup} /> 
          Fullscreen
        </Button>
        <Button onClick={handleMinimizeChat} sx={{...sxBtnPopup}}>
          <FullscreenExit sx={sxIconPopup} /> 
          Minimize Chat
        </Button>
        <Button onClick={handleApplyVisual} sx={{...sxBtnPopup}}>
          <SpaceDashboard sx={sxIconPopup} /> 
          Apply Visual Effects
        </Button>
        <Button onClick={handleSettings} sx={{...sxBtnPopup}}>
          <Settings sx={sxIconPopup}/> 
          Settings
        </Button>
      </Stack>
    </Popper>
  );
};

export default OptionPopup;

const sxBtnPopup = {
    color: '#666666'
}

const sxIconPopup = {
    marginRight: '8px'
}
