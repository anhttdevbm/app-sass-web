"use client";
import { AddReaction } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import Picker, { EmojiClickData } from "emoji-picker-react";
import useTheme from "hooks/useTheme";
import { useState } from "react";
import { sxBtnCircleActiveDark, sxBtnCircleActiveLight } from "../style";
import { ParticipantAction, ParticipantStreamEvent } from "store/meeting/types";
import { useAuth } from "store/app/selectors";
import { WSParticipantActionPayload, WSParticipantActionType } from "../type";
import { useAppSelector } from "store/hooks";

export default function ReactionButton() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [isShow, setIsShow] = useState(false);
  const { meetingWsClient } = useAppSelector((state) => state.meeting);

  const onClickReaction = (e: EmojiClickData) => {
    const action: ParticipantAction = {
      event: ParticipantStreamEvent.REACTION,
      participantId: user?.id as string,
      status: e.unified,
    };
    const payload: WSParticipantActionPayload = {
      event: "signal",
      type: WSParticipantActionType.PARTICIPANT_ACTION,
      payload: action,
    };
    meetingWsClient?.send(JSON.stringify(payload));
    setIsShow(false);
  };

  return (
    <Box>
      <IconButton
        sx={isDarkMode ? sxBtnCircleActiveDark : sxBtnCircleActiveLight}
        onClick={() => setIsShow(!isShow)}
        style={{ width: "40px", height: "40px" }}
      >
        <AddReaction />
      </IconButton>
      <Picker
        open={isShow}
        onReactionClick={onClickReaction}
        reactionsDefaultOpen={true}
        allowExpandReactions={false}
        style={{
          zIndex: 1000,
          bottom: "80px",
          position: "fixed",
        }}
      />
    </Box>
  );
}
