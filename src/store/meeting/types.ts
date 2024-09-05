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
  streamState: {
    isCameraOn: boolean;
    isMicOn: boolean;
  };
}

export interface WSPayload {
  event: "signal" | "return_signal";
  receive: MeetUser;
  send: MeetUser;
  signal: any;
}

export interface MeetDataEntryEvent {
  event: "join" | "leave";
  user: MeetUser;
}

export enum ParticipantStreamEvent {
  TOGGLE_CAMERA = "toggle_camera",
  TOGGLE_MIC = "toggle_mic",
}

export interface ParticipantStreamEventPayload {
  event: ParticipantStreamEvent;
  participantId: string;
  status: boolean;
}

export interface LocalStreamState {
  isCameraOn: boolean;
  isMicOn: boolean;
}
