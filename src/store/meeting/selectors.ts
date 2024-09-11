import { useCallback } from "react";
import { useAppDispatch } from "store/hooks";
import {
  endMeet,
  leaveRoom,
  resetMeet,
  setCallRequest,
  setCallStatus,
  setEndMeeting,
  setMeetInfo,
  setMeetingWsClient,
  setRemoteSignal,
  startConnecting,
  updateMessages,
} from "./reducer";
import {
  cancelMeeting,
  endMeeting,
  getParticipants,
  startMeeting,
  startReconnecting,
} from "./actions";
import { CallStatus, MeetRoomInfo, MessageItem } from "./types";
import { store } from "store/configureStore";

export const useMeeting = () => {
  const dispatch = useAppDispatch();

  const onSetMeetingWsClient = useCallback(
    async (ws) => {
      return dispatch(setMeetingWsClient(ws));
    },
    [dispatch],
  );

  const onSetMeetInfo = useCallback(
    async (meetInfo) => {
      return dispatch(setMeetInfo(meetInfo));
    },
    [dispatch],
  );

  const onSetCallRequest = useCallback(
    async (data) => {
      return dispatch(setCallRequest(data));
    },
    [dispatch],
  );

  const updateCallStatus = (status) => {
    return dispatch(setCallStatus(status));
  };

  const onStartMeeting = useCallback(
    async (room) => {
      return await dispatch(startMeeting({ room }));
    },
    [dispatch],
  );

  const getAllParticipants = useCallback(
    async (meet) => {
      await dispatch(getParticipants(meet));
    },
    [dispatch],
  );

  const onAcceptCall = useCallback(
    async (meet) => {
      dispatch(startConnecting());
      // await dispatch(getParticipants(meet));
      return updateCallStatus(CallStatus.accepted);
    },
    [dispatch],
  );

  const onRejectCall = useCallback(
    async (roomId) => {
      updateCallStatus(CallStatus.rejected);
      return await dispatch(cancelMeeting({ meet: roomId }));
    },
    [dispatch],
  );

  const onEndMeeting = useCallback(
    async (roomId) => {
      return await dispatch(endMeeting({ room: roomId }));
    },
    [dispatch],
  );

  const onSetRemoteSignal = useCallback(
    async (signal) => {
      return dispatch(setRemoteSignal(signal));
    },
    [dispatch],
  );

  const onLeaveMeeting = useCallback(
    async (meetInfo: MeetRoomInfo) => {
      const { meetingWsClient: ws } = store.getState().meeting;

      // 1-1 call
      if (meetInfo.room?.type === "p") {
        onEndMeeting(meetInfo.room.id);
        return;
      }
      await dispatch(getParticipants(meetInfo.id))
        .unwrap()
        .then((res) => {
          // Group call
          if (meetInfo.room.id && res.participants.length > 1) {
            ws?.close();
            onResetMeet();
          } else {
            onEndMeeting(meetInfo.room.id);
          }
        });
    },
    [dispatch],
  );

  const onResetMeet = useCallback(async () => {
    dispatch(resetMeet());
  }, [dispatch]);

  const onGetMeetRoom = useCallback(
    async (roomId: string) => {
      const res = await dispatch(startReconnecting(roomId)).unwrap();
      onSetMeetInfo(res);
    },
    [dispatch],
  );

  const onAddNewMessage = useCallback(
    (message: MessageItem) => {
      dispatch(updateMessages(message));
    },
    [dispatch],
  );

  const onUpdateMeetingStatus = useCallback(
    (isEnding: boolean) => {
      dispatch(setEndMeeting(isEnding));
    },
    [dispatch],
  );

  return {
    onSetMeetingWsClient,
    onEndMeeting,
    getAllParticipants,
    onSetMeetInfo,
    onAcceptCall,
    updateCallStatus,
    onStartMeeting,
    onSetCallRequest,
    onSetRemoteSignal,
    onRejectCall,
    onLeaveMeeting,
    onResetMeet,
    onGetMeetRoom,
    onAddNewMessage,
    onUpdateMeetingStatus,
  };
};
