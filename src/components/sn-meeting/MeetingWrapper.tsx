/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { client } from "api";
import Loading from "components/Loading";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { store } from "store/configureStore";
import { useAppSelector } from "store/hooks";
import {
  onRemoveParticipantStream,
  setCallRequest,
  setCurrentParticipants,
  setMeetingWsClient,
  setPeer,
  setRemoteStreams,
  updateRemoteStream,
  updateRemoteStreamState,
} from "store/meeting/reducer";
import { useMeeting } from "store/meeting/selectors";
import {
  MEET_EVENT_TYPE,
  MeetDataEntryEvent,
  MeetRoomInfo,
  MeetUser,
  MessageItem,
  ParticipantAction,
  RemoteStream,
  WSPayload,
} from "store/meeting/types";
import { clientStorage } from "utils/storage";
import { getLocalStream, newPeerConnection } from "webSocket/webRTC";
import MediaPermission from "./components/MediaPermission";
import MeetingEndedScreen from "./components/MeetingEndedScreen";
import MeetingLayout from "./meeting-layout/MeetingLayout";
import { WSParticipantActionType } from "./type";

export default function MeetingWrapper() {
  const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);

  const { remoteStreams, meetingWsClient, localStream, isEndMeeting } =
    useAppSelector((state) => state.meeting);
  const { user } = store.getState().app;
  const searchParams = useSearchParams();
  const { id } = useParams();
  const [isHasPermission, setIsHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    onStartMeeting,
    onSetMeetInfo,
    onAddNewMessage,
    onUpdateMeetingStatus,
    onResetMeet,
  } = useMeeting();

  const [isEnded, setIsEnded] = useState(false);

  const handleJoin = async (
    meetData: MeetDataEntryEvent,
    ws: WebSocket,
    meetId: string,
  ) => {
    const response = await client.get(
      `meet/participants/${meetId}`,
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

      peer.on("stream", (stream: MediaStream) => {
        const isCameraOn = stream.getVideoTracks()[0].enabled;
        const isMicOn = stream.getAudioTracks()[0].enabled;
        const remoteStream: RemoteStream = {
          participant: meetData.user,
          stream,
          streamState: {
            isCameraOn,
            isMicOn,
          },
        };
        store.dispatch(setRemoteStreams(remoteStream));
      });
    };

    getLocalStream(() => {
      peerConnection();
    });
  };

  const handleSignal = (meetData: WSPayload, callRequest, ws: WebSocket) => {
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

      peer.on("stream", (stream: MediaStream) => {
        const isCameraOn = stream.getVideoTracks()[0].enabled;
        const isMicOn = stream.getAudioTracks()[0].enabled;

        const remoteStream: RemoteStream = {
          participant: meetData.send as MeetUser,
          stream,
          streamState: {
            isCameraOn,
            isMicOn,
          },
        };

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
    store.dispatch(onRemoveParticipantStream(meetData.user.id));
  };

  const handleEndMeet = async () => {
    onUpdateMeetingStatus(true);
  };

  const handleNewMessage = async (message: MessageItem) => {
    onAddNewMessage(message);
  };

  const handleParticipantEvent = (payload: ParticipantAction) => {
    const { event, participantId, status } = payload;
    store.dispatch(
      updateRemoteStreamState({
        event: event,
        value: status,
        participantId: participantId,
      }),
    );
  };

  const handleConnectToWebSocket = (meetId: string) => {
    const ws = new WebSocket(
      `${process.env.NEXT_APP_MEETING_WS_URL}/${meetId}?token=${aT}`,
    );
    if (meetingWsClient) return;
    store.dispatch(setMeetingWsClient(ws));

    ws.onmessage = (event) => {
      const resp = JSON.parse(event.data);
      const meetData = resp.data;

      switch (meetData.event) {
        case MEET_EVENT_TYPE.JOIN:
          if (meetData.user.id === user?.id) return;
          handleJoin(meetData, ws, meetId);
          break;
        case MEET_EVENT_TYPE.SIGNAL:
          if (meetData?.type === WSParticipantActionType.NEW_MESSAGE) {
            handleNewMessage(meetData?.payload);
            return;
          }

          if (meetData?.type === WSParticipantActionType.PARTICIPANT_ACTION) {
            handleParticipantEvent(meetData?.payload);
          }

          if (meetData?.receive?.id !== user?.id) return;
          handleSignal(meetData, meetData, ws);
          break;
        case MEET_EVENT_TYPE.RETURN_SIGNAL:
          if (meetData?.receive?.id !== user?.id) return;
          handleReturnSignal(meetData);
          break;
        case MEET_EVENT_TYPE.LEAVE:
          if (meetData?.receive?.id === user?.id) return;
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
  };

  useEffect(() => {
    const handleGetMedia = async () => {
      try {
        const isAccess = await getLocalStream();
        setIsHasPermission(isAccess);
      } catch (e) {
        setIsHasPermission(false);
      }
      setIsLoading(false);
    };
    !localStream && handleGetMedia();
  }, []);

  useEffect(() => {
    const isJoining = searchParams.get("isJoining");
    if (isJoining && isHasPermission) {
      const meetInfoDecode = decodeURIComponent(
        searchParams.get("meetInfo") as string,
      );
      const meetInfo: MeetRoomInfo = JSON.parse(meetInfoDecode);
      onSetMeetInfo(meetInfo);
      handleConnectToWebSocket(meetInfo.id);
      return;
    }

    const startMeeting = async () => {
      if (!id) return;
      await onStartMeeting(id as string)
        .then(async (res) => {
          onSetMeetInfo(res.payload);
          handleConnectToWebSocket(res.payload.id);
        })
        .catch((e) => {
          console.log("err", e.message);
        });
    };
    isHasPermission && startMeeting();
  }, [isHasPermission]);

  useEffect(() => {
    const handleEndMeeting = async () => {
      setIsEnded(true);
      localStream?.getTracks().forEach((track) => track.stop());
      onResetMeet();
    };
    isEndMeeting && handleEndMeeting();
  }, [isEndMeeting]);

  if (isEnded) return <MeetingEndedScreen />;

  if (isLoading) return <Loading open />;

  return isHasPermission ? <MeetingLayout /> : <MediaPermission />;
}
