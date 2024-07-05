import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { DocAccessibility, Permission, ThemeMode } from "./enums";
import { i18n } from ".";
import { Editor } from "@tiptap/core";

export interface Option {
  label: string;
  value: string | number;
  icon?: string | React.ReactNode;
  avatar?: string;
  subText?: string;
}

export interface Paging_Feedback {
  page: number;
  size: number;
  total_page?: number;
  totalItems?: number;
}

export interface Paging_Billing {
  page: number;
  size: number;
  total_page?: number;
  totalItems?: number;
}

export interface Paging_Career {
  page: number;
  size: number;
  total_page?: number;
  totalItems?: number;
}

export interface PagingItem {
  page: number;
  size: number;
  total_page?: number;
  totalItems?: number;
}

export interface Size {
  width?: number;
  height?: number;
}

export type Mode = ThemeMode.LIGHT | ThemeMode.DARK | "system";

export type ErrorResponse = {
  code: string;
  description?: string;
  errors: {
    [key: string]: string;
  }[];
};

export interface BaseQueries {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
}

export interface BaseQueries_Feedback {
  page?: number;
  size?: number;
}

export interface BaseQueries_Billing {
  page?: number;
  size?: number;
}

export interface User {
  id: string;
  fullname: string;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  taxCode?: string;
  address?: string;
  country?: string;
  position?: {
    name: string;
    id: string;
  };
  roles: Permission[];
  avatar?: {
    link: string;
  };
}

export interface Paging {
  pageIndex: number;
  pageSize: number;
  totalPages?: number;
  totalItems?: number;
}

export type ItemListResponse = {
  totalPages: number;
  totalItems: number;
  items: unknown[];
  filters?: Params;
  concat?: boolean;
  prefixKey?: string;
};

export type OptionFormatNumber = {
  numberOfFixed?: number;
  emptyText?: string;
  localeOption?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  space?: boolean;
} & Intl.NumberFormatOptions;

export type Locale = (typeof i18n)["locales"][number];

export type Attachment = {
  object: string;
  name: string;
  link: string;
};

export declare interface IDocument {
  _id?: string;
  id?: string;
  name?: string;
  created_time?: Date;
  updated_time?: Date;
  created_by?: Partial<User>;
  updated_by?: Partial<User>;
  owner?: Partial<User>;
  description?: string;
  is_active?: boolean;
  is_public?: boolean;
  member?: Array<{
    _id: string;
    create_time: Date;
    doc: string;
    user: Partial<User>;
    perm: keyof typeof DocAccessibility;
  }>;
  positionComment?: [];
  company?: string;
  project_id?: string;
  content?: string;
  child?: [];
}

export declare type TPagination<T> = {
  docs: Array<T>;
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export declare interface IComment {
  _id: string;
  create_time: Date;
  updated_time: Date;
  created_by?: Partial<User>;
  content: string;
  position: {
    create_time: Date;
    updated_time: Date;
    doc: string;
    position: string;
  };
  doc: string;
  editor: Editor;
  createdAt: Date;
}

export interface IApplicant {
  _id: string;
  id: string;
  first_name: string;
  last_name: string;
  birth: string;
  email: string;
  gender: string;
  phone: string;
  resume: string;
  socialLink: string;
  created_time: string;
  attachments_down: Attachment[];
  resume_down: Attachment;
}

//  _id: '657215173bd3d5a7f5cbe7f8',
//       created_time: '2023-12-07T18:55:19.160Z',
//       updated_time: '2023-12-07T18:55:19.160Z',
//       created_by: {
//         id: '090ad1a0-82cb-11ee-a65f-e197750c3495',
//         email: 'am@fpt.com',
//         roles: [ 'AM' ],
//         company: 'FPT',
//         fullname: 'Vũ Viết Kiều',
//         position: null,
//         avatar: {
//           object: '6d8d41d0-82cb-11ee-a796-53445187e289-7fe979fe734c7a22',
//           name: 'chup-anh-dep-bang-dien-thoai-25 (1).jpg',
//           link:
//             'http://103.196.145.232:9000/sass/6d8d41d0-82cb-11ee-a796-53445187e289-7fe979fe734c7a22?response-content-disposition=attachment%3B%20filename%3D%22chup-anh-dep-bang-dien-thoai-25%20%281%29.jpg%22&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20231207%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231207T185553Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=2486052c1aa51e58c87b6db2ee8ecd784a3e4fa444a83a2c55f4be858c1bf0e9'
//         }
//       },
//       doc: '2e7b7620-8ed7-11ee-9ee3-a196b3178b3c',
//       position: {
//         created_time: '2023-12-07T18:55:19.152Z',
//         updated_time: '2023-12-07T18:55:19.152Z',
//         doc: '2e7b7620-8ed7-11ee-9ee3-a196b3178b3c',
//         position: 'aef8c53a2-78de-4ad9-b265-62d6cbd74e4fa'
//       },
//       content: 'test'
//     }
