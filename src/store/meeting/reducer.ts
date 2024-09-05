// usersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LocalStreamState,
  MeetRoomInfo,
  MeetUser,
  ParticipantStreamEvent,
  RemoteStream,
} from "./types";
import {
  cancelMeeting,
  startReconnecting,
  getParticipants,
  startMeeting,
} from "./actions";

export interface MeetingState {
  isEstablishingConnection: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  meetingWsClient: WebSocket | null;
  meetInfo: MeetRoomInfo;
  audioOnly: boolean;
  otherUserId: string | null;
  participants: MeetUser[];
  isEndMeeting: boolean;
  callStatus: "ringing" | "accepted" | "rejected" | "left" | null;
  callRequest: any;
  // callRequest: {
  //   callerName: string;
  //   audioOnly: boolean;
  //   callerUserId: string;
  //   signal: SimplePeer.SignalData;
  // } | null;
  remoteSignal: any;
  peer: any;
  isLeaving: boolean;
  currentParticipants: MeetUser[];
  localStreamState: LocalStreamState;
}

const initialState: MeetingState = {
  isEstablishingConnection: false,
  localStream: null,
  remoteStream: null,
  remoteStreams: [],
  meetingWsClient: null,
  meetInfo: {} as MeetRoomInfo,
  audioOnly: false,
  otherUserId: null,
  participants: [],
  isEndMeeting: false,
  callStatus: null,
  callRequest: null,
  remoteSignal: null,
  peer: null,
  isLeaving: false,
  currentParticipants: [],
  localStreamState: {
    isCameraOn: false,
    isMicOn: false,
  },
};

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    // addUser(state, action: PayloadAction<User>) {
    //   state.push(action.payload);
    // },
    // removeUser(state, action: PayloadAction<string>) {
    //   return state.filter((user) => user.id !== action.payload);
    // },

    // toggleFeature(
    //   state,
    //   action: PayloadAction<{
    //     userId: string;D
    //       | "mic"
    //       | "camera"
    //       | "screenShare"
    //       | "subtitles"
    //       | "handRaised"
    //       | "screenRecord";
    //   }>,
    // ) {
    //   const { userId, feature } = action.payload;
    //   const user = state.find((user) => user.id === userId);
    //   if (user) {
    //     user[feature] = !user[feature];
    //   }
    // },
    // toggleMic(
    //   state,
    //   action: PayloadAction<{ userId: string; feature: "mic" }>,
    // ) {
    //   const { userId, feature } = action.payload;
    //   const user = state.find((user) => user.id === userId);
    //   if (user) {
    //     user[feature] = !user[feature];
    //     //function to handle mic actions
    //   }
    // },

    // toggleCamera(
    //   state,
    //   action: PayloadAction<{ userId: string; feature: "camera" }>,
    // ) {
    //   const { userId, feature } = action.payload;
    //   const user = state.find((user) => user.id === userId);
    //   if (user) {
    //     user[feature] = !user[feature];
    //     //function to handle camera actions
    //   }
    // },

    // toggleScreenShare(
    //   state,
    //   action: PayloadAction<{ userId: string; feature: "screenShare" }>,
    // ) {
    //   const { userId, feature } = action.payload;
    //   const user = state.find((user) => user.id === userId);
    //   if (user) {
    //     user[feature] = !user[feature];

    //     //function to handle screenShare actions
    //   }
    // },

    // toggleSubtitles(
    //   state,
    //   action: PayloadAction<{ userId: string; feature: "subtitles" }>,
    // ) {
    //   const { userId, feature } = action.payload;
    //   const user = state.find((user) => user.id === userId);
    //   if (user) {
    //     user[feature] = !user[feature];

    //     //function to handle subtitles actions
    //   }
    // },

    // toggleHandRaised(
    //   state,
    //   action: PayloadAction<{ userId: string; feature: "handRaised" }>,
    // ) {
    //   const { userId, feature } = action.payload;
    //   const user = state.find((user) => user.id === userId);
    //   if (user) {
    //     user[feature] = !user[feature];
    //     //function to handle handRaised actions
    //   }
    // },

    // toggleScreenRecord(
    //   state,
    //   action: PayloadAction<{ userId: string; feature: "screenRecord" }>,
    // ) {
    //   const { userId, feature } = action.payload;
    //   const user = state.find((user) => user.id === userId);
    //   if (user) {
    //     user[feature] = !user[feature];
    //     //function to handle screenRecord actions
    //   }
    // },
    startConnecting(state) {
      state.isEstablishingConnection = true;
    },
    setLocalStream(state, action) {
      state.localStream = action.payload;
    },
    setRemoteStream(state, action) {
      state.remoteStream = action.payload;
    },
    setRemoteStreams(state, action) {
      state.remoteStreams = [...state.remoteStreams, action.payload];
    },
    updateRemoteStream(state, action) {
      state.remoteStreams = action.payload;
    },
    setCurrentParticipants(state, action) {
      state.currentParticipants = action.payload;
    },
    setCallStatus(state, action) {
      state.callStatus = action.payload;
    },
    setCallRequest(state, action) {
      state.callRequest = action.payload;
    },
    setMeetingWsClient(state, action) {
      state.meetingWsClient = action.payload;
    },
    setEndMeeting(state, action) {
      state.isEndMeeting = action.payload;
    },
    setMeetInfo(state, action) {
      state.meetInfo = action.payload;
    },
    setRemoteSignal(state, action) {
      state.remoteSignal = action.payload;
    },
    setAudioOnly(state, action) {
      state.audioOnly = action.payload;
    },
    setOtherUserId(state, action) {
      state.otherUserId = action.payload;
    },
    setPeer(state, action) {
      state.peer = action.payload;
    },
    leaveRoom(state, action) {
      state.remoteStreams = state.remoteStreams.filter((stream) => {
        stream.participant !== action.payload.user.id;
      });
    },
    endMeet() {
      return initialState;
    },
    resetMeet() {
      return initialState;
    },
    setLocalStreamState(
      state,
      action: PayloadAction<{ isCameraOn: boolean; isMicOn: boolean }>,
    ) {
      state.localStreamState = action.payload;
    },
    updateRemoteStreamState(
      state,
      action: PayloadAction<{
        participantId: string;
        event: ParticipantStreamEvent;
        value: boolean;
      }>,
    ) {
      const { participantId, event, value } = action.payload;
      const remoteStream = state.remoteStreams.find(
        (stream) => stream.participant.id === participantId,
      );
      let field: keyof LocalStreamState | undefined = undefined;
      switch (event) {
        case ParticipantStreamEvent.TOGGLE_CAMERA:
          field = "isCameraOn";
          break;
        case ParticipantStreamEvent.TOGGLE_MIC:
          field = "isMicOn";
          break;
        default:
          break;
      }
      if (remoteStream && field) {
        remoteStream.streamState = {
          ...remoteStream.streamState,
          [field]: value,
        };
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(getParticipants.fulfilled, (state, action) => {
      state.currentParticipants = action.payload.participants.map((p) => p.id);
    });
    builder.addCase(startMeeting.fulfilled, (state, action) => {
      state.meetInfo = action.payload;
    });
    builder.addCase(cancelMeeting.fulfilled, (state) => {
      state = initialState;
    });
    builder.addCase(startReconnecting.fulfilled, (state, action) => {
      state.meetInfo = action.payload;
    });
  },
});

export const {
  startConnecting,
  setLocalStream,
  setRemoteStream,
  setRemoteStreams,
  updateRemoteStream,
  setCurrentParticipants,
  setCallStatus,
  setCallRequest,
  setMeetingWsClient,
  setEndMeeting,
  setMeetInfo,
  setRemoteSignal,
  setAudioOnly,
  setOtherUserId,
  leaveRoom,
  endMeet,
  resetMeet,
  setPeer,
  setLocalStreamState,
  updateRemoteStreamState,
} = meetingSlice.actions;

export default meetingSlice.reducer;
