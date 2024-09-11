export interface TicketDictionary {
  ticket: Ticket;
  title: string;
  hide: string;
  actions: Actions;
  createTicketFrom : any
  status: Status;
  comment: Comment;
  error: Error;
  PUBLISHED: string;
  DRAFT: string;
  HIDE: string;
  filterTicket : FilterTicket
  ticketFields : TicketFields
  cardTicket : CardTicket
  ticketDetail : TicketDetail
  modelReply : ModelReply
  ticketAgnet : any
  dashboard : any
}

interface Error {
  anErrorTryAgain: string;
}

interface Comment {
  writeComment: string;
  sendComment: string;
}

interface Status {
  published: string;
  draft: string;
  hide: string;
}

interface Actions {
  createTicket: string;
  search: string;
  status: string;
  delete: Delete;
  draft: string;
  published: string;
  hide: string;
  update: Update;
  updateTicket: string;
  viewBy: string;
  createAgent : string;

}

interface Update {
  title: string;
  content: string;
}

interface Delete {
  title: string;
  confirm: string;
  remove: string;
}

interface Ticket {
  head: Head;
}

interface Head {
  title: string;
}

interface FilterTicket {
  sendAll: string;
  newTicket: string;
  openTicket: string;
  inProgressTicket: string;
  onHoldTicket: string;
  resolvedTicket: string;
  closedTicket: string;
  canceledTicket: string;
  
}

interface TicketFields {
  id: string;
  stage: string;
  name: string;
  ticketType: string;
  priority: string;
  assignedTo: string;
  creator: string;
  creationTime: string;
}

interface CardTicket {
  title: string;
  created: string;
  lastRespond: string;
  openTicket: string;
}

interface TicketDetail {
  title: string;
  created: string;
  New: string;
  Open: string;
  inProgress: string;
  onHold: string;
  Sold: string;
  Closed: string;
  question: string;
  reply: string;
  createRequest: string;
  requestTicketType: string;
  priority: string;
  assignee: string;
  rootCause: string;
  description: string;
  btnShowDetail: string,
  btnHideDetail: string,
  attachment: string;
  download: string;
  switchList: string;
  switchStrip: string;
  TableView: TableView;
  activity : ActivityLabels
  commentActivity : CommentActivityLabels
  historyActivity : HistoryActivityLabels

}

interface ModelReply {
  title: string;
  email: string;
  subject: string;
  send: string;
  cancel: string;
}

interface TableView  {
  name: string;
  Size: string;
  dateAdded: string;
};

interface ActivityLabels {
  activity: string;
  show: string;
  newest: string;
  oldest: string;
  first: string;
  All: string;
  Comments: string;
  History: string;
  Email: string;
}

interface CommentActivityLabels {
  tabComment1: string;
  tabComment2: string;
  save: string;
  cancel: string;
  internalNote : string
  edit : string
  delete : string
}

interface HistoryActivityLabels {
  time: string
}
