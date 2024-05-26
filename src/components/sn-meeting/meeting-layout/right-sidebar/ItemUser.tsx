import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  VideocamOutlined,
} from "@mui/icons-material";
import { Stack, Avatar, Box, Grid } from "@mui/material";
import { IconButton, Text } from "components/shared";
import { sxBtnIconActive, sxBtnIconDanger} from "components/sn-meeting/style";
import React, { useState } from "react";

interface User {
  id: string;
  avatar: string;
  name: string;
  isMicOn: boolean;
  isCameraOn: boolean;
}

interface ItemUserProps {
  user: User;
}

const ItemUser: React.FC<ItemUserProps> = (props: ItemUserProps) => {
  const { user } = props;
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  return (
    <Grid
      container
      key={user.id}
      direction={"row"}
      justifyContent={"space-between"}
      py={1}
    >
      <Grid item xs={2} alignItems={'center'} alignContent={'center'}>
        <Avatar src="public/images/avatar1.png" />
      </Grid>
      <Grid item xs={7}>
        <Text>{user.name}</Text>
      </Grid>
      <Grid item xs={3}>
        <Stack direction={"row"} gap={1}>
          <IconButton onClick={toggleMic} sx={isMicOn ? sxBtnIconActive : sxBtnIconDanger}>
            {isMicOn ? <Mic /> : <MicOff />}
          </IconButton>
          <IconButton onClick={toggleCamera} sx={isCameraOn ? sxBtnIconActive : sxBtnIconDanger}>
            {isCameraOn ? <Videocam /> : <VideocamOff />}
          </IconButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ItemUser;
