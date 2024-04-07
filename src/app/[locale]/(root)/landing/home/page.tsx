import { Stack } from "@mui/material";
import LandingHomePage from "components/sn-landing-home";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { NS_CONTENTS } from "constant"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations(NS_CONTENTS);
    return {
        title: t("home.head.title"),
    };
}

export default function Page(){
    return (
        <>
            <LandingHomePage />
        </>
    );
}