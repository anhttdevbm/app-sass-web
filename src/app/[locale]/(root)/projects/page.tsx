import { Actions, ItemList, Wrapper } from "components/sn-projects";
import { NS_PROJECT } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_PROJECT);

  return {
    title: t("list.head.title"),
  };
}
export default function Page() {
  return (
    <Wrapper>
      <Actions />
      <ItemList />
    </Wrapper>
  );
}
