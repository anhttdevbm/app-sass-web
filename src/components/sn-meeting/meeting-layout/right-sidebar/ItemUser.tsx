import { VideocamOff } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { IconButton, Text } from "components/shared";
import { sxBtnIconActive, sxBtnIconDanger } from "components/sn-meeting/style";
import { MicrophoneIcon } from "icons/MicrophoneIcon";
import { MicrophoneOffIcon } from "icons/MicrophoneOffIcon";
import { VideoIcon } from "icons/VideoIcon";
import { VideoSlashIcon } from "icons/VideoSlashIcon";
import React, { useState } from "react";
import { RemoteStream } from "store/meeting/types";

interface IProps {
  remoteStream: RemoteStream;
}

const ItemUser = ({ remoteStream }: IProps) => {
  const { isCameraOn, isMicOn, isRaiseHand } = remoteStream.streamState;
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Avatar
          size={32}
          src={remoteStream.participant.avatar}
          alt={remoteStream.participant.fullname}
        />
        <Text
          fontWeight={600}
          sx={{
            fontSize: "14px",
            color: "#000",
          }}
        >
          {remoteStream.participant.fullname}
        </Text>
      </Box>
      <Box>
        <Stack direction="row" alignItems="center">
          {isRaiseHand && (
            <IconButton
              sx={{
                width: "32px",
                height: "32px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  userSelect: "none",
                }}
              >
                ✋
              </Typography>
            </IconButton>
          )}
          <IconButton sx={isMicOn ? sxBtnIconActive : sxBtnIconDanger}>
            {isMicOn ? (
              <MicrophoneIcon
                sx={{
                  width: "16px",
                  height: "16px",
                }}
              />
            ) : (
              <MicrophoneOffIcon
                sx={{
                  width: "16px",
                  height: "16px",
                  fill: "#EB5757",
                  "& path": {
                    stroke: "#EB5757",
                  },
                }}
              />
            )}
          </IconButton>
          <IconButton sx={isCameraOn ? sxBtnIconActive : sxBtnIconDanger}>
            {isCameraOn ? (
              <VideoIcon
                sx={{
                  width: "16px",
                  height: "16px",
                  fill: "#2174EA",
                  "& path": {
                    stroke: "#2174EA",
                  },
                }}
              />
            ) : (
              <VideoSlashIcon
                sx={{
                  width: "16px",
                  height: "16px",
                }}
              />
            )}
          </IconButton>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ItemUser;
