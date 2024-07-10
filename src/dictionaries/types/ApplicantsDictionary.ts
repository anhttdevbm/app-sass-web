export type ApplicantsDictionary={
    applicants :{
        head:{
            tab_title:string,
            tab_title_applicants :string
        }
        information: {
            first_name: string,
            last_name: string,
            birth: string,
            email: string,
            gender: string,
            phone: string,
            resume_down: string,
            social_link: string,
            response_applicant: string,
            note: string,
        },
    },
    form_Applicant : {
        label_form_update: string,
        name: string,
        phone: string,
        title: string,
        content: string,
        responsed_content: string,
        placeholder : string
    },
    Applicant_success:{
        notification:{
            success_responsed: string,
        },
    },
    applicantTable: {
        id: string
        topic: string,
        name: string,
        phone: string,
        email: string,
        mailCc: string,
        mailBcc: string,
        subject: string,
        content: string,
        status: string,
        responsed: string,
        editResponsed: string,
        delete: string,
        statusList: {
            responsed: string,
            watting_response: string,
        },
    },
}