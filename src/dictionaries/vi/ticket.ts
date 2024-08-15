import { TicketDictionary } from "dictionaries/types/TicketDictionary";

export const TicketLang: TicketDictionary = {
  ticket: {
    head: {
      title: "Vé",
    },
  },
  title: "Vé",
  // blogList: {
  //     head: {
  //         title: "Danh sách vé",
  //     },
  //     title: "Tiêu đề",
  //     content: "Nội dung",
  //     category: "Danh mục",
  //     tag: "Nhãn dán",
  //     statusBlog:"Trạng thái",
  //     slug:"Đường dẫn",
  //     created_time : "Ngày tạo",
  //     short_description : "Mô tả",
  //     notification: {
  //         success: "Cập nhật trạng thái {label} thành công"
  //     },
  // },
  hide: "Ẩn",
  actions: {
    createTicket: "Thêm mới",
    search: "Tìm kiếm",
    status: "Trạng thái",
    delete: {
      title: "Xác nhận xóa Vé",
      confirm: "Bạn muốn xóa Vé ?",
      remove: "Xóa",
    },
    draft: "Nháp",
    published: "Xuất bản",
    hide: "Ẩn",
    update: {
      title: "Bạn có muốn cập nhật trạng thái ?",
      content: "Cập nhật trạng thái sang {label} ",
    },
    updateTicket: "Cập nhật",
  },
  status: {
    published: "Xuất bản",
    draft: "Nháp",
    hide: "Ẩn",
  },
  comment: {
    writeComment: "Viết bình luận",
    sendComment: "Gửi bình luận",
  },
  error: {
    anErrorTryAgain: "Có lỗi xảy ra, vui lòng thử lại !",
  },
  PUBLISHED: "xuất bản",
  DRAFT: "nháp",
  HIDE: "ẩn",
};
