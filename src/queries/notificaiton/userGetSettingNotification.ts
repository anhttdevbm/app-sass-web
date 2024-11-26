import { useQuery } from "react-query";
import { useParams } from "next/navigation";
import { QUERY_NOTIFY_KEY } from "./keys";
import { getListHistoryApi, getSettingNotificationApi } from "./api";
import { useAuth } from "store/app/selectors";


export const userGetSettingNotification = () => {
    return useQuery({
      queryKey: [QUERY_NOTIFY_KEY.LIST_SETTING],
      queryFn: () => getSettingNotificationApi(),
    });
  };

