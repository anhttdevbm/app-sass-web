import JoinWorkspacePage from "components/sn-join-workspace";
import { NS_AUTH } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_AUTH);

  return {
    title: t("joinWorkspace.head.title"),
  };
}

export default function Page() {
  return <JoinWorkspacePage />;
}
