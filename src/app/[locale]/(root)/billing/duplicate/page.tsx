import Wrapper from "components/Wrapper";
import InformationBillingPage from "components/sn-billing-detail";
import { NS_BILLING } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_BILLING);
  return {
    title: "Thông tin hóa đơn | taskcover",
  };
}
export default function Page() {
  return (
    <>
      <InformationBillingPage />
    </>
  );
}
