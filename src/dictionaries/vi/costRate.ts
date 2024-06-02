import { CostRateDictionary } from "dictionaries/types/CostRateDictionary";

export const CostRateLang: CostRateDictionary = {
  head: {
    title: "Cost Rate | Taskcover",
    tab: {
      userInfo: "Thông tin",
      costRate: "Cost Rate",
    },
  },
  empty: {
    title: "chưa có thông tin cost rate",
    subtitle: "Thêm cost rate để theo dõi lương nhân viên",
    addCostRate: "Thêm Cost Rate",
  },
  form: {
    type: "Loại Cost Rate",
    costPerMonth: "Lương hằng tháng",
    currency: "Tiền tệ",
    workingHours: "Số giờ làm việc",
    startDate: "Ngày bắt đầu",
    endDate: "Ngày kết thúc",
    holidayCalendar: "Lịch nghỉ lễ",
    note: "Ghi chú",
    mon: "T2",
    tue: "T3",
    wed: "T4",
    thu: "T5",
    fri: "T6",
    sat: "T7",
    sun: "CN",
    overhead: "Over Head",
    weekly: "Hằng tuần",
    monthly: "Hằng tháng",
  },
  table: {
    startDate: "Ngày bắt đầu",
    endDate: "Ngày kết thúc",
    type: "Loại Cost Rate",
    cost: "Cost",
    hourly: "Lương giờ",
    capacity: "Tổng giờ làm",
    note: "Ghi chú",
  },
  info: {
    currentCostRate: "Cost Rate hiện tại",
    workingDays: "Số ngày làm việc",
    costType: "Loại cost rate",
    costPerMonth: "Lương tháng",
    atCurrentCostRate: "Lương giờ",
    capacity: "Tổng số giờ",
    currentHourlyCost: "Lương giờ",
    overhead: "Overhead",
  },
  confirmDelete: {
    title: "Xác nhận xóa cost rate",
    content:
      "Bạn có chắc chắn muốn xóa {count, plural, =1 {cost rate này} other {# cost rate}}?",
  },
  notification: {
    addSuccess: "Thêm Cost Rate thành công.",
    updateSuccess: "Sửa Cost Rate thành công.",
    deleteSuccess: "Xóa Cost Rate thành công.",
  },
};
