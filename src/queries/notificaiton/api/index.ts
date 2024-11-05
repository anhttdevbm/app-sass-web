import { client, ticketInstance } from "api/client";
import { NOTIFY_API_URL } from "constant/index";



export const getListHistoryApi = (params) => {
    return client.get(`/notification/history/`, {
        userId: params
    }, {
        baseURL: NOTIFY_API_URL,
    });
};


export const updateReadStatusApi = (id) => {
    console.log("check", id)
    return client.put(`/notification/readStatus/`, {}, {
        baseURL: NOTIFY_API_URL,
        params: {
            userId: id,
        },
    });
};