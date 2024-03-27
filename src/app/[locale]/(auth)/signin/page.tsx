import { Wrapper, MainSection, Banner } from "components/sn-signin";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { NS_AUTH } from "constant/index";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_AUTH);

  return {
    title: t("signin.head.title"),
  };
}

export default function Page({ params }) {
  return (
    <Wrapper>
      <MainSection />
      <Banner />
    </Wrapper>
  );
}
