export type CostRateDictionary = {
  head: {
    title: string;
    tab: {
      userInfo: string;
      costRate: string;
    };
  };
  empty: {
    title: string;
    subtitle: string;
    addCostRate: string;
  };
  form: {
    type: string;
    costPerMonth: string;
    currency: string;
    workingHours: string;
    startDate: string;
    endDate: string;
    holidayCalendar: string;
    note: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
    overhead: string;
    weekly: string;
    monthly: string;
  };
  table: {
    startDate: string;
    endDate: string;
    type: string;
    cost: string;
    hourly: string;
    capacity: string;
    note: string;
  };
  info: {
    currentCostRate: string;
    workingDays: string;
    costType: string;
    costPerMonth: string;
    atCurrentCostRate: string;
    capacity: string;
    currentHourlyCost: string;
    overhead: string;
  };
  confirmDelete: {
    title: string;
    content: string;
  };
  notification: {
    addSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
  };
};
