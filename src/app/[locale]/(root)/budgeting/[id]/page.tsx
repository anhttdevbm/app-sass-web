import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NS_BUDGETING } from "constant/index";
import Wrapper from "components/Wrapper";
import { BudgetDetail } from "components/sn-budgeting/BudgetDetail";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_BUDGETING);
  return {
    title: t("head.titleDetail"),
  };
}

export default function Page() {
  return (
    <Wrapper sx={{ overflowX: "hidden", overflowY: "auto", scrollBehavior: 'smooth' }} id="budget-detail-container">
      <BudgetDetail />
    </Wrapper>
  );
}
