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
    createTicket: " Create new",
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
};
