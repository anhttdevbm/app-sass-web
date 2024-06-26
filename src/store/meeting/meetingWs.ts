import { useAuth } from "store/app/selectors";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { useEffect } from "react";
import { clientStorage } from "utils/storage";
import { CHAT_EVENT_TYPE } from "store/chat/type";
import { useChat } from "store/chat/selectors";
import { useMeeting } from "./selectors";

export const useWSMeetingConnect = (roomId) => {
  const { user } = useAuth();
  const { onSetMeetingWsClient } = useMeeting();
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);

  const connectSocket = () => {
    const meetingWsClient = new WebSocket(
      `${process.env.NEXT_APP_MEETING_WS_URL}/${roomId}?token=${aT}` || "",
    );

    meetingWsClient.onopen = () => {
      onSetMeetingWsClient(meetingWsClient);
    };

    meetingWsClient.onerror = () => meetingWsClient.close();

    meetingWsClient.onclose = () => {
      setTimeout(() => {
        connectSocket();
      }, 3000);
    };
  };

  useEffect(() => {
    if (user && aT) connectSocket();
  }, [user, aT]);

  return { connectSocket };
};
