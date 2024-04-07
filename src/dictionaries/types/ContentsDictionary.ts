export type ContentsDictionary = {
    home: {
        head: {
            title:string,
        },
        notification: {
            updateSuccess: string
        },
        banner: string,
        explore_how_we: string
        update_explore_how_we: string,
        powerfull_agent: string,
        update_powerfull_agent: string
    },
    aboutUs: {
        head: {
            title:string,
        },
        question: string,
        allStarTeam: string,
        mostViewedArticles: string,
        mission: string,
        banner: string
        updateQuestion: string
        updateAllStarTeam: string
        updateMostViewedArticles: string
        updatemission: string,
        startTeamMemberTable: {
            name: string,
            work_experience: string,
            college: string,
            description: string,
            avatar: string,
            email: string,
            position: string,
            social_link: string,
            detail: string,
        },
        title_form: string
    },
    helpCenter: {
        head: {
            title: string,
        },
        usage_tips: string,
        update_usage_tips: string
    },
    trustCenter: {
        head: {
            title: string,
        },
        building_trust: string,
        update_building_trust: string
    },
    action: {
        edit: string
    },
    tableList: {
        name?: string,
        title?: string,
        tab_name?: string,
        description?: string,
        image?: string,
        link?: string,
        logo?: string,
        banner?: string,
    },
    content_success: {
        notification: {
            success_responsed: string,
        },
    },
}