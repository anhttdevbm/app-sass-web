import { AlertColor } from "@mui/material";
import { FILE_MAP, Status, ThemeMode } from "./enums";
import {
  Mode,
  Paging,
  PagingItem,
  Paging_Career,
  Paging_Feedback,
} from "./types";

export const AUTH_API_URL = process.env.AUTH_API_URL as string;
export const API_URL = process.env.API_URL as string;
export const COMPANY_API_URL = process.env.COMPANY_API_URL as string;
export const UPLOAD_API_URL = process.env.UPLOAD_API_URL as string;
export const TIME_SHEET_API_URL = process.env.TIME_SHEET_API_URL as string;
export const CHAT_API_URL = process.env.CHAT_API_URL as string;
export const SALE_API_URL = process.env.SALE_API_URL as string;
export const BUDGET_UPLOAD_FILE_API_URL = process.env
  .BUDGET_UPLOAD_FILE_API_URL as string;
export const DEFAULT_MODE: Mode = ThemeMode.LIGHT;
export const RESOURCE_API_URL = process.env.RESOURCE_API_URL as string;
//feedback
export const FEEDBACK_API_URL = process.env.FEEDBACK_API_URL as string;
// BLOG
export const BLOG_API_URL = process.env.BLOG_API_URL as string;
// CAREER
export const CAREER_API_URL = process.env.CAREER_API_URL as string;
//Billing
export const BILLING_API_URL = process.env.BILLING_API_URL as string;
//Invoice
export const INVOICE_API_URL = process.env.INVOICE_API_URL as string;

//Content
export const CONTENT_API_URL = process.env.CONTENT_API_URL as string;

// AI
export const AI_CHAT_API_URL = process.env.AI_CHAT_API_URL as string;
export const AI_AGENT_API_URL = process.env.AI_AGENT_API_URL as string;
export const PROJECT_AI_API_URL = process.env.PROJECT_AI_API_URL as string;
export const AI_DOCS_API_URL = process.env.AI_DOCS_API_URL as string;

//Ticket
export const TICKET_API_URL = process.env.TICKET_API_URL as string;

export const DARK_THEME_MEDIA_SYSTEM = "(prefers-color-scheme: dark)";
export const DOCS_API_URL = process.env.DOCS_API_URL as string;
export const DATE_FORMAT_FORM = "yyyy-MM-dd";

export const DATE_FORMAT_SLASH = "dd/MM/yyyy";
export const DATE_FORMAT_HYPHEN = "dd-MM-yyyy";
export const LONG_TIME_FORMAT = "HH:mm:ss";
export const SHORT_TIME_FORMAT = "HH:mm";
export const DATE_TIME_FORMAT_SLASH = `${SHORT_TIME_FORMAT} ${DATE_FORMAT_SLASH}`;
export const DATE_TIME_FORMAT_HYPHEN = `${SHORT_TIME_FORMAT} ${DATE_FORMAT_HYPHEN}`;
export const DATE_PICKER_FORMAT = "MM/DD/YYYY";
export const DATE_LOCALE_FORMAT = "DD MMM, YYYY";

export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_TOTAL = 10;

export const DEFAULT_PAGING: Paging = {
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE,
};

export const DEFAULT_PAGING_FEEDBACK: Paging_Feedback = {
  page: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
  totalItems: DEFAULT_PAGE_TOTAL,
};

export const DEFAULT_PAGING_CAREER: Paging_Career = {
  page: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
  totalItems: DEFAULT_PAGE_TOTAL,
};

export const DEFAULT_PAGING_ITEM: PagingItem = {
  page: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
  totalItems: DEFAULT_PAGE_TOTAL,
};

export const DEFAULT_PAGING_BILLING: PagingItem = {
  page: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
};

export const SCROLL_ID = "scroll-id";

export const i18n = {
  // A list of all locales that are supported
  locales: ["en", "vi"],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: "en",
} as const;

export const TEXT_STATUS: { [key in Status]: string } = {
  [Status.ACTIVE]: "statusEnum.inprogress",
  [Status.CLOSE]: "statusEnum.close",
  [Status.PAUSE]: "statusEnum.pause",
};

export const COLOR_STATUS: { [key in Status]: AlertColor } = {
  [Status.ACTIVE]: "warning",
  [Status.CLOSE]: "success",
  [Status.PAUSE]: "error",
};

export const STATUS_OPTIONS = [
  { label: TEXT_STATUS.ACTIVE, value: Status.ACTIVE },
  { label: TEXT_STATUS.PAUSE, value: Status.PAUSE },
  { label: TEXT_STATUS.CLOSE, value: Status.CLOSE },
];

export const NS_COMMON = "common";
export const NS_AUTH = "auth";
export const NS_LAYOUT = "layout";
export const NS_ACCOUNT = "account";
export const NS_PROJECT = "project";
export const NS_COMPANY = "company";
export const NS_MANAGER = "manager";
export const NS_SALES = "sales";
export const NS_TIME_TRACKING = "timeTracking";
export const NS_RESOURCE_PLANNING = "resourcePlanning";
export const NS_CHAT = "chat";
export const NS_CHAT_BOX = "chatbox";

// AI
export const NS_AI_CHAT = "aiChat";
export const NS_AI_AGENT = "aiAgent";

export const NS_DOCS = "documents";
export const NS_COST_RATE = "costRate";
export const NS_HOLIDAY_CALENDAR = "holidayCalendar";
export const NS_PACKAGE_MANAGERMENT = "packageManagement";
//Feedback
export const NS_FEEDBACK = "feeback";
//blog
export const NS_BLOG = "blog";
//Cereer
export const NS_CAREER = "career";
//Applicants
export const NS_APPLICANTS = "applicants";
//Billing
export const NS_BILLING = "billing";
//Budgeting
export const NS_BUDGETING = "budgeting";
//Content
export const NS_CONTENTS = "contents";

//Meeting
export const NS_MEETING = "meeting";

// Invoice
export const NS_INVOICE = "invoice";

//ticket
export const NS_TICKET = "ticket";

export const IMAGES_ACCEPT = ["image/png", "image/jpeg", "image/jpg"];
export const VIDEO_ACCEPT = ["video/mp4"];
export const ACCEPT_MEDIA = [...IMAGES_ACCEPT, ...VIDEO_ACCEPT];
export const FILE_ACCEPT = [
  "application/zip",
  "application/vnd.ms-powerpoint",
  "text/csv",
  "application/java-archive",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export const ACCESS_TOKEN_STORAGE_KEY = "aT";
export const REFRESH_TOKEN_STORAGE_KEY = "rT";

export const API_TIMEOUT = 30_000; //s

export const AN_ERROR_TRY_RELOAD_PAGE = "error.anErrorTryReload";
export const AN_ERROR_TRY_AGAIN = "error.anErrorTryAgain";

export const mapType = {
  [FILE_MAP.DOC]: ["doc", "docx", "dot", "dotx"],
  [FILE_MAP.EXCEL]: ["xls", "xlsx", "xlsm"],
  [FILE_MAP.CSV]: ["csv"],
  [FILE_MAP.PDF]: ["pdf"],
};

export const nameDayList = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export const nameMonthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const timeLocale = {
  en: "en-US",
  vi: "vi-VN",
};
