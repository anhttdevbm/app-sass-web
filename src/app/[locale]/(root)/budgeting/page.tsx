import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NS_BUDGETING } from "constant/index";
import AppWrapper from "components/Wrapper";
import { WrapBudgeting } from "components/sn-budgeting/WrapBudgeting";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_BUDGETING);
  return {
    title: t("head.title"),
  };
}

export default function Page() {
  return (
    <AppWrapper overflow="auto" inFrame>
      <WrapBudgeting />
    </AppWrapper>
  );
}
