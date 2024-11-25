import { useMutation, useQuery } from "react-query";
import { settingNotificationApi } from "./api";

const useSettingNotification = () => {
    const settingNotification = useMutation({
        mutationFn: settingNotificationApi,
    });




    return { settingNotification };
};
export default useSettingNotification;
