import CreatePage from "components/sn-invoice/Create/FormCreate";
import { NS_BILLING } from "constant/index";
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
    <CreatePage />
    // <Wrapper>
    // <Actions />

    // </Wrapper>
  );
}
