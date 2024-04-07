import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { NS_CONTENTS } from "constant"
import { Grid } from "@mui/material";
import LandingHelpCenterPage from "components/sn-landing-help-center"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations(NS_CONTENTS);
    return {
        title: t("helpCenter.head.title"),
    };
}


const Page = () => {
    return (
        <>
            <LandingHelpCenterPage/>
        </>
    )
}

export default Page