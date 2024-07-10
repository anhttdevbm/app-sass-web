import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { NS_CONTENTS } from "constant"
import { Grid } from "@mui/material";
import LandingTrustCenterPage from "components/sn-landing-trust-center"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations(NS_CONTENTS);
    return {
        title: t("trustCenter.head.title"),
    };
}


const Page = () => {
    return (
        <>
            <LandingTrustCenterPage/>
        </>
    )
}

export default Page