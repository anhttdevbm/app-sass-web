export type CostRateDictionary = {
  head: {
    title: string;
    tab: {
      userInfo: string;
      costRate: string;
    }
  }
  empty: {
    title: string;
    subtitle: string;
    addCostRate: string;
    form: {
      type: string;
      costPerMonth: string;
      currency: string;
      workingHours: string
      startDate: string;
      endDate: string;
      holidayCalendar: string;
      note: string;
    };
    notification: {
      addSuccess: string;
    };
  }
};
