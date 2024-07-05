import Wrapper from "components/Wrapper";
import ChangePasswordPage from "components/sn-change-password";
import { NS_ACCOUNT } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(NS_ACCOUNT);

  return {
    title: t("changePassword.head.title"),
  };
}

export default function Page() {
  const headersList = headers();

  const prevPath = getPrevPath(headersList);

  return (
    <Wrapper overflow="auto">
      <ChangePasswordPage prevPath={prevPath} />
    </Wrapper>
  );
}

const getPrevPath = (headersList: ReadonlyHeaders) => {
  const host = headersList.get("next-url") ?? undefined;
  if (!host) return;
  const referer = headersList.get("referer");

  const arrSplit = referer?.includes("?") ? referer.split("?") : [];
  let queryString = arrSplit.length ? arrSplit[arrSplit.length - 1] : "";
  queryString = queryString ? "?" + queryString : "";

  return host + queryString;
};
