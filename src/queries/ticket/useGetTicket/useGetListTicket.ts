import { useQuery } from "react-query";

const useGetListTicket = () => {
  return useQuery({
    queryKey: [],
    queryFn: () => {},
    staleTime: 60,
    enabled: true,
  });
};

export default useGetListTicket;
