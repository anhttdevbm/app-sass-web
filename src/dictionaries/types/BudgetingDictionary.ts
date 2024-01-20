export type BudgetingDictionary = {
  head: {
    title: string;
    titleDetail: string;
  };
  toolbar: {
    date: string;
    addTime: string;
    addExpense: string;
    addInvoice: string;
    serviceEdit: string;
    search: string;
  };
  status: {
    open: string;
    close: string;
  };
  actionStatus: {
    create: string;
    create_service: string;
  };
  tabTime: {
    service: string;
    person: string;
    notes: string;
    time: string;
    billable: string;
    edit: string;
    delete: string;
  };
  tabExpenses: {
    service: string;
    description: string;
    date: string;
    att: string;
    paymentStatus: string;
    totalCost: string;
    billable: string;
    newExpenseForm: {
      date: string;
      owner: string;
      service: string;
      qty: string;
      const: string;
      currency: string;
      totalCost: string;
      markUp: string;
      totalBillable: string;
      description: string;
      paymentStatus: string;
      reimbursement: {
        reimbursement: string;
        reimbursementDate: string;
      };
      payment: {
        dueDate: string,
        paymentDate: string,
        vendor: string;
      };
      status: string;
      attachment: string;
    };
  };
  tabInvoice: {
    subject: string;
    invoiceNumber: string;
    date: string;
    att: string;
    amountNoTax: string;
    amountUnpaid: string;
    dueDate: string;
  };
  tabService: {
    index: {
      name: string;
      workedTime: string;
      price: string;
      cost: string;
    };
    totalArea: {
      time: {
        title: string;
        estimatedTime: string;
        billableTime: string;
        workedTime: string;
        budgetedTime: string;
        remainingTime: string;
      };
      profit: {
        title: string;
        revenue: string;
        cost: string;
        profit: string;
      };
      budget: {
        title: string;
        budgetTotal: string;
        budgetUsed: string;
        budgetRemaining: string;
      };
      invoicing: {
        title: string;
        newInvoice: string;
        total: string;
        invoiced: string;
        forInvoicing: string;
      };
    };
    section: {
      serviceName: string;
      serviceType: string;
      billingType: string;
      unit: string;
      tracking: string;
      estimate: string;
      position: string;
      quantity: string;
      price: string;
      discount: string;
      totalBudget: string;
      description: string;
      addSection: string;
      addItem: string;
    };
  };
  dialog: {
    titleModalAdd: string;
    titleModalUpdate: string;
    date: string;
    project: string;
    timeRanger: string;
    startTime: string;
    endTime: string;
    note: string;
    cancelBtnText: string;
    addBtnText: string;
    updateBtnText: string;
    editBtnText: string;
    service: string;
    update: string;
    exportView: string;
    exportBtnText: string;
  };
  dialogExpense: {
    titleModalAdd: string;
    titleModalDetail: string;
    date: string;
    person: string;
    service: string;
    qty: string;
    cost: string;
    currency: string;
    totalCost: string;
    markup: string;
    totalBillable: string;
    description: string;
    reimbursement: string;
    payment: string;
    cancelBtnText: string;
    createBtnText: string;
    updateBtnText: string;
    billable: string;
    reimbursementDate: string;
    dueDate: string;
    paymentDate: string;
    vendor: string;
  };
  dialogRecurring: {
    titleModalAdd: string;
    cancelBtnText: string;
    addBtnText: string;
    editBtnText: string;
    recurringInterval: string;
    nextOccurrence: string;
    stopRecurring: string;
  };
  delete: {
    titleConfirmDelete: string;
    contentConfirmDelete: string;
  };
  notifications: {
    updateServiceSuccess: string;
  }
};
