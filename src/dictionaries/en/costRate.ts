import { CostRateDictionary } from "dictionaries/types/CostRateDictionary";

export const CostRateLang: CostRateDictionary = {
  head: {
    title: "Cost Rate | Taskcover",
    tab: {
      userInfo: "Information",
      costRate: "Cost Rate",
    },
  },
  empty: {
    title: "doesn't have any defined cost rate",
    subtitle: "Add cost rate to track employee salaries",
    addCostRate: "Add Cost Rate",
  },
  form: {
    type: "Cost Rate Type",
    costPerMonth: "Cost Per Month",
    currency: "Currency",
    workingHours: "Working Hours",
    startDate: "Start Date",
    endDate: "End Date",
    holidayCalendar: "Holiday Calendar",
    note: "Note",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
    overhead: "Over Head",
    weekly: "Weekly",
    monthly: "Monthly",
  },
  table: {
    startDate: "Start Date",
    endDate: "End Date",
    type: "Cost Rate Type",
    cost: "Cost",
    hourly: "Hourly Wage",
    capacity: "Capacity",
    note: "Note",
  },
  confirmDelete: {
    title: "Confirm delete cost rate",
    content:
      "Are you sure to delete {count, plural, =1 {this cost rate} other {# cost rates}}?",
  },
  info: {
    currentCostRate: "Current Cost Rate",
    workingDays: "Working Days",
    costType: "Cost Type",
    costPerMonth: "Cost Per Month",
    atCurrentCostRate: "At current cost rate",
    capacity: "Capacity",
    currentHourlyCost: "Current Hourly Cost",
    overhead: "Overhead",
  },
  notification: {
    addSuccess: "Add Cost Rate successfully.",
    updateSuccess: "Update Cost Rate successfully.",
    deleteSuccess: "Delete Cost Rate successfully.",
  },
};
