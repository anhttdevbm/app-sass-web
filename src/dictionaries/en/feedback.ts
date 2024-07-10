import { FeedbackDictionary } from "dictionaries/types/FeedbackDictionary";

export const FeedbackLang : FeedbackDictionary={
    feedback: {
        head: {
            title: "Feedback"
        }
    },

    actions: {
        search: "search"
    },

    feedbackTable: {
        id: "ID",
        topic: 'Topic',
        name: "Name",
        phone: "Phone",
        email: "Email",
        mailBcc: "Mail BCC",
        mailCC: "Mail CC",
        subject: "Subject",
        content: "Content",
        status: "Status",
        responsed: "Note",
        editResponsed: "Responsed",
        delete: "Delete",
        statusList: {
            responded: "Responded",
            watting_responde: "Waitting responde",
        },
    },
    status: "Status",
    responded: "Responded",
    watting_responde: "Watting responde",

    form_Feedback : {
        label_form_update: "Respond to reviews",
        name: "Name",
        phone: "Phone",
        title: "Title",
        content: "Content",
        responsed_content: "Your feedback",
        placeholder : "Content of your response"
    },

    Feedback_success:{
        notification:{
            success_responsed: "Successful Feedback",
        },
    },

    Feedback_title_view:{
        head:{
            title: "Review feedback category ",
        },
        key: "Review feedback category ",
        title : "List of reviews",
    },
}