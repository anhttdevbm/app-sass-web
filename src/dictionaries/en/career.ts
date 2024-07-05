import { CareerDictionary } from "dictionaries/types/CareerDictionary";

export const CareerLang: CareerDictionary = {
    career: {
        head: {
            title: "Career"
        }
    },

    title_form: "Career",

    actions: {
        search: "search",
        update:{
            title:"Are you sure to update?",
            content:"Update {label}"
        }
    },

    careerTable: {
        id: "ID",
        title: "Title",
        slug: "Slug",
        description: "Description",
        location: "Location",
        time: "Time",
        numberOfHires: "Number of hires",
        statusList: {
            is_opening: "Opening",
            is_closed: "Closing",
        },
        responsed : "Note",
        endtime : "-"
    },
    
    status: "Status",
    is_opening: "Opening",
    is_closed: "Closing",
    Closed:"Closed",
    ReOpen:"Re Open",
    form_career: {
        title: "Title",
        slug: "Slug",
        description: "Description",
        location: "Location",
        start_time: "Start time",
        end_time: "End time",
        numberOfHires: "Number of hires",
        is_opening: "Status",
        opening: "Open",
        closed: "Closed",
    },

    career_success: {
        notification: {
            success_responsed: "{label} Successful career",
            error_responsed_date: "Error Date",
        },
    },

    career_title_view: {
        head: {
            title: "Review career category ",
        },
        key: "Review career category ",
        title: "List of reviews",
    },

    confirmRemove: {
        content: "Are you sure to remove this category ? ",
        title: "Confirm remove category",
    },
    update:"Update",
}