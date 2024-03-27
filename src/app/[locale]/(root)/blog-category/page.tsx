import Wrapper from "components/Wrapper";
import { Actions, ItemList } from "components/sn-blog-category";
import { NS_BLOG } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations(NS_BLOG);
    return {
        title: t("blogCategory.head.title"),
    };
}
export default function Page() {
    return (
        // eslint-disable-next-line react/jsx-no-undef
        <Wrapper overflow="auto">
            <Actions />
            <ItemList />
        </Wrapper>
    );
}
