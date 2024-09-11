import { DirectionChat } from "store/chat/type";
import { MessageItem } from "store/meeting/types";

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

export enum WSMessageType {
  NEW_MESSAGE = "new_message",
}

export interface WSMessagePayload {
  event: "signal";
  type: WSMessageType;
  message: MessageItem;
}
