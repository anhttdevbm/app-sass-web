import Wrapper from "components/Wrapper";
import { Actions, ItemList } from "components/sn-project-types";
import { NS_COMPANY } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_COMPANY);

  return {
    title: t("projectTypes.head.title"),
  };
}

export default function Page() {
  return (
    <Wrapper overflow="auto" inFrame>
      <Actions />
      <ItemList />
    </Wrapper>
  );
}
