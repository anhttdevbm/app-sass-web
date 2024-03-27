import ResourceDictionary from "dictionaries/types/ResourceDictionary";

export const ResourcePlanningLang: ResourceDictionary = {
  header: {
    title: "Resource Planning",

    tab: {
      allPeople: "All People",
      mySchedule: "My schedule",
    },
  },
  schedule: {
    filter: {
      search: "Name employee",
      workingHours: "Working hours",
      status: {
        active: "Active",
        pending: "Pending",
        inactive: "Inactive",
      },
      descending: "Descending by working hours",
      asceding: "Ascending by working hours",
    },
    unit: {
      day: "day",
      hour: "hour",
    },
    unitSymbol: {
      day: "d",
      hour: "h",
    },
    time: {
      eventTime: "{allocation}{unit} for {day} days",
      thisWeek: "This week",
    },
    resourceHeader: {
      available: "Available",
      schedule: "Schedule",
    },
    action: {
      addBooking: "Add booking",
      editBooking: "Edit booking",
    },
    toolTip: {
      resolveBooking: "Resolve overbooking",
      splitBooking: "Split booking",
      duplicateBooking: "Duplicate booking",
      openBudget: "Open budget 'Administration'",
      deleteOverBooking: "Delete overbooking",
    },
  },
  form: {
    title: "Resource Planning",
    services: "Services",
    selectTimeOffCategory: "Select time off category",
    project: "Project",
    timeoff: "Time off",
    detail: "Show booking detail",
    role: "Role",
    dateRange: "Date range",
    createBooking: "Create booking",
    allocation: "Allocation",
    note: "Note",
    leftToSchedule: "Left to schedule",
    estimate: "Estimate",
    work: "Work",
    schedule: "Schedule",
    timeOffType: {
      vacation: "Vacation",
      sick: "Sick leave",
      other: "Not available",
    },
    editActions: {
      duplicate: "Duplicate booking",
      delete: "Delete overbooking",
      repeat: "Repeat booking",
      split: "Split booking",
      resolve: "Resolve overbooking",
      openAdmin: "Open budget 'Administration'",
    },
    error: {
      split: "Cannot split booking, day range is too short",
      duplicate: "Cannot duplicate booking",
      repeat: "Cannot repeat booking",
    },
    week: "Weeks",
    numberOf: "Number of {type}",
    weekOrMonth: "Weeks or months",
    time: "Times",
    repeatTimes: "Repeat for",
    month: "Months",
    confirmDelete: "Are you sure to delete?",
    timeOffCategory: "Time off category",
    createSuccess: "Create booking successfully",
    createFailed: "Create booking failed",
    editBooking: "Edit booking",
    updateSuccess: "Update booking successfully",
    updateFailed: "Update booking failed",
    deleteSuccess: "Delete booking successfully",
    deleteFailed: "Delete booking failed",
  },
};
