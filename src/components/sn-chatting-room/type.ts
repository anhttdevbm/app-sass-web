import { DirectionChat } from "store/chat/type";
import { MobileScreen } from "./const";

export type MobileScreenType = `${MobileScreen}`;

export type HeaderMobileProps = {
  children?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  title?: string;
  backgroundColor?: string;
};


export interface ParamState {
  type: DirectionChat,
  text: string,
  offset: number,
  count: number
}

export interface ParamChatState extends Omit<ParamState, 'text'> {
  roomId: string
}
