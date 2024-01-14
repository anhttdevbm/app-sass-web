import { BillingDictionary } from "dictionaries/types/BillingDictionary";

export const BillingLang: BillingDictionary = {
  list: {
    head: {
      title: "",
    },
    filter: {
      recent: "",
      saved: "",
      status: "status",
      add: "Add Filter",
    },
    form: {
      title: {
        for_invoice: "For invoicing",
        uninvoiced_time_expenses: "Uninvoiced Time & Expenses",
        uninvoiced_amount: "Uninvoiced amount",
        display_service: "Display expenses as",
        subsidiary: "Subsidiary",
        subTotal: "Subtotal",
        vat: "VAT",
        total: "Total",
        invoice_preview: "Invoice preview",
        display_expenses: "Display expenses as",
        of_the_budget_revenue: "of the budget revenue",
      },
      step: {
        title: {
          budgets: "Select budgets",
          preview: "Preview line items",
        },
      },
      content: {
        step1: {
          content1: "What do you want to invoice?",
          content2: "Select budgets that will be linked to this invoice.",
          companyName: "Company AI chat generate",
        },
        step2: {
          content1: "What hours and expenses should go on the Invoice?",
          content2: "Invoicing method",
        },
      },
      table_step_1: {
        for_invoicing: "For invoicing",
        name: "Name",
        project: "Project",
        revenue: "Revenue",
        status: "Status",
      },
      table_step_2: {
        amount: "Amount",
        description: "Discription",
        qty: "Qty",
        rate: "Rate",
        service_type: "Service type",
        unit: "Unit",
      },
      filter: {
        add: "Add Filter",
      },
      button: {
        nextStep: "Next step",
        submit: "Submit",
      },
    },
    table: {
      subject: "Subject",
      invoiceNumber: "Invoice number",
      date: "Date",
      company: "Company",
      budgets: "Budgets",
      att: "Att.",
      amount: "Amount (no tax)",
      amountUnpaid: "Amount unpaid",
      dueDate: "Due date",
    },
    exportView: {
      fullNameCompany: "",
      subject: "Subject",
      client: "Client",
      date: "date",
      dueDate: "Due date",
      createBy: "Created By",
      payment: {
        description: "Description",
        unit: "Unit",
        quality: "Qyt",
        rate: "Rate",
        amount: "Amount",
      },
      subTotal: "Subtotal",
      vat: "VAT",
      grandTotal: "Grand Total",
    },
    button: {
      invoice: "Invoice",
      exportView: "Export view",
    },
    modalExport: {
      documentFormat: "Document forrmat",
      orientation: "Orientation",
      pageSize: "Page size",
      title: "Export View",
      button: {
        cancel: "Cancel",
        export: "Export",
      },
    },
  },
  detail: {
    form: {
      invoice: {
        table: {
          amount: "Amount",
          description: "Description",
          qty: "Qty",
          rate: "Rate",
          service_type: "Service type",
          unit: "Unit",
          discount: "Discount",
        },
        tableBudget: {
          linkedBudget: "Linked budget",
          timePeriod: "Time period",
          invoicedwithoutTax: "Invoiced (without tax)",
          leftForInvoicing: "Left for invoicing",
        },
        bill: {
          fullCompanyName: "Full company name",
          taxID: "Tax ID",
          street: "Street",
          city: "City",
          postcode: "ZIP / Postcode",
          state: "State / County",
          country: "Country",
          save: "Save as default billing for client",
          title: {
            billTo: "Bill To",
            billFrom: "Bill From",
          },
        },
        button: {
          sentToClient: "Sent to client",
          edit: "Edit",
          addNewRow: "Add new row",
          linkBudget: "Link budget",
          option: {
            viewPdf: "View PDF",
            download: "Download",
            replace: "Replace",
          },
          cancel: "Cancel",
          save: "Save",
        },
        title: {
          dateSent: "Date sent",
          invoicePDF: "Invoice PDF",
          billTo: "Bill to:",
          billFrom: "Bill from:",
          message: "The message displayed on the invoice",
          subject: "Subject",
          invoiceNumber: "Invoice number",
          invoiceDate: "Invoice date",
          dueDate: "Due date",
          poNumber: "PO Number",
          subtotal: "Subtotal:",
          tax: "Tax",
          total: "Total:",
          name: "Name",
          value: "Value (%)",
          invoice: "Invoice",
          vat: "VAT",
        },
      },
      feed: {
        table: {},
        button: {
          sendComment: "Sent Comment",
          option: {
            comments: "Comments",
            attachments: "Attachments",
            changes: "Changes",
          },
        },
        title: {
          writeYourComment: "Write your comment",
          show: "Show",
          paidOn: "Paid on set to ",
          Feed: "Feed",
        },
      },
      payment: {
        table: {
          dueDate: "Due date",
          totalInvoice: "Total invoice",
          paid: "Paid",
          leftToPay: "Left to pay",
        },
        table2: {
          status: "Status",
          date: "Date",
          overdue: "Overdue",
          amount: "Amount",
          note: "Note",
        },
        button: {
          cancel: "Cancel",
          updatePayment: "Update payment",
          option: {
            edit: "Edit",
            delete: "Delete",
          },
        },
        title: {
          payments: "Payments",
          editPayment: "Edit Payment",
          amount: "Amount",
          note: "Note",
          paidOn: "Paid on",
        },
      },
      top: {
        button: {
          markAsSent: "Mark as sent",
          cancel: "Cancel",
          saveChange: "Save change",
          edit: "Edit",
          option: {
            duplicateInvoice: "Duplicate invoice",
            createCreditNote: "Create credit note",
            deleteInvoice: "Delete invoice",
          },
        },
        title: {
          paid: "Paid",
        },
      },
    },
  },
  viewPdf: {
    title: {},
    button: {
      insertComment: "Insert comment",
      openNewTab: "Open new tab",
      download: "Download",
    },
  },
};
