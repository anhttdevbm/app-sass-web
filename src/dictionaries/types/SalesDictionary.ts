export type SalesDictionary = {
  list: {
    title: string;
    head: {
      title: string;
    };
    filter: {
      decending: string;
      ascending: string;
    };
    action: {
      deal: string;
      export: string;
    };
    newDealForm: {
      title: string;
      dealName: string;
      dealMember: string;
      unit: string;
      owner: string;
      tags: string;
      submit: string;
      update: string;
    };
    table: {
      stage: string;
      pjRevenue: string;
      revenue: string;
      time: string;
      owner: string;
      probability: string;
      lastActivity: string;
    };
    stage: {
      lead: string;
      proposalSent: string;
      prospect: string;
      waitingApprove: string;
      negotiation: string;
      open: string;
      wonDeal: string;
      lostDeal: string;
    };
    exportView: {
      title: string;
      documentFormat: string;
      orientation: string;
      pagesize: string;
      orientationOption: {
        portrait: string;
        landscape: string;
      };
      error: string;
    };
    noOptionText: string;
  };
  detail: {
    tab: {
      assign: string;

      feed: string;
      service: string;
    };
    todoList: {
      title: string;
      addTodo: string;
      assign: string;
      dueDate: string;
      addNew: string;
    };
    service: {
      title: string;
      table: {
        name: string;
        price: string;
        description: string;
        quantity: string;
        estimate: string;
        totalBuget: string;
        position: string;
        billType: string;
        unit: string;
        discount: string;
        estTooltip: string;
        markup: string;
      };
      billType: {
        fix: string;
        actual: string;
        nonBillable: string;
      };
      unit: {
        hour: string;
        hourSubText: string;
        day: string;
        daySubText: string;
        piece: string;
        pieceSubText: string;
      };
      addSection: string;
      addNewFromRateCard: string;
      addNewRow: string;
      duplicate: string;
      showDiscount: string;
      addService: string;
      showMarkup: string;
      showFixedPrice: string;
      showEstimate: string;
      ShowDescription: string;
    };
    assignedUser: string;
    comment: {
      title: string;
      placeholder: string;
      submit: string;
      show: {
        title: string;
        comments: string;
        attachment: string;
        change: string;
      };
    };
  };
};
