import { useQuery } from "react-query";
import { getDashBoardApi } from "../api";
import { QUERY_AGENT_KEY } from "../keys";
import { useAppSelector } from "store/hooks";
import { selectParamsDashboard } from "store/ticket-agent/selectors";

const useGetDashboardData = () => {
  const params = useAppSelector(selectParamsDashboard);
  console.log("🚀 ~ useGetDashboardData ~ paramsRedux:", params);

  // const params = {
  //     createTime : "year" ,
  //     fromDate : "" ,
  //     toDate : "" ,
  //     startDate : "",
  //     startDateAvgTicket : "" ,
  //     fields : `["TICKETCREATE" , "TICKETUNSOLVED" , "TICKETSOLVED" , "AVGFIRSTREPLY" , "AGENTONLINE" , "AVGRATESTAR"]`,
  // }

  return useQuery({
    queryKey: [QUERY_AGENT_KEY.TICKET_DASHBOARD, params],
    queryFn: () => getDashBoardApi(params),
    staleTime: 60,
    enabled: true,
  });
};
export default useGetDashboardData;
