import ForgotPage from "components/sn-forgot-password";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { NS_AUTH } from "constant/index";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_AUTH);

  return {
    title: t("forgot.head.title"),
  };
}

export default function Page() {
  return <ForgotPage />;
}
