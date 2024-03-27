import { NS_APPLICANTS } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_APPLICANTS);
  return {
      title: t("applicants.head.tab_title"),
  };
}

export default function Page(){
  return(
      <>Trang lấy thông tin danh công việc</>
  );
}
