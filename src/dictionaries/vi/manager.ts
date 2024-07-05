import { ManagerDictionary } from "dictionaries/types/ManagerDictionary";

export const ManagerLang: ManagerDictionary = {
  approve: "chấp nhận",
  reject: "từ chối",
  companyList: {
    head: {
      title: "Danh sách công ty | Taskcover",
    },
    title: "Danh sách công ty",
    accountList: "Danh sách tài khoản",
    staffPaid: "Số nhân viên đã thanh toán",
    totalStaff: "Tổng số nhân viên",
    approved: "Đã chấp nhận",
    rejected: "Đã từ chối",
    company: "công ty",
    confirm: {
      title: "Xác nhận {label}",
      content:
        "Bạn chắc chắn muốn {label} {count, plural, =1 {công ty} other {các công ty}} này?",
    },
  },
  employeeList: {
    head: {
      title: "Nhân viên công ty | Taskcover",
    },
    title: "Nhân viên công ty ",
    staffPaid: "Số nhân viên đã thanh toán",
    staffUnpaid: "Số nhân viên chưa thanh toán",
    company: "Công ty",
    confirm: {
      title: "Xác nhận {label}",
      content:
        "Bạn chắc chắn muốn {label} {count, plural, =1 {tài khoản} other {các tài khoản}} này?",
    },
  },
};
