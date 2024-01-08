import { ItemList, Wrapper } from "components/sn-billing";
import CreatePage from "components/sn-billing/Create/FormCreate";
import ViewPdf from "components/sn-billing/Modals/ViewPdf";
import { NS_BILLING, NS_PROJECT } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_BILLING);

  return {
    title: t("list.head.title"),
  };
}
export default function Page() {
  return (
    <Wrapper>
      <ViewPdf />
    </Wrapper>
  );
}
