import { ItemList } from "components/sn-career-detail/Applicants";
import { NS_APPLICANTS } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_APPLICANTS);
  return {
      title: t("applicants.head.tab_title_applicants"),
  };
}

export default function Page() {
  return (
    <>
      <ItemList />
    </>
  );
}
