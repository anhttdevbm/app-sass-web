// usersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  avatar: string;
  //---------------values
  mic: boolean;
  camera: boolean;
  screenShare: boolean;
  subtitles: boolean;
  handRaised: boolean;
  screenRecord: boolean;
}

interface typeBooleanOfUser {
  mic: boolean;
  camera: boolean;
  screenShare: boolean;
  subtitles: boolean;
  handRaised: boolean;
}

type MeetingState = Array<User>

const initialState: MeetingState = [];

const meetingSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      state.push(action.payload);
    },
    removeUser(state, action: PayloadAction<string>) {
      return state.filter(user => user.id !== action.payload);
    },
    
    toggleFeature(state, action: PayloadAction<{ userId: string; feature: "mic" | "camera" | "screenShare" | "subtitles" | 'handRaised' | 'screenRecord'  }>) {
      const { userId, feature } = action.payload;
      const user = state.find(user => user.id === userId);
      if (user) {
        user[feature] = !user[feature];
      }
    },
    toggleMic(state, action: PayloadAction<{ userId: string; feature: "mic" }>) {
      const { userId, feature } = action.payload;
      const user = state.find(user => user.id === userId);
      if (user) {
        user[feature] = !user[feature];
        //function to handle mic actions
      }
    },

    toggleCamera(state, action: PayloadAction<{ userId: string; feature: "camera" }>) {
      const { userId, feature } = action.payload;
      const user = state.find(user => user.id === userId);
      if (user) {
        user[feature] = !user[feature];
        //function to handle camera actions
      }
    },

    toggleScreenShare(state, action: PayloadAction<{ userId: string; feature: "screenShare" }>) {
      const { userId, feature } = action.payload;
      const user = state.find(user => user.id === userId);
      if (user) {
        user[feature] = !user[feature];

        //function to handle screenShare actions
      }
    },

    toggleSubtitles(state, action: PayloadAction<{ userId: string; feature: "subtitles" }>) {
      const { userId, feature } = action.payload;
      const user = state.find(user => user.id === userId);
      if (user) {
        user[feature] = !user[feature];
        
        //function to handle subtitles actions
      }
    },

    toggleHandRaised(state, action: PayloadAction<{ userId: string; feature: "handRaised" }>) {
      const { userId, feature } = action.payload;
      const user = state.find(user => user.id === userId);
      if (user) {
        user[feature] = !user[feature];
        //function to handle handRaised actions
      }
    },

    toggleScreenRecord(state, action: PayloadAction<{ userId: string; feature: "screenRecord" }>) {
      const { userId, feature } = action.payload;
      const user = state.find(user => user.id === userId);
      if (user) {
        user[feature] = !user[feature];
        //function to handle screenRecord actions
      }
    },
  },
});

export const { addUser, removeUser, toggleFeature } = meetingSlice.actions;

export default meetingSlice.reducer;

const templateInit = [
  {
    id: '1',
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
    id: '2',
    name: "Hoang Thanh",
    avatar: "https://via.placeholder.com/150",
    //---------------values
    mic: true,
    camera: true,
    screenShare: false,
    subtitles: false,
    handRaised: false,
    screenRecord: false,
  }
  ,{
    id: '3',
    name: "Hoang Thanh",
    avatar: "https://via.placeholder.com/150",
    //---------------values
    mic: true,
    camera: true,
    screenShare: false,
    subtitles: false,
    handRaised: false,
    screenRecord: false,
  }
  ,{
    id: '4',
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
    id: '5',
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
    id: '6',
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
]