import { useQuery } from "react-query";
import { getDashBoardApi } from "../api";
import { QUERY_AGENT_KEY } from "../keys";
import { useAppSelector } from "store/hooks";
import { selectParamsDashboard } from "store/ticket-agent/selectors";

const useGetDashboardData = () => {
  const params = useAppSelector(selectParamsDashboard);

  const paramsStatistical = {
    ...params,
    fields: `["TICKETCREATE" , "TICKETUNSOLVED" , "TICKETSOLVED" , "AVGFIRSTREPLY" , "AGENTONLINE" , "AVGRATESTAR"]`,
  };
  const paramsColumnChart = { ...params, fields: `["AVGTICKETBYWEEK"]` };
  const paramsOpenTicket = { ...params, fields: `["TICKETOPEN"]` };
  const paramsPieTickets = { ...params, fields: `["TICKETBYSTATUS"]` };
  const paramsLineChartTicket = { ...params, fields: `["AGENTPERFORMANCE"]` };
  const paramsTopAgentByResolved = {
    ...params,
    fields: `["TOPAGENTBYRESOLVED"]`,
  };

  const paramsTopAgentByRating = {
    ...params,
    fields: `["TOPAGENTBYRATING"]`,
  };

  const statisticalData = useQuery({
    queryKey: [QUERY_AGENT_KEY.TICKET_DASHBOARD, paramsStatistical],
    queryFn: () => getDashBoardApi(paramsStatistical),
    staleTime: 60,
    enabled: true,
  });

  const columnChartData = useQuery({
    queryKey: [QUERY_AGENT_KEY.TICKET_DASHBOARD, paramsColumnChart],
    queryFn: () => getDashBoardApi(paramsColumnChart),
    staleTime: 60,
    enabled: true,
  });

  const openTicketData = useQuery({
    queryKey: [QUERY_AGENT_KEY.TICKET_DASHBOARD, paramsOpenTicket],
    queryFn: () => getDashBoardApi(paramsOpenTicket),
    staleTime: 60,
    enabled: true,
  });

  const pieTicketsData = useQuery({
    queryKey: [QUERY_AGENT_KEY.TICKET_DASHBOARD, paramsPieTickets],
    queryFn: () => getDashBoardApi(paramsPieTickets),
    staleTime: 60,
    enabled: true,
  });

  const lineChartTicketData = useQuery({
    queryKey: [QUERY_AGENT_KEY.TICKET_DASHBOARD, paramsLineChartTicket],
    queryFn: () => getDashBoardApi(paramsLineChartTicket),
    staleTime: 60,
    enabled: true,
  });

  const topAgentByResolvedData = useQuery({
    queryKey: [QUERY_AGENT_KEY.TICKET_DASHBOARD, paramsTopAgentByResolved],
    queryFn: () => getDashBoardApi(paramsTopAgentByResolved),
    staleTime: 60,
    enabled: true,
  });

  const topAgentByRatingData = useQuery({
    queryKey: [QUERY_AGENT_KEY.TICKET_DASHBOARD, paramsTopAgentByRating],
    queryFn: () => getDashBoardApi(paramsTopAgentByRating),
    staleTime: 60,
    enabled: true,
  });
  

  return {
    statisticalData,
    columnChartData,
    openTicketData,
    pieTicketsData,
    lineChartTicketData,
    topAgentByResolvedData,
    topAgentByRatingData,
  };
};
export default useGetDashboardData;
