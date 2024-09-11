"use client";

import { Endpoint } from "api";
import AppWrapper from "components/Wrapper";
import { NS_COMMON, NS_TIME_TRACKING } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useEffect } from "react";
import { useHeaderConfig } from "store/app/selectors";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { onUpdateHeaderConfig } = useHeaderConfig();
  const timeTrackingT = useTranslations(NS_TIME_TRACKING);
  const commonT = useTranslations(NS_COMMON);

  useEffect(() => {
    onUpdateHeaderConfig({
      title: timeTrackingT("header.timeTracking"),
      searchPlaceholder: commonT("searchBy", {
        name: timeTrackingT("list.key"),
      }),
      key: "name",
    });
    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        key: undefined,
      });
    };
  }, [commonT, onUpdateHeaderConfig, timeTrackingT]);

  return (
    <AppWrapper
      overflow="auto"
      inFrame
      sx={{
        "& > div:nth-of-type(2)": {
          height: "calc(100% - 16px)",
        },
      }}
    >
      {children}
    </AppWrapper>
  );
};

export default memo(Wrapper);
