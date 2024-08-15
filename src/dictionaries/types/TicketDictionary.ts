export interface TicketDictionary {
  ticket: Ticket;
  title: string;
  hide: string;
  actions: Actions;
  status: Status;
  comment: Comment;
  error: Error;
  PUBLISHED: string;
  DRAFT: string;
  HIDE: string;
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
