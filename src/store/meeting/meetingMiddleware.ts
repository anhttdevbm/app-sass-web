import { Middleware } from "@reduxjs/toolkit";
import { client } from "api";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { clientStorage } from "utils/storage";
import { getLocalStream, newPeerConnection } from "webSocket/webRTC";
import {
  MeetingState,
  setCallRequest,
  setCurrentParticipants,
  setEndMeeting,
  setMeetingWsClient,
  setPeer,
  setRemoteStreams,
  updateRemoteStream,
  updateRemoteStreamState,
} from "./reducer";
import {
  MEET_EVENT_TYPE,
  MeetDataEntryEvent,
  MeetUser,
  ParticipantStreamEventPayload,
  RemoteStream,
  WSPayload,
} from "./types";

export const meetingMiddleware: Middleware = (store) => (next) => (action) => {
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
  const { meetInfo, remoteStreams, meetingWsClient, localStream } =
    store.getState().meeting as MeetingState;
  const { user } = store.getState().app;

  const handleJoin = async (meetData: MeetDataEntryEvent, ws: WebSocket) => {
    const response = await client.get(
      `meet/participants/${meetInfo.id}`,
      undefined,
      {
        baseURL: process.env.MEETING_API_URL,
      },
    );

    const cp = response.data.participants.map((p) => p.id);
    const sender = response.data.participants.filter(
      (p: MeetUser) => p.id === user?.id,
    )[0];

    store.dispatch(setCurrentParticipants(cp));

    const peerConnection = () => {
      const peer = newPeerConnection(true);
      store.dispatch(setPeer(peer));
      peer.on("signal", (signal: any) => {
        const wsPayload: WSPayload = {
          event: "signal",
          receive: meetData.user,
          send: sender,
          signal,
        };
        ws?.send(JSON.stringify(wsPayload));
      });

      peer.on("stream", (stream) => {
        const remoteStream: RemoteStream = {
          participant: meetData.user,
          stream,
          streamState: {
            isCameraOn: true,
            isMicOn: true,
          },
        };
        store.dispatch(setRemoteStreams(remoteStream));
      });

      peer.on("data", (data: string) => {
        const message: ParticipantStreamEventPayload = JSON.parse(data);
        store.dispatch(
          updateRemoteStreamState({
            event: message.event,
            value: message.status,
            participantId: message.participantId,
          }),
        );
      });
    };

    getLocalStream(() => {
      peerConnection();
    });
  };

  const handleSignal = (meetData: WSPayload, callRequest, ws: WebSocket) => {
    // const { currentParticipants } = store.getState().meeting;
    // console.log("send currentParticipants", currentParticipants);
    // if (currentParticipants.includes(user?.id)) return;

    const peerConnection = () => {
      const peer = newPeerConnection(false);
      store.dispatch(setPeer(peer));

      peer.on("signal", (signal: any) => {
        const wsPayload: WSPayload = {
          event: "return_signal",
          receive: meetData.send,
          send: meetData.receive,
          signal,
        };
        ws?.send(JSON.stringify(wsPayload));
      });

      peer.on("stream", (stream) => {
        const remoteStream: RemoteStream = {
          participant: meetData.send,
          stream,
          streamState: {
            isCameraOn: true,
            isMicOn: true,
          },
        };

        peer.on("data", (data) => {
          const message: ParticipantStreamEventPayload = JSON.parse(data);
          store.dispatch(
            updateRemoteStreamState({
              event: message.event,
              value: message.status,
              participantId: message.participantId,
            }),
          );
        });

        store.dispatch(setRemoteStreams(remoteStream));
      });

      peer.signal(callRequest?.signal!);
    };

    getLocalStream(() => {
      peerConnection();
      store.dispatch(setCallRequest(null));
    });
  };

  const handleReturnSignal = (meetData: WSPayload) => {
    const peer = store.getState().meeting.peer;

    peer?.signal(meetData.signal);
  };

  const handleLeave = (meetData: MeetDataEntryEvent) => {
    const newRemoteStreams = remoteStreams.filter(
      (stream) => stream.participant.id !== meetData.user.id,
    );

    store.dispatch(updateRemoteStream(newRemoteStreams));
  };

  const handleEndMeet = async () => {
    store.dispatch(setEndMeeting(true));
  };
  try {
    if (
      action.type === "meeting/startConnecting" ||
      action.type === "meeting/startMeeting/fulfilled"
    ) {
      if (!localStream) getLocalStream();
      if (meetInfo.id) {
        const ws = new WebSocket(
          `${process.env.NEXT_APP_MEETING_WS_URL}/${meetInfo.id}?token=${aT}`,
        );
        if (meetingWsClient) return next(action);
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
              if (meetData.receive.id !== user?.id) return;
              handleSignal(meetData, meetData, ws);
              break;
            case MEET_EVENT_TYPE.RETURN_SIGNAL:
              if (meetData.receive.id !== user?.id) return;
              handleReturnSignal(meetData);
              break;
            case MEET_EVENT_TYPE.LEAVE:
              handleLeave(meetData);
              break;
            case MEET_EVENT_TYPE.END:
              handleEndMeet();
              break;
            case MEET_EVENT_TYPE.CANCLE:
              handleEndMeet();
              break;
            default:
              break;
          }
        };
      }
    }
    return next(action);
  } catch (e) {
    console.log(e);
  }
};
