import { Middleware } from "@reduxjs/toolkit";
import { ACCESS_TOKEN_STORAGE_KEY, MEETING_API_URL } from "constant/index";
import { clientStorage } from "utils/storage";
import { MEET_EVENT_TYPE } from "./types";
import { getLocalStream, newPeerConnection } from "webSocket/webRTC";
import {
  endMeet,
  setAudioOnly,
  setCallRequest,
  setCurrentParticipants,
  setMeetingWsClient,
  setPeer,
  setRemoteStreams,
  updateRemoteStream,
} from "./reducer";
import { client } from "api";

export const meetingMiddleware: Middleware = (store) => (next) => (action) => {
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
  const { meetInfo, audioOnly } = store.getState().meeting;
  const { user } = store.getState().app;

  const handleJoin = async (meetData, ws: WebSocket) => {
    console.log("direct call");

    const response = await client.get(
      `meet/participants/${meetInfo.id}`,
      {},
      {
        baseURL: MEETING_API_URL,
      },
    );

    const cp = response.data.participants.map((p) => p.id);
    store.dispatch(setCurrentParticipants(cp));

    const peerConnection = () => {
      const peer = newPeerConnection(true);
      store.dispatch(setPeer(peer));

      // currentPeerConnection = peer;

      peer.on("signal", (signal) => {
        ws?.send(
          JSON.stringify({
            event: "signal",
            receive: meetData.user.id,
            send: user?.id,
            signal,
          }),
        );
      });

      peer.on("stream", (stream) => {
        const remoteStream = {
          participant: meetData.user.id,
          stream,
        };
        store.dispatch(setRemoteStreams(remoteStream));
      });
    };

    getLocalStream(audioOnly, () => {
      peerConnection();
      store.dispatch(setAudioOnly(audioOnly));
    });
  };

  const handleSignal = (meetData, callRequest, ws: WebSocket) => {
    // const { currentParticipants } = store.getState().meeting;
    // console.log("send currentParticipants", currentParticipants);
    // if (currentParticipants.includes(user?.id)) return;

    const peerConnection = () => {
      const peer = newPeerConnection(false);

      // currentPeerConnection = peer;

      console.log("send return signal");

      peer.on("signal", (signal) => {
        ws?.send(
          JSON.stringify({
            event: "return_signal",
            receive: meetData.send,
            send: user?.id,
            signal,
          }),
        );
      });

      peer.on("stream", (stream) => {
        const remoteStream = {
          participant: meetData.peer_id,
          stream,
        };
        store.dispatch(setRemoteStreams(remoteStream));
      });

      peer.signal(callRequest?.signal!);
    };

    getLocalStream(audioOnly, () => {
      peerConnection();
      store.dispatch(setCallRequest(null));
      store.dispatch(setAudioOnly(audioOnly));
    });
  };

  const handleReturnSignal = (meetData) => {
    const peer = store.getState().meeting.peer;
    peer[meetData.send].signal(meetData.signal);
  };

  const handleLeave = (meetData) => {
    const { remoteStreams } = store.getState().meeting;
    console.log("md remoteStreams", remoteStreams);

    const newRemoteStreams = remoteStreams.filter(
      (stream) => stream.participant !== meetData.user.id,
    );
    console.log("md newRemoteStreams", newRemoteStreams);

    store.dispatch(updateRemoteStream(newRemoteStreams));
  };

  const handleEndMeet = () => {
    store.dispatch(endMeet());
  };

  try {
    if (
      action.type === "meeting/startConnecting" ||
      action.type === "meeting/startMeeting/fulfilled"
    ) {
      if (!meetInfo.id) return;
      const ws = new WebSocket(
        `${process.env.NEXT_APP_MEETING_WS_URL}/${meetInfo.id}?token=${aT}`,
      );
      store.dispatch(setMeetingWsClient(ws));

      ws.onmessage = (event) => {
        const resp = JSON.parse(event.data);
        const meetData = resp.data;

        switch (meetData.event) {
          case MEET_EVENT_TYPE.JOIN:
            if (meetData.user.id === user?.id) return;
            handleJoin(meetData, ws);
            break;
          case MEET_EVENT_TYPE.SIGNAL:
            if (meetData.receive !== user?.id) return;
            handleSignal(meetData, meetData, ws);
            break;
          case MEET_EVENT_TYPE.RETURN_SIGNAL:
            if (meetData.receive !== user?.id) return;
            handleReturnSignal(meetData);
            break;
          case MEET_EVENT_TYPE.LEAVE:
            handleLeave(meetData);
            break;
          case MEET_EVENT_TYPE.END:
            handleEndMeet();
            break;
          default:
            break;
        }
      };
    }
    return next(action);
  } catch (e) {
    console.log(e);
  }
};
