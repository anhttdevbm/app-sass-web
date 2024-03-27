/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStatus } from "constant/enums";
import { Paging } from "constant/types";
import {
  Attachment,
  ChatLinkType,
  MediaType,
  TypeMedia,
} from "./media/typeMedia";

export type IChatItemInfo = IChatInfo & IChatGroup & IChatDirect;
export interface IChatInfo {
  status: string;
  username: string;
  usernames: any;
  _id: string;
  _updatedAt: string;
  name: string;
  t: string;
  msgs: number;
  usersCount: number;
  ts: string;
  ro: boolean;
  default: boolean;
  sysMes: boolean;
  avatar: string;
  unreadCount: number;
  unreadsFrom: string;
}

export interface IChatGroup {
  fname: string;
  customFields: unknown;
  u: UserSendInfo;
  lm: string;
  lastMessage: MessageInfo;
}

export interface IChatDirect {
  active: boolean;
  nameInsensitive: string;
  status: string;
  statuses: { username: string; status: string }[];
  type: string;
  lm: string;
  username: string;
  usernames: string[];
  lastMessage: MessageInfo;
  uids: string[];
}

export interface UserOnlinePage {
  active: boolean;
  name: string;
  nameInsensitive: string;
  status: string;
  type: string;
  username: string;
  _id: string;
  avatar: string;
}

export interface Url {
  url: string;
  meta: Meta;
  headers: Headers;
  parsedUrl: ParsedURL;
}

export interface Headers {
  contentType: string;
}

export interface Meta {
  pageTitle: string;
  ogImage: string;
  twitterCard: string;
  ogTitle: string;
  twitterSite: string;
}

export interface ParsedURL {
  host: string;
  hash: null;
  pathname: string;
  protocol: string;
  port: null;
  query: null;
  search: null;
  hostname: string;
}

export interface MessageInfo {
  t: string;
  _id: string;
  alias: string;
  msg: string;
  attachments: Attachment[];
  parseUrls: boolean;
  groupable: boolean;
  ts: string | Date;
  u: UserSendInfo;
  rid: string;
  _updatedAt: string;
  urls?: Url[];
  mentions: unknown[];
  channels: unknown[];
  md?: unknown[];
}

export interface UserOnlinePage {
  active: boolean;
  name: string;
  nameInsensitive: string;
  status: string;
  type: string;
  username: string;
  _id: string;
}

export interface MessengerInfo {
  msg: string;
  ts: string;
  u: UserSendInfo | null;
  _id: string;
  rid: string;
  _updatedAt: string;
  alias: string;
  attachments: Attachment[];
  parseUrls: false;
  groupable: false;
  mentions: [];
  channels: [];
}

export interface UserSendInfo {
  _id: string;
  username: string;
  name: string;
}

export interface ChatGroup {
  _id: string;
  fname: string;
  name: string;
  usersCount: number;
}

export interface SetStepAction<T> {
  step: STEP;
  dataTransfer?: T;
}

export interface MediaPreviewItem {
  link: string;
  name: string;
  object: string;
  ts: string;
  type: TypeMedia;
}

export interface ChatState {
  convention: IChatItemInfo[];
  mediaListConversation: MediaPreviewItem[];
  conversationStatus: DataStatus;
  detailConversationStatus: DataStatus;
  conversationPaging: Paging & {
    isReloadPageCurrent?: boolean;
    textSearch: string;
  };
  conversationInfo: IChatItemInfo | null;
  roomId: string;

  currStep: STEP;
  prevStep: STEP;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataTransfer?: any;
  messageInfo: MessageInfo[];
  messageStatus: DataStatus;
  messagePaging: Paging & { isRefetchPage?: boolean; pageSizeDefault: number };
  //partner info
  partnerInfo: UserInfo | null;
  partnerInfoStatus: DataStatus;
  //chat links
  chatLinks: ChatLinkType[];
  chatLinksStatus: DataStatus;
  //ListSearchConversation
  listSearchMessage: MessageSearchInfo[];
  statusListSearchMessage: DataStatus;
  //media list
  mediaList: MediaType[];
  mediaListStatus: DataStatus;
  //sendMessage state
  stateSendMessage: {
    filePreview?: File | File[] | null;
    status: DataStatus;
  };
  stateSearchMessage: MessageSearchInfo | null;
  unReadMessage: UnReadMessageInfo | null;
  //UnReadMessage
  statusUnReadMessage: DataStatus;

  newGroupData: ChatGroup | {};
  createGroupStatus: DataStatus;
  addMembers2GroupStatus: DataStatus;
  leftGroupStatus: DataStatus;
  removeMemberGroupStatus: DataStatus;
  typeList: TYPE_LIST;
  groupMembers: any[];
  chatAttachments: any;
  deleteConversationStatus: DataStatus;
  paramsConversation: ChatRequestCommon | {};
  paramsLastMessage: LastMessagesRequest | {};
  paramsUnreadMessage: UnReadMessageRequest | {};
  typeDrawerChat: TypeDrawerChat;
  isOpenInfoChat: boolean;
  isChatDesktop: boolean;
  selectSearchIndex: number;
}

export type TypeDrawerChat =
  | "group"
  | "forward"
  | "media"
  | "file"
  | "link"
  | "info"
  | "account"
  | "group-modal";
export type DirectionChat = "a" | "c" | "d";

export type TypeParamsChat =
  | "paramsConversation"
  | "paramsLastMessage"
  | "paramsUnreadMessage";

export interface AuthenRequestCommon {
  authToken: string;
  userId: string;
}
export interface ChatRequestCommon extends AuthenRequestCommon {
  type: DirectionChat;
  count?: number;
  offset?: number;
}
export interface ChatConventionItemRequest extends ChatRequestCommon {
  text: string;
  company?: string;
}

export interface LastMessagesRequest extends ChatRequestCommon {
  roomId: string;
}

export interface CreateGroupRequest extends ChatRequestCommon {
  groupName: string;
  members: string[];
}

export interface AddMember2GroupRequest extends AuthenRequestCommon {
  roomId: string;
  userId_to_add: string;
}

export interface LeftGroupRequest extends AuthenRequestCommon {
  roomId: string;
}

export interface RenameGroupRequest extends AuthenRequestCommon {
  roomId: string;
  name: string;
}

export interface FetchGroupMemberRequest extends AuthenRequestCommon {
  roomId: string;
}

export interface RemoveGroupMemberRequest extends AuthenRequestCommon {
  roomId: string;
  userId_to_remove: string;
}

export interface DeleteConversationGroup extends AuthenRequestCommon {
  roomId: string;
  type: string;
}

export interface ForwardMessageGroup extends AuthenRequestCommon {
  roomId: string;
  messageId: string;
}

export interface ChangeGroupAvatar extends AuthenRequestCommon {
  roomId: string;
  avatarUrl: string;
}

export type RoomType = "c" | "d" | "p";
export interface ChatAttachmentsRequest extends AuthenRequestCommon {
  roomId?: string;
  fileType?: "media" | "file" | "link";
  roomType?: RoomType;
}

export interface ChangeRoleRequest extends AuthenRequestCommon {
  groupId: string;
  userIdToChange: string;
  newRole:
    | "addOwner"
    | "removeOwner"
    | "addModerator"
    | "removeModerator"
    | "addLeader"
    | "removeLeader";
}

export interface RemoveMemberRequest extends AuthenRequestCommon {
  groupId: string;
  userIdToKick: string;
}

export interface Avatar {
  object: string;
  name: string;
  link: string;
}

export interface Position {
  id: string;
  name: string;
}
export interface UserInfo {
  company: string;
  department: string;
  email: string;
  fullname: string;
  id: string;
  is_active: true;
  phone: string;
  position: Position;
  date_end_using: string;
  date_start_using: string;
  approve: true;
  avatar: Avatar;
  status: 1;
  authToken: string;
  id_rocket: string;
  username: string;
}

export interface MessageBodyRequest {
  sender_authToken: string;
  sender_userId: string;
  receiverUsername: string;
  message?: string;
  attachments?: Attachment[];
  t: "d" | "c" | "p";
  roomId?: string;
  userId?: string;
  channel?: string;
  authToken?: string;
}

export interface MessageSearchInfo {
  roomId: string;
  messageId: string;
  matchedText: string;
  ts: string;
  userId: string;
  fullname: string;
  avatar: string;
  offset: number;
}

export interface MessageSearchInfoRequest extends AuthenRequestCommon {
  roomId?: string;
  text: string;
  type: RoomType;
}

export interface UnReadMessageRequest extends AuthenRequestCommon {
  roomId: string;
  type: RoomType;
}

export interface UnreadUserInfo {
  unreadCount: number;
  unreadsFrom: string;
  userId: string;
  username: string;
}
export interface UnReadMessageInfo {
  roomId: string;
  info: UnreadUserInfo[];
  success: boolean;
}

export interface SetParamConversationProps {
  type: TypeParamsChat;
  value: any;
}

export interface ReadMessageRequest extends AuthenRequestCommon {
  roomId: string;
}

export enum STEP {
  IDLE,
  CONVENTION,
  CHAT_ONE,
  VIEW_DETAIL_USER,
  ACCOUNT_INFO,
  MEDIA_INFO,
  ADD_GROUP,
  CHAT_DETAIL_GROUP,
  LIST,
  USER_INFO,
  MEDIA,
  LINK,
  FILE,
  CHAT_FORWARD,
  CHAT_GROUP,
  ADD_MEMBER,
  SEARCH_CHAT_TEXT,
}

export enum STEP_INFO {
  IDLE,
  USER,
  MEDIA,
  LINK,
  FILE,
}

export enum TYPE_LIST {
  MEDIA_LIST,
  LINK_LIST,
  FILE_LIST,
}

export const mimiMap = {
  "application/zip": ".zip",
  "application/xhtml+xml": ".xhtml",
  "application/vnd.visio": ".vsd",
  "image/svg_xml": ".svg",
  "video.mp4": ".mp4",
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": ".png",
};
