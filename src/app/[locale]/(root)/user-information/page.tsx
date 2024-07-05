import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Wrapper from "components/Wrapper";
import EmployeeDetailPage from "components/sn-employee-detail";
import { NS_ACCOUNT } from "constant/index";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_ACCOUNT);

  return {
    title: t("accountInformation.head.title"),
  };
}

export default function Page() {
  return (
    <Wrapper overflow="auto">
      <EmployeeDetailPage type="SELF" />
    </Wrapper>
  );
}
