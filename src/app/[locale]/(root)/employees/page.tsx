import Wrapper from "components/Wrapper";
import EmployeesPage from "components/sn-employees";
import { NS_COMPANY } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_COMPANY);

  return {
    title: t("employees.head.title"),
  };
}

export default function Page() {
  return (
    <Wrapper overflow="auto" inFrame>
      <EmployeesPage />
    </Wrapper>
  );
}
