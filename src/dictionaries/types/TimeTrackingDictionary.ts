export type TimeTrackingDictionary = {
  header: {
    tab: {
      myTime: string;
      companyTime: string;
      workLog: string;
      workTime: string;
      breakTime: string;
      weekly_total: string;
    };
    timeTracking: string;
    noData: string;
    common: {
      startButton: string;
      logTimeButton: string;
    }
  };
  myTime: {
    addButton: string;
    searchButton: string;
    search: string;
    timesheet: string;
    timesheet_tab: {
      weekly_summary: string;
      total: string;
      pin: string;
      unpin: string;
    };
    calender: string;
    calender_tab: {
      time_label: string;
      same_time_worker: string;
    };
    day: string;
    day_tab: {
      project: string;
      position: string;
      start_time: string;
      time: string;
      note: string;
    };
  };
  company_time: {
    this_week: string;
    timesheet: string;
    searchButton: string;
    timesheet_tab: {
      weekly_summary: string;
      total: string;
      pin: string;
      unpin: string;
    };
    table: string;
    table_tab: {
      employee: string;
      project: string;
      position: string;
      start_time: string;
      time: string;
      note: string;
    };
  };
  timeLog: {
    createTL: string;
    moveT: string;
    upITL: string;
    upTL: string;
    upT: string;
    upST: string;
    upIT: string;
    upIST: string;
    creT: string;
    creST: string;
  };
  modal: {
    Project: string;
    Position: string;
    Date: string;
    timeDuration: string;
    Type: string;
    start_time: string;
    Note: string;
    Cancel: string;
    Confirm: string;
    Delete: string;
    edit_time: string;
    add_time: string;
   }
};
