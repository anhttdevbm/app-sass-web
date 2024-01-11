import { BudgetingDictionary } from "dictionaries/types/BudgetingDictionary";

export const BudgetingLang: BudgetingDictionary = {
    head: {
        title: 'Ngân sách',
        titleDetail: 'Chi tiết ngân sách',
    },
    toolbar: {
        date: 'Ngày',
        addTime: 'Tạo giờ',
        addExpense: 'Tạo chi phí',
        addInvoice: 'Tạo hóa đơn',
        serviceEdit: 'Sửa',
		search: 'Tìm kiếm'
    },
    status: {
        open: 'Đang mở',
        close: 'Đã giao hàng',
    },
    actionStatus: {
        create: 'Đã tạo ngân sách',
		create_service: "Đã tạo dịch vụ của ngân sách"
    },
    tabTime: {
        service: 'Dịch vụ',
        person: 'Người tạo',
        notes: 'Ghi chú',
        time: 'Giờ',
        billable: 'Có thể lập hóa đơn',
        edit: 'Chỉnh sửa',
        delete: 'Xóa'
    },
    tabExpenses: {
        service: 'Dịch vụ',
        description: 'Mô tả',
        date: 'Ngày',
        att: 'Att.',
        paymentStatus: 'Trạng thái thanh toán',
        totalCost: 'Tổng chi phí',
        billable: 'Có thể lập hóa đơn',
    },
    tabInvoice: {
        subject: 'Subject',
        invoiceNumber: 'Invoice number',
        date: 'Date',
        att: 'Attr.',
        amountNoTax: 'Amount (no tax)',
        amountUnpaid: 'Amount unpaid',
        dueDate: 'Due Date',
    },
	tabService: {
		index: {
			name: "Tên",
			workingTime: "Thời gian làm việc",
			price: "Giá",
			cost: "Chi phí",
		},
		section: {
            serviceName: "Tên dịch vụ",
            serviceType: "Loại dịch vụ",
            billingType: "Loại hóa đơn",
            unit: "Đơn vị",
            tracking: "Tracking",
            estimate: "Estimate",
            position: "Vị trí",
            quantity: "Số lượng",
            price: "Giá",
            discount: "Giảm giá",
            totalBudget: "Tổng ngân sách",
            description: "Mô tả"
        }
	},
    dialog: {
        titleModalAdd: "Thêm thời gian",
        titleModalUpdate: "Cập nhật thời gian",
        date: "Ngày",
        project: "Dự án",
        timeRanger: "Khoảng thời gian",
        startTime: "Giờ bắt đầu",
        endTime: "Giờ kết thúc",
        note: "Ghi chú",
        cancelBtnText: "Hủy",
        addBtnText: "Thêm",
        updateBtnText: "Cập nhật",
        editBtnText: "Sửa",
        service: 'Dịch vụ',
        update: 'Cập nhật',
    },
    dialogExpense: {
        titleModalAdd: "New Expense",
        titleModalDetail: "Expense Detail",
        date: "Date",
        person: "Person",
        service: "Service",
        qty: "Qty",
        cost: "Cost",
        currency: "Currency",
        totalCost: "Total Cost",
        markup: "Markup",
        totalBillable: "Total Billable",
        description: "Description",
        reimbursement: "Reimbursement",
        payment: "Payment",
        cancelBtnText: "Camcel",
        createBtnText: "Create Expense",
        updateBtnText: "Update Expense",
      },
	dialogRecurring: {
		titleModalAdd: 'Make this Recurring Budget',
		cancelBtnText: 'Cancel',
        addBtnText: 'Make recurring',
        editBtnText: 'Edit recurring',
		recurringInterval: "Recurring Interval",
		nextOccurrence: "Next Occurrence",
		stopRecurring: "Stop Recurring",
	},
	delete: {
		titleConfirmDelete: "Xác Nhận Xóa",
		contentConfirmDelete: "Bạn có chắc chắn muốn xóa?",
	},
    notifications: {
        updateServiceSuccess: "Cập nhật dịch vụ thành công.",
    }
}
