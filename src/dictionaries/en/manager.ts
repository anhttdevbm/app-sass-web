import { ManagerDictionary } from "dictionaries/types/ManagerDictionary";

export const ManagerLang: ManagerDictionary = {
  approve: "approve",
  reject: "reject",
  companyList: {
    head: {
      title: "Companies Management | Taskcover",
    },
    title: "Companies Management",
    accountList: "Account List",
    staffPaid: "Staff paid",
    totalStaff: "Total staff",
    approved: "Approved",
    rejected: "Rejected",
    company: "company",
    confirm: {
      title: "Confirm {label}",
      content:
        "Are you sure to {label} {count, plural, =1 {this company} other {these companies}}?",
    },
  },
  employeeList: {
    head: {
      title: "Employees | Taskcover",
    },
    title: "Employees",
    staffPaid: "Staff paid",
    staffUnpaid: "Staff unpaid",
    company: "Company",
    confirm: {
      title: "Confirm {label}",
      content:
        "Are you sure to {label} {count, plural, =1 {this account} other {these accounts}}?",
    },
  },
};
