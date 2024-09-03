import InformationBillingPage from "components/sn-billing-detail";
import { NS_INVOICE } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_INVOICE);
  return Promise.resolve({
    title: t("seo.title"),
  });
}
export default function Page() {
  return (
    <>
      <InformationBillingPage />
    </>
  );
}
