export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUEST = 429,
  INTERNAL_SERVER = 500,
}

export enum DataStatus {
  IDLE,
  LOADING,
  SUCCEEDED,
  FAILED,
}

export enum DataAction {
  DETAIL = 1,
  CREATE,
  UPDATE,
  DELETE,
  OTHER,
}

export enum Permission {
  SA = "SA",
  AM = "AM",
  ST = "ST",
  EU = "EU",
}

export enum Status {
  PAUSE = "PAUSE",
  ACTIVE = "ACTIVE",
  CLOSE = "CLOSE",
}

export enum PayStatus {
  // ALL,
  PAID = 1,
  UNPAID,
  WAITING,
}

export enum FILE_MAP {
  DOC,
  EXCEL,
  CSV,
  PDF,
}

export enum SORT_OPTIONS {
  ASC = "1",
  DESC = "-1",
}

export enum SALE_STAGE {
  LEAD = "LEAD",
  PROPOSAL_SENT = "PROPOSAL_SENT",
  PROSPECT = "PROSPECT",
  NEGOTIATION = "NEGOTIATION",
  WAITING_APPROVE = "WATTING_APPROVE",
  OPEN = "OPEN",
  WON_DEAL = "WON_DEAL",
  LOST_DEAL = "LOST_DEAL",
}

export enum SALE_BILL_TYPE {
  FIX = "FIX",
  ACTUAL = "ACTUAL",
  NON_BILLABLE = "NON_BILLABLE",
}

export enum CURRENCY_CODE {
  USD = "USD",
  EUR = "EUR",
  JPY = "JPY",
  GBP = "GBP",
  CAD = "CAD",
  AUD = "AUD",
  SGD = "SGD",
  HKD = "HKD",
  SEK = "SEK",
  CHF = "CHF",
  NZD = "NZD",
  MXN = "MXN",
  BRL = "BRL",
  RUB = "RUB",
  CNY = "CNY",
  VND = "VND",
}

export enum RESOURCE_EVENT_TYPE {
  PROJECT_BOOKING = "PROJECT_BOOKING",
  TIME_OF_BOOKING = "TIME_OF_BOOKING",
}

export enum RESOURCE_ALLOCATION_TYPE {
  PERCENTAGE = "%",
  HOUR = "hours",
  HOUR_PER_DAY = "h/day",
}

export enum RESOURCE_ALLOCATION_UNIT {
  PERCENTAGE = "%",
  HOUR = "hours",
  HOUR_PER_DAY = "h/day",
}

export enum DAY_TIME_UNIT {
  DAY = "day",
  HOUR = "hour",
}

export enum SERVICE_UNIT_OPTIONS {
  HOUR = "hour",
  DAY = "day",
  PIECE = "piece",
}

export enum DocGroupByEnum {
  CREATED_BY = "created_by",
  UPDATED_BY = "updated_by",
  OWNER = "owner",
  PROJECT_ID = "project_id",
}

export const DocAccessibility = {
  FULL_ACCESS: "Full access",
  VIEW: "Can view",
  EDIT: "Can edit",
  COMMENT: "Can comment",
} as const;

export enum ExpenseStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
}

export enum DocumentFormat {
  PDF = "pdf",
  CSV = "csv",
  XLSX = "xlsx",
}

export enum BudgetServiceBillable {
  "BILLABLE" = "billable",
  "NON_BILLABLE" = "non_billable",
  FIXED = "fixed",
  ACTUALS = "actuals",
}
