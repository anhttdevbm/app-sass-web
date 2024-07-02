import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NS_INVOICE } from "constant/index";
import { Wrapper, List, Actions } from "components/sn-invoice";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_INVOICE);
    return Promise.resolve({
        title: t("seo.title"),
    });
}

export default function Page(){
    return(
        <Wrapper>
          <Actions />
          <List />
        </Wrapper>
    );
}
