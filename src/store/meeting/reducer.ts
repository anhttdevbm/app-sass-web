// usersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MeetingState {
  meetingWsClient: WebSocket | null;
  isEndMeeting: boolean;
}

const initialState: MeetingState = {
  meetingWsClient: null,
  isEndMeeting: false,
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

    setMeetingWsClient(state, action) {
      state.meetingWsClient = action.payload;
    },
    setEndMeeting(state, action) {
      state.isEndMeeting = action.payload;
    },
  },
});

export const { setMeetingWsClient, setEndMeeting } = meetingSlice.actions;

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
