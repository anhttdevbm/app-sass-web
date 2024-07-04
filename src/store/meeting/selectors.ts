import { useCallback } from "react";
import { useAppDispatch } from "store/hooks";
import {
  setCallRequest,
  setCallStatus,
  setMeetingWsClient,
  setRemoteSignal,
  setRoomInfo,
} from "./reducer";
import {
  cancelMeeting,
  endMeeting,
  getParticipants,
  startMeeting,
} from "./actions";
import { clientStorage } from "utils/storage";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { CallStatus } from "./types";

export const useMeeting = () => {
  const dispatch = useAppDispatch();
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);

  const onSetMeetingWsClient = useCallback(
    async (ws) => {
      return dispatch(setMeetingWsClient(ws));
    },
    [dispatch],
  );

  const onConnectWebsocket = async (room: string) => {
    if (room) {
      const meetingWs = new WebSocket(
        `${process.env.NEXT_APP_MEETING_WS_URL}/${room}?token=${aT}` || "",
      );
      onSetMeetingWsClient(meetingWs);
    }
  };

  const onSetRoomInfo = useCallback(
    async (roomInfo) => {
      return dispatch(setRoomInfo(roomInfo));
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
    async (room) => {
      await onConnectWebsocket(room);
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

  return {
    onSetMeetingWsClient,
    onEndMeeting,
    getAllParticipants,
    onSetRoomInfo,
    onAcceptCall,
    updateCallStatus,
    onStartMeeting,
    onSetCallRequest,
    onSetRemoteSignal,
    onRejectCall,
  };
};
