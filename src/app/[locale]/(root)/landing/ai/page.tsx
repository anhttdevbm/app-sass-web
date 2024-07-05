import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { NS_CONTENTS } from "constant"
import { Grid } from "@mui/material";
import LandingAIPage from "components/sn-landing-ai"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations(NS_CONTENTS);
    return {
        title: t("ai.head.title"),
    };
}


const Page = () => {
    return (
        <>
            <LandingAIPage/>
        </>
    )
}

export default Page