"use client";

import { Endpoint } from "api";
import AppWrapper from "components/Wrapper";
import { NS_AI_AGENT, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useHeaderConfig } from "store/app/selectors";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { onUpdateHeaderConfig } = useHeaderConfig();
  const aiAgentT = useTranslations(NS_AI_AGENT);
  const commonT = useTranslations(NS_COMMON);

  useEffect(() => {
    onUpdateHeaderConfig({
      title: aiAgentT("header.title"),
      searchPlaceholder: commonT("searchBy", { name: aiAgentT("header.key") }),
      endpoint: Endpoint.AI_AGENT,
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
  }, [commonT, onUpdateHeaderConfig, aiAgentT]);

  return (
    <AppWrapper overflow="auto" inFrame>
      {children}
    </AppWrapper>
  );
};

export default Wrapper;
