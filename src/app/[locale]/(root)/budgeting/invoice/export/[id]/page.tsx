import { Wrapper } from "components/sn-billing";
import ViewPdfInvoice from "components/sn-budgeting/TabDetail/Invoices/ViewPdfInvoice";
import { NS_BUDGETING } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_BUDGETING);

  return {
    title: t("head.title"),
  };
}
export default function Page() {
  return (
    <Wrapper>
      <ViewPdfInvoice />
    </Wrapper>
  );
}
