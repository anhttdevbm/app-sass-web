import CostHistoryPage from "components/sn-cost-history";
import { NS_COMPANY } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_COMPANY);

  return {
    title: t("costHistory.head.title"),
  };
}

export default function Page() {
  return <CostHistoryPage />;
}
