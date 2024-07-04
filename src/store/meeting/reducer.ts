// usersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MeetRoomInfo, MeetUser } from "./types";
import { cancelMeeting, getParticipants, startMeeting } from "./actions";
import SimplePeer from "simple-peer";

export interface MeetingState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  meetingWsClient: WebSocket | null;
  roomInfo: MeetRoomInfo;
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
}

const initialState: MeetingState = {
  localStream: null,
  remoteStream: null,
  meetingWsClient: null,
  roomInfo: {} as MeetRoomInfo,
  audioOnly: false,
  otherUserId: null,
  participants: [],
  isEndMeeting: false,
  callStatus: null,
  callRequest: null,
  remoteSignal: null,
};

const meetingSlice = createSlice({
  name: "meetings",
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
    setLocalStream(state, action) {
      state.localStream = action.payload;
    },
    setRemoteStream(state, action) {
      state.remoteStream = action.payload;
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
    setRoomInfo(state, action) {
      state.roomInfo = action.payload;
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
    resetMeetState() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder.addCase(getParticipants.fulfilled, (state, action) => {
      const host = state.roomInfo.host.id;

      state.participants =
        action.payload.participants === host ? "" : action.payload.participants;
    });
    builder.addCase(startMeeting.fulfilled, (state, action) => {
      state.roomInfo = action.payload.meetInfo;
      state.meetingWsClient = action.payload.meetWsClient;
    });
    builder.addCase(cancelMeeting.fulfilled, (state) => {
      state = initialState;
    });
  },
});

export const {
  setLocalStream,
  setRemoteStream,
  setCallStatus,
  setCallRequest,
  setMeetingWsClient,
  setEndMeeting,
  resetMeetState,
  setRoomInfo,
  setRemoteSignal,
  setAudioOnly,
  setOtherUserId,
} = meetingSlice.actions;

export default meetingSlice.reducer;

const templateInit = [
  {
    id: "1",
    name: "Hoang Thanh",
    avatar: "https://via.placeholder.com/150",
    //---------------values
    mic: true,
    camera: true,
    screenShare: false,
    subtitles: false,
    handRaised: false,
    screenRecord: false,
  },
  {
    id: "2",
    name: "Hoang Thanh",
    avatar: "https://via.placeholder.com/150",
    //---------------values
    mic: true,
    camera: true,
    screenShare: false,
    subtitles: false,
    handRaised: false,
    screenRecord: false,
  },
  {
    id: "3",
    name: "Hoang Thanh",
    avatar: "https://via.placeholder.com/150",
    //---------------values
    mic: true,
    camera: true,
    screenShare: false,
    subtitles: false,
    handRaised: false,
    screenRecord: false,
  },
  {
    id: "4",
    name: "Hoang Thanh",
    avatar: "https://via.placeholder.com/150",
    //---------------values
    mic: true,
    camera: true,
    screenShare: false,
    subtitles: false,
    handRaised: false,
    screenRecord: false,
  },
  {
    id: "5",
    name: "Hoang Thanh",
    avatar: "https://via.placeholder.com/150",
    //---------------values
    mic: true,
    camera: true,
    screenShare: false,
    subtitles: false,
    handRaised: false,
    screenRecord: false,
  },
  {
    id: "6",
    name: "Hoang Thanh",
    avatar: "https://via.placeholder.com/150",
    //---------------values
    mic: true,
    camera: true,
    screenShare: false,
    subtitles: false,
    handRaised: false,
    screenRecord: false,
  },
];
