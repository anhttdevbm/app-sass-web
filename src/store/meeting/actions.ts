import { createAsyncThunk } from "@reduxjs/toolkit";
import { actionTypes } from "./types";
import { client } from "api";
import { MEETING_API_URL } from "constant/index";

export const setOpenRoom = (
  isUserRoomCreator = false,
  isUserInRoom = false,
) => {
  return {
    type: actionTypes.openRoom,
    payload: {
      isUserRoomCreator,
      isUserInRoom,
    },
  };
};

export const startMeeting = createAsyncThunk(
  "meeting/startMeeting",
  async (paramReq: { room: string }) => {
    const response = await client.post("meet/start", paramReq, {
      baseURL: MEETING_API_URL,
    });
  },
);

export const cancelMeeting = createAsyncThunk(
  "meeting/cancelMeeting",
  async (paramReq: { meet: string }) => {
    const response = await client.post("meet/cancel", paramReq, {
      baseURL: MEETING_API_URL,
    });
  },
);

export const endMeeting = createAsyncThunk(
  "meeting/endMeeting",
  async (paramReq: { room: string }) => {
    const response = await client.post("meet/end", paramReq, {
      baseURL: MEETING_API_URL,
    });
  },
);
