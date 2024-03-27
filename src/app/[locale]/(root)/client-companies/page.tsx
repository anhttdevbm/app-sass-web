import Wrapper from "components/Wrapper";
import { Actions, ItemList} from "components/sn-client-companies";
import { NS_COMPANY } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_COMPANY);

  return {
    title: t("clientCompany.head.title"),
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
