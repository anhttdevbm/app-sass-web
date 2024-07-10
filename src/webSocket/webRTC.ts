import { store } from "store/configureStore";
import { setLocalStream } from "../store/meeting/reducer";
import Peer from "simple-peer";

export const getLocalStream = (
  audioOnly: boolean,
  callback?: () => void,
  room?: boolean,
) => {
  const constraints = { audio: audioOnly, video: true };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));

      if (callback) {
        callback();
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("Error getting local stream");
    });
};

export const peerConfiguration = () => {
  const turnIceServers = null;

  if (turnIceServers) {
    // TODO use TURN server credentials
  } else {
    console.warn("Using only STUN server");
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
  }
};

export const newPeerConnection = (initiator: boolean) => {
  const stream = store.getState().meeting.localStream;

  if (!stream) {
    throw new Error("No local stream");
  }

  const configuration = peerConfiguration();
  const peer = new Peer({
    initiator: initiator,
    trickle: false,
    config: configuration,
    stream: stream,
  });

  return peer;
};

let peers: any = {};

export const prepareNewConnection = (
  connUserId: string,
  isInitiator: boolean,
  ws: WebSocket,
) => {
  const localStream = store.getState().meeting.localStream;

  peers[connUserId] = new Peer({
    initiator: isInitiator,
    config: peerConfiguration(),
    stream: localStream,
  });

  peers[connUserId].on("signal", (signal: Peer.SignalData) => {
    ws.send(
      JSON.stringify({
        event: "signal",
        connUserId,
        signal,
      }),
    );
  });
};

export const handleSignalingData = (meetData: {
  connUserId: string;
  signal: Peer.SignalData;
}) => {
  const { connUserId, signal } = meetData;
  if (peers[connUserId]) {
    peers[connUserId].signal(signal);
  }
};
