import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "api";
import { AxiosError } from "axios";
import { HttpStatusCode } from "constant/enums";
import { ACCESS_TOKEN_STORAGE_KEY, MEETING_API_URL } from "constant/index";
import { clientStorage } from "utils/storage";

export const startMeeting = createAsyncThunk(
  "meeting/startMeeting",
  async (paramReq: { room: string }, { dispatch, rejectWithValue }) => {
    const aT = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
    try {
      const response = await client.post("meet/start", paramReq, {
        baseURL: MEETING_API_URL,
      });
      // const meetingWs = new WebSocket(
      //   `${process.env.NEXT_APP_MEETING_WS_URL}/${response.data.id}?token=${aT}` ||
      //     "",
      // )
      return response.data;
      // meetWsClient: meetingWs,
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data["error"];
        return rejectWithValue(message);
      } else {
        throw error;
      }
    }
  },
);

export const getParticipants = createAsyncThunk(
  "meeting/getParticipants",
  async (paramReq: string, { rejectWithValue }) => {
    try {
      const response = await client.get(
        `meet/participants/${paramReq}`,
        {},
        {
          baseURL: MEETING_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data["error"];
        return rejectWithValue(message);
      } else {
        throw error;
      }
    }
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
