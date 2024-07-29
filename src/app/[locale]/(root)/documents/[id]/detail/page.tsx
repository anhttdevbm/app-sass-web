import PageDocDetail from "components/sn-docs/detail/PageDocDetail";
import Wrapper from "components/Wrapper";
import { NS_DOCS } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_DOCS);

  return {
    title: t("title"),
  };
}

export default function Page() {
  return (
    <Wrapper overflow="hidden" transparent>
      <PageDocDetail />
    </Wrapper>
  );
}
