import { TicketDictionary } from "dictionaries/types/TicketDictionary";

export const TicketLang: TicketDictionary = {
  ticket: {
    head: {
      title: "Tickets",
    },
  },
  title: "Tickets",
  hide: "Hide",
  actions: {
    createTicket: "New Ticket",
    search: "Search",
    status: "Status",
    delete: {
      title: "Confirm delete ticket ",
      confirm: "Are you sure to remove ticket ?",
      remove: "Remove",
    },
    draft: "Draft",
    published: "Published",
    hide: "Hide",
    update: {
      title: "Are you sure to update?",
      content: "Update ticket to {label}",
    },
    updateTicket: "Update ticket",
  },

  status: {
    published: "Published",
    draft: "Draft",
    hide: "Hide",
  },
  comment: {
    writeComment: "Write comment ...",
    sendComment: "Send comment",
  },
  error: {
    anErrorTryAgain: "An error occurred, please try again !",
  },
  PUBLISHED: "published",
  DRAFT: "draft",
  HIDE: "hide",
  filterTicket: {
    sendAll: "All Ticket",
    newTicket: "New",
    openTicket: "Open",
    inProgressTicket: "In-grogress",
    onHoldTicket: "On Hold",
    resolvedTicket: "Rosolved",
    closedTicket: "Closed",
    canceledTicket: "Canceled",
  },
  ticketFields: {
    id: "ID",
    stage: "STAGE",
    name: "NAME",
    ticketType: "TICKET TYPE",
    priority: "PRIORITY",
    assignedTo: "ASSIGNED TO",
    creator: "CREATOR",
    creationTime: "CREATION TIME",
  },
  cardTicket: {
    title: "Ticket#",
    created: "Created by",
    lastRespond: "Last respond",
    openTicket: "Open Ticket",
  },
  ticketDetail: {
    title: "Ticket#",
    created: "Created at",
    New: "New",
    Open: "Open",
    inProgress: "In Progress",
    onHold: "On Hold",
    Sold: "Sold",
    Closed: "Closed",
    question: "How to deposit money to my portal?",
    reply: "Reply",
    createRequest: "created this request",
    requestTicketType: "Request Ticket Type",
    priority: "Priority",
    assignee: "Assignee",
    rootCause: "Root cause",
    description: "Description",
    btnShowDetail: "Show detail",
    btnHideDetail: "Hide detail",
  },
  modelReply: {
    title: "Reply to ticket",
    email: "Your Email ....",
    subject: "Subject",
    send: "Send",
    cancel: "Cancel",

  },
};
