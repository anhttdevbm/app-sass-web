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
    form: {
      type: "Cost Rate Type",
      costPerMonth: "Cost Per Month",
      currency: "Currency",
      workingHours: "Working Hours",
      startDate: "Start Date",
      endDate: "End Date",
      holidayCalendar: "Holiday Calendar",
      note: "Note",
    },
    notification: {
      addSuccess: "Add Cost Rate successfully.",
    },
  },
};
