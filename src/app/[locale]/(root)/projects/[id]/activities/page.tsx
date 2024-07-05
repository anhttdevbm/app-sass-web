import { ItemList, Actions } from "components/sn-project-detail/Activities";
import { NS_PROJECT } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_PROJECT);

  return {
    title: t("detailActivities.head.title"),
  };
}

export default function Page() {
  return (
    <>
      <Actions />
      <ItemList />
    </>
  );
}
