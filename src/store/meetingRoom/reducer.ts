import { createSlice } from "@reduxjs/toolkit";

export interface RoomState {
  isUserInRoom: boolean;
  isUserRoomCreator: boolean;
}

const initialState = {
  isUserInRoom: false,
  isUserRoomCreator: false,
};

const meetingRoomSlice = createSlice({
  name: "meetingRoom",
  initialState,
  reducers: {
    createNewRoom(state, action) {
      state.isUserRoomCreator = action.payload.isUserRoomCreator;
      state.isUserInRoom = action.payload.isUserInRoom;
    },
  },
});

export const { createNewRoom } = meetingRoomSlice.actions;

export default meetingRoomSlice.reducer;
