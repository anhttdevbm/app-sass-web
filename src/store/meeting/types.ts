/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignalData } from "simple-peer";
export interface MeetResponse {
  data: MeetResponseData;
  type: string;
}

export interface MeetResponseData {
  event: string;
  user: MeetUser;
}

export interface MeetUser {
  avatar: string;
  fullname: string;
  id: string;
  position: string;
  username: string | null;
}

export const MEET_EVENT_TYPE = {
  JOIN: "join",
  SIGNAL: "signal",
  RETURN_SIGNAL: "return_signal",
  LEAVE: "leave",
  END: "end_meet",
  CANCLE: "canncel",
};

export interface MeetRoomInfo {
  created_at: string;
  host: HostInfo;
  id: string;
  room: RoomInfo;
  participants?: MeetUser[];
  status?: "started" | "end";
  event?: string;
}

export interface HostInfo {
  avatar: string;
  fullname: string;
  id: string;
  position: string;
  username: string;
}

export interface RoomInfo {
  id: string;
  members: string[];
  type: "p" | "g";
}

export const CallStatus = {
  ringing: "ringing",
  accepted: "accepted",
  rejected: "rejected",
  left: "left",
};

export const CallType = {
  DIRECT_CALL: "p",
  GROUP_CALL: "g",
};

export interface RemoteStream {
  participant: MeetUser;
  stream: MediaStream;
  streamState: LocalStreamState;
}

export interface WSPayload {
  event: "signal" | "return_signal";
  receive: MeetUser | null;
  send: MeetUser | null;
  signal: any;
}

export interface MeetDataEntryEvent {
  event: "join" | "leave";
  user: MeetUser;
}

export enum ParticipantStreamEvent {
  TOGGLE_CAMERA = "toggle_camera",
  TOGGLE_MIC = "toggle_mic",
  RAISE_HAND = "raise_hand",
  LOWER_HAND = "lower_hand",
}

export interface ParticipantAction {
  event: ParticipantStreamEvent;
  participantId: string;
  status: boolean;
}

export interface LocalStreamState {
  isCameraOn: boolean;
  isMicOn: boolean;
  isRaiseHand: boolean;
}

// Current structure only for text message
export interface MessageItem {
  sender: MeetUser;
  content: string;
  sended_at: string;
  type: "link" | "text";
}
