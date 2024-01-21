import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NS_PROJECT } from "constant/index";
import { Actions, ItemList } from "components/sn-docs";
import { useParams } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_PROJECT);

  return {
    title: t("detailDocuments.head.title"),
  };
}

export default function Page() {
  return (
    <>
      <Actions />
      <ItemList isGrouped={true} />
    </>
  );
}
