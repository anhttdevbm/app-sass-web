import { NS_AI_AGENT } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_AI_AGENT);

  return {
    title: t("general.header.title"),
  };
}

export default function Page() {
  return <div>Generals</div>;
}
