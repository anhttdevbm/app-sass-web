import { ApplicantsDictionary } from "dictionaries/types/ApplicantsDictionary";

export const ApplicantsLang: ApplicantsDictionary = {
    applicants :{
        head:{
            tab_title: "Job information",
            tab_title_applicants : "List of candidate information"
        },
        information: {
            first_name: "First name",
            last_name: "Last name",
            birth: "Birthday",
            email: "Email",
            gender: "Gender",
            phone: "Phone",
            resume_down: "Resume",
            social_link: "Social link",
            response_applicant: "Response Applicant",
            note: "Note"
        },
    },
    form_Applicant : {
        label_form_update: "Respond to Applicant",
        name: "Name",
        phone: "Phone",
        title: "Title",
        content: "Content",
        responsed_content: "Your feedback",
        placeholder : "Content of your response"
    },
    Applicant_success:{
        notification:{
            success_responsed: "Successful Feedback",
        },
    },
    applicantTable: {
        id: "ID",
        topic: 'Topic',
        name: "Name",
        phone: "Phone",
        email: "Email",
        mailBcc: "Mail BCC",
        subject: "Subject",
        content: "Content",
        status: "Status",
        responsed: "Note",
        editResponsed: "Responsed",
        delete: "Delete",
        statusList: {
            responsed: "Responsed",
            watting_response: "Waitting response",
        },
    },
}