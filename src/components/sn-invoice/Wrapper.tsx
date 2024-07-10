"use client";

import { useHeaderConfig } from "store/app/selectors";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_INVOICE } from "constant/index";
import { useEffect } from "react";
import { Endpoint } from "../../api";
import AppWrapper from "components/Wrapper";

export interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  const { onUpdateHeaderConfig } = useHeaderConfig();
  const invoiceT = useTranslations(NS_INVOICE);
  const commonT = useTranslations(NS_COMMON);

  useEffect(() => {
    onUpdateHeaderConfig({
      title: invoiceT("head.title"),
      searchPlaceholder: commonT("searchBy", { name: invoiceT("head.key") }),
      endpoint: Endpoint.INVOICE,
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
  }, [commonT, onUpdateHeaderConfig, invoiceT]);

  return (
    <AppWrapper overflow="auto" inFrame>
      {children}
    </AppWrapper>
  );
};

export default Wrapper;
