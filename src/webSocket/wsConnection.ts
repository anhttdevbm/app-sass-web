import { useCallback, useEffect } from "react";
import { MEET_EVENT_TYPE } from "../store/meeting/types";
import { useAuth } from "store/app/selectors";
import { useAppSelector } from "store/hooks";
import { getLocalStream, newPeerConnection } from "webSocket/webRTC";
import {
  setAudioOnly,
  setCallRequest,
  setOtherUserId,
  setRemoteStream,
} from "../store/meeting/reducer";
import { store } from "store/configureStore";

export const useWSMeeting = () => {
  const { user } = useAuth();
  const { meetingWsClient, audioOnly } = useAppSelector(
    (state) => state.meeting,
  );

  const handleJoin = () => {
    const peerConnection = () => {
      const peer = newPeerConnection(true);

      // currentPeerConnection = peer;

      peer.on("signal", (signal) => {
        meetingWsClient?.send(
          JSON.stringify({
            event: "signal",
            peer_id: user?.id,
            signal,
          }),
        );
      });

      peer.on("stream", (stream) => {
        store.dispatch(setRemoteStream(stream));
      });

      meetingWsClient!.onmessage = async (event) => {
        const response = JSON.parse(event.data);
        if (response.data.event === MEET_EVENT_TYPE.RETURN_SIGNAL) {
          store.dispatch(setOtherUserId(response.data.peer_id));
          peer.signal(response.data.signal);
        }
        if (response.data.event === MEET_EVENT_TYPE.END) {
          store.dispatch(setRemoteStream(null));
        }
      };
    };
    getLocalStream(audioOnly, () => {
      peerConnection();
      store.dispatch(setAudioOnly(audioOnly));
    });
  };

  const handleSignal = (callRequest) => {
    const peerConnection = () => {
      const peer = newPeerConnection(false);

      // currentPeerConnection = peer;

      peer.on("signal", (signal) => {
        meetingWsClient?.send(
          JSON.stringify({
            event: "return_signal",
            peer_id: user?.id,
            signal,
          }),
        );
      });

      peer.on("stream", (stream) => {
        store.dispatch(setRemoteStream(stream));
      });

      peer.signal(callRequest?.signal!);
    };

    getLocalStream(audioOnly, () => {
      peerConnection();
      store.dispatch(setCallRequest(null));
      store.dispatch(setAudioOnly(audioOnly));
    });
  };

  const handleEndMeet = () => {
    store.dispatch(setRemoteStream(null));
  };

  //connect meeting websocket
  const connectMeeting = useCallback(async (meetingWs: WebSocket | null) => {
    if (meetingWs) {
      meetingWs.onmessage = async (event) => {
        const resp = JSON.parse(event.data);
        console.info("meetWsResp", resp);
        const meetData = resp.data;

        if (meetData.peer_id === user?.id) return;

        switch (meetData.event) {
          case MEET_EVENT_TYPE.JOIN:
            handleJoin();
            break;
          case MEET_EVENT_TYPE.SIGNAL:
            handleSignal(meetData);
            break;
          case MEET_EVENT_TYPE.END:
            handleEndMeet();
            break;
          default:
            break;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (meetingWsClient) {
      connectMeeting(meetingWsClient);
    }
  }, [connectMeeting, meetingWsClient]);
};
