import { List, Actions, Wrapper } from "components/sn-ai-agent";
import { NS_AI_AGENT } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { usePromptTemplate } from "store/promptTemplate/selectors";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_AI_AGENT);

  return {
    title: t("seo.title"),
  };
}

export default function Page() {
  return (
    <Wrapper>
      <Actions />
      <List />
    </Wrapper>
  );
}
