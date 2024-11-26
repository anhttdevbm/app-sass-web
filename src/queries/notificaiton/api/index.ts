import { Endpoint } from "api";
import { client } from "api/client";
import { NOTIFY_API_URL } from "constant/index";



export const getListHistoryApi = (params) => {
    return client.get(Endpoint.NOTIFY_GET_ALL, {
        userId: params
    }, {
        baseURL: NOTIFY_API_URL,
    });
};


export const updateReadStatusApi = (id) => {
    return client.put(Endpoint.NOTIFY_READ_STATUS, {}, {
        baseURL: NOTIFY_API_URL,
        params: {
            userId: id,
        },
    });
};


export const settingNotificationApi = (payload) => {
    return client.post(Endpoint.NOTIFY_APPLY_SETTING, payload, {
        baseURL: NOTIFY_API_URL,
    });
}


export const getSettingNotificationApi = () => {
    return client.get(Endpoint.NOTIFY_GET_SETTING, {}, {
        baseURL: NOTIFY_API_URL,
    });
}