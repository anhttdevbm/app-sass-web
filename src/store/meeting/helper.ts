import { useCallback, useEffect } from "react";
import { useMeeting } from "./selectors";

export const useWSMeeting = () => {
  const { meetingWsClient } = useMeeting();

  //connect meeting websocket
  const connectMeeting = useCallback(async (meetingWs: WebSocket | null) => {
    if (meetingWs) {
      meetingWs.onmessage = async (event) => {
        const resp: unknown = JSON.parse(event.data);
        console.info("meetingResp", resp);
      };
    }
  }, []);

  useEffect(() => {
    if (meetingWsClient) {
      connectMeeting(meetingWsClient);
    }
  }, [connectMeeting, meetingWsClient]);
  return {
    connectMeeting,
  };
};
