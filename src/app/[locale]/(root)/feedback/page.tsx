import Wrapper from "components/Wrapper";
import { Actions, ItemList } from "components/sn-feedback";
// import { Actions, ItemList } from "components/sn-blogs";
import { NS_FEEDBACK } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations(NS_FEEDBACK);
    return {
        title: t("feedback.head.title"),
    };
}
export default function Page(){
    return(
        <Wrapper overflow="auto">
            <Actions/>
            <ItemList/>
        </Wrapper>
    );
}