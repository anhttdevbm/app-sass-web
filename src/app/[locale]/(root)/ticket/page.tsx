import Wrapper from "components/Wrapper";
import { Actions , TicketList } from "components/sn-ticket";
import { NS_DOCS } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useState } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_DOCS);

  return {
    title: t("title"),
  };
}

export default function Page() {
  return (
    <Wrapper overflow="auto" inFrame>
      <Actions isProjectTabMode={false} />
      <TicketList/>
    </Wrapper>
  );
}
