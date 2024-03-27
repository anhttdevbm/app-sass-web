import ResourceDictionary from "dictionaries/types/ResourceDictionary";

export const ResourcePlanning: ResourceDictionary = {
  header: {
    title: "Quản lý lịch trình",

    tab: {
      allPeople: "Mọi người",
      mySchedule: "Lịch trình của tôi",
    },
  },
  schedule: {
    filter: {
      search: "Tìm tên nhân viên",
      workingHours: "Giờ làm việc",
      status: {
        active: "Đang làm việc",
        pending: "Tạm dừng",
        inactive: "Ngừng làm việc",
      },
      descending: "Giảm dần theo giờ làm",
      asceding: "Tăng dần theo giờ làm",
    },
    time: {
      eventTime: "{allocation}{unit} cho {day} ngày",
      thisWeek: "Tuần này",
    },
    resourceHeader: {
      available: "Khả dụng",
      schedule: "Lịch trình",
    },
    unit: {
      day: "ngày",
      hour: "giờ",
    },
    unitSymbol: {
      day: "ngày",
      hour: "h",
    },
    action: {
      editBooking: "Sửa lịch",
      addBooking: "Thêm lịch",
    },
    toolTip: {
      resolveBooking: "Giải quyết lịch trình",
      splitBooking: "Chia lịch trình",
      duplicateBooking: "Nhân đôi lịch trình",
      openBudget: "Mở ngân sách 'Quản trị'",
      deleteOverBooking: "Xóa lịch trình",
    },
  },
  form: {
    title: "Quản lý lịch trình",
    services: "Dịch vụ",
    selectTimeOffCategory: "Chọn loại nghỉ phép",
    project: "Dự án",
    timeOffCategory: "Loại nghỉ phép",
    timeoff: "Nghỉ phép",
    detail: "Xem chi tiết lịch trình",
    role: "Vai trò",
    dateRange: "Khoảng thời gian",
    createBooking: "Tạo lịch",
    allocation: "Phân bổ",
    note: "Ghi chú",
    leftToSchedule: "Còn lại để lên lịch",
    estimate: "Ước tính",
    work: "Giờ làm",
    schedule: "Lên lịch",
    editActions: {
      delete: "Xóa lịch",
      duplicate: "Nhân đôi lịch",
      split: "Chia lịch",
      openAdmin: "Mở ngân sách 'Quản trị'",
      repeat: "Lặp lại lịch",
      resolve: "Giải quyết lịch",
    },
    error: {
      duplicate: "Không thể nhân đôi lịch",
      repeat: "Không thể lặp lại lịch",
      split: "Không thể chia lịch, khoảng ngày quá ngắn",
    },
    timeOffType: {
      vacation: "Nghỉ phép",
      sick: "Nghỉ ốm",
      other: "Khác",
    },
    repeatTimes: "Lặp lại",
    week: "Tuần",
    time: "Lần",
    numberOf: "Số lần {type}",
    weekOrMonth: "Tuần hoặc tháng",
    month: "Tháng",
    confirmDelete: "Bạn có chắc chắn muốn xóa?",
    createFailed: "Tạo lịch thất bại",
    createSuccess: "Tạo lịch thành công",
    editBooking: "Sửa lịch",
    updateFailed: "Cập nhật lịch thất bại",
    updateSuccess: "Cập nhật lịch thành công",
    deleteFailed: "Xóa lịch thất bại",
    deleteSuccess: "Xóa lịch thành công",
  },
};
