import { string } from "yup"

export type CareerDictionary={
    career :{
        head:{
            title:string
        }
    },

    actions: {
        search: string,
        update:{
            title:string,
            content:string,
        }
    },

    title_form: string,
    
    careerTable: {
        id: string,
        title: string,
        slug: string,
        description: string,
        location: string,
        time:string,
        numberOfHires:string,
        statusList: {
            is_opening: string,
            is_closed: string,
        },
        responsed : string,
        endtime : string,
    },

    status: string,
    is_opening: string,
    is_closed: string,
    Closed:string,
    ReOpen:string,
    form_career : {
        title: string,
        slug: string,
        description: string,
        location: string,
        start_time:string,
        end_time:string,
        numberOfHires:string,
        is_opening: string,
        opening: string,
        closed: string,
    }

    career_success:{
        notification:{
            success_responsed: string,
            error_responsed_date: string,
        },
    },

    career_title_view:{
        head:{
            title: string,
        },
        key: string,
        title : string,
    },

    confirmRemove: {
        title: string,
        content: string
    },
    update:string,
}