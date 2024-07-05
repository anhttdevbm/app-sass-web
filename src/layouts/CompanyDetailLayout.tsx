"use client";

import Wrapper from "components/Wrapper";
import { TabList } from "components/sn-company-detail/components";
import { COMPANIES_PATH, COMPANY_EMPLOYEES_PATH } from "constant/paths";
import { usePathname } from "next-intl/client";
import { useEffect, useMemo, useRef } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useCompany, useCompanies } from "store/manager/selectors";
import { getPath } from "utils/index";

type CompanyDetailLayoutProps = {
  children: React.ReactNode;
  id: string;
};

const CompanyDetailLayout = ({ children, id }: CompanyDetailLayoutProps) => {
  const { onGetCompany, item } = useCompany();
  const { filters, pageIndex, pageSize } = useCompanies();
  const { onUpdateHeaderConfig } = useHeaderConfig();

  const pathname = usePathname();

  const isEmployeesOfCompanyPath = useMemo(
    () => pathname.replace(id, "{id}") === COMPANY_EMPLOYEES_PATH,
    [id, pathname],
  );

  const dataStringifyRef = useRef<string | undefined>();

  useEffect(() => {
    if (!id) return;
    onGetCompany(id);
  }, [id, onGetCompany]);

  useEffect(() => {
    dataStringifyRef.current = JSON.stringify({
      ...filters,
      pageIndex,
      pageSize,
    });
  }, [filters, pageIndex, pageSize]);

  useEffect(() => {
    const parsedQueries = dataStringifyRef.current
      ? JSON.parse(dataStringifyRef.current)
      : {};

    const prevPath = getPath(COMPANIES_PATH, parsedQueries);

    onUpdateHeaderConfig({
      title: item?.name,
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
  }, [item?.name, onUpdateHeaderConfig]);

  return (
    <Wrapper overflow="auto" inFrame={isEmployeesOfCompanyPath}>
      <TabList />
      {children}
    </Wrapper>
  );
};

export default CompanyDetailLayout;
