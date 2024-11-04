import { useQuery } from "react-query";
import { useParams } from "next/navigation";
import { QUERY_NOTIFY_KEY } from "./keys";
import { getListHistoryApi } from "./api";
import { useAuth } from "store/app/selectors";


export const useGetHistoryNotification = () => {
    const user = useAuth()
    console.log("🚀 ~ DetaiList ~ user:", user?.user?.id)
    return useQuery({
        queryKey: [QUERY_NOTIFY_KEY.LIST_NOTIFY],
        queryFn: () => getListHistoryApi(user?.user?.id),
    });
};

