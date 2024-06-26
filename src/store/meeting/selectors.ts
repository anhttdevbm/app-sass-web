import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { setEndMeeting, setMeetingWsClient } from "./reducer";
import { cancelMeeting, endMeeting, startMeeting } from "./actions";
import { shallowEqual } from "react-redux";
import { useWSMeetingConnect } from "./meetingWs";

export const useMeeting = () => {
  const dispatch = useAppDispatch();
  const { meetingWsClient, isEndMeeting } = useAppSelector(
    (state) => state.meeting,
    shallowEqual,
  );
  

  const onSetMeetingWsClient = useCallback(
    async (ws) => {
      return dispatch(setMeetingWsClient(ws));
    },
    [dispatch],
  );

  const onStartMeeting = useCallback(
    async (roomId) => {
      
      // dispatch(setEndMeeting(false));
      await dispatch(startMeeting({ room: roomId }));
    },
    [dispatch],
  );

  const onCancelMeeting = useCallback(
    async (roomId) => {
      await dispatch(cancelMeeting({ meet: roomId }));
    },
    [dispatch],
  );

  const onEndMeeting = useCallback(
    async (roomId) => {
      dispatch(setEndMeeting(true));
      await dispatch(endMeeting({ room: roomId }));
    },
    [dispatch],
  );

  return {
    meetingWsClient,
    isEndMeeting,
    onSetMeetingWsClient,
    onStartMeeting,
    onCancelMeeting,
    onEndMeeting,
  };
};
