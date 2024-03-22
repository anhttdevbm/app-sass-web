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
    status: "Status",
    responsed: "Responsed",
    watting_responsed: "Watting responsed",

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