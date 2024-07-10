import AIChat from "components/sn-ai-chat";
import { NS_AI_CHAT } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_AI_CHAT);

  return {
    title: t("aiChat.title")
  };
}

export default function Page() {
  return <AIChat />;
}
