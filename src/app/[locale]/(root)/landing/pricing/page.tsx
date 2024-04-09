import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { NS_CONTENTS } from "constant"
import { Grid } from "@mui/material";
import LandingPricingPage from "components/sn-landing-pricing"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations(NS_CONTENTS);
    return {
        title: t("pricing.head.title"),
    };
}


const Page = () => {
    return (
        <>
            <LandingPricingPage/>
        </>
    )
}

export default Page