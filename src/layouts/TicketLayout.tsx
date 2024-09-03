import { Endpoint } from "api";
import { NS_COMMON, NS_TICKET } from "constant/index";
import { TICKET_INFO_PATH, TICKET_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { useGetTicketDetail } from "queries/ticket/useGetTicket/useGetTicketById";
import { useEffect } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { getPath } from "utils/index";

const TicketLayout = ({ children }) => {
  const params = useParams();
  const id = params?.id as string;
  const { onUpdateHeaderConfig } = useHeaderConfig();
  const ticketT = useTranslations(NS_TICKET);
  const commonT = useTranslations(NS_COMMON);
  const pathName = usePathname();
  const { data: dataTicket } = useGetTicketDetail();
  useEffect(() => {
    const prevPath = getPath(TICKET_PATH, undefined, { id });
    onUpdateHeaderConfig({
      title: pathName.includes("/create")
        ? "Create ticket"
        : `${ticketT("title")}# ${dataTicket?.code ?? ""}`,
      searchPlaceholder: commonT("searchBy", { name: ticketT("header.key") }),
      endpoint: Endpoint.TICKET,
      key: "name",
      prevPath,
    });
    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        endpoint: undefined,
        key: undefined,
      });
    };
  }, [onUpdateHeaderConfig, pathName, dataTicket]);
  return <>{children}</>;
};

export default TicketLayout;
