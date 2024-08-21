import Skeleton from "components/sn-ticket/layout/Skeleton";
import dynamic from "next/dynamic";

const TicketDetail = dynamic(
  () =>
    import("components/sn-ticket/module/ticket-detail/ticket-detail-template"),
  {
    ssr: false,
    loading: () => <Skeleton />,
  },
);

export default function Page() {
  return <TicketDetail />;
}
