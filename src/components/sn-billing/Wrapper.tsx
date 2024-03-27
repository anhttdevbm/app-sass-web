"use client";

import { memo, useEffect } from "react";
import AppWrapper from "components/Wrapper";
import { useHeaderConfig } from "store/app/selectors";
import { useTranslations } from "next-intl";
import { NS_BILLING, NS_COMMON, NS_PROJECT } from "constant/index";
import { Endpoint } from "api";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { onUpdateHeaderConfig } = useHeaderConfig();
  const billingT = useTranslations(NS_BILLING);
  const commonT = useTranslations(NS_COMMON);

  useEffect(() => {
    onUpdateHeaderConfig({
      title: billingT("list.title"),
      searchPlaceholder: commonT("searchBy", { name: billingT("list.key") }),
      endpoint: Endpoint.PROJECTS,
      key: "name",
    });
    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        endpoint: undefined,
        key: undefined,
      });
    };
  }, [commonT, onUpdateHeaderConfig, billingT]);

  return (
    <AppWrapper overflow="auto" inFrame>
      {children}
    </AppWrapper>
  );
};

export default memo(Wrapper);
