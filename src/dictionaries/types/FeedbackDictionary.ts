import { string } from "yup"

export type FeedbackDictionary={
    feedback :{
        head:{
            title:string
        }
    },

    actions: {
        search: string
    },
    
    feedbackTable: {
        id: string,
        topic: string,
        name: string,
        phone: string,
        email: string,
        mailBcc: string,
        subject: string,
        content: string,
        status:string,
        responsed:string,
        editResponsed:string,
        delete:string,
        statusList: {
            responsed: string,
            watting_response: string,
        },
    },
    status: string,
    responsed:string,
    watting_responsed:string,
    form_Feedback : {
        label_form_update: string,
        name: string,
        title: string,
        phone: string,
        content: string,
        responsed_content: string,
        placeholder: string,
    }

    Feedback_success:{
        notification:{
            success_responsed: string,
        },
    },

    Feedback_title_view:{
        head:{
            title: string,
        },
        key: string,
        title : string,
    },
}