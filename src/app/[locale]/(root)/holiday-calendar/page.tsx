import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import HolidayCalendar from "components/sn-holiday-calendar";
import { NS_ACCOUNT } from "constant/index";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_ACCOUNT);

  return {
    title: t("accountInformation.head.title"),
  };
}

export default function Page() {
  return <HolidayCalendar />;
}
