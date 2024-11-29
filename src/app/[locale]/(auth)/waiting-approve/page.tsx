import WaitingApprove from "components/sn-waiting-approve";
import { NS_AUTH } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_AUTH);

  return {
    title: t("waitingApprove.head.title"),
  };
}

export default function Page() {
  return <WaitingApprove />;
}
