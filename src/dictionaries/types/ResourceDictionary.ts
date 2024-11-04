export default interface ResourceDictionary {
  header: {
    title: string;
    add: string;
    tab: {
      allPeople: string;
      mySchedule: string;
    };
  };
  schedule: {
    filter: {
      search: string;
      workingHours: string;
      status: {
        active: string;
        pending: string;
        inactive: string;
      };
      descending: string;
      asceding: string;
      position: string;
      viewBy: string;
    };
    time: {
      eventTime: string;
      thisWeek: string;
      hourPerDay: string;
    };
    unit: {
      day: string;
      hour: string;
    };
    unitSymbol: {
      day: string;
      hour: string;
    };
    resourceHeader: {
      available: string;
      schedule: string;
      service: string;
      user: string;
      startDate: string;
      Workload: string;
      chooseService: string;
    };
    action: {
      addBooking: string;
      editBooking: string;
    };
    toolTip: {
      resolveBooking: string;
      splitBooking: string;
      openBudget: string;
      deleteOverBooking: string;
      duplicateBooking: string;
    };
  };
  form: {
    title: string;

    project: string;
    timeoff: string;
    services: string;
    detail: string;
    role: string;
    dateRange: string;
    createBooking: string;
    allocation: string;
    note: string;
    leftToSchedule: string;
    estimate: string;
    work: string;
    schedule: string;
    selectTimeOffCategory: string;
    timeOffCategory: string;
    budget: string;
    user: string;
    role1: string;
    timeOffType: {
      vacation: string;
      sick: string;
      other: string;
    };
    editActions: {
      duplicate: string;
      split: string;
      resolve: string;
      delete: string;
      repeat: string;
      openAdmin: string;
    };
    error: {
      split: string;
      repeat: string;
      duplicate: string;
    };
    week: string;
    numberOf: string;
    weekOrMonth: string;
    time: string;
    month: string;
    repeatTimes: string;
    confirmDelete: string;
    createSuccess: string;
    createFailed: string;
    editBooking: string;
    updateSuccess: string;
    updateFailed: string;
    deleteFailed: string;
    deleteSuccess: string;
  };
  popupService: {
    project: string;
    chooseProjectPlacehodle: string;
    chooseBudgetPlacehodle: string;
    budget: string;
    search: string;
    servicePlaceholder: string;
    dragText: string;
    date: string;
  };
  months: {
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
  };
}
