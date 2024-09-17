import { DirectionChat } from "store/chat/type";
import { MessageItem, ParticipantAction } from "store/meeting/types";

export type HeaderMobileProps = {
  children?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  title?: string;
  backgroundColor?: string;
};

export interface ParamState {
  type: DirectionChat;
  text: string;
  offset: number;
  count: number;
}

export interface ParamChatState extends Omit<ParamState, "text"> {
  roomId: string;
}

export enum WSParticipantActionType {
  NEW_MESSAGE = "message.created",
  PARTICIPANT_ACTION = "participant.action",
  INIT_STREAM_STATE = "stream.initState",
}

export interface WSParticipantActionBase {
  event: "signal";
}

export interface WSParticipantActionNewMessage extends WSParticipantActionBase {
  type: WSParticipantActionType.NEW_MESSAGE;
  payload: MessageItem;
}

export interface WSParticipantAction extends WSParticipantActionBase {
  type: WSParticipantActionType.PARTICIPANT_ACTION;
  payload: ParticipantAction;
}

export type WSParticipantActionPayload =
  | WSParticipantActionNewMessage
  | WSParticipantAction;

export enum LayoutType {
  GALARY = "galary",
  SPEAKER = "speaker",
  FOCUS_ON_CONTENT = "focus_on_content",
}
