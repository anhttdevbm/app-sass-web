import { useCallback } from "react";
import { useAppDispatch } from "store/hooks";
import {
  leaveRoom,
  resetMeet,
  setCallRequest,
  setCallStatus,
  setMeetInfo,
  setMeetingWsClient,
  setRemoteSignal,
  startConnecting,
} from "./reducer";
import {
  cancelMeeting,
  endMeeting,
  getParticipants,
  startMeeting,
} from "./actions";
import { CallStatus } from "./types";
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
    async (meetInfo) => {
      const { meetingWsClient: ws } = store.getState().meeting;
      await dispatch(getParticipants(meetInfo.id))
        .unwrap()
        .then((res) => {
          if (res.participants.length > 1) {
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
  };
};
