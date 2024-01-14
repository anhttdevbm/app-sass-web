import { BillingDictionary } from "dictionaries/types/BillingDictionary";

export const BillingLang: BillingDictionary = {
  list: {
    head: {
      title: "",
    },
    filter: {
      recent: "",
      saved: "",
      status: "Trạng thái",
      add: "Thêm bộ lọc",
    },
    form: {
      title: {
        for_invoice: "Lập hóa đơn",
        uninvoiced_time_expenses: "Không lập hóa đơn thời gian và chi phí",
        uninvoiced_amount: "Không lập hóa đơn số lượng",
        display_service: "Dịch vụ hiển thị ",
        subsidiary: "Công ty con",
        subTotal: "Tổng phụ",
        vat: "VAT",
        total: "Tổng cộng",
        invoice_preview: "Xem trước hóa đơn",
        display_expenses: "Chi phí trưng bày",
        of_the_budget_revenue: " Trong thu ngân sách",
      },
      step: {
        title: {
          budgets: "Thiết lập ngân sách",
          preview: "Xem chi tiết đơn hàng",
        },
      },
      content: {
        step1: {
          content1: "Bạn muốn xuất hóa đơn gì?",
          content2: "Chọn ngân sách sẽ được liên kết với hóa đơn này.",
          companyName: "Company AI chat generate",
        },
        step2: {
          content1: "Giờ và chi phí nào nên được ghi trên Hóa đơn?",
          content2: "Phương thức lập hóa đơn",
        },
      },
      table_step_1: {
        for_invoicing: "Lập hóa đơn",
        name: "Tên",
        project: "Dự án",
        revenue: "Doanh thu",
        status: "Trạng thái",
      },
      table_step_2: {
        amount: "Số lượng",
        description: "Mô tả",
        qty: "Qty",
        rate: "Tỷ lệ",
        service_type: "Loại dịch vụ",
        unit: "Đơn vị",
      },
      filter: {
        add: "Thêm bộ lọc",
      },
      button: {
        nextStep: "Bước tiếp theo",
        submit: "Xác nhận",
      },
    },
    table: {
      subject: "Hóa đơn",
      invoiceNumber: "Mã hóa đơn",
      date: "Ngày tạo",
      company: "Tên công ty",
      budgets: "Ngân sách",
      att: "att",
      amount: "Đã thanh toán",
      amountUnpaid: "Chưa thanh toán",
      dueDate: "Ngày hết hạn",
    },
    exportView: {
      fullNameCompany: "",
      subject: "Hóa đơn",
      client: "Khách hàng",
      date: "Ngày tạo",
      dueDate: "Ngày hết hạn",
      createBy: "Người tạo",
      payment: {
        description: "Mô tả",
        unit: "Đơn vị",
        quality: "",
        rate: "Tỷ lệ",
        amount: "Số tiền",
      },
      subTotal: "Tổng phụ",
      vat: "Thuế",
      grandTotal: "Tổng cộng",
    },
    button: {
      invoice: "Hóa đơn",
      exportView: "Xuất chế độ xem",
    },
    modalExport: {
      documentFormat: "Định dạng tài liệu",
      orientation: "Hướng",
      pageSize: "Kích thước trang",
      title: "Xuất chế độ xem",
      button: {
        cancel: "Hủy",
        export: "Xuất file",
      },
    },
  },
  detail: {
    form: {
      invoice: {
        table: {
          amount: "Số tiền",
          description: "Mô tả",
          qty: "Qty",
          rate: "Tỷ lệ",
          service_type: "Loại dịch vụ",
          unit: "Đơn vị",
          discount: "Giảm giá",
        },
        tableBudget: {
          linkedBudget: "Ngân sách được liên kết",
          timePeriod: "Khoảng thời gian",
          invoicedwithoutTax: "Hóa đơn (không có thuế)",
          leftForInvoicing: "Còn lại để lập hóa đơn",
        },
        bill: {
          fullCompanyName: "Tên công ty",
          taxID: "Tax ID",
          street: "Đường/phố",
          city: "Thành phố",
          postcode: "ZIP",
          state: "Quận/huyện",
          country: "Quốc gia",
          save: "Lưu làm thanh toán mặc định cho khách hàng",
          title: {
            billTo: "Hóa đơn đến",
            billFrom: "Hóa đơn từ",
          },
        },
        button: {
          sentToClient: "Gửi cho khách hàng",
          edit: "Chỉnh sửa",
          addNewRow: "Thêm hàng mới",
          linkBudget: "Ngân sách liên kết",
          option: {
            viewPdf: "Hiển thị PDF",
            download: "Tải xuống",
            replace: "Đổi tên",
          },
          cancel: "Hủy",
          save: "Lưu",
        },
        title: {
          dateSent: "Ngày gửi",
          invoicePDF: "Hóa đơn PDF",
          billTo: "Hóa đơn đến:",
          billFrom: "Hóa đơn từ:",
          message: "Thông báo hiển thị trên hóa đơn",
          subject: "Tiêu đề",
          invoiceNumber: "Số hóa đơn",
          invoiceDate: "Ngày tạo",
          dueDate: "Ngày hết hạn",
          poNumber: "Số PO",
          subtotal: "Tổng phụ:",
          tax: "Tax",
          total: "Tổng cộng:",
          name: "Tên",
          value: "Giá trị (%)",
          invoice: "Hóa đơn",
          vat: "VAT",
        },
      },
      feed: {
        table: {},
        button: {
          sendComment: "Gửi bình luận ",
          option: {
            comments: "Bình luận",
            attachments: "Tệp đính kèm",
            changes: "Thay đổi",
          },
        },
        title: {
          writeYourComment: "Viết bình luận của bạn",
          show: "Hiển thị",
          paidOn: "Được thanh toán theo thiết lập ",
          Feed: "Phản hồi",
        },
      },
      payment: {
        table: {
          dueDate: "Ngày hết hạn",
          totalInvoice: "Tổng hóa đơn",
          paid: "Đã trả",
          leftToPay: "Còn lại phải trả",
        },
        table2: {
          status: "Trạng thái",
          date: "Ngày",
          overdue: "Overdue",
          amount: "Số tiền",
          note: "Ghi chú",
        },
        button: {
          cancel: "Hủy",
          updatePayment: "Cập nhật thanh toán",
          option: {
            edit: "Sửa",
            delete: "Xóa",
          },
        },
        title: {
          payments: "Thanh toán",
          editPayment: "Chỉnh sửa thông tin thanh toán",
          amount: "Số tiền",
          note: "Ghi chú",
          paidOn: "Ngày sửa",
        },
      },
      top: {
        button: {
          markAsSent: "Đánh dấu là đã gửi",
          cancel: "Hủy",
          saveChange: "Lưu thay đổi",
          edit: "Chỉnh sửa",
          option: {
            duplicateInvoice: "Nhân bản invoice",
            createCreditNote: "Tạo ghi chú tín dụng",
            deleteInvoice: "Xóa invoice",
          },
        },
        title: {
          paid: "Đã trả",
        },
      },
    },
  },
  viewPdf: {
    title: {},
    button: {
      insertComment: "Thêm phản hồi",
      openNewTab: "Mở tab mới",
      download: "Tải file",
    },
  },
};
