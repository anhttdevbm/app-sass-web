import LandingAboutUsPage from "components/sn-landing-about-us";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { NS_CONTENTS } from "constant"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations(NS_CONTENTS);
    return {
        title: t("aboutUs.head.title"),
    };
}

export default function Page(){
    return (
        <>
            <LandingAboutUsPage />
        </>
    );
}