import { ApplicantsDictionary } from "dictionaries/types/ApplicantsDictionary";

export const ApplicantsLang: ApplicantsDictionary = {
    applicants :{
        head: {
            tab_title: "Thông tin công việc",
            tab_title_applicants : "Danh sách thông tin ứng viên",
        },
        information: {
            first_name: "Họ",
            last_name: "Tên",
            birth: "Ngày sinh",
            email: "Email",
            gender: "Giới tính",
            phone: "Điện thoại",
            resume_down: "Hồ sơ cá nhân",
            social_link: "Mạng xã hội",
            response_applicant: "Phản hồi ứng viên",
            note: "Note"
        },
    },
    form_Applicant: {
        label_form_update: "Phản hồi người nộp đơn",
        name: "Người gửi",
        title: "Tiêu đề",
        phone: "Di động",
        content: "Nội dung",
        responsed_content: "Phản hồi của bạn",
        placeholder: "Nội dung phản hồi của bạn",
    },
    Applicant_success: {
        notification: {
            success_responsed: "Phản Hồi Thành Công",
        },
    },
    applicantTable: {
        id: "Mã",
        topic: 'Topic',
        name: "Người gửi",
        phone: "Di động",
        email: "Email",
        mailBcc: "Mail BCC",
        subject: "Tiêu đề",
        content: "Nội dung",
        status: "Trạng thái",
        responsed: "Note",
        editResponsed: "Phản hồi",
        delete: "Xóa",
        statusList: {
            responsed: "Đã trả lời",
            watting_response: "Chờ phản hồi",
        },
    },
}