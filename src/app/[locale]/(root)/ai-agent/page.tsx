import Wrapper from "components/Wrapper";
import { NS_BLOG } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Actions, List } from "components/sn-ai-agent";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_BLOG);
  return {
    title: "AI Agent",
  };
}
export default function Page() {
  return (
    <Wrapper overflow="auto">
      <Actions />
      <List />
    </Wrapper>
  );
}
