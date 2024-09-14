import { Stack } from "@mui/material";
import PackageManagement from "components/sn-package-management";
import Wrapper from "components/Wrapper";
import { NS_COMPANY, NS_HOLIDAY_CALENDAR } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// export async function generateMetadata(): Promise<Metadata> {
//   const t = await getTranslations(NS_COMPANY);

//   return {
//     title: t("head.title"),
//   };
// }

export default function Page() {
  return (
    <Wrapper overflow="auto" inFrame>
      <PackageManagement />{" "}
    </Wrapper>
  );
}
