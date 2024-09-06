// redux/ticketDetail/selectors.ts

import { useEffect } from "react";
import { getListAgent } from "./actions";
import { useAppDispatch } from "store/hooks";

export const selectSearchTicketAgent = (state: any) =>
  state.ticketAgent.keySearch;

export const selectListAgentOnline = (state) => state?.ticketAgent.listOnline;

export const useGetAgents = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getListAgent());
  }, [getListAgent]);
  return null;
};

export const selectListAgent = (state) => state?.ticketAgent.listAgent;
