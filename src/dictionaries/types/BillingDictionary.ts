export type BillingDictionary = {
  list: {
    head: {
      title: string;
    };
    filter: {
      recent: string;
      saved: string;
      status: string;
      add: string;
    };
    form: {
      title: {
        for_invoice: string;
        uninvoiced_time_expenses: string;
        uninvoiced_amount: string;
        display_service: string;
        subsidiary: string;
        subTotal: string;
        vat: string;
        total: string;
        invoice_preview: string;
        display_expenses: string;
        of_the_budget_revenue: string;
      };
      step: {
        title: {
          budgets: string;
          preview: string;
        };
      };
      content: {
        step1: {
          content1: string;
          content2: string;
          companyName: string;
        };
        step2: {
          content1: string;
          content2: string;
        };
      };
      table_step_1: {
        name: string;
        project: string;
        status: string;
        revenue: string;
        for_invoicing: string;
      };
      table_step_2: {
        service_type: string;
        description: string;
        unit: string;
        qty: string;
        rate: string;
        amount: string;
      };
      button: {
        nextStep: string;
        submit: string;
      };
      filter: {
        add: string;
      };
    };
    table: {
      subject: string;
      invoiceNumber: string;
      date: string;
      company: string;
      budgets: string;
      att: string;
      amount: string;
      amountUnpaid: string;
      dueDate: string;
    };
    exportView: {
      fullNameCompany: string;
      subject: string;
      client: string;
      date: string;
      dueDate: string;
      createBy: string;
      payment: {
        description: string;
        unit: string;
        quality: string;
        rate: string;
        amount: string;
      };
      subTotal: string;
      vat: string;
      grandTotal: string;
    };
    button: {
      invoice: string;
      exportView: string;
    };
    modalExport: {
      documentFormat: string;
      orientation: string;
      pageSize: string;
      title: string;
      button: {
        cancel: string;
        export: string;
      };
    };
  };
  detail: {
    form: {
      invoice: {
        table: {
          service_type: string;
          description: string;
          unit: string;
          qty: string;
          rate: string;
          amount: string;
          discount: string;
        };
        tableBudget: {
          linkedBudget: string;
          timePeriod: string;
          invoicedwithoutTax: string;
          leftForInvoicing: string;
        };
        bill: {};
        button: {};
        title: {};
      };
      feed: {
        table: {};
        button: {};
        title: {};
      };
      payment: {
        table: {};
        table2: {};
        button: {};
        title: {};
      };
      top: {
        button: {};
        title: {};
      };
    };
  };
  viewPdf: {
    title: {};
    button: {};
  };
};
