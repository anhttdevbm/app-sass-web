export interface ChatLinkType {
  messageId: string;
  ts: string;
  urls: UrlInfo[];
}

export interface IChatLinkV2 {
  created_at: string;
  id: string;
  message: string;
  room: string;
  url: string;
}

export interface IChatFile {
  created_at: string;
  id: string;
  message: string;
  name: string;
  object: string;
  room: string;
  size: number;
  type: string;
  url: string;
}

export interface UrlInfo {
  url: string;
  meta: {
    pageTitle: string;
    ogImage: string;
    twitterCard: string;
    ogTitle: string;
    twitterSite: string;
  };
  headers: {
    contentType: string;
  };
  parsedUrl: {
    host: string;
    hash: null;
    pathname: string;
    protocol: string;
    port: null;
    query: null;
    search: null;
    hostname: string;
  };
}

export interface ChatQueryParam {
  authToken: string;
  userId: string;
  roomId: string;
}

export type UrlsQuery = ChatQueryParam & {
  type?: string;
};

export type MediaQuery = ChatQueryParam & {
  roomType?: string;
};

export type TypeMedia = "image_url" | "video_url";

export interface Attachment {
  audio_url?: string;
  author_icon?: string;
  author_link?: string;
  author_name?: string;
  collapsed?: boolean;
  color?: string;
  fields?: AttachmentFields[];
  message_link?: string;
  text?: string;
  thumb_url?: string;
  title?: string;
  title_link?: string;
  title_link_download?: boolean;
  ts?: string;
  name?: string;
  image_url?: string;
  video_url?: string;
  downloadlink?: string;
}

export interface AttachmentV2 {
  name: string;
  object: string;
  size: number;
  type: string;
  url: string;
}

export interface AttachmentFields {
  short?: boolean;
  title?: string;
  value?: string;
}

export interface FileUploadResponse {
  download: string;
  object: string;
  upload: string;
}

export interface MediaTypeCommon {
  rid: string;
  userId: string;
  _updatedAt: Date | string;
  uploadedAt: Date | string;
  user: User;
  name: string;
}

export interface MediaHistoryType extends MediaTypeCommon {
  url: string;
}

export interface FileHistoryType extends MediaTypeCommon {
  path: string;
}

export type MediaType = MediaHistoryType & FileHistoryType;

export interface User {
  _id: string;
  username: string;
  name: string;
}

export type MediaResponse<T> = Page & {
  files: T[];
};

export interface Page {
  count: number;
  offset: number;
  total: number;
  success: boolean;
}
