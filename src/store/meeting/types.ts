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
  END: "end_meet",
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
  type: string;
}

export const CallStatus = {
  ringing: "ringing",
  accepted: "accepted",
  rejected: "rejected",
  left: "left",
};
