import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NS_PROJECT } from "constant/index";
import { WrapBudgeting } from "components/sn-budgeting/WrapBudgeting";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_PROJECT);

  return {
    title: t("budget.head.title"),
  };
}

export default function Page() {
  return <WrapBudgeting />;
}
