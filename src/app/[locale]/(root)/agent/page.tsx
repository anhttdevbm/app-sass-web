import Skeleton from "components/sn-ticket/layout/Skeleton";
import { NS_TICKET } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const TicketAgent = dynamic(
  () => import("components/sn-ticket-agent/template/ticket-agent"),
  {
    ssr: false,
    loading: () => <Skeleton />,
  },
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_TICKET);

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <TicketAgent />;
}
