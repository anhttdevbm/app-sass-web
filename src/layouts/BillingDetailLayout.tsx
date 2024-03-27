"use client";

import Wrapper from "components/Wrapper";
import {
  BILLING_DETAIL_PATH,
  BILLING_INFO_PATH,
  BILLING_PATH,
  BLOGS_DETAIL_PATH,
  BLOGS_PATH,
} from "constant/paths";
import { usePathname } from "next-intl/client";
import { useEffect, useMemo, useRef } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useBillings } from "store/billing/selectors";
import { useBlogs } from "store/blog/selectors";
import { getPath } from "utils/index";

type BillingDetailLayoutProps = {
  children: React.ReactNode;
  id: string;
};

const BillingDetailLayout = ({ children, id }: BillingDetailLayoutProps) => {
  //   const { onGetBlogBySlug, item } = useBlogs();
  const { filters, page, size } = useBillings();
  const { onUpdateHeaderConfig } = useHeaderConfig();

  const pathname = usePathname();

  const isBillingDetailPath = useMemo(
    () => pathname.replace(id, "{id}") === BILLING_INFO_PATH,
    [id, pathname],
  );

  const dataStringifyRef = useRef<string | undefined>();

  //   useEffect(() => {
  //     if (!id) return;
  //     onGetBlogBySlug(id);
  //   }, [id, onGetBlogBySlug]);

  useEffect(() => {
    dataStringifyRef.current = JSON.stringify({
      ...filters,
      page,
      size,
    });
  }, [filters, page, size]);

  useEffect(() => {
    const parsedQueries = dataStringifyRef.current
      ? JSON.parse(dataStringifyRef.current)
      : {};

    const prevPath = getPath(BILLING_PATH, parsedQueries);

    onUpdateHeaderConfig({
      title: "",
      searchPlaceholder: undefined,
      prevPath,
    });
    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
      });
    };
  }, [onUpdateHeaderConfig]);

  return (
    <Wrapper overflow="auto" inFrame={isBillingDetailPath}>
      {children}
    </Wrapper>
  );
};

export default BillingDetailLayout;
