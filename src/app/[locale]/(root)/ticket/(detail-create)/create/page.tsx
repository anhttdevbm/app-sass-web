import Skeleton from "components/sn-ticket/layout/Skeleton";
import dynamic from "next/dynamic";

const CreateTicket = dynamic(
  () =>
    import("components/sn-ticket/module/create-ticket/create-ticket-template"),
  {
    ssr: false,
    loading: () => <Skeleton />,
  },
);

export default function Page() {
  return <CreateTicket />;
}
