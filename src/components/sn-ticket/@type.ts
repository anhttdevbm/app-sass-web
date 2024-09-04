export interface IFile {
  name: string;
  url: string;
}

export interface ITicket {
  assign: string | null;
  assignUser: any | null;
  code: string;
  company: string;
  createTime: string;
  creator: string;
  description: string;
  id: string;
  idUpdateUser: string | null;
  lstFile: File[];
  priority: "Low" | "Medium" | "High";
  rate: number | null;
  rootCause: string | null;
  stage: "New" | "InProgress" | "Resolved" | "Closed";
  title: string;
  type: string | null;
  updateTime: string | null;
}

export enum StateTicket {
  ALL_TICKET = "All Ticket",
  NEW = "New",
  OPEN = "Open",
  IN_PROGRESS = "InProgress",
  ON_HOLD = "OnHold",
  RESOLVED = "Resolved",
  CLOSED = "Closed",
  CANCELLED = "Cancelled",
}

export enum TypeViewList {
  LIST = "kanbanViewListDoc",
  TABLE = "basicViewListDoc",
}
