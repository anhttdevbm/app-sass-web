import { NS_SALES } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SalesWrapper from "components/sn-sales/SalesWrapper";
import React from "react";
import SaleForm from "components/sn-sales-detail";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_SALES);

  return {
    title: t("list.head.title"),
  };
}

const SalesPage = ({ params }: { params: { id: string } }) => {
  return (
    <SalesWrapper>
      <SaleForm params={params} />
    </SalesWrapper>
  );
};

export default SalesPage;
