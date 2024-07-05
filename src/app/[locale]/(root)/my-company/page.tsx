import AppWrapper from "components/Wrapper";
import InformationCompanyPage from "components/sn-company-detail/Information";
import Wrapper from "components/sn-company-detail/Information/Wrapper";
import { NS_COMPANY } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_COMPANY);

  return {
    title: t("information.head.title"),
  };
}

export default function Page() {
  return (
    <AppWrapper overflow="auto">
      <Wrapper>
        <InformationCompanyPage />
      </Wrapper>
    </AppWrapper>
  );
}
