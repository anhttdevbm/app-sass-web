import { LayoutType } from "components/sn-meeting/type";
import { useCallback } from "react";
import { store } from "store/configureStore";
import { useAppDispatch } from "store/hooks";
import {
  cancelMeeting,
  endMeeting,
  getParticipants,
  startMeeting,
} from "./actions";
import {
  resetMeet,
  setCallRequest,
  setCallStatus,
  setEndMeeting,
  setMeetInfo,
  setMeetingLayout,
  setMeetingWsClient,
  setRemoteSignal,
  startConnecting,
  updateMessages,
} from "./reducer";
import { CallStatus, MeetRoomInfo, MessageItem } from "./types";

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
        ws?.close();
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

  const onSetMeetingLayout = useCallback(
    (layout: LayoutType) => {
      dispatch(setMeetingLayout(layout));
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
    onAddNewMessage,
    onUpdateMeetingStatus,
    onSetMeetingLayout,
  };
};
